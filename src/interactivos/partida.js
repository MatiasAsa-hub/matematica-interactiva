// ==========================================================================
// INTERACTIVO: funciones partidas (por tramos)
//
//   f(x) = { x + 2   si x < 1
//          { 3       si x ≥ 1
//
// - Un punto que se arrastra: "x = −2: como −2 < 1, uso x + 2 → f(−2) = 0".
//   En la llave se resalta el tramo que se está usando.
// - En los cortes: punto lleno si el extremo está incluido, hueco si no
//   (como corchete y paréntesis en los intervalos).
// - Casilla "Saltos": en cada corte dice si la curva salta o se pega.
// - Con dos tramos, un deslizador mueve el corte y un botón cambia de qué
//   lado va el punto del corte.
// Los ejemplos vienen del tema (campo "partidas:" del .md).
// El HTML está en src/components/interactivos/Partida.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { leerPartida, enTramo, condicionHtml } from '../lib/partidas.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
const EPS = 1e-9;

export function iniciarPartida(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.partidas);
  const estado = { indice: 0, tramos: [], px: -2 };

  /** El tramo que corresponde a x (o null si no hay ninguno). */
  const tramoDe = (x) => estado.tramos.find((t) => enTramo(t, x)) ?? null;
  const F = (x) => {
    const t = tramoDe(x);
    return t ? t.formula.f(x) : NaN;
  };
  /** Los cortes donde se juntan dos tramos seguidos: { x, izq, der } */
  const cortes = () => {
    const res = [];
    const ts = estado.tramos;
    for (let i = 0; i < ts.length - 1; i++) {
      if (Math.abs(ts[i].hi - ts[i + 1].lo) < EPS) res.push({ x: ts[i].hi, izq: ts[i], der: ts[i + 1] });
    }
    return res;
  };

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -5, xMax: 5, yCentro: 1.5 },
    descripcion: 'Gráfico de la función partida',
  });
  const col = plano.colores;
  let casillas = {};

  // --- Capa 1: las fórmulas enteras (fantasma) ---
  plano.agregarCapa((p) => {
    if (!casillas.enteras) return;
    for (const t of estado.tramos) p.curva(t.formula.f, { color: col.fantasma, ancho: 2.5, guiones: [8, 6] });
  });

  // --- Capas 2 y 3: cada tramo en su pedazo, y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, {
    f: F,
    color: col.funcion,
    tabla: tablaCaja,
    dibujarCurva: (hasta) => {
      const activo = tramoDe(estado.px);
      for (const t of estado.tramos) {
        plano.curva(t.formula.f, { color: col.funcion, ancho: t === activo ? 4.5 : 3.5, desde: t.lo, hasta: Math.min(t.hi, hasta) });
      }
    },
  });

  // --- Capa 4: saltos, extremos de los tramos y el punto que se arrastra ---
  plano.agregarCapa((p) => {
    if (animacion.hastaX !== Infinity) return;
    if (casillas.saltos) {
      for (const c of cortes()) {
        const yi = c.izq.formula.f(c.x);
        const yd = c.der.formula.f(c.x);
        if (!Number.isFinite(yi) || !Number.isFinite(yd)) continue;
        if (Math.abs(yi - yd) < EPS) {
          p.etiqueta('se pega', c.x, yi, { color: col.vertice, dx: 0, dy: -22, alinear: 'center', tamano: 13 });
        } else {
          p.segmento(c.x, yi, c.x, yd, { color: col.vertice, ancho: 2.5, guiones: [4, 4] });
          p.etiqueta(`salta ${num(Math.abs(yd - yi))}`, c.x, (yi + yd) / 2, { color: col.vertice, dx: 10, dy: 0, alinear: 'left', tamano: 13 });
        }
      }
    }
    // los extremos: primero los huecos y después los llenos (así un lleno tapa a un hueco)
    const extremos = [];
    for (const t of estado.tramos) {
      if (Number.isFinite(t.lo)) extremos.push({ x: t.lo, y: t.formula.f(t.lo), lleno: t.loCerrado });
      if (Number.isFinite(t.hi)) extremos.push({ x: t.hi, y: t.formula.f(t.hi), lleno: t.hiCerrado });
    }
    for (const e of extremos.filter((e) => !e.lleno && Number.isFinite(e.y))) p.punto(e.x, e.y, { color: col.funcion, radio: 6, hueco: true });
    for (const e of extremos.filter((e) => e.lleno && Number.isFinite(e.y))) p.punto(e.x, e.y, { color: col.funcion, radio: 6 });

    const x = estado.px;
    const y = F(x);
    if (!Number.isFinite(y)) {
      p.lineaVertical(x, { color: col.negativo, ancho: 2, guiones: [4, 5], alfa: 0.9 });
      p.punto(x, 0, { color: col.negativo, radio: 8, hueco: true });
      return;
    }
    p.segmento(x, 0, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
    p.segmento(0, y, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
    p.punto(x, y, { color: col.funcion, radio: 9 });
  });

  // El punto se arrastra a lo largo de la curva (solo importa su x). Se pega a los medios.
  plano.agregarArrastrable({
    posicion: () => [estado.px, Number.isFinite(F(estado.px)) ? F(estado.px) : 0],
    mover: (x) => {
      estado.px = Math.max(plano.xMin, Math.min(plano.xMax, Math.round(x * 2) / 2));
      plano.pedirDibujo();
      actualizarLectura();
    },
  });

  // --------------------------------------------------------------- textos

  const llaveEl = $('[data-llave]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  function actualizarLlave() {
    const activo = tramoDe(estado.px);
    const filas = estado.tramos.map((t) =>
      `<span class="llave-fila${t === activo ? ' activo' : ''}"><span class="llave-formula">${t.formula.html()}</span><span class="llave-si">si ${condicionHtml(t)}</span></span>`).join('');
    llaveEl.innerHTML = `<span class="llave-nombre"><i>f</i>(${X}) =</span><span class="llave" style="--filas:${estado.tramos.length}">${filas}</span>`;
  }

  function actualizarLectura() {
    const x = estado.px;
    const t = tramoDe(x);
    actualizarLlave();
    if (!t) {
      lecturaEl.innerHTML = `${X} = ${num(x)}: <b>no hay ningún tramo</b> para este número. No está en el dominio.`;
      return;
    }
    lecturaEl.innerHTML = `${X} = ${num(x)}: como ${condicionHtml(t, x)}, uso <b>${t.formula.html()}</b> → ` +
      `<i>f</i>(${num(x)}) = ${t.formula.cuenta(x)} <b>${igual(t.formula.f(x))}</b>`;
    plano.pedirDibujo();
  }

  /** El dominio: los tramos unidos donde se tocan. */
  function dominio() {
    const partes = [];
    for (const t of estado.tramos) {
      const ult = partes[partes.length - 1];
      if (ult && Math.abs(ult.hi - t.lo) < EPS && (ult.hiCerrado || t.loCerrado)) {
        ult.hi = t.hi;
        ult.hiCerrado = t.hiCerrado;
      } else partes.push({ ...t });
    }
    const n = (v) => (Number.isFinite(v) ? num(v) : v > 0 ? '+∞' : '−∞');
    return partes.map((q) => (!Number.isFinite(q.lo) && !Number.isFinite(q.hi) ? 'ℝ'
      : `${q.loCerrado ? '[' : '('}${n(q.lo)}, ${n(q.hi)}${q.hiCerrado ? ']' : ')'}`)).join(' ∪ ');
  }

  function actualizarInfo() {
    const partes = [];
    partes.push(itemInfo(col.funcion, 'Cómo se lee:', `para cada ${X}, primero se mira <b>en qué tramo cae</b> (la parte de "si…") y después se hace la cuenta de <b>ese</b> tramo. El punto lleno quiere decir que ese extremo está incluido; el hueco, que no.`));
    if (casillas.saltos) {
      for (const c of cortes()) {
        const yi = c.izq.formula.f(c.x);
        const yd = c.der.formula.f(c.x);
        const quien = c.izq.hiCerrado ? 'el de la izquierda' : 'el de la derecha';
        const cuerpo = Math.abs(yi - yd) < EPS
          ? `los dos tramos llegan a la misma altura (${numAprox(yi)}): la curva <b>se pega</b> y se puede dibujar sin levantar el lápiz.`
          : `el tramo de la izquierda llega a ${numAprox(yi)} y el de la derecha arranca en ${numAprox(yd)}: la curva <b>salta</b> ${numAprox(Math.abs(yd - yi))}. En ${X} = ${num(c.x)} vale ${numAprox(F(c.x))} (manda ${quien}).`;
        partes.push(itemInfo(col.vertice, `En ${X} = ${num(c.x)}:`, cuerpo));
      }
    }
    if (casillas.enteras) {
      partes.push(itemInfo(col.fantasma, 'Fórmulas enteras:', 'cada tramo es un pedazo de una función entera (en gris). La partida se queda solo con un pedazo de cada una.'));
    }
    if (casillas.dominio) {
      partes.push(itemInfo(col.funcion, 'Dominio:', `${dominio()} <span class="texto-suave">(juntando los tramos)</span>`));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  // --------------------------------------------------------------- controles

  const controlCorte = $('[data-control-corte]');
  const corte = conectarDeslizador($('.deslizador[data-param="c"]'), (v) => {
    // con dos tramos, el corte se mueve: el primero termina y el segundo empieza en v
    const [a, b] = estado.tramos;
    a.hi = v;
    b.lo = v;
    cambio();
  });

  $('[data-cambiar-lado]').addEventListener('click', () => {
    const [a, b] = estado.tramos;
    a.hiCerrado = !a.hiCerrado;
    b.loCerrado = !b.loCerrado;
    cambio();
  });

  function cambio() {
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarLectura();
    actualizarInfo();
  }

  function elegir(i) {
    estado.indice = (i + textos.length) % textos.length;
    estado.tramos = leerPartida(textos[estado.indice]);
    contadorEl.textContent = `Función ${estado.indice + 1} de ${textos.length}`;
    const dos = estado.tramos.length === 2 && Math.abs(estado.tramos[0].hi - estado.tramos[1].lo) < EPS;
    controlCorte.hidden = !dos;
    if (dos) corte.poner(estado.tramos[0].hi, false);
    cambio();
    if (casillas.animacion) animacion.reproducir();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

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

  estado.tramos = leerPartida(textos[0]);
  const animar = casillas.animacion;
  casillas.animacion = false; // (la primera vez arranca cuando se ve el gráfico)
  elegir(0);
  casillas.animacion = animar;

  if (casillas.animacion) {
    animacion.visibles = 0;
    animacion.hastaX = -Infinity;
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        observador.disconnect();
        if (casillas.animacion) animacion.reproducir(); else animacion.terminar();
      }
    }, { threshold: 0.6 });
    observador.observe($('[data-grafico]'));
  }
}
