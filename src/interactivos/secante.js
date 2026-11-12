// ==========================================================================
// INTERACTIVO 6.a: de la secante a la tangente
//
// - Un punto azul (x, f(x)) y uno negro (x + h, f(x + h)), unidos por la
//   recta secante. Arriba se lee su pendiente, el cociente incremental:
//       (f(x + h) − f(x)) : h
// - "Achicar h" lleva h hacia 0 de a poco (animado): el punto negro se
//   acerca al azul y la secante se convierte en la tangente.
// - Una tablita va anotando la pendiente para h = 1, 0.5, 0.1, 0.01, 0.001
//   y dice a qué número se acerca: la derivada f'(x).
// - h puede ser negativo (el punto negro a la izquierda): se llega a lo mismo.
// - Casilla "Con h en la cuenta" (para polinomios): la pendiente escrita con
//   h, por ejemplo 2 + h, y qué queda cuando h se achica.
// Las funciones vienen del tema (campo "funciones:" del .md).
// El HTML está en src/components/interactivos/Secante.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { leerDerivable, cocienteEnH } from '../lib/derivadas.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
const H = '<i>h</i>';
const F = '<i>f</i>';
const HITOS = [1, 0.5, 0.1, 0.01, 0.001]; // los h que se anotan en la tabla
const H_CHICO = 0.01;                      // desde acá, la secante ya casi es la tangente
const H_FINAL = 0.001;                     // hasta dónde llega "Achicar h"
const EPS = 1e-9;

/** Cuántos decimales tiene un número (escrito sin ceros de más). */
const decimalesDe = (v) => (String(Math.abs(v)).split('.')[1] ?? '').length;

/** Redondea h: de a 0.01 si es grande; con 2 cifras si es chico (0.035, 0.0012). */
function redondearH(h) {
  if (h === 0) return 0;
  if (Math.abs(h) >= 0.1) return Math.round(h * 100) / 100;
  return Number(h.toPrecision(2));
}

/** Un polinomio en h, del término sin h al de mayor grado: 2 + h, 12 + 6h + h² */
function enHHtml(coef) {
  const sup = ['', '', '²', '³', '⁴', '⁵', '⁶'];
  const partes = [];
  coef.forEach((c, i) => {
    if (Math.abs(c) < 0.0005) return;
    const abs = numAprox(Math.abs(c)).replace('≈ ', '');
    const termino = i === 0 ? abs : `${abs === '1' ? '' : abs}${H}${sup[i] ?? ''}`;
    partes.push(partes.length === 0 ? (c < 0 ? '−' : '') + termino : ` ${c < 0 ? '−' : '+'} ${termino}`);
  });
  return partes.join('') || '0';
}

/** Un número entre paréntesis si es negativo: (−2) */
const par = (v, d = 2) => (v < 0 ? `(${num(v, d)})` : num(v, d));

