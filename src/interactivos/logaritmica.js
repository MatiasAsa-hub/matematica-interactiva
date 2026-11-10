// ==========================================================================
// INTERACTIVO: función logarítmica f(x) = logₖ(x)
//   k: la base
// La idea central: el logaritmo es la exponencial "al revés".
//   logₖ(x) responde: ¿a qué número hay que elevar k para llegar a x?
//   - Un punto que se arrastra sobre la curva: "log₂(8) = 3 porque 2³ = 8".
//   - Saltos: cuando x se multiplica por k, el log sube 1.
//   - Espejo: es la exponencial kˣ reflejada en la recta y = x.
// El HTML está en src/components/interactivos/Logaritmica.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { dibujarBarrasDeSigno, tramoCrecimiento } from '../lib/grafico/signos.js';
import { num, numAprox, esExacto } from '../lib/numeros.js';

const EPS = 1e-9;
const X = '<i>x</i>';

/** logₖ(x) escrito lindo. */
export function logaritmoHtml(k, arg = X, { marcar = false } = {}) {
  const base = marcar ? `<span class="valor" data-p="k">${num(k)}</span>` : num(k);
  return `log<sub>${base}</sub>(${arg})`;
}

/** Un exponente escrito lindo: "3", "−1", "2.32" (con ≈ si no es exacto, va afuera). */
const exp = (e) => num(e);

