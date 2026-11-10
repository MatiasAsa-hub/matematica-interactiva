// ==========================================================================
// INTERACTIVO: una "familia" de funciones con la forma a · f(x − h) + k
//   - módulo:      f(x) = a|x − h| + k       (una V con vértice en (h, k))
//   - raíz:        f(x) = a√(x − h) + k      (arranca en (h, k))
//   - homográfica: f(x) = a / (x − h) + k    (asíntotas x = h e y = k)
// Igual que la forma canónica de la cuadrática: h corre a los costados y k
// sube o baja. Las cuentas salen de transformar() (src/lib/funcionesBase.js).
//
// Además, cada una tiene:
//   - un punto que se arrastra sobre la curva y muestra la cuenta
//     ("|−1 − 2| = |−3| = 3", "√(2 + 2) = √4 = 2", "2 : (3 − 1) = 1");
//   - algo propio: "Sin el módulo" (la recta que rebota) o
//     "Parábola acostada" (la raíz es media parábola).
// El HTML está en src/components/interactivos/Familia.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { dibujarBarrasDeSigno, tramoCrecimiento } from '../lib/grafico/signos.js';
import { BASES, transformar, argumentoHtml } from '../lib/funcionesBase.js';
import { bordes, renglonesInfo, itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox, igual } from '../lib/numeros.js';
import { rectaHtml } from './lineal.js';

const X = '<i>x</i>';
const par = (v) => (v < 0 ? `(${num(v)})` : num(v));
/** "x − h" con los números puestos: "3 − 1", "−1 + 2" */
const resta = (x, h) => (h === 0 ? num(x) : `${num(x)} ${h > 0 ? '−' : '+'} ${num(Math.abs(h))}`);

const FAMILIAS = {
  modulo: { base: 'modulo', px: -1 },
  raiz: { base: 'raiz', px: 2 },
  homografica: { base: 'inversa', px: 3 },
};

