// ==========================================================================
// INTERACTIVO: vectores en el plano.
// u (azul) y v (naranja) salen del origen; sus puntas se arrastran (de a
// números enteros). El resultado de la operación va en blanco.
//   - Suma: v se "pega" en la punta de u (punteado) → u + v.
//   - Resta: u − v es la flecha que va de la punta de v a la punta de u.
//   - Por un número: k · u (con el deslizador k).
//   - Producto escalar: u · v = u₁·v₁ + u₂·v₂, con el ángulo entre los dos.
// El HTML está en src/components/interactivos/Vectores.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas, conectarDeslizador } from '../lib/grafico/controles.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox } from '../lib/numeros.js';

const np = (v) => (v < 0 ? `(${num(v)})` : num(v));
const par = ([x, y]) => `(${num(x)}, ${num(y)})`;
const U = '<i>u</i>';
const V = '<i>v</i>';

/** "√5 ≈ 2.24", o "5" si es exacto. */
function moduloTexto([x, y]) {
  const c = x * x + y * y;
  const r = Math.sqrt(c);
  return Number.isInteger(r) ? num(r) : `√${num(c)} ${numAprox(r).startsWith('≈') ? numAprox(r) : '= ' + num(r)}`;
}

export function iniciarVectores(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const css = getComputedStyle(raiz);
  const colU = css.getPropertyValue('--c-ec1').trim();
  const colV = css.getPropertyValue('--c-ec2').trim();
  const estado = { u: [3, 1], v: [1, 2], op: 'suma', k: 2 };
  let casillas = {};

  const plano = new Plano($('[data-grafico]'), { vista: { xMin: -5, xMax: 7, yCentro: 2 }, descripcion: 'Dos vectores y el resultado de la operación' });
  const col = plano.colores;

  const flecha = (p, [x0, y0], [x1, y1], color, ancho = 4) => {
    if (Math.hypot(x1 - x0, y1 - y0) < 1e-9) return;
    p.flechaPx(p.px(x0), p.py(y0), p.px(x1), p.py(y1), { color, ancho });
  };
  const resultado = () => {
    const { u, v, op, k } = estado;
    if (op === 'suma') return [u[0] + v[0], u[1] + v[1]];
    if (op === 'resta') return [u[0] - v[0], u[1] - v[1]];
    if (op === 'escalar') return [k * u[0], k * u[1]];
    return null;
  };

  plano.agregarCapa((p) => {
    const { u, v, op } = estado;
    const r = resultado();
    const conV = op !== 'escalar';
    // componentes de u: cuánto avanza en x y cuánto sube
    if (casillas.componentes) {
      p.segmento(0, 0, u[0], 0, { color: colU, ancho: 2, guiones: [5, 5] });
      p.segmento(u[0], 0, u[0], u[1], { color: colU, ancho: 2, guiones: [5, 5] });
      p.etiqueta(num(u[0]), u[0] / 2, 0, { color: colU, dx: 0, dy: u[1] >= 0 ? 18 : -10, alinear: 'center', tamano: 14 });
      p.etiqueta(num(u[1]), u[0], u[1] / 2, { color: colU, dx: u[0] >= 0 ? 8 : -8, dy: 5, alinear: u[0] >= 0 ? 'left' : 'right', tamano: 14 });
    }
    if (op === 'suma') {
      p.segmento(u[0], u[1], r[0], r[1], { color: colV, ancho: 2.5, guiones: [7, 6] });
      p.segmento(v[0], v[1], r[0], r[1], { color: colU, ancho: 2.5, guiones: [7, 6], alfa: 0.6 });
    }
    if (op === 'resta') {
      // la flecha de la punta de v a la punta de u (es u − v, corrida)
      p.segmento(v[0], v[1], u[0], u[1], { color: col.texto, ancho: 2.5, guiones: [7, 6], alfa: 0.7 });
    }
    if (op === 'punto') {
      // el ángulo entre u y v (arquito)
      const a1 = Math.atan2(u[1], u[0]);
      let a2 = Math.atan2(v[1], v[0]);
      let d = a2 - a1;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      a2 = a1 + d;
      const ctx = p.ctx;
      const R = 34;
      const prod = u[0] * v[0] + u[1] * v[1];
      ctx.save();
      ctx.strokeStyle = col.vertice;
      ctx.lineWidth = p.grosor(2.5);
      ctx.beginPath();
      if (prod === 0) {
        // ángulo recto: un cuadradito
        const e1 = [Math.cos(a1), -Math.sin(a1)];
        const e2 = [Math.cos(a2), -Math.sin(a2)];
        const O = [p.px(0), p.py(0)];
        const L = 16;
        ctx.moveTo(O[0] + e1[0] * L, O[1] + e1[1] * L);
        ctx.lineTo(O[0] + (e1[0] + e2[0]) * L, O[1] + (e1[1] + e2[1]) * L);
        ctx.lineTo(O[0] + e2[0] * L, O[1] + e2[1] * L);
      } else {
        ctx.arc(p.px(0), p.py(0), R, -a1, -a2, d > 0);
      }
      ctx.stroke();
      ctx.restore();
    }
    if (r) flecha(p, [0, 0], r, col.texto, 4);
    flecha(p, [0, 0], u, colU);
    if (conV) flecha(p, [0, 0], v, colV);
    p.punto(u[0], u[1], { color: colU, radio: 8, hueco: true });
    if (conV) p.punto(v[0], v[1], { color: colV, radio: 8, hueco: true });
    p.etiqueta('u', u[0], u[1], { color: colU, dx: 10, dy: -10, tamano: 17 });
    if (conV) p.etiqueta('v', v[0], v[1], { color: colV, dx: 10, dy: -10, tamano: 17 });
    if (r) {
      const nombre = { suma: 'u + v', resta: 'u − v', escalar: `${num(estado.k)} · u` }[op];
      p.etiqueta(nombre, r[0], r[1], { color: col.texto, dx: 10, dy: 18, tamano: 15 });
    }
    if (casillas.modulo) {
      const m = Math.hypot(u[0], u[1]);
      p.etiqueta(`|u| ${numAprox(m).startsWith('≈') ? numAprox(m) : '= ' + num(m)}`, u[0] / 2, u[1] / 2, { color: col.vertice, dx: -8, dy: -10, alinear: 'right', tamano: 14 });
    }
  });

  const mover = (cual) => (x, y) => {
    const nuevo = [Math.max(-6, Math.min(8, Math.round(x))), Math.max(-6, Math.min(8, Math.round(y)))];
    if (nuevo[0] === 0 && nuevo[1] === 0) return;
    if (nuevo[0] === estado[cual][0] && nuevo[1] === estado[cual][1]) return;
    estado[cual] = nuevo;
    actualizar();
  };
  plano.agregarArrastrable({ posicion: () => estado.u, mover: mover('u') });
  plano.agregarArrastrable({ posicion: () => (estado.op === 'escalar' ? [NaN, NaN] : estado.v), mover: mover('v') });

  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');

  function actualizar() {
    const { u, v, op, k } = estado;
    const r = resultado();
    const cu = `<span class="color-a">${U} = ${par(u)}</span>`;
    const cv = `<span class="color-b">${V} = ${par(v)}</span>`;
    let lectura;
    const partes = [];
    if (op === 'suma') {
      lectura = `${cu} &nbsp; ${cv}<br>${U} + ${V} = (${num(u[0])} + ${np(v[0])}, ${num(u[1])} + ${np(v[1])}) = <b>${par(r)}</b>`;
      partes.push(itemInfo(col.texto, 'Suma:', 'se suman las <i>x</i> por un lado y las <i>y</i> por el otro. En el dibujo: ponés <i>v</i> en la punta de <i>u</i> (punteado) y vas del origen hasta el final.'));
    } else if (op === 'resta') {
      lectura = `${cu} &nbsp; ${cv}<br>${U} − ${V} = (${num(u[0])} − ${np(v[0])}, ${num(u[1])} − ${np(v[1])}) = <b>${par(r)}</b>`;
      partes.push(itemInfo(col.texto, 'Resta:', '<i>u</i> − <i>v</i> es la flecha que va <b>de la punta de <i>v</i> a la punta de <i>u</i></b> (punteada). Si la llevás al origen, es la blanca.'));
    } else if (op === 'escalar') {
      lectura = `${cu}<br>${num(k)} · ${U} = (${num(k)} · ${np(u[0])}, ${num(k)} · ${np(u[1])}) = <b>${par(r)}</b>`;
      partes.push(itemInfo(col.texto, 'Por un número:', 'se multiplican las dos componentes. La flecha se estira (o se achica) y, si el número es negativo, <b>se da vuelta</b>.'));
    } else {
      const pr = u[0] * v[0] + u[1] * v[1];
      const ang = Math.acos(Math.max(-1, Math.min(1, pr / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
      lectura = `${cu} &nbsp; ${cv}<br>${U} · ${V} = ${np(u[0])} · ${np(v[0])} + ${np(u[1])} · ${np(v[1])} = <b>${num(pr)}</b>` +
        `<br><span class="texto-suave">ángulo entre los dos ${numAprox(ang, 0).startsWith('≈') ? numAprox(ang, 0) : '= ' + num(ang, 0)}°</span>`;
      partes.push(itemInfo(col.vertice, 'Producto escalar:', 'da un <b>número</b> (no un vector). Si da 0, las flechas son <b>perpendiculares</b> (forman un ángulo recto). Si es positivo, el ángulo es menor que 90°; si es negativo, mayor.'));
    }
    if (casillas.componentes) partes.push(itemInfo(colU, 'Componentes:', `${U} = ${par(u)} quiere decir: avanzo ${num(u[0])} en <i>x</i> y subo ${num(u[1])} en <i>y</i>.`));
    if (casillas.modulo) partes.push(itemInfo(col.vertice, 'Módulo:', `el largo de la flecha, con Pitágoras: |${U}| = √(${np(u[0])}² + ${np(u[1])}²) = ${moduloTexto(u)}.`));
    partes.push(itemInfo(col.fantasma, 'Mover:', 'arrastrá las puntas de las flechas.'));
    lecturaEl.innerHTML = lectura;
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
    plano.pedirDibujo();
  }

  const botones = raiz.querySelectorAll('[data-operacion]');
  for (const b of botones) {
    b.addEventListener('click', () => {
      estado.op = b.dataset.operacion;
      for (const o of botones) o.setAttribute('aria-checked', String(o === b));
      $('[data-caja-k]').hidden = estado.op !== 'escalar';
      actualizar();
    });
  }
  conectarDeslizador($('.deslizador[data-param="k"]'), (v) => { estado.k = v; actualizar(); });
  casillas = conectarCasillas($('[data-casillas]'), () => actualizar());
  actualizar();
}
