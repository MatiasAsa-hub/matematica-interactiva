// ==========================================================================
// INTERACTIVO: funciones polinómicas, escritas con sus raíces
//   f(x) = a(x − r₁)(x − r₂)…(x − rₙ)
// Se elige el grado (1 a 5: el 1 es una recta y el 2 una parábola) y se
// arrastran las raíces sobre el eje x. Los máximos, mínimos, puntos de
// inflexión y el crecimiento se calculan con números (ver src/lib/polinomios.js).
// El HTML está en src/components/interactivos/Polinomica.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { conjuntos, dibujarBarrasDeSigno, tramoCrecimiento, intervaloAbierto } from '../lib/grafico/signos.js';
import { desdeRaices, evaluar, derivar, raicesConCambioDeSigno, polinomioHtml, agruparRaices, factorHtml } from '../lib/polinomios.js';
import { num, numAprox } from '../lib/numeros.js';

const EPS = 1e-9;
const X = '<i>x</i>';
// raíces con las que arranca cada grado (muestran algo interesante)
const INICIALES = { 1: [1], 2: [-1, 3], 3: [-1, 1, 3], 4: [-2, -1, 1, 2], 5: [-2, -1, 0, 1, 2] };
const NOMBRES = { 1: 'lineal', 2: 'cuadrática', 3: 'cúbica', 4: 'de grado 4', 5: 'de grado 5' };