export function iniciarFamilia(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const familia = raiz.dataset.familia;
  const config = FAMILIAS[familia];
  const base = BASES[config.base];
  const estado = { a: 1, h: 0, k: 0, px: config.px };

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 1 },
    descripcion: 'Gráfico de la función',
  });
  const col = plano.colores;
  let casillas = {};

  let t; // lo que devuelve transformar()
  function recalcular() {
    const margen = (plano.xMax - plano.xMin) * 0.1;
    t = transformar(config.base, { a: estado.a, b: 1, c: estado.h, d: estado.k, k: 2 }, [plano.xMin - margen, plano.xMax + margen]);
  }
  const F = (x) => t.F(x);
  const existe = (x) => Number.isFinite(F(x));
  recalcular();

  // --- Capa 1: lo propio de cada familia, debajo de todo ---
  plano.agregarCapa((p) => {
    const { a, h, k } = estado;
    if (familia === 'modulo' && casillas.espejo) {
      const recta = (x) => a * (x - h) + k;
      p.curva(recta, { color: col.fantasma, ancho: 2.5, guiones: [8, 6] });
      // flechitas: lo que la recta tenía de un lado, el módulo lo da vuelta
      if (a !== 0) {
        for (const dx of [1, 2, 3]) {
          const x = h - dx;
          if (x < p.xMin || x > p.xMax) continue;
          const y1 = recta(x);
          const y2 = F(x);
          if (Math.abs(p.py(y1) - p.py(y2)) > 16) p.flechaPx(p.px(x), p.py(y1), p.px(x), p.py(y2), { color: col.fantasma, ancho: 2, punta: 8 });
        }
        const xe = h - 2.5;
        p.etiqueta('se da vuelta', xe, (recta(xe) + F(xe)) / 2, { color: col.fantasma, dx: -8, dy: 0, alinear: 'right', tamano: 13 });
      }
    }
    if (familia === 'raiz' && casillas.acostada && a !== 0) {
      // la parábola entera: x = h + ((y − k) / a)²
      const ctx = p.ctx;
      ctx.save();
      ctx.strokeStyle = col.fantasma;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      const pasos = 200;
      for (let i = 0; i <= pasos; i++) {
        const y = p.yMin + ((p.yMax - p.yMin) * i) / pasos;
        const x = h + ((y - k) / a) ** 2;
        if (i === 0) ctx.moveTo(p.px(x), p.py(y)); else ctx.lineTo(p.px(x), p.py(y));
      }
      ctx.stroke();
      ctx.restore();
      const ye = k - Math.sign(a) * 1.6;
      p.etiqueta('la otra mitad', h + ((ye - k) / a) ** 2, ye, { color: col.fantasma, dx: 10, dy: 0, alinear: 'left', tamano: 13 });
    }
    // la zona donde no hay función (raíz)
    if (familia === 'raiz' && casillas.dominio) {
      const X0 = Math.max(0, Math.min(p.ancho, p.px(h)));
      const ctx = p.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, X0, p.alto);
      ctx.clip();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = col.fantasma;
      ctx.fillRect(0, 0, X0, p.alto);
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = col.fantasma;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let d = -p.alto; d < X0; d += 14) { ctx.moveTo(d, p.alto); ctx.lineTo(d + p.alto, 0); }
      ctx.stroke();
      ctx.restore();
      if (X0 > 110) p.etiqueta('acá no hay raíz', p.mx(X0 / 2), p.yMin, { color: col.fantasma, dx: 0, dy: -24, alinear: 'center', tamano: 14 });
    }
  });

  // --- Capa 2: C⁺ y C⁻ ---
  plano.agregarCapa((p) => {
    if (!casillas.signos || t.todoCero) return;
    p.zonaSigno(F, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(F, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    const cortes = [...t.raices, ...bordes(t)].sort((x, y) => x - y);
    dibujarBarrasDeSigno(p, F, cortes);
  });

  // --- Capas 3 y 4: la curva (por tramos) y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, {
    f: F,
    color: col.funcion,
    tabla: tablaCaja,
    dibujarCurva: (hasta) => {
      for (const tr of t.tramos) plano.curva(F, { color: col.funcion, ancho: 3.5, desde: tr.desde, hasta: Math.min(tr.hasta, hasta) });
    },
  });

  // --- Capa 5: asíntotas y puntos notables ---
  const dentro = (x) => x >= plano.xMin && x <= plano.xMax;
  plano.agregarCapa((p) => {
    const { a, h, k } = estado;
    if (casillas.asintotas) {
      for (const x of t.verticales) {
        p.lineaVertical(x, { color: col.texto, ancho: 1.5, guiones: [3, 6], alfa: 0.8 });
        p.etiqueta(`x = ${num(x)}`, x, p.yMax, { color: col.texto, dx: 6, dy: 40, alinear: 'left', tamano: 13 });
      }
      if (t.horizontal !== null) {
        p.lineaHorizontal(t.horizontal, { color: col.texto, ancho: 1.5, guiones: [3, 6], alfa: 0.8 });
        p.etiqueta(`y = ${num(t.horizontal)}`, p.xMin, t.horizontal, { color: col.texto, dx: 6, dy: -12, alinear: 'left', tamano: 13 });
      }
    }
    if (casillas.crece && a !== 0) {
      const derecha = p.ancho - 56;
      const cortes = [...t.extremos.map((e) => e.x), ...bordes(t)].map((x) => Math.min(Math.max(p.px(x), 0), derecha));
      const lista = [0, ...cortes, derecha].sort((x, y) => x - y);
      for (let i = 0; i < lista.length - 1; i++) {
        const xm = p.mx((lista[i] + lista[i + 1]) / 2);
        const s = F(xm + 1e-4) - F(xm - 1e-4);
        if (Number.isFinite(s) && s !== 0) tramoCrecimiento(p, lista[i], lista[i + 1], s > 0);
      }
    }
    if (casillas.ordenada && existe(0)) {
      p.punto(0, F(0), { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      p.etiqueta(`(0, ${numAprox(F(0))})`, 0, F(0), { color: col.ordenada, dx: -10, dy: -12, alinear: 'right' });
    }
    if (casillas.extremos) {
      for (const e of t.extremos.filter((e) => dentro(e.x))) {
        p.punto(e.x, F(e.x), { color: col.vertice, forma: 'rombo', radio: 6 });
        p.etiqueta(`vértice (${num(e.x)}, ${num(F(e.x))})`, e.x, F(e.x), { color: col.vertice, dx: 0, dy: e.tipo === 'max' ? -20 : 22, alinear: 'center', tamano: 14 });
      }
    }
    if (casillas.arranque && familia === 'raiz') {
      p.punto(h, k, { color: col.vertice, forma: 'rombo', radio: 6 });
      p.etiqueta(`arranca en (${num(h)}, ${num(k)})`, h, k, { color: col.vertice, dx: 0, dy: a >= 0 ? 22 : -20, alinear: 'center', tamano: 14 });
    }
    if (casillas.raices) {
      const visibles = t.raices.filter(dentro);
      visibles.forEach((x, i) => {
        p.punto(x, 0, { color: col.raices, radio: 6.5 });
        p.etiqueta(numAprox(x), x, 0, { color: col.raices, dx: 0, dy: i % 2 === 0 ? 20 : 38, alinear: 'center', tamano: 14 });
      });
    }

    // el punto que se arrastra, con líneas guía a los ejes
    const x = estado.px;
    if (!dentro(x)) return;
    if (!existe(x)) {
      p.lineaVertical(x, { color: col.negativo, ancho: 2, guiones: [4, 5], alfa: 0.9 });
      p.etiqueta('no existe', x, p.yMin, { color: col.negativo, dx: 6, dy: -40, alinear: 'left', tamano: 13 });
      p.punto(x, 0, { color: col.negativo, radio: 8, hueco: true });
      return;
    }
    const y = F(x);
    p.segmento(x, 0, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
    p.segmento(0, y, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
    p.punto(x, y, { color: col.funcion, radio: 9 });
  });

  // El punto se arrastra a lo largo de la curva (solo importa su x).
  plano.agregarArrastrable({
    posicion: () => [estado.px, existe(estado.px) ? F(estado.px) : 0],
    mover: (x) => {
      let nx = Math.round(x * 10) / 10;
      // se pega a los enteros (en la homográfica no: así se puede llegar bien cerca de la asíntota)
      if (familia !== 'homografica' && Math.abs(nx - Math.round(nx)) <= 0.15) nx = Math.round(nx);
      estado.px = Math.max(plano.xMin, Math.min(plano.xMax, nx));
      plano.pedirDibujo();
      actualizarLectura();
    },
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const desarrolladaEl = $('[data-desarrollada]');
  const lecturaEl = $('[data-lectura]');
  const avisoEl = $('[data-aviso]');
  const infoEl = $('[data-info]');
  let parametroActivo = null;

  function actualizarExpresion() {
    const { a, h, k } = estado;
    // en funcionesBase el corrimiento se llama c y d; acá, h y k
    const v = (p, txt) => `<span class="valor" data-p="${p === 'c' ? 'h' : p === 'd' ? 'k' : p}">${txt}</span>`;
    const arg = argumentoHtml(1, h, v, num);
    let cuerpo;
    if (familia === 'homografica') cuerpo = base.html(arg, '', v('a', num(a)));
    else {
      const adelante = a === 1 ? '' : a === -1 ? v('a', '−') : `${v('a', num(a))}${a === 0 ? ' · ' : ''}`;
      cuerpo = adelante + base.html(arg);
    }
    const final = k === 0 ? '' : ` ${k > 0 ? '+' : '−'} ${v('k', num(Math.abs(k)))}`;
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${cuerpo}${final}`;
    if (parametroActivo) expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');

    // la homográfica también escrita como (mx + n) / (x − h)
    if (desarrolladaEl) {
      const arriba = rectaHtml(k, a - k * h);
      const abajo = rectaHtml(1, -h);
      desarrolladaEl.innerHTML = k === 0 && h === 0 ? '' :
        `Es lo mismo que <span class="frac"><span class="frac-num">${arriba}</span><span class="frac-den">${abajo}</span></span>`;
    }
  }

  /** La cuenta en el punto que se arrastra. */
  function actualizarLectura() {
    const { a, h } = estado;
    const x = estado.px;
    const adentro = x - h;
    const fx = `<i>f</i>(${num(x)})`;
    let cuenta;
    if (familia === 'modulo') {
      cuenta = `|${resta(x, h)}| = |${num(adentro)}| = <b>${num(Math.abs(adentro))}</b>`;
    } else if (familia === 'raiz') {
      if (adentro < -1e-9) {
        lecturaEl.innerHTML = `√(${resta(x, h)}) = √(${num(adentro)}) <b>no existe</b> <span class="texto-suave">(ningún número al cuadrado da negativo)</span>`;
        return;
      }
      const r = Math.sqrt(adentro);
      cuenta = `√(${resta(x, h)}) = √${num(adentro)} <b>${igual(r)}</b>`;
    } else {
      if (Math.abs(adentro) < 1e-9) {
        lecturaEl.innerHTML = `${num(a)} : (${resta(x, h)}) = ${num(a)} : 0 → <b>no se puede dividir por 0</b>`;
        return;
      }
      const q = a / adentro;
      cuenta = `${num(a)} : (${resta(x, h)}) = ${num(a)} : ${par(adentro)} <b>${igual(q)}</b>`;
    }
    lecturaEl.innerHTML = `${cuenta} <span class="texto-suave">→</span> ${fx} ${igual(F(x))}`;
  }

  function actualizarInfo() {
    const { a, h, k } = estado;
    avisoEl.hidden = a !== 0;
    if (a === 0) avisoEl.innerHTML = `Con <i>a</i> = 0 la función queda <b>constante</b>: <i>f</i>(${X}) = ${num(k)}.`;

    const partes = [];
    if (familia === 'modulo' && casillas.espejo) {
      partes.push(itemInfo(col.fantasma, 'Sin el módulo:', `sería la recta <i>y</i> = ${rectaHtml(a, k - a * h)}. Del lado izquierdo de ${num(h)}, lo de adentro (${X} − ${par(h)}) da negativo, y el módulo lo da vuelta a positivo: por eso la recta "rebota" y se forma la V.`));
    }
    if (familia === 'raiz' && casillas.arranque) {
      partes.push(itemInfo(col.vertice, `Arranca en (${num(h)}, ${num(k)}):`, `ahí lo de adentro vale 0, y √0 = 0. Antes de ${X} = ${num(h)} no hay nada.`));
    }
    if (familia === 'raiz' && casillas.acostada) {
      partes.push(itemInfo(col.fantasma, 'Parábola acostada:', `si <i>y</i> = √${X}, entonces ${X} = <i>y</i>². La raíz es la operación inversa de elevar al cuadrado, y como la raíz da siempre positivo, queda solo la mitad ${a >= 0 ? 'de arriba' : 'de abajo (con a negativo, dada vuelta)'}.`));
    }
    if (a !== 0) {
      partes.push(...renglonesInfo(t, base, casillas, col, {
        a, centro: h, nombreExtremos: familia === 'modulo' ? 'Vértice:' : 'Máximos y mínimos:',
      }));
    }
    if (familia === 'homografica' && casillas.asintotas && a !== 0) {
      partes.push(itemInfo(col.texto, '¿Por qué?', `Cerca de ${X} = ${num(h)} se divide por algo muy chiquito y da un número enorme (probalo arrastrando el punto). Y lejos, ${num(a)} dividido por algo enorme da casi 0: queda casi ${num(k)}.`));
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
    actualizarLectura();
    actualizarInfo();
  }

  for (const p of ['a', 'h', 'k']) {
    const control = conectarDeslizador($(`.deslizador[data-param="${p}"]`), (v) => { estado[p] = v; cambio(); }, {
      alEmpezar: () => { parametroActivo = p; actualizarExpresion(); },
      alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
    });
    estado[p] = control.valor;
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
  plano.alCambiarVista.push(() => {
    recalcular();
    if (!animacion.animando) animacion.calcularXs();
  });

  cambio();

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
