// ==========================================================================
// INTERACTIVO: el determinante 2×2 como área.
// Cada fila de la matriz es un vector (fila 1 azul, fila 2 naranja, como en
// los sistemas). Juntos arman un paralelogramo: su área es |det|.
//   - det > 0: verde. det < 0: rojo (los vectores quedaron "al revés").
//   - det = 0: se aplasta (los dos vectores están sobre la misma recta).
// Casilla "Rectángulo menos triángulos": la cuenta del área con el dibujo.
// El HTML está en src/components/interactivos/Determinante.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas } from '../lib/grafico/controles.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num } from '../lib/numeros.js';

const np = (v) => (v < 0 ? `(${num(v)})` : num(v));

export function iniciarDeterminante(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const css = getComputedStyle(document.documentElement);
  const colU = css.getPropertyValue('--c-ec1').trim();
  const colV = css.getPropertyValue('--c-ec2').trim();
  const estado = { u: [3, 1], v: [1, 2] };
  let casillas = {};

  const plano = new Plano($('[data-grafico]'), { vista: { xMin: -2.5, xMax: 6.5, yCentro: 2 }, descripcion: 'Dos vectores y el paralelogramo que forman' });
  const col = plano.colores;
  const det = () => estado.u[0] * estado.v[1] - estado.u[1] * estado.v[0];

  plano.agregarCapa((p) => {
    const [a, b] = estado.u;
    const [c, d] = estado.v;
    const D = det();
    const ctx = p.ctx;
    // rectángulo que encierra al paralelogramo, y lo que le sobra (triángulos y rectangulitos)
    if (casillas.rectangulo) {
      const xs = [0, a, c, a + c];
      const ys = [0, b, d, b + d];
      const x0 = Math.min(...xs); const x1 = Math.max(...xs);
      const y0 = Math.min(...ys); const y1 = Math.max(...ys);
      ctx.save();
      ctx.fillStyle = col.vertice;
      ctx.globalAlpha = 0.16;
      ctx.fillRect(p.px(x0), p.py(y1), p.px(x1) - p.px(x0), p.py(y0) - p.py(y1));
      ctx.restore();
      p.segmento(x0, y0, x1, y0, { color: col.vertice, ancho: 2, guiones: [6, 5] });
      p.segmento(x1, y0, x1, y1, { color: col.vertice, ancho: 2, guiones: [6, 5] });
      p.segmento(x1, y1, x0, y1, { color: col.vertice, ancho: 2, guiones: [6, 5] });
      p.segmento(x0, y1, x0, y0, { color: col.vertice, ancho: 2, guiones: [6, 5] });
    }
    // el paralelogramo
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p.px(0), p.py(0));
    ctx.lineTo(p.px(a), p.py(b));
    ctx.lineTo(p.px(a + c), p.py(b + d));
    ctx.lineTo(p.px(c), p.py(d));
    ctx.closePath();
    ctx.fillStyle = casillas.rectangulo ? col.fondo : D >= 0 ? col.positivo : col.negativo;
    ctx.globalAlpha = casillas.rectangulo ? 1 : 0.28;
    ctx.fill();
    if (casillas.rectangulo) {
      ctx.fillStyle = D >= 0 ? col.positivo : col.negativo;
      ctx.globalAlpha = 0.35;
      ctx.fill();
    }
    ctx.restore();
    // lados de enfrente (punteados)
    p.segmento(a, b, a + c, b + d, { color: colV, ancho: 2, guiones: [6, 6], alfa: 0.7 });
    p.segmento(c, d, a + c, b + d, { color: colU, ancho: 2, guiones: [6, 6], alfa: 0.7 });
    // los dos vectores
    p.flechaPx(p.px(0), p.py(0), p.px(a), p.py(b), { color: colU, ancho: 4 });
    p.flechaPx(p.px(0), p.py(0), p.px(c), p.py(d), { color: colV, ancho: 4 });
    p.punto(a, b, { color: colU, radio: 8, hueco: true });
    p.punto(c, d, { color: colV, radio: 8, hueco: true });
    if (casillas.coordenadas) {
      p.etiqueta(`(${num(a)}, ${num(b)})`, a, b, { color: colU, dx: 10, dy: -12 });
      p.etiqueta(`(${num(c)}, ${num(d)})`, c, d, { color: colV, dx: 10, dy: -12 });
    }
    // el área escrita en el medio
    if (D !== 0) p.etiqueta(`${num(Math.abs(D))}`, (a + c) / 2, (b + d) / 2, { color: col.texto, dx: 0, dy: 6, alinear: 'center', tamano: 18 });
  });

  // arrastrar las puntas (de a números enteros)
  const mover = (cual) => (x, y) => {
    const nuevo = [Math.max(-6, Math.min(8, Math.round(x))), Math.max(-6, Math.min(8, Math.round(y)))];
    if (nuevo[0] === 0 && nuevo[1] === 0) return;
    if (nuevo[0] === estado[cual][0] && nuevo[1] === estado[cual][1]) return;
    estado[cual] = nuevo;
    actualizar();
  };
  plano.agregarArrastrable({ posicion: () => estado.u, mover: mover('u') });
  plano.agregarArrastrable({ posicion: () => estado.v, mover: mover('v') });

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');

  function actualizar() {
    const [a, b] = estado.u;
    const [c, d] = estado.v;
    const D = det();
    expresionEl.innerHTML = `<div class="mat-fila"><span class="mat-op">det</span><table class="mat"><tbody>` +
      `<tr><td class="color-a">${num(a)}</td><td class="color-a">${num(b)}</td></tr>` +
      `<tr><td class="color-b">${num(c)}</td><td class="color-b">${num(d)}</td></tr></tbody></table>` +
      `<span class="mat-op">=</span><span class="mat-final">${np(a)} · ${np(d)} − ${np(b)} · ${np(c)} = <b class="${D > 0 ? 'mas' : D < 0 ? 'menos' : ''}">${num(D)}</b></span></div>`;
    lecturaEl.innerHTML = D > 0
      ? `Área del paralelogramo: <b>${num(D)}</b> cuadraditos.`
      : D < 0
        ? `Área: <b>${num(-D)}</b> cuadraditos. El signo menos dice que los vectores quedaron "al revés".`
        : '<b>det = 0:</b> los dos vectores están sobre la misma recta y el paralelogramo se aplasta (área 0).';
    const partes = [
      itemInfo(colU, 'Filas = vectores:', 'la fila 1 es la flecha azul y la fila 2 la naranja. Arrastrá las puntas.'),
      itemInfo(col.positivo, 'Área:', 'el determinante dice el área del paralelogramo que forman. Contá los cuadraditos para comprobarlo.'),
      itemInfo(col.negativo, 'Signo:', 'si para ir de la flecha azul a la naranja hay que girar como las agujas del reloj, el determinante da negativo.'),
      itemInfo(col.raices, 'Con sistemas:', 'si el determinante de los números de adelante da 0, el sistema <b>no</b> tiene una sola solución: las rectas son paralelas o la misma.'),
    ];
    if (casillas.rectangulo) {
      const xs = [0, a, c, a + c];
      const ys = [0, b, d, b + d];
      const W = Math.max(...xs) - Math.min(...xs);
      const H = Math.max(...ys) - Math.min(...ys);
      partes.push(itemInfo(col.vertice, 'Rectángulo:', `mide ${num(W)} × ${num(H)} = ${num(W * H)}. Si le sacás lo que sobra alrededor (triángulos y rectangulitos), queda ${num(Math.abs(D))}.`));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
    plano.pedirDibujo();
  }

  casillas = conectarCasillas($('[data-casillas]'), () => actualizar());
  actualizar();
}