export function iniciarPolinomica(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { grado: 3, a: 1, r: [-1, 1, 3, 1, 2] };

  const raices = () => estado.r.slice(0, estado.grado);
  // Todo lo que se calcula sale de acá (se recalcula cuando algo cambia)
  let datos;
  function recalcular() {
    const rs = raices();
    const coef = desdeRaices(estado.a, rs);
    const d1 = derivar(coef);
    const d2 = derivar(d1);
    // con todas las raíces reales, los extremos y las inflexiones quedan entre la primera y la última raíz
    const desde = Math.min(...rs) - 1;
    const hasta = Math.max(...rs) + 1;
    const nulo = Math.abs(estado.a) < EPS;
    datos = {
      coef,
      grupos: agruparRaices(rs),
      extremos: nulo ? [] : raicesConCambioDeSigno(d1, desde, hasta),
      inflexiones: nulo ? [] : raicesConCambioDeSigno(d2, desde, hasta),
      d1,
      nulo,
    };
  }
  const f = (x) => evaluar(datos.coef, x);
  recalcular();

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 0 },
    descripcion: 'Gráfico del polinomio',
  });
  const col = plano.colores;
  let casillas = {};

  // --- Capa 1: C⁺ y C⁻ ---
  plano.agregarCapa((p) => {
    if (!casillas.signos || datos.nulo) return;
    p.zonaSigno(f, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(f, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    dibujarBarrasDeSigno(p, f, datos.grupos.map((g) => g.x));
  });

  // --- Capas 2 y 3: la curva y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, { f, color: col.funcion, tabla: tablaCaja });

  // --- Capa 4: puntos notables ---
  plano.agregarCapa((p) => {
    // crece / decrece: tramos entre los máximos y mínimos
    if (casillas.crece && !datos.nulo) {
      const derecha = p.ancho - 56;
      const cortes = [0, ...datos.extremos.map((x) => Math.min(Math.max(p.px(x), 0), derecha)), derecha];
      for (let i = 0; i < cortes.length - 1; i++) {
        const xm = p.mx((cortes[i] + cortes[i + 1]) / 2);
        tramoCrecimiento(p, cortes[i], cortes[i + 1], evaluar(datos.d1, xm) > 0);
      }
    }
    if (casillas.ordenada) {
      const y0 = f(0);
      p.punto(0, y0, { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      p.etiqueta(`(0, ${numAprox(y0)})`, 0, y0, { color: col.ordenada, dx: -10, dy: -12, alinear: 'right' });
    }
    if (casillas.inflexion) {
      for (const x of datos.inflexiones) {
        p.punto(x, f(x), { color: col.vertice, radio: 6, hueco: true });
        p.etiqueta('inflexión', x, f(x), { color: col.vertice, dx: 10, dy: 0, alinear: 'left', tamano: 13 });
      }
    }
    if (casillas.extremos) {
      for (const x of datos.extremos) {
        const y = f(x);
        const esMax = evaluar(datos.d1, x - 1e-3) > 0;
        p.punto(x, y, { color: col.vertice, forma: 'rombo', radio: 6 });
        p.etiqueta(`${esMax ? 'máx' : 'mín'} (${numAprox(x)}, ${numAprox(y)})`, x, y, { color: col.vertice, dx: 0, dy: esMax ? -20 : 22, alinear: 'center', tamano: 14 });
      }
    }
    // las raíces (siempre se ven, porque se pueden arrastrar; la etiqueta solo con la casilla)
    datos.grupos.forEach((g, i) => {
      p.punto(g.x, 0, { color: col.raices, radio: g.veces > 1 ? 8.5 : 7 });
      if (casillas.raices) {
        const texto = `${num(g.x)}${g.veces === 2 ? ' (doble)' : g.veces === 3 ? ' (triple)' : g.veces > 3 ? ` (×${g.veces})` : ''}`;
        p.etiqueta(texto, g.x, 0, { color: col.raices, dx: 0, dy: i % 2 === 0 ? 20 : 38, alinear: 'center', tamano: 14 });
      }
    });
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const desarrolladaEl = $('[data-desarrollada]');
  const infoEl = $('[data-info]');
  const avisoGrado = $('[data-aviso-grado]');
  const avisoA0 = $('[data-aviso-a0]');
  let parametroActivo = null;

  function actualizarExpresion() {
    const v = (p, t) => `<span class="valor" data-p="${p}">${t}</span>`;
    const { a } = estado;
    const delante = Math.abs(a - 1) < 0.005 ? '' : Math.abs(a + 1) < 0.005 ? v('a', '−') : v('a', num(a));
    const factores = raices().map((r, i) => v(`r${i}`, factorHtml(r))).join('');
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${delante}${factores}`;
    expresionEl.classList.toggle('expresion-larga', estado.grado >= 4);
    if (parametroActivo) expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');
    desarrolladaEl.innerHTML = datos.nulo ? '' : `Desarrollado: ${polinomioHtml(datos.coef)}`;
  }

  const item = (color, titulo, cuerpo) =>
    `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

  function actualizarInfo() {
    const { grado, a } = estado;
    avisoA0.hidden = !datos.nulo;
    avisoGrado.hidden = grado > 2;
    avisoGrado.innerHTML = grado === 1
      ? `Con grado 1 es una <b>función lineal</b>: una recta. La lineal es un caso particular de la polinómica.`
      : `Con grado 2 es una <b>cuadrática</b>: una parábola, escrita con sus raíces (forma factorizada).`;

    const partes = [];
    const extremoIzq = a > 0 === (grado % 2 === 0) ? 'arriba' : 'abajo';
    const extremoDer = a > 0 ? 'arriba' : 'abajo';
    if (!datos.nulo) {
      partes.push(item(col.funcion, `Grado ${grado}`, `(función ${NOMBRES[grado]}): si se multiplican los paréntesis, la ${X} más grande queda ${grado === 1 ? `${X}` : `${X}<sup>${grado}</sup>`}. Por la izquierda viene de <b>${extremoIzq}</b> y por la derecha se va para <b>${extremoDer}</b>.`));
    }
    if (casillas.raices && !datos.nulo) {
      const lista = datos.grupos.map((g) => `${X} = ${num(g.x)}${g.veces > 1 ? ` (${g.veces === 2 ? 'doble' : g.veces === 3 ? 'triple' : `se repite ${g.veces} veces`})` : ''}`).join(', ');
      let texto = `${lista}. Se leen directo de la fórmula: cada paréntesis (${X} − r) da 0 cuando ${X} = r, y algo multiplicado por 0 da 0.`;
      if (datos.grupos.some((g) => g.veces % 2 === 0)) texto += ' En una raíz <b>doble</b>, la curva <b>toca el eje y rebota</b> (no lo cruza).';
      partes.push(item(col.raices, 'Raíces:', texto));
    }
    if (casillas.ordenada) {
      partes.push(item(col.ordenada, 'Ordenada al origen:', `<i>f</i>(0) ${numAprox(f(0)).startsWith('≈') ? '' : '= '}${numAprox(f(0))}. Es el número sin ${X} del polinomio desarrollado.`));
    }
    if (casillas.extremos && !datos.nulo) {
      const lista = datos.extremos.map((x) => {
        const esMax = evaluar(datos.d1, x - 1e-3) > 0;
        return `${esMax ? 'máximo' : 'mínimo'} en (${numAprox(x)}, ${numAprox(f(x))})`;
      });
      partes.push(item(col.vertice, 'Máximos y mínimos:', lista.length
        ? `${lista.join('; ')}. Son "relativos": el punto más alto (o más bajo) de su zona, donde la curva deja de subir y empieza a bajar (o al revés).`
        : 'no tiene: la curva sube siempre (o baja siempre).'));
    }
    if (casillas.inflexion && !datos.nulo) {
      const lista = datos.inflexiones.map((x) => `(${numAprox(x)}, ${numAprox(f(x))})`);
      partes.push(item(col.vertice, 'Puntos de inflexión:', lista.length
        ? `${lista.join('; ')}. Ahí la curva cambia de forma: pasa de "curvarse para arriba" (como una ∪) a "curvarse para abajo" (como una ∩), o al revés.`
        : 'no tiene: la curva no cambia de forma.'));
    }
    if (casillas.signos && !datos.nulo) {
      const s = conjuntos(f, datos.grupos.map((g) => g.x));
      partes.push(item(col.positivo, 'C⁺ =', `${s.pos} <span class="texto-suave">(donde f(x) > 0)</span>`));
      partes.push(item(col.negativo, 'C⁻ =', `${s.neg} <span class="texto-suave">(donde f(x) < 0)</span>`));
    }
    if (casillas.crece && !datos.nulo) {
      const cortes = [-Infinity, ...datos.extremos, Infinity];
      const crece = [];
      const decrece = [];
      for (let i = 0; i < cortes.length - 1; i++) {
        const xm = !Number.isFinite(cortes[i]) && !Number.isFinite(cortes[i + 1]) ? 0
          : !Number.isFinite(cortes[i]) ? cortes[i + 1] - 1 : !Number.isFinite(cortes[i + 1]) ? cortes[i] + 1 : (cortes[i] + cortes[i + 1]) / 2;
        const texto = cortes.length === 2 ? 'ℝ' : intervaloAbierto(cortes[i], cortes[i + 1]);
        (evaluar(datos.d1, xm) > 0 ? crece : decrece).push(texto);
      }
      const unir = (l) => (l.length ? l.join(' ∪ ') : '∅');
      partes.push(item(col.crece, 'Crece en', unir(crece)));
      partes.push(item(col.decrece, 'Decrece en', unir(decrece)));
    }

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba.</p>';
  }

  // --------------------------------------------------------------- controles

  function cambio() {
    recalcular();
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarInfo();
  }

  const conTexto = (nombre) => ({
    alEmpezar: () => { parametroActivo = nombre; actualizarExpresion(); },
    alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
  });
  conectarDeslizador($('.deslizador[data-param="a"]'), (v) => { estado.a = v; cambio(); }, conTexto('a'));
  const deslRaices = estado.r.map((_, i) => conectarDeslizador(
    $(`.deslizador[data-param="r${i}"]`),
    (v) => { estado.r[i] = v; cambio(); },
    conTexto(`r${i}`),
  ));

  // las raíces se arrastran sobre el eje x (de a 0.5, así es fácil juntar dos)
  estado.r.forEach((_, i) => {
    plano.agregarArrastrable({
      posicion: () => (i < estado.grado ? [estado.r[i], 0] : [NaN, NaN]),
      mover: (x) => deslRaices[i].poner(Math.max(-5, Math.min(5, Math.round(x * 2) / 2))),
    });
  });

  // grado
  const botonesGrado = [...raiz.querySelectorAll('[data-grado]')];
  for (const boton of botonesGrado) {
    boton.addEventListener('click', () => {
      const g = Number(boton.dataset.grado);
      estado.grado = g;
      for (const b of botonesGrado) b.setAttribute('aria-checked', String(b === boton));
      for (const el of raiz.querySelectorAll('[data-raiz-control]')) el.hidden = Number(el.dataset.raizControl) >= g;
      INICIALES[g].forEach((r, i) => deslRaices[i].poner(r));
      cambio();
      if (casillas.animacion) animacion.reproducir();
    });
  }

  const botonRepetir = $('[data-repetir]');
  casillas = conectarCasillas($('[data-casillas]'), (nombre, activa) => {
    if (nombre === 'animacion') {
      botonRepetir.hidden = !activa;
      if (activa) animacion.reproducir(); else animacion.terminar();
    }
    if (nombre === 'tabla') tablaCaja.hidden = !activa;
    plano.pedirDibujo();
    actualizarInfo();
  });
  botonRepetir.hidden = !casillas.animacion;
  tablaCaja.hidden = !casillas.tabla;
  botonRepetir.addEventListener('click', () => animacion.reproducir());
  plano.alCambiarVista.push(() => { if (!animacion.animando) animacion.calcularXs(); });

  for (let i = 0; i < 5; i++) estado.r[i] = deslRaices[i].valor;
  cambio();

  if (casillas.animacion) {
    animacion.visibles = 0;
    animacion.hastaX = -Infinity;
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        observador.disconnect();
        animacion.reproducir();
      }
    }, { threshold: 0.6 });
    observador.observe($('[data-grafico]'));
  }
}