export function iniciarLogaritmica(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { k: 2, px: 4 };
  const kEs1 = () => Math.abs(estado.k - 1) < EPS;
  const f = (x) => (x > 0 && !kEs1() ? Math.log(x) / Math.log(estado.k) : NaN);
  const exponencial = (x) => estado.k ** x;
  const crece = () => estado.k > 1;

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -3, xMax: 10, yCentro: 1.5 },
    descripcion: 'Gráfico de la función logarítmica',
  });
  const col = plano.colores;
  let casillas = {};

  // --- Capa 1: dominio (lo que está a la izquierda del 0 queda rayado) y C⁺ / C⁻ ---
  plano.agregarCapa((p) => {
    if (casillas.dominio) {
      const X0 = Math.max(0, Math.min(p.ancho, p.px(0)));
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
      if (X0 > 90) p.etiqueta('acá no hay log', p.mx(X0 / 2), p.cy, { color: col.fantasma, dx: 0, dy: 0, alinear: 'center', tamano: 14 });
    }
    if (casillas.signos && !kEs1()) {
      p.zonaSigno(f, +1, { color: col.positivo, alfa: 0.16 });
      p.zonaSigno(f, -1, { color: col.negativo, alfa: 0.14, rayado: true });
      // la barra de signo arranca en el 0 (antes no hay función)
      dibujarBarrasDeSigno(p, f, [0, 1]);
    }
  });

  // --- Capa 2: el espejo (la exponencial y la recta y = x) ---
  plano.agregarCapa((p) => {
    if (!casillas.espejo || kEs1()) return;
    p.curva((x) => x, { color: col.fantasma, ancho: 1.5, guiones: [4, 6] });
    p.etiqueta('y = x', p.mx(p.ancho - 70), p.mx(p.ancho - 70), { color: col.fantasma, dx: 0, dy: 18, alinear: 'center', tamano: 13 });
    p.curva(exponencial, { color: col.fantasma, ancho: 2.5, guiones: [8, 6] });
    // etiqueta de la exponencial, arriba, donde la curva sale de la vista
    const yEt = p.yMax - (p.yMax - p.yMin) * 0.12;
    const xEt = Math.log(yEt) / Math.log(estado.k);
    if (Number.isFinite(xEt)) {
      p.etiqueta(`${num(estado.k)}ˣ`, xEt, yEt, { color: col.fantasma, dx: estado.k > 1 ? -10 : 10, dy: 0, alinear: estado.k > 1 ? 'right' : 'left', tamano: 14 });
    }
  });

  // --- Capas 3 y 4: la curva y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, { f, color: col.funcion, tabla: tablaCaja });

  // --- Capa 5: los saltos (×k en x → +1 en y) ---
  plano.agregarCapa((p) => {
    if (!casillas.saltos || kEs1()) return;
    if (animacion.hastaX !== Infinity) return;
    const { k } = estado;
    const lista = [];
    for (let n = -6; n <= 12; n++) {
      const x = k ** n;
      if (x > p.xMin && x < p.xMax && n > p.yMin - 1 && n < p.yMax + 1) lista.push(n);
    }
    for (const n of lista) {
      const x0 = k ** n;
      const x1 = k ** (n + 1);
      if (!(x1 > p.xMin && x1 < p.xMax)) continue;
      const largo = Math.abs(p.px(x1) - p.px(x0));
      if (largo < 22) continue; // muy apretados (cerca del 0): no se dibujan
      // horizontal: ×k
      p.flechaPx(p.px(x0), p.py(n), p.px(x1), p.py(n), { color: col.vertice, ancho: 2.5, punta: 8 });
      if (largo > 40) p.etiqueta(`×${num(k)}`, (x0 + x1) / 2, n, { color: col.vertice, dx: 0, dy: 13, alinear: 'center', tamano: 13 });
      // vertical: +1
      p.segmento(x1, n, x1, n + 1, { color: col.vertice, ancho: 2.5, guiones: [5, 4] });
      if (p.escala > 20) p.etiqueta('+1', x1, n + 0.5, { color: col.vertice, dx: 7, dy: 0, alinear: 'left', tamano: 13 });
    }
    for (const n of lista) p.punto(k ** n, n, { color: col.vertice, radio: 4.5 });
  });

  // --- Capa 6: asíntota, crece / decrece, raíz y el punto que se arrastra ---
  plano.agregarCapa((p) => {
    if (kEs1()) return;
    if (casillas.asintotas) {
      p.lineaVertical(0, { color: col.texto, ancho: 2, guiones: [3, 6], alfa: 0.85 });
      p.etiqueta('asíntota x = 0', 0, crece() ? p.yMin : p.yMax, { color: col.texto, dx: 8, dy: crece() ? -16 : 16, alinear: 'left', tamano: 14 });
    }
    if (casillas.crece) {
      const X0 = Math.max(0, p.px(0));
      tramoCrecimiento(p, X0, p.ancho - 56, crece());
    }
    if (casillas.raiz || casillas.signos) {
      p.punto(1, 0, { color: col.raices, radio: 6.5 });
      if (casillas.raiz) p.etiqueta('(1, 0)', 1, 0, { color: col.raices, dx: 10, dy: crece() ? 16 : -16, alinear: 'left' });
    }

    // el punto P = (x, logₖ x), con líneas guía a los ejes
    const x = estado.px;
    const y = f(x);
    if (!Number.isFinite(y)) return;
    p.segmento(x, 0, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
    p.segmento(0, y, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
    if (casillas.espejo) {
      // el punto espejado (y, x) sobre la exponencial, unido con P
      p.segmento(x, y, y, x, { color: col.vertice, ancho: 2, guiones: [2, 5], alfa: 0.9 });
      p.punto(y, x, { color: col.fantasma, radio: 6.5 });
      p.etiqueta(`(${numAprox(y).replace('≈ ', '≈')}, ${num(x)})`, y, x, { color: col.fantasma, dx: -10, dy: -12, alinear: 'right', tamano: 14 });
    }
    p.punto(x, y, { color: col.funcion, radio: 9 });
    p.etiqueta(`(${num(x)}, ${numAprox(y).replace('≈ ', '≈')})`, x, y, { color: col.funcion, dx: -12, dy: crece() ? -18 : 18, alinear: 'right', tamano: 15 });
  });

  // El punto se arrastra a lo largo de la curva (solo importa su x).
  plano.agregarArrastrable({
    posicion: () => [estado.px, Number.isFinite(f(estado.px)) ? f(estado.px) : 0],
    mover: (x) => {
      let nx = Math.max(0.1, Math.min(plano.xMax - 0.1, x));
      nx = Math.round(nx * 10) / 10;
      // si queda cerca de una potencia de k (un log "justo"), se pega ahí
      const e = f(nx);
      const entero = Math.round(e);
      const justo = estado.k ** entero;
      if (Math.abs(e - entero) < 0.1 && justo > 0.05) nx = justo;
      estado.px = nx;
      plano.pedirDibujo();
      actualizarLectura();
    },
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');
  const avisoEl = $('[data-aviso]');
  let parametroActivo = null;

  function actualizarExpresion() {
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${logaritmoHtml(estado.k, X, { marcar: true })}`;
    if (parametroActivo) expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');
  }

  /** "log₂(8) = 3 porque 2³ = 8" */
  function actualizarLectura() {
    if (kEs1()) { lecturaEl.innerHTML = ''; return; }
    const { k, px: x } = estado;
    const y = f(x);
    const exacto = esExacto(y);
    const valor = `${exacto ? '=' : '≈'} ${exp(y)}`;
    lecturaEl.innerHTML =
      `${logaritmoHtml(k, num(x))} <b>${valor}</b> ` +
      `<span class="texto-suave">porque</span> ${num(k)}<sup>${exp(y)}</sup> ${exacto ? '=' : '≈'} ${num(x)}`;
  }

  const item = (color, titulo, cuerpo) =>
    `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

  function textoSaltos() {
    const { k } = estado;
    const ns = k > 1 ? [0, 1, 2, 3] : [0, 1, 2];
    const valores = ns.map((n) => `${logaritmoHtml(k, numAprox(k ** n).replace('≈ ', '≈'))} = ${n}`).join(', ');
    return `cada vez que ${X} <b>se multiplica por ${num(k)}</b>, el logaritmo <b>sube 1</b>: <span class="info-despeje">${valores}</span>. ` +
      'Es la exponencial al revés: ahí, sumar 1 en <i>x</i> multiplicaba.';
  }

  function actualizarInfo() {
    const { k } = estado;
    avisoEl.hidden = !kEs1();
    const partes = [];
    if (!kEs1()) {
      if (casillas.saltos) partes.push(item(col.vertice, 'Saltos:', textoSaltos()));
      if (casillas.raiz) {
        partes.push(item(col.raices, 'Raíz: x = 1.', `Porque ${num(k)}<sup>0</sup> = 1, así que ${logaritmoHtml(k, '1')} = 0. Pasa con cualquier base: todos los logaritmos cortan al eje x en 1.`));
      }
      if (casillas.espejo) {
        partes.push(item(col.fantasma, 'Espejo:', `es la exponencial ${num(k)}<sup>${X}</sup> reflejada en la recta y = x: se cambian ${X} por y. Si ${num(k)}<sup>3</sup> = ${numAprox(k ** 3)}, la exponencial pasa por (3, ${numAprox(k ** 3)}) y el logaritmo por (${numAprox(k ** 3)}, 3).`));
      }
      if (casillas.signos) {
        const [pos, neg] = crece() ? ['(1, +∞)', '(0, 1)'] : ['(0, 1)', '(1, +∞)'];
        partes.push(item(col.positivo, 'C⁺ =', `${pos} <span class="texto-suave">(donde ${logaritmoHtml(k)} > 0)</span>`));
        partes.push(item(col.negativo, 'C⁻ =', `${neg} <span class="texto-suave">(${crece() ? 'entre 0 y 1 el log da negativo: hay que elevar a un exponente negativo' : `donde ${logaritmoHtml(k)} < 0`})</span>`));
      }
      if (casillas.asintotas) {
        partes.push(item(col.texto, 'Asíntota vertical: x = 0.', `Cerca del 0, la curva se ${crece() ? 'hunde para abajo' : 'dispara para arriba'}, cada vez más pegada al eje y, pero <b>nunca lo toca</b>.`));
      }
      if (casillas.crece) {
        partes.push(item(crece() ? col.crece : col.decrece, crece() ? 'Crece en (0, +∞):' : 'Decrece en (0, +∞):', crece() ? 'la base es mayor que 1.' : 'la base está entre 0 y 1.'));
      }
      if (casillas.dominio) {
        partes.push(item(col.funcion, 'Dominio: (0, +∞).', `Solo números <b>positivos</b>: ${num(k)} elevado a cualquier cosa da positivo, así que nunca llega a 0 ni a un negativo.`));
        partes.push(item(col.funcion, 'Imagen: ℝ.', 'El logaritmo puede dar cualquier número.'));
      }
    }

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : kEs1() ? '' : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba para ver qué tiene de especial esta curva.</p>';
  }

  // --------------------------------------------------------------- controles

  function redibujarTodo() {
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarLectura();
    actualizarInfo();
  }

  const control = conectarDeslizador(raiz.querySelector('.deslizador[data-param="k"]'), (v) => {
    // al cambiar la base, el punto se queda en el mismo x
    estado.k = v;
    redibujarTodo();
  }, {
    alEmpezar: () => { parametroActivo = 'k'; actualizarExpresion(); },
    alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
  });
  estado.k = control.valor;

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
  actualizarLectura();
  actualizarInfo();

  // La animación arranca recién cuando el gráfico aparece en pantalla.
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
