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

// Correlativas (campo "necesita:" de cada tema): se revisan al armar el sitio.
// Si un nombre está mal escrito o hay una vuelta (A necesita B y B necesita A),
// el armado avisa y la página publicada no se toca.
function necesitaDe(t) {
  const n = t.datos.necesita ?? [];
  if (!Array.isArray(n)) throw new Error(`En ${t.ruta}, "necesita:" tiene que ser una lista entre corchetes, por ejemplo: necesita: [funcion-lineal, resolver-ecuaciones]`);
  return n.map(String);
}
(() => {
  for (const t of temasCrudos) {
    for (const s of necesitaDe(t)) {
      if (!slugsDeTemas.has(s)) throw new Error(`En ${t.ruta}, "necesita:" nombra "${s}", que no es ningún tema. Tiene que ser el nombre de un archivo de contenido/temas/, sin ".md".`);
      if (s === t.slug) throw new Error(`En ${t.ruta}, el tema se necesita a sí mismo en "necesita:".`);
    }
  }
  const mapa = new Map(temasCrudos.map((t) => [t.slug, necesitaDe(t)]));
  const estado = new Map();
  const visitar = (s, camino) => {
    if (estado.get(s) === 'listo') return;
    if (estado.get(s) === 'viendo') throw new Error(`Las correlativas dan una vuelta: ${[...camino, s].join(' → ')}. Revisá "necesita:" en esos temas.`);
    estado.set(s, 'viendo');
    for (const r of mapa.get(s)) visitar(r, [...camino, s]);
    estado.set(s, 'listo');
  };
  for (const s of mapa.keys()) visitar(s, []);
})();

/**
 * Lista de temas en el orden del recorrido: primero por unidad (el orden de
 * las unidades está en contenido/sitio.md) y, dentro de la unidad, por el
 * campo "orden". "seccion" es el id de la unidad (el nombre de la carpeta).
 */
export function listaDeTemas() {
  const ids = datosDelSitio().unidades.map((u) => u.id);
  const lugar = (id) => (ids.includes(id) ? ids.indexOf(id) : ids.length);
  return temasCrudos
    .map((t) => ({
      slug: t.slug,
      seccion: t.seccion,
      titulo: t.datos.titulo ?? t.slug,
      resumen: t.datos.resumen ?? '',
      orden: Number(t.datos.orden ?? 999),
      subseccion: t.datos.subseccion ?? '',
      interactivo: t.datos.interactivo ?? null,
      necesita: necesitaDe(t),
    }))
    .sort((a, b) => lugar(a.seccion) - lugar(b.seccion) || a.orden - b.orden);
}

/** Las unidades con sus temas y el nombre de su etapa, en orden. */
export function listaDeUnidades() {
  const sitio = datosDelSitio();
  const temas = listaDeTemas();
  return sitio.unidades.map((u, i) => ({
    ...u,
    numero: i + 1,
    nombreEtapa: sitio.etapas.find((e) => e.id === u.etapa)?.nombre ?? '',
    temas: temas.filter((t) => t.seccion === u.id),
  }));
}

/** La unidad de un tema. */
export function unidadDe(slug) {
  return listaDeUnidades().find((u) => u.temas.some((t) => t.slug === slug)) ?? null;
}

/** El tema anterior y el siguiente en el recorrido (o null en las puntas). */
export function vecinosDe(slug, filtro = () => true) {
  const temas = listaDeTemas().filter(filtro);
  const i = temas.findIndex((t) => t.slug === slug);
  const conUnidad = (t) => (t ? { ...t, unidad: unidadDe(t.slug) } : null);
  return { anterior: conUnidad(temas[i - 1]), siguiente: conUnidad(temas[i + 1]) };
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
  // Una línea que dice solo "(interactivo)" marca dónde va el interactivo de la página
  const partes = content.split(/^\(interactivo\)[ \t]*$/m).map((p) => markdownAHtml(p));
  return { datos: data, html: markdownAHtml(content), partes };
}

/**
 * Una página suelta cortada en secciones (cada título "## ..." es una).
 * Sirve para la página de Notación, que arma un índice con las secciones.
 * En las listas, un renglón que empieza con algo en **negrita** se muestra
 * como una ficha: a la izquierda lo que se escribe, a la derecha qué quiere decir.
 */
export function obtenerPaginaEnSecciones(nombre) {
  const crudo = archivos[`/contenido/paginas/${nombre}.md`];
  if (!crudo) throw new Error(`Falta el archivo contenido/paginas/${nombre}.md`);
  const { data, content } = matter(crudo);
  const bloques = cortarPorTitulos(content, '##');
  const fichas = (html) => html.replace(
    /<li><strong>([\s\S]*?)<\/strong>[\s:—–-]*([\s\S]*?)<\/li>/g,
    '<li class="ficha-notacion"><span class="ficha-simbolo">$1</span><span class="ficha-significado">$2</span></li>',
  );
  return {
    datos: data,
    introHtml: markdownAHtml(bloques[0].texto),
    secciones: bloques.slice(1).map((b) => ({
      titulo: b.titulo,
      id: normalizar(b.titulo).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      html: fichas(markdownAHtml(b.texto)),
    })),
  };
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
          // [texto](pagina:laboratorio) apunta a una página suelta (laboratorio, notacion…)
          if (href.startsWith('pagina:')) hijo.properties.href = url(`${href.slice(7).replace(/\/$/, '')}/`);
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
  if (n.startsWith('para recordar')) return 'recordar';
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
        // Un título "### Nivel: Para arrancar" no es un ejercicio: separa los ejercicios en niveles.
        ejercicios: (() => {
          let n = 0;
          return sub.slice(1).map((e) => {
            const nivel = e.titulo.match(/^nivel\s*:\s*(.*)$/i);
            if (nivel) return { tipo: 'nivel', titulo: nivel[1], introHtml: markdownAHtml(e.texto) };
            n++;
            return armarEjercicio(e.titulo, e.texto, n, ruta);
          });
        })(),
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
    // la respuesta tal como está escrita (3/4, -2 ; 2), para la guía imprimible
    respuestaTexto: tipo === 'numero' ? respuestaTexto.split(';').map((r) => r.trim().replace(/-/g, '−')).join(' ; ') : null,
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