export function iniciarSecante(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.funciones);
  const estado = { indice: 0, fn: leerDerivable(textos[0]), x: 1, h: 1 };

  const plano = new Plano($('[data-grafico]'), {
    // corrida a la derecha: el punto arranca en x = 1 y los carteles no quedan bajo los botones de zoom
    vista: { xMin: -3, xMax: 5, yCentro: 1.5 },
    descripcion: 'Gráfico de la función con la recta secante',
  });
  const col = plano.colores;
  let casillas = {};

  const f = (x) => estado.fn.f(x);
  const pendiente = (h = estado.h) => (f(estado.x + h) - f(estado.x)) / h;
  const casiTangente = () => estado.h !== 0 && Math.abs(estado.h) <= H_CHICO + EPS;

  // --- Capa 1: la recta tangente ---
  plano.agregarCapa((p) => {
    if (!casillas.tangente) return;
    const { x } = estado;
    const m = estado.fn.d(x);
    p.curva((t) => f(x) + m * (t - x), { color: col.derivada, ancho: 2.5, guiones: [9, 6] });
  });

  // --- Capa 2: la curva ---
  plano.agregarCapa((p) => p.curva(f, { color: col.funcion, ancho: 3.5 }));

  // --- Capa 3: el triángulo (lo que avanzo, h, y lo que sube) ---
  plano.agregarCapa((p) => {
    const { x, h } = estado;
    if (!casillas.triangulo || h === 0) return;
    const y1 = f(x);
    const y2 = f(x + h);
    const ctx = p.ctx;
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = col.vertice;
    ctx.beginPath();
    ctx.moveTo(p.px(x), p.py(y1));
    ctx.lineTo(p.px(x + h), p.py(y1));
    ctx.lineTo(p.px(x + h), p.py(y2));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.segmento(x, y1, x + h, y1, { color: col.vertice, ancho: 2.5 });
    p.segmento(x + h, y1, x + h, y2, { color: col.vertice, ancho: 2.5 });
    // los carteles solo si el triángulo se ve de un tamaño razonable
    if (Math.abs(h) * p.escala > 28) {
      const abajo = y2 > y1;
      p.etiqueta(`h = ${num(h, 3)}`, x + h / 2, y1, { color: col.vertice, dx: 0, dy: abajo ? 16 : -16, alinear: 'center', tamano: 13 });
    }
    if (Math.abs(y2 - y1) * p.escalaY > 22) {
      const d = y2 - y1;
      p.etiqueta(`${d >= 0 ? 'sube' : 'baja'} ${num(Math.abs(d), 3)}`, x + h, (y1 + y2) / 2,
        { color: col.vertice, dx: h > 0 ? 8 : -8, dy: 0, alinear: h > 0 ? 'left' : 'right', tamano: 13 });
    }
  });

  // --- Capa 4: la secante y los dos puntos ---
  plano.agregarCapa((p) => {
    const { x, h } = estado;
    const y1 = f(x);
    if (h !== 0) {
      const m = pendiente();
      const color = casiTangente() ? col.derivada : col.texto;
      p.curva((t) => y1 + m * (t - x), { color, ancho: 2.5, alfa: 0.9 });
      // el cartel, sobre la recta, un poco antes del punto azul (del lado contrario al negro)
      const xe = x - Math.sign(h) * 1.2 / Math.hypot(1, m);
      p.etiqueta(casiTangente() ? '¡ya casi es la tangente!' : 'secante', xe, y1 + m * (xe - x),
        { color, dx: h > 0 ? 10 : -10, dy: 2, alinear: h > 0 ? 'left' : 'right', tamano: 13 });
      p.punto(x + h, f(x + h), { color: col.texto, radio: 7 });
      if (Math.abs(h) * p.escala > 24) p.etiqueta('x + h', x + h, f(x + h), { color: col.texto, dx: h > 0 ? 10 : -10, dy: 14, alinear: h > 0 ? 'left' : 'right', tamano: 13, negrita: false });
    }
    p.punto(x, y1, { color: col.funcion, radio: 8.5 });
    p.etiqueta('x', x, y1, { color: col.funcion, dx: h >= 0 ? -12 : 12, dy: -14, alinear: h >= 0 ? 'right' : 'left', tamano: 14 });
  });

  // El punto azul se arrastra sobre la curva (de a 0.5); el negro cambia h (de a 0.1).
  plano.agregarArrastrable({
    posicion: () => [estado.x, f(estado.x)],
    mover: (x) => {
      detener();
      deslX.poner(Math.round(x * 2) / 2);
    },
  });
  plano.agregarArrastrable({
    posicion: () => [estado.x + estado.h, f(estado.x + estado.h)],
    mover: (x) => {
      detener();
      let h = Math.round((x - estado.x) * 10) / 10;
      if (h === 0) h = estado.h >= 0 ? 0.1 : -0.1;
      ponerH(Math.max(-3, Math.min(3, h)));
    },
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const tablaEl = $('[data-tabla]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  function actualizarLectura() {
    const { x, h } = estado;
    expresionEl.innerHTML = `${F}(${X}) = ${estado.fn.html}`;
    if (h === 0) {
      lecturaEl.innerHTML = `Con ${H} = 0 los dos puntos son el mismo y la cuenta da 0 : 0, que no se puede hacer. ` +
        `<span class="texto-suave">Por eso ${H} se achica, pero nunca llega a 0.</span>`;
      return;
    }
    const k = decimalesDe(h);
    const dF = Math.min(8, 2 + 2 * k); // decimales para f(x) y f(x + h)
    const y1 = f(x);
    const y2 = f(x + h);
    lecturaEl.innerHTML =
      `<span class="lectura-titulo">pendiente de la secante = (${F}(${X} + ${H}) − ${F}(${X})) : ${H}</span>` +
      `<span>(${F}(${num(x + h, 6)}) − ${F}(${num(x)})) : ${par(h, 6)} = (${num(y2, dF)} − ${par(y1, dF)}) : ${par(h, 6)} ` +
      `<b>${igual(pendiente(), Math.max(2, k))}</b></span>`;
  }

  function actualizarTabla() {
    const signo = estado.h < 0 ? -1 : 1;
    const habs = Math.abs(estado.h);
    const celdas = HITOS.map((m) => {
      const visto = estado.h !== 0 && habs <= m + EPS;
      return { h: signo * m, q: pendiente(signo * m), visto };
    });
    const fila1 = celdas.map((c) => `<td class="${c.visto ? '' : 'oculta'}">${num(c.h, 3)}</td>`).join('');
    const fila2 = celdas.map((c) => `<td class="${c.visto ? '' : 'oculta'}">${numAprox(c.q, Math.max(2, decimalesDe(c.h))).replace('≈ ', '')}</td>`).join('');
    const d = estado.fn.d(estado.x);
    const nota = casiTangente()
      ? `Se acerca a <b class="color-derivada">${numAprox(d)}</b>: esa es la derivada, ${F}'(${num(estado.x)}) ${igual(d)}.`
      : `Achicá ${H} y fijate a qué número se acerca la pendiente.`;
    tablaEl.innerHTML = `<table class="tabla-valores"><tr><th>${H}</th>${fila1}</tr><tr><th>pendiente</th>${fila2}</tr></table>` +
      `<p class="tabla-nota">${nota}</p>`;
  }

  function actualizarInfo() {
    const { x } = estado;
    const d = estado.fn.d(x);
    const partes = [];
    partes.push(itemInfo(col.texto, 'Secante:', `la recta que pasa por los dos puntos. Su pendiente es lo que sube dividido lo que avanza: (${F}(${X} + ${H}) − ${F}(${X})) : ${H}. Esa cuenta se llama <b>cociente incremental</b>.`));
    partes.push(itemInfo(col.derivada, 'Si h se achica:', `el punto negro se acerca al azul y la secante se apoya cada vez más en la curva, hasta ser la <b>recta tangente</b>. Su pendiente es la <b>derivada</b>: ${F}'(${num(x)}) ${igual(d)}.`));
    if (casillas.tangente) {
      partes.push(itemInfo(col.derivada, 'Tangente:', `toca la curva en (${num(x)}, ${numAprox(f(x))}) y tiene pendiente ${F}'(${num(x)}) ${igual(d)}. ` +
        (Math.abs(d) < 1e-6 ? 'Está acostada: ahí la curva no sube ni baja.' : d > 0 ? 'Sube: ahí la curva crece.' : 'Baja: ahí la curva decrece.')));
    }
    if (casillas.conH) {
      if (estado.fn.coef) {
        const enH = enHHtml(cocienteEnH(estado.fn.coef, x));
        const xMasH = x === 0 ? H : `${num(x)} + ${H}`;
        partes.push(itemInfo(col.funcion, 'Con h en la cuenta:', `haciendo la cuenta con letras, (${F}(${xMasH}) − ${F}(${num(x)})) : ${H} = <b>${enH}</b>. ` +
          `Si ${H} se achica hasta casi 0, lo que tiene ${H} desaparece y queda <b>${numAprox(d)}</b>.`));
      } else {
        partes.push(itemInfo(col.funcion, 'Con h en la cuenta:', 'esta cuenta con letras la hacemos solo con polinomios.'));
      }
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  function actualizar() {
    plano.pedirDibujo();
    actualizarLectura();
    actualizarTabla();
    actualizarInfo();
    actualizarBoton();
  }

  // --------------------------------------------------------------- controles

  const formatoH = (v) => num(v, Math.max(2, decimalesDe(v)));
  const deslX = conectarDeslizador($('.deslizador[data-param="x"]'), (v) => { estado.x = v; actualizar(); });
  const deslH = conectarDeslizador($('.deslizador[data-param="h"]'), (v) => { detener(); ponerH(v); }, { formato: formatoH });

  function ponerH(v) {
    estado.h = redondearH(v);
    deslH.poner(estado.h, false, false);
    actualizar();
  }

  // "Achicar h": h va hacia 0 multiplicándose de a poco (cada 2 segundos, 10 veces más chico)
  const botonAchicar = $('[data-achicar]');
  let anim = null;
  function detener() {
    if (anim) { anim.cancelar(); anim = null; actualizarBoton(); }
  }
  function actualizarBoton() {
    if (anim) botonAchicar.innerHTML = 'Parar';
    else if (estado.h !== 0 && Math.abs(estado.h) <= H_FINAL + EPS) botonAchicar.innerHTML = `Volver a ${H} = ${estado.h < 0 ? '−1' : '1'}`;
    else botonAchicar.innerHTML = `Achicar ${H}`;
  }
  botonAchicar.addEventListener('click', () => {
    if (anim) { detener(); return; }
    const signo = estado.h < 0 ? -1 : 1;
    if (estado.h !== 0 && Math.abs(estado.h) <= H_FINAL + EPS) { ponerH(signo); return; }
    const h0 = estado.h === 0 ? signo : estado.h;
    const veces = Math.log10(Math.abs(h0) / H_FINAL); // cuántas veces hay que dividir por 10
    const duracion = sinMovimiento() ? 1 : Math.max(800, veces * 2000);
    anim = animar(duracion, (t) => {
      estado.h = redondearH(h0 * (H_FINAL / Math.abs(h0)) ** t);
      deslH.poner(estado.h, false, false);
      actualizar();
    }, () => { anim = null; ponerH(signo * H_FINAL); });
    actualizarBoton();
  });

  casillas = conectarCasillas($('[data-casillas]'), () => { plano.pedirDibujo(); actualizarInfo(); });

  function elegir(i) {
    detener();
    estado.indice = (i + textos.length) % textos.length;
    estado.fn = leerDerivable(textos[estado.indice]);
    contadorEl.textContent = `Función ${estado.indice + 1} de ${textos.length}`;
    ponerH(1);
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  elegir(0);
}
