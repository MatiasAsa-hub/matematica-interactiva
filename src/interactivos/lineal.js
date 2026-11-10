// ==========================================================================
// INTERACTIVO: función lineal f(x) = m·x + b
//   m: pendiente (cuánto sube o baja por cada 1 que se avanza en x)
//   b: ordenada al origen (donde la recta corta al eje y)
// El HTML está en src/components/interactivos/Lineal.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { conjuntos, dibujarBarrasDeSigno, tramoCrecimiento } from '../lib/grafico/signos.js';
import { num, igual } from '../lib/numeros.js';

const EPS = 1e-9;
const X = '<i>x</i>';
const par = (v) => (v < 0 ? `(${num(v)})` : num(v));

/** m·x + b escrito lindo. Con marcar, cada valor queda marcado (para resaltarlo al mover el deslizador). */
export function rectaHtml(m, b, { marcar = false } = {}) {
  const v = (p, t) => (marcar ? `<span class="valor" data-p="${p}">${t}</span>` : t);
  const partes = [];
  if (Math.abs(m) >= 0.005) {
    const abs = Math.abs(m);
    partes.push(`${m < 0 ? '−' : ''}${Math.abs(abs - 1) < 0.005 ? '' : v('m', num(abs))}${X}`);
  }
  if (Math.abs(b) >= 0.005 || partes.length === 0) {
    if (partes.length === 0) partes.push(v('b', num(b)));
    else partes.push(`${b < 0 ? '−' : '+'} ${v('b', num(Math.abs(b)))}`);
  }
  return partes.join(' ');
}

