// ==========================================================================
// Lectura del contenido.
// Todo el texto de la página vive en la carpeta "contenido/" como archivos
// Markdown (.md). Este archivo los lee al armar el sitio y los convierte en
// HTML (con las fórmulas ya dibujadas por KaTeX).
// ==========================================================================

import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { url } from './rutas.js';
import { leerNumero } from './numeros.js';

// Todos los .md de la carpeta contenido/, como texto.
const archivos = import.meta.glob('/contenido/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// --------------------------------------------------------------------------
// Datos generales del sitio (contenido/sitio.md)
// --------------------------------------------------------------------------
export function datosDelSitio() {
  const crudo = archivos['/contenido/sitio.md'];
  if (!crudo) throw new Error('Falta el archivo contenido/sitio.md');
  return matter(crudo).data;
}

// --------------------------------------------------------------------------
// Temas: contenido/temas/<seccion>/<tema>.md
// --------------------------------------------------------------------------
const temasCrudos = Object.entries(archivos)
  .filter(([ruta]) => ruta.startsWith('/contenido/temas/'))
  .map(([ruta, texto]) => {
    const partes = ruta.replace('/contenido/temas/', '').split('/');
    const seccion = partes.length > 1 ? partes[0] : 'otros';
    const slug = partes[partes.length - 1].replace(/\.md$/, '');
    const { data, content } = matter(texto);
    return { ruta, seccion, slug, datos: data, cuerpo: content };
  });

const slugsDeTemas = new Set(temasCrudos.map((t) => t.slug));

/** Lista de temas, ordenados por sección y por el campo "orden". */
export function listaDeTemas() {
  return temasCrudos
    .map((t) => ({
      slug: t.slug,
      seccion: t.seccion,
      titulo: t.datos.titulo ?? t.slug,
      resumen: t.datos.resumen ?? '',
      orden: Number(t.datos.orden ?? 999),
      subseccion: t.datos.subseccion ?? '',
    }))
    .sort((a, b) => a.orden - b.orden);
}

/** Un tema completo, ya dividido en partes y convertido a HTML. */
export function obtenerTema(slug) {
  const t = temasCrudos.find((x) => x.slug === slug);
  if (!t) throw new Error(`No existe el tema "${slug}"`);
  const partes = dividirEnPartes(t.cuerpo, t.ruta);
  return {
    slug: t.slug,
    seccion: t.seccion,
    titulo: t.datos.titulo ?? t.slug,
    resumen: t.datos.resumen ?? '',
    subseccion: t.datos.subseccion ?? '',
    interactivo: t.datos.interactivo ?? null,
    opciones: t.datos,
    partes,
    tieneTutores: partes.some((p) => p.tipo === 'tutores'),
  };
}

// --------------------------------------------------------------------------
// Páginas sueltas: contenido/paginas/<nombre>.md
// --------------------------------------------------------------------------
export function obtenerPagina(nombre) {
  const crudo = archivos[`/contenido/paginas/${nombre}.md`];
  if (!crudo) throw new Error(`Falta el archivo contenido/paginas/${nombre}.md`);
  const { data, content } = matter(crudo);
  return { datos: data, html: markdownAHtml(content) };
}

// --------------------------------------------------------------------------
// Markdown → HTML
// --------------------------------------------------------------------------

// Los links del estilo [texto](tema:funcion-cuadratica) apuntan a un tema.
// Si el tema todavía no existe, se muestra el texto con "(próximamente)".
function rehypeLinksATemas() {
  return (arbol) => {
    const recorrer = (nodo) => {
      if (!nodo.children) return;
      nodo.children = nodo.children.map((hijo) => {
        if (hijo.type === 'element' && hijo.tagName === 'a') {
          const href = String(hijo.properties?.href ?? '');
          if (href.startsWith('tema:')) {
            const slug = href.slice(5).replace(/\/$/, '');
            if (slugsDeTemas.has(slug)) {
              hijo.properties.href = url(`temas/${slug}/`);
            } else {
              return {
                type: 'element',
                tagName: 'span',
                properties: { className: ['link-pendiente'] },
                children: [...hijo.children, { type: 'text', value: ' (próximamente)' }],
              };
            }
          }
        }
        recorrer(hijo);
        return hijo;
      });
    };
    recorrer(arbol);
  };
}

const procesador = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeLinksATemas)
  .use(rehypeKatex, { strict: false })
  .use(rehypeStringify);

export function markdownAHtml(texto) {
  return String(procesador.processSync(texto ?? ''));
}

// --------------------------------------------------------------------------
// División de un tema en partes, según los títulos "## ..."
// --------------------------------------------------------------------------

function normalizar(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function tipoDeParte(titulo) {
  const n = normalizar(titulo);
  if (n.startsWith('intuicion')) return 'intuicion';
  if (n.startsWith('explicacion')) return 'explicacion';
  if (n.startsWith('ejemplo')) return 'ejemplo';
  if (n.startsWith('ejercicio')) return 'ejercicios';
  if (n.includes('tutor')) return 'tutores';
  return 'otra';
}

/** Corta un texto en bloques que empiezan con una línea "<marca> Título". */
function cortarPorTitulos(texto, marca) {
  const lineas = texto.split(/\r?\n/);
  const bloques = [];
  let actual = { titulo: null, lineas: [] };
  const re = new RegExp(`^${marca}\\s+(.*)$`);
  for (const linea of lineas) {
    const m = linea.match(re);
    if (m) {
      bloques.push(actual);
      actual = { titulo: m[1].trim(), lineas: [] };
    } else {
      actual.lineas.push(linea);
    }
  }
  bloques.push(actual);
  return bloques.map((b) => ({ titulo: b.titulo, texto: b.lineas.join('\n').trim() }));
}

function dividirEnPartes(cuerpo, ruta) {
  const bloques = cortarPorTitulos(cuerpo, '##');
  const partes = [];
  // Lo que está antes del primer "##" (si hay algo) va como introducción.
  if (bloques[0].texto) partes.push({ tipo: 'otra', titulo: null, html: markdownAHtml(bloques[0].texto) });

  for (const b of bloques.slice(1)) {
    const tipo = tipoDeParte(b.titulo);
    if (tipo === 'ejemplo') {
      partes.push({ tipo, titulo: b.titulo, ...armarEjemplo(b.texto) });
    } else if (tipo === 'ejercicios') {
      const sub = cortarPorTitulos(b.texto, '###');
      partes.push({
        tipo,
        titulo: b.titulo,
        introHtml: markdownAHtml(sub[0].texto),
        ejercicios: sub.slice(1).map((e, i) => armarEjercicio(e.titulo, e.texto, i + 1, ruta)),
      });
    } else {
      partes.push({ tipo, titulo: b.titulo, html: markdownAHtml(b.texto) });
    }
  }
  return partes;
}

// Ejemplo resuelto: el texto antes del primer "###" es el enunciado;
// cada "### ..." es un paso desplegable.
function armarEjemplo(texto) {
  const sub = cortarPorTitulos(texto, '###');
  return {
    enunciadoHtml: markdownAHtml(sub[0].texto),
    pasos: sub.slice(1).map((p) => ({ titulo: p.titulo, html: markdownAHtml(p.texto) })),
  };
}

// --------------------------------------------------------------------------
// Ejercicios autocorregibles
// --------------------------------------------------------------------------

function armarEjercicio(titulo, texto, numero, ruta) {
  // La resolución empieza en la primera línea "#### ..."
  const idx = texto.search(/^####\s+/m);
  const cuerpo = idx >= 0 ? texto.slice(0, idx) : texto;
  const resolucion = idx >= 0 ? texto.slice(idx).replace(/^####.*(\r?\n|$)/, '') : '';

  let respuestaTexto = null;
  let tolerancia = 0.01;
  let pista = null;
  const opciones = [];
  const resto = [];

  for (const linea of cuerpo.split(/\r?\n/)) {
    const campo = linea.match(/^\s*(respuesta|respuestas|tolerancia|pista)\s*:\s*(.*)$/i);
    const opcion = linea.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/);
    if (campo) {
      const clave = normalizar(campo[1]);
      if (clave.startsWith('respuesta')) respuestaTexto = campo[2].trim();
      else if (clave === 'tolerancia') tolerancia = leerNumero(campo[2]);
      else if (clave === 'pista') pista = campo[2].trim();
    } else if (opcion) {
      opciones.push({ correcta: opcion[1].toLowerCase() === 'x', html: markdownEnLinea(opcion[2]) });
    } else {
      resto.push(linea);
    }
  }

  const lugar = `en ${ruta.replace(/^\//, '')}, ejercicio "${titulo}"`;
  let tipo;
  let respuestas = [];
  if (opciones.length > 0) {
    tipo = 'opciones';
    if (!opciones.some((o) => o.correcta)) {
      throw new Error(`Falta marcar la opción correcta con [x] ${lugar}`);
    }
  } else {
    tipo = 'numero';
    if (respuestaTexto === null) {
      throw new Error(`Falta la línea "respuesta: ..." ${lugar}`);
    }
    respuestas = respuestaTexto.split(';').map((r) => leerNumero(r));
    if (respuestas.some((r) => Number.isNaN(r))) {
      throw new Error(`No se entiende la respuesta "${respuestaTexto}" ${lugar}`);
    }
  }
  if (Number.isNaN(tolerancia)) throw new Error(`No se entiende la tolerancia ${lugar}`);

  return {
    numero,
    titulo,
    tipo,
    enunciadoHtml: markdownAHtml(resto.join('\n')),
    respuestas,
    tolerancia,
    opciones,
    pistaHtml: pista ? markdownEnLinea(pista) : null,
    resolucionHtml: resolucion.trim() ? markdownAHtml(resolucion) : null,
  };
}

// Markdown de una sola línea, sin el <p> de afuera.
function markdownEnLinea(texto) {
  return markdownAHtml(texto).replace(/^<p>/, '').replace(/<\/p>\s*$/, '');
}