export function iniciarLineal(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { m: 2, b: -4 };
  const f = (x) => estado.m * x + estado.b;
  const hayPendiente = () => Math.abs(estado.m) > EPS;
  const raices = () => (hayPendiente() ? [-estado.b / estado.m] : []);

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 0 },
    descripcion: 'Gráfico de la recta',
  });
  const col = plano.colores;
  let casillas = {};

  // --- Capa 1: C⁺ y C⁻ (debajo de la recta) ---
  plano.agregarCapa((p) => {
    if (!casillas.signos) return;
    p.zonaSigno(f, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(f, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    dibujarBarrasDeSigno(p, f, raices());
  });

  // --- Capa 2: el triángulo de la pendiente ("avanzo 1, subo m") ---
  plano.agregarCapa((p) => {
    if (!casillas.pendiente) return;
    const { m } = estado;
    // arranca en x = 0 si se ve; si no, en el entero más cercano al centro
    const seVe = (x) => x > p.xMin && x + 1 < p.xMax && f(x) > p.yMin && f(x) < p.yMax;
    let x0 = 0;
    if (!seVe(0)) {
      const centro = Math.round(hayPendiente() ? (p.cy - estado.b) / m : p.cx);
      x0 = seVe(centro) ? centro : Math.round(p.cx);
    }
    const y0 = f(x0);
    const ctx = p.ctx;
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = col.vertice;
    ctx.beginPath();
    ctx.moveTo(p.px(x0), p.py(y0));
    ctx.lineTo(p.px(x0 + 1), p.py(y0));
    ctx.lineTo(p.px(x0 + 1), p.py(y0 + m));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.segmento(x0, y0, x0 + 1, y0, { color: col.vertice, ancho: 3, guiones: [6, 5] });
    if (hayPendiente()) {
      p.segmento(x0 + 1, y0, x0 + 1, y0 + m, { color: col.vertice, ancho: 3.5 });
      const X1 = p.px(x0 + 1);
      if (Math.abs(p.escala * m) > 18) p.flechaPx(X1, p.py(y0), X1, p.py(y0 + m), { color: col.vertice, ancho: 3.5, punta: 10 });
    }
    p.etiqueta('avanzo 1', x0 + 0.5, y0, { color: col.vertice, dx: 0, dy: m > 0 ? 16 : -16, alinear: 'center', tamano: 14 });
    const texto = !hayPendiente() ? 'no sube ni baja' : `${m > 0 ? 'subo' : 'bajo'} ${num(Math.abs(m))}`;
    p.etiqueta(texto, x0 + 1, y0 + m / 2, { color: col.vertice, dx: 10, dy: 0, alinear: 'left', tamano: 14 });
  });

  // --- Capas 3 y 4: la recta y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, { f, color: col.funcion, tabla: tablaCaja });

  // --- Capa 5: puntos notables ---
  plano.agregarCapa((p) => {
    const { m, b } = estado;
    if (casillas.raiz || casillas.signos) {
      for (const r of raices()) {
        p.punto(r, 0, { color: col.raices, radio: 6.5 });
        if (casillas.raiz) p.etiqueta(`x ${igual(r)}`, r, 0, { color: col.raices, dx: m > 0 ? 10 : -10, dy: m > 0 ? 16 : 16, alinear: m > 0 ? 'left' : 'right' });
      }
      if (casillas.raiz && !hayPendiente() && Math.abs(b) < EPS) {
        p.etiqueta('¡todos los x son raíces!', p.cx, 0, { color: col.raices, dy: -16, alinear: 'center' });
      }
    }
    if (casillas.ordenada) {
      p.punto(0, b, { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      p.etiqueta(`(0, ${num(b)})`, 0, b, { color: col.ordenada, dx: m > 0 ? -10 : 10, dy: -12, alinear: m > 0 ? 'right' : 'left' });
    }
    if (casillas.crece) {
      if (hayPendiente()) tramoCrecimiento(p, 0, p.ancho - 56, m > 0);
      else p.etiqueta('constante: ni crece ni decrece', p.cx, p.yMax, { color: col.fantasma, dx: 0, dy: 30, alinear: 'center', tamano: 14 });
    }
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const infoEl = $('[data-info]');
  const avisoM0 = $('[data-aviso-m0]');
  let parametroActivo = null;

  function actualizarExpresion() {
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${rectaHtml(estado.m, estado.b, { marcar: true })}`;
    if (parametroActivo) expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');
  }

  const item = (color, titulo, cuerpo) =>
    `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

  /** La raíz, despejando como en "Resolver ecuaciones": m·x + b = 0 → … */
  function despejeRaiz() {
    const { m, b } = estado;
    if (!hayPendiente()) {
      return Math.abs(b) < EPS
        ? 'todos los <i>x</i>: la recta es el mismo eje x.'
        : '<b>no tiene</b>: la recta es horizontal y nunca toca el eje x.';
    }
    const r = -b / m;
    const pasos = [`${rectaHtml(m, b)} = 0`];
    if (Math.abs(b) >= 0.005) pasos.push(`${rectaHtml(m, 0)} = ${num(-b)}`);
    if (Math.abs(m - 1) >= 0.005) pasos.push(`${X} = ${num(-b)} : ${par(m)}`);
    return `donde <i>f</i>(${X}) = 0. Se resuelve la ecuación: <span class="info-despeje">${pasos.join(' → ')} → <b>${X} ${igual(r)}</b></span>`;
  }

  function actualizarInfo() {
    const { m, b } = estado;
    avisoM0.hidden = hayPendiente();
    const partes = [];

    if (casillas.raiz) partes.push(item(col.raices, 'Raíz:', despejeRaiz()));
    if (casillas.ordenada) partes.push(item(col.ordenada, 'Ordenada al origen:', `(0, ${num(b)}). Es donde la recta corta al eje y: <i>f</i>(0) = <i>b</i> = ${num(b)}.`));
    if (casillas.pendiente) {
      const texto = !hayPendiente()
        ? 'no sube ni baja: la recta es horizontal.'
        : `por cada 1 que avanzás en ${X}, <i>f</i>(${X}) <b>${m > 0 ? 'sube' : 'baja'} ${num(Math.abs(m))}</b>.`;
      partes.push(item(col.vertice, `Pendiente: m = ${num(m)}.`, `Es el número que multiplica a la ${X}: ${texto}`));
    }
    if (casillas.signos) {
      const s = conjuntos(f, raices(), !hayPendiente() && Math.abs(b) < EPS);
      partes.push(item(col.positivo, 'C⁺ =', `${s.pos} <span class="texto-suave">(donde f(x) > 0: es resolver la inecuación ${rectaHtml(m, b)} > 0)</span>`));
      partes.push(item(col.negativo, 'C⁻ =', `${s.neg} <span class="texto-suave">(donde f(x) < 0)</span>`));
    }
    if (casillas.crece) {
      if (!hayPendiente()) partes.push(item(col.fantasma, 'Constante:', 'ni crece ni decrece (m = 0).'));
      else partes.push(item(m > 0 ? col.crece : col.decrece, m > 0 ? 'Crece en ℝ:' : 'Decrece en ℝ:', `la pendiente es ${m > 0 ? 'positiva' : 'negativa'}.`));
    }

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba para ver los puntos importantes de la recta.</p>';
  }

  // --------------------------------------------------------------- controles

  function redibujarTodo() {
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarInfo();
  }

  for (const nombre of ['m', 'b']) {
    const control = conectarDeslizador(raiz.querySelector(`.deslizador[data-param="${nombre}"]`), (v) => {
      estado[nombre] = v;
      redibujarTodo();
    }, {
      alEmpezar: () => { parametroActivo = nombre; actualizarExpresion(); },
      alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
    });
    estado[nombre] = control.valor;
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

  actualizarExpresion();
  actualizarInfo();

  // La animación arranca recién cuando el gráfico aparece en pantalla.
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
