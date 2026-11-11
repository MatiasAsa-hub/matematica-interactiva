// ==========================================================================
// INTERACTIVO: sistemas de ecuaciones (etapa 8)
//
// - 2×2: cada ecuación es una recta (en el gráfico 2D de siempre).
// - 3×3: cada ecuación es un plano (en 3D, con Three.js; se carga solo si hace falta).
// Modos:
//   explorar  → se ven las rectas/planos, la solución y el cartel con la
//               clasificación. En 2×2 las rectas se arrastran por sus puntitos.
//   gauss     → matriz ampliada y "Siguiente paso". Cada paso cambia una fila
//               por una combinación con otra: la recta/plano gira, pero sigue
//               pasando por la solución.
//   parametro → deslizador de k; cambia el sistema y la clasificación.
// El HTML está en src/components/interactivos/Sistema.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas, conectarDeslizador } from '../lib/grafico/controles.js';
import { animar, suave, sinMovimiento } from '../lib/grafico/animacion.js';
import {
  leerSistema, leerGauss, filasCon, valor, ecuacionHtml, frHtml, numeroHtml, clasificar,
  recorrido, operacionTexto, esEscalar, estaEscalonada, contradiccion, esCero,
  NOMBRE_TIPO, QUE_QUIERE_DECIR,
} from '../lib/sistemas.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num } from '../lib/numeros.js';

const LETRAS = ['x', 'y', 'z'];
const SUB = ['₁', '₂', '₃'];
const ANIM_PASO = 1300; // milisegundos que tarda en moverse un plano

/** Un número para escribir en el dibujo (texto simple): 2, 7/2, ≈ 1.27 */
function numTexto(v) {
  if (Math.abs(v - Math.round(v)) < 1e-9) return num(Math.round(v));
  for (let q = 2; q <= 12; q++) {
    const p = v * q;
    if (Math.abs(p - Math.round(p)) < 1e-9) return `${v < 0 ? '−' : ''}${Math.abs(Math.round(p))}/${q}`;
  }
  return '≈' + num(v);
}

const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

export async function iniciarSistema(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const modo = raiz.dataset.modo;
  const textos = JSON.parse(raiz.dataset.sistemas);
  const css = getComputedStyle(document.documentElement);
  const colorEc = [1, 2, 3].map((i) => css.getPropertyValue(`--c-ec${i}`).trim());

  const estado = {
    indice: 0,
    sistema: null,     // lo que se leyó del tema
    filas: null,       // filas actuales (números) que se dibujan
    antes: null,       // dónde estaba la fila que se movió (fantasma)
    manijas: null,     // 2×2 explorar: dos puntos por recta
    gauss: null,       // { pasos, escalonadaEn, todas }
    paso: 0,
    k: 0,
  };
  let casillas = {};

  // ------------------------------------------------------------- gráfico 2D

  const graf2 = $('[data-grafico]');
  const graf3 = $('[data-espacio]');
  const plano = new Plano(graf2, { vista: { xMin: -6, xMax: 6, yCentro: 0 }, descripcion: 'Las rectas del sistema' });
  const col = plano.colores;

  /** El pedazo visible de la recta a·x + b·y = c: [[x1, y1], [x2, y2]] o null. */
  function recortar2([a, b, c], p) {
    const n2 = a * a + b * b;
    if (n2 < 1e-12) return null;
    const p0 = [(a * c) / n2, (b * c) / n2];
    const d = [-b, a];
    let t0 = -Infinity;
    let t1 = Infinity;
    const lim = [[p.xMin, p.xMax], [p.yMin, p.yMax]];
    for (let i = 0; i < 2; i++) {
      if (Math.abs(d[i]) < 1e-12) {
        if (p0[i] < lim[i][0] || p0[i] > lim[i][1]) return null;
        continue;
      }
      let u = (lim[i][0] - p0[i]) / d[i];
      let v = (lim[i][1] - p0[i]) / d[i];
      if (u > v) [u, v] = [v, u];
      t0 = Math.max(t0, u);
      t1 = Math.min(t1, v);
    }
    if (t0 >= t1) return null;
    return [[p0[0] + d[0] * t0, p0[1] + d[1] * t0], [p0[0] + d[0] * t1, p0[1] + d[1] * t1]];
  }

  plano.agregarCapa((p) => {
    if (!estado.filas || estado.sistema.n !== 2) return;
    const filas = estado.filas;
    // dónde estaba antes (gauss)
    if (estado.antes) {
      const s = recortar2(estado.antes.fila, p);
      if (s) p.segmento(s[0][0], s[0][1], s[1][0], s[1][1], { color: col.fantasma, ancho: 2, guiones: [6, 6], alfa: 0.8 });
    }
    const iguales = mismaRecta(filas[0], filas[1]);
    filas.forEach((f, i) => {
      const s = recortar2(f, p);
      if (!s) return;
      p.segmento(s[0][0], s[0][1], s[1][0], s[1][1], {
        color: colorEc[i], ancho: 3.5, guiones: i === 1 && iguales ? [12, 10] : null,
      });
      // el número de la recta, cerca del extremo izquierdo (a la derecha están los botones)
      const [q1, q2] = s;
      const fin = q2[0] < q1[0] - 1e-9 || (Math.abs(q2[0] - q1[0]) < 1e-9 && q2[1] < q1[1]) ? q2 : q1;
      const ini = fin === q2 ? q1 : q2;
      const largo = Math.hypot(fin[0] - ini[0], fin[1] - ini[1]) || 1;
      const t = Math.min(0.9, 1.1 / largo) + (i === 1 && iguales ? 0.08 : 0);
      const ex = fin[0] + (ini[0] - fin[0]) * t;
      const ey = fin[1] + (ini[1] - fin[1]) * t;
      p.etiqueta(String(i + 1), ex, ey, { color: colorEc[i], dx: 8, dy: -10, tamano: 16 });
    });
    // puntitos para arrastrar
    if (modo === 'explorar' && estado.manijas) {
      estado.manijas.forEach((par, i) => par.forEach(([x, y]) => {
        p.punto(x, y, { color: colorEc[i], radio: 8, hueco: true });
      }));
    }
    // la solución
    const cl = clasificar(filas);
    if (casillas.solucion && cl.tipo === 'CD') {
      const [x, y] = cl.solucion;
      p.punto(x, y, { color: col.raices, radio: 7 });
      p.etiqueta(`(${numTexto(x)}, ${numTexto(y)})`, x, y, { color: col.raices, dx: 12, dy: 18 });
    }
  });

  /** ¿Son la misma recta? (una es múltiplo de la otra) */
  function mismaRecta(f, g) {
    const [a, b, c] = f;
    const [d, e, h] = g;
    return Math.abs(a * e - b * d) < 1e-9 && Math.abs(a * h - c * d) < 1e-9 && Math.abs(b * h - c * e) < 1e-9;
  }

  // arrastrar los puntitos de las rectas (solo 2×2, modo explorar)
  if (modo === 'explorar') {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        plano.agregarArrastrable({
          posicion: () => (estado.manijas && estado.sistema.n === 2 ? estado.manijas[i][j] : [NaN, NaN]),
          mover: (x, y) => moverManija(i, j, x, y),
        });
      }
    }
  }

  function moverManija(i, j, x, y) {
    const nx = Math.max(-9, Math.min(9, Math.round(x)));
    const ny = Math.max(-9, Math.min(9, Math.round(y)));
    const otra = estado.manijas[i][1 - j];
    if (otra[0] === nx && otra[1] === ny) return;
    const actual = estado.manijas[i][j];
    if (actual[0] === nx && actual[1] === ny) return;
    estado.manijas[i][j] = [nx, ny];
    // la recta que pasa por los dos puntos, con números enteros
    const [[x1, y1], [x2, y2]] = estado.manijas[i];
    let a = y2 - y1;
    let b = x1 - x2;
    let c = a * x1 + b * y1;
    const g = mcd(mcd(a, b), c);
    a /= g; b /= g; c /= g;
    if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
    estado.filas[i] = [a + 0, b + 0, c + 0];
    actualizarTodo();
  }

  /** Dos puntos con coordenadas enteras sobre la recta (para arrastrarla). */
  function manijasDe([a, b, c]) {
    const cand = [];
    for (let x = -6; x <= 6; x++) {
      for (let y = -6; y <= 6; y++) if (Math.abs(a * x + b * y - c) < 1e-9) cand.push([x, y]);
    }
    if (cand.length >= 2) {
      cand.sort((p, q) => Math.hypot(...p) - Math.hypot(...q));
      const p1 = cand[0];
      let mejor = null;
      for (const q of cand.slice(1)) {
        const d = Math.hypot(q[0] - p1[0], q[1] - p1[1]);
        if (d <= 5.5 && (!mejor || d > mejor.d)) mejor = { q, d };
      }
      return [p1, mejor ? mejor.q : cand[1]];
    }
    // si no hay dos puntos enteros cerca, dos puntos cualquiera
    if (Math.abs(b) > 1e-9) return [[-2, (c + 2 * a) / b], [2, (c - 2 * a) / b]];
    return [[c / a, -2], [c / a, 2]];
  }

  // ------------------------------------------------------------- gráfico 3D

  let espacio = null;
  let obj3 = null;
  async function prepararEspacio() {
    if (espacio) return;
    const { Espacio, corteDePlanos } = await import('../lib/grafico/espacio.js');
    // la caja tiene que alcanzar para todas las soluciones del tema
    let L = 5;
    for (const t of textos) {
      try {
        const s = leerSistema(typeof t === 'string' ? t : t.sistema);
        if (s.n !== 3 || s.conK) continue;
        const cl = clasificar(filasCon(s).map((f) => f.map(valor)));
        if (cl.solucion) L = Math.max(L, Math.min(9, Math.ceil(Math.max(...cl.solucion.map(Math.abs))) + 2));
      } catch { /* se avisó al armar el sitio */ }
    }
    espacio = new Espacio(graf3, { limite: L, descripcion: 'Los planos del sistema, en 3D. Se gira con el dedo.' });
    obj3 = {
      corteDePlanos,
      // cada número va para un lado distinto (izquierda arriba, derecha arriba, derecha abajo)
      planos: [[0.6, -0.8, 0.8], [-0.6, 0.8, 0.8], [-0.6, 0.8, -0.8]].map((hacia, i) => espacio.plano({ color: colorEc[i], etiqueta: String(i + 1), haciaEtiqueta: hacia })),
      cortes: [0, 1, 2].map(() => espacio.recta({ color: col.texto, ancho: 1.6 })),
      comun: espacio.recta({ color: col.raices, ancho: 4 }),
      punto: espacio.punto({ color: col.raices }),
      textoSol: espacio.etiqueta('', [0, 0, 0], { color: col.raices, clase: 'espacio-etiqueta-sol' }),
    };
  }

  function dibujar3() {
    if (!espacio || estado.sistema.n !== 3) return;
    const filas = estado.filas;
    filas.forEach((f, i) => {
      obj3.planos[i].mostrar(!!casillas[`p${i + 1}`]);
      obj3.planos[i].poner(f);
      obj3.planos[i].fantasma(estado.antes && estado.antes.i === i ? estado.antes.fila : null);
    });
    const vis = [0, 1, 2].map((i) => !!casillas[`p${i + 1}`] && filas[i].slice(0, 3).some((v) => Math.abs(v) > 1e-9));
    const pares = [[0, 1], [0, 2], [1, 2]];
    pares.forEach(([i, j], n) => {
      const r = casillas.cortes && vis[i] && vis[j] ? obj3.corteDePlanos(filas[i], filas[j]) : null;
      obj3.cortes[n].poner(r ? r.punto : null, r ? r.dir : null);
    });
    const cl = clasificar(filas);
    let comun = null;
    if (cl.tipo === 'CI' && cl.rangoA === 2) {
      // la recta que comparten: el corte de dos planos que no sean el mismo
      for (const [i, j] of pares) {
        const r = obj3.corteDePlanos(filas[i], filas[j]);
        if (r) { comun = r; break; }
      }
    }
    obj3.comun.poner(casillas.solucion && comun ? comun.punto : null, comun ? comun.dir : null);
    const sol = casillas.solucion && cl.tipo === 'CD' ? cl.solucion : null;
    obj3.punto.poner(sol && sol.every((v) => Math.abs(v) <= espacio.L) ? sol : null);
    obj3.textoSol.visible = !!sol;
    if (sol) {
      obj3.textoSol.pos = [sol[0], sol[1], sol[2] + 0.75];
      obj3.textoSol.html = `(${sol.map(numeroHtml).join(', ')})`;
    }
    espacio.pedirDibujo();
  }

  // ------------------------------------------------------------- textos

  const ecuacionesEl = $('[data-ecuaciones]');
  const matrizEl = $('[data-matriz]');
  const pasoEl = $('[data-paso]');
  const cartelEl = $('[data-cartel]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  const insignia = (i) => `<span class="ec-num" style="--color:${colorEc[i]}">${i + 1}</span>`;

  /** El sistema escrito con la llave: cada ecuación con su número y su color. */
  function escribirSistema() {
    let filas;
    if (modo === 'parametro') filas = estado.sistema.filas; // con k como letra
    else filas = estado.filas.map((f) => f.map(aFraccion));
    ecuacionesEl.innerHTML = `<div class="llave">${filas.map((f, i) =>
      `<div class="ec-fila" style="--color:${colorEc[i]}">${insignia(i)}<span>${ecuacionHtml(f)}</span></div>`).join('')}</div>`;
  }

  /** Un número (que sale de cuentas con enteros) como fracción exacta, para escribirlo. */
  function aFraccion(v) {
    for (let q = 1; q <= 1000; q++) {
      const p = v * q;
      if (Math.abs(p - Math.round(p)) < 1e-7) {
        const n = Math.round(p);
        const g = mcd(n, q);
        return { n: n / g, d: q / g };
      }
    }
    return { n: Math.round(v * 100), d: 100 };
  }

  /** La matriz ampliada (modo gauss), con las filas que cambiaron resaltadas. */
  function escribirMatriz(filasFr, cambiadas = []) {
    const n = estado.sistema.n;
    const enc = LETRAS.slice(0, n).map((l) => `<th scope="col"><i>${l}</i></th>`).join('');
    const filas = filasFr.map((f, i) => {
      const celdas = f.slice(0, n).map((c) => `<td>${frHtml(c)}</td>`).join('');
      return `<tr class="${cambiadas.includes(i) ? 'cambio' : ''}" style="--color:${colorEc[i]}">` +
        `<th scope="row"><span class="ec-num" style="--color:${colorEc[i]}">F${SUB[i]}</span></th>` +
        `${celdas}<td class="barra">${frHtml(f[n])}</td></tr>`;
    }).join('');
    matrizEl.innerHTML = `<table class="matriz-ampliada"><thead><tr><th></th>${enc}<th class="barra"></th></tr></thead><tbody>${filas}</tbody></table>`;
  }

  /** Lo que dice el cartel según la clasificación (y la forma de las rectas/planos). */
  function cartel() {
    const filas = estado.filas;
    const n = estado.sistema.n;
    const cl = clasificar(filas);
    let detalle;
    if (n === 2) {
      detalle = { CD: 'Las rectas se cortan en un punto', CI: 'Son la misma recta', I: 'Las rectas son paralelas' }[cl.tipo];
    } else if (cl.tipo === 'CD') detalle = 'Los tres planos se cortan en un punto';
    else if (cl.tipo === 'CI') detalle = cl.rangoA === 2 ? 'Los planos comparten una recta' : 'Los tres son el mismo plano';
    else if (filas.some((f) => f.slice(0, 3).every((v) => Math.abs(v) < 1e-9))) detalle = 'Quedó una ecuación imposible (0 = un número que no es 0)';
    else {
      const paralelos = [[0, 1], [0, 2], [1, 2]].some(([i, j]) => {
        const a = filas[i].slice(0, 3);
        const b = filas[j].slice(0, 3);
        const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
        return Math.hypot(...c) < 1e-9 && Math.hypot(...a) > 1e-9 && Math.hypot(...b) > 1e-9;
      });
      detalle = paralelos ? 'Hay planos paralelos: no hay ningún punto en los tres' : 'Se cortan de a dos, pero no hay ningún punto en los tres';
    }
    let sol = '';
    if (cl.tipo === 'CD') sol = `: (${LETRAS.slice(0, n).map((l, i) => `<i>${l}</i> = ${numeroHtml(cl.solucion[i])}`).join(', ')})`;
    cartelEl.className = `cartel-sistema tipo-${cl.tipo}`;
    cartelEl.innerHTML = `<b>${NOMBRE_TIPO[cl.tipo]}</b> → ${QUE_QUIERE_DECIR[cl.tipo]}${sol}<span>${detalle}.</span>`;
  }

  function actualizarInfo() {
    const n = estado.sistema.n;
    const partes = [];
    const cosa = n === 2 ? 'recta' : 'plano';
    if (n === 2) partes.push(itemInfo(colorEc[0], 'Rectas:', 'cada ecuación con <i>x</i> e <i>y</i> es una recta. La solución es el punto que está en las dos a la vez.'));
    else partes.push(itemInfo(colorEc[0], 'Planos:', 'cada ecuación con <i>x</i>, <i>y</i>, <i>z</i> es un plano. La solución es el punto que está en los tres a la vez. Girá el dibujo con el dedo.'));
    if (modo === 'explorar' && n === 2) partes.push(itemInfo(col.fantasma, 'Mover:', 'arrastrá los puntitos huecos para mover las rectas. Mirá cómo cambia el sistema y el cartel.'));
    if (modo === 'gauss') partes.push(itemInfo(col.raices, 'La idea:', `cada paso cambia una ecuación por otra que tiene las mismas soluciones. El ${cosa} se mueve (el gris punteado es donde estaba), pero <b>la solución no se mueve</b>.`));
    if (modo === 'parametro') partes.push(itemInfo(col.raices, 'Probá:', `mové <i>k</i> y fijate para qué valores cambia el cartel. Ahí los ${cosa}s se acomodan de otra forma.`));
    if (casillas.funciones && n === 2) {
      estado.filas.forEach((f, i) => {
        const [a, b, c] = f;
        let txt;
        if (Math.abs(b) < 1e-9) txt = Math.abs(a) < 1e-9 ? 'no es una recta' : `es vertical: <i>x</i> = ${numeroHtml(c / a)} (no se puede despejar <i>y</i>)`;
        else {
          const m = -a / b;
          const h = c / b;
          const mTxt = Math.abs(m) < 1e-9 ? '' : `${Math.abs(Math.abs(m) - 1) < 1e-9 ? (m < 0 ? '−' : '') : numeroHtml(m)}<i>x</i>`;
          const hTxt = Math.abs(h) < 1e-9 ? (mTxt ? '' : '0') : `${mTxt ? (h < 0 ? ' − ' : ' + ') : h < 0 ? '−' : ''}${numeroHtml(Math.abs(h))}`;
          txt = `<i>y</i> = ${mTxt}${hTxt}`;
        }
        partes.push(itemInfo(colorEc[i], `Recta ${i + 1}:`, txt));
      });
      partes.push(itemInfo(col.funcion, 'Igualación:', 'si las dos dicen "<i>y</i> = …", se igualan las dos cuentas para encontrar la <i>x</i> del cruce.'));
    }
    if (casillas.cortes && n === 3) partes.push(itemInfo(col.texto, 'Rectas de corte:', 'donde se cortan dos planos queda una recta. Si las tres rectas pasan por un mismo punto, ese es la solución.'));
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  function actualizarTodo() {
    if (modo !== 'gauss') escribirSistema();
    cartel();
    actualizarInfo();
    plano.pedirDibujo();
    dibujar3();
  }

  // ------------------------------------------------------------- Gauss

  const botonSiguiente = $('[data-paso-siguiente]');
  const botonAnterior = $('[data-paso-anterior]');
  let anim = null;

  /** Explicación corta de un paso. */
  function fraseDe(op) {
    if (op.tipo === 'cambiar') return `Cambiamos de lugar las filas ${op.i + 1} y ${op.j + 1}. Las ${estado.sistema.n === 2 ? 'rectas' : 'planos'} no se mueven: solo cambian de número.`;
    const cosa = estado.sistema.n === 2 ? 'La recta' : 'El plano';
    if (esEscalar(op)) {
      const c = op.terminos[0].coef;
      const v = c.n / c.d;
      const accion = Math.abs(c.n) === 1 && c.d !== 1 ? `Dividimos la fila ${op.destino + 1} por ${num(c.n * c.d)}` : `Multiplicamos la fila ${op.destino + 1} por ${numeroHtml(v)}`;
      return `${accion}, para que queden números más chicos. ${cosa} no se mueve: tiene las mismas soluciones.`;
    }
    const propio = op.terminos.find((t) => t.fila === op.destino);
    const otros = op.terminos.filter((t) => t.fila !== op.destino);
    const a = propio.coef.n / propio.coef.d;
    const inicio = a === 1 ? `A la fila ${op.destino + 1}` : `A ${numeroHtml(a)} veces la fila ${op.destino + 1}`;
    const resto = otros.map((t) => {
      const v = t.coef.n / t.coef.d;
      return `le ${v < 0 ? 'restamos' : 'sumamos'} ${Math.abs(v) === 1 ? '' : `${numeroHtml(Math.abs(v))} veces `}la fila ${t.fila + 1}`;
    }).join(' y ');
    const final = estado.gauss.tipo === 'CD' ? 'pero sigue pasando por la solución' : 'pero el sistema sigue teniendo las mismas soluciones';
    return `${inicio} ${resto}. ${cosa} ${op.destino + 1} se mueve, ${final}.`;
  }

  function mostrarPaso() {
    const { pasos, escalonadaEn, todas } = estado.gauss;
    const k = estado.paso;
    const op = k > 0 ? pasos[k - 1] : null;
    const cambiadas = op ? (op.tipo === 'cambiar' ? [op.i, op.j] : [op.destino]) : [];
    escribirMatriz(todas[k], cambiadas);
    const filasFr = todas[k];
    let nota = '';
    if (filasFr.some(contradiccion)) {
      nota = `<p class="gauss-nota tipo-I">Apareció una fila que dice <b>0 = ${frHtml(filasFr.find(contradiccion).at(-1))}</b>: ¡imposible! El sistema no tiene solución.</p>`;
    } else if (k === escalonadaEn && estaEscalonada(filasFr)) {
      const ceros = filasFr.filter((f) => f.every(esCero)).length;
      if (ceros > 0) nota = '<p class="gauss-nota tipo-CI">¡Quedó escalonada! Hay una fila <b>0 = 0</b>, que no dice nada: sobran incógnitas, así que hay infinitas soluciones.</p>';
      else if (k < pasos.length) nota = '<p class="gauss-nota tipo-CD">¡Quedó escalonada! Ya se puede despejar de abajo hacia arriba. Si seguís, los planos terminan "derechos".</p>'.replace('los planos', estado.sistema.n === 2 ? 'las rectas' : 'los planos');
      else nota = '<p class="gauss-nota tipo-CD">¡Quedó escalonada! Ya se puede despejar de abajo hacia arriba.</p>';
    } else if (k === pasos.length && k > escalonadaEn) {
      const cosa = estado.sistema.n === 2 ? 'Las rectas quedaron derechas' : 'Los planos quedaron derechos';
      nota = `<p class="gauss-nota tipo-CD">${cosa}: cada ecuación dice directamente cuánto vale una letra. ¡Esa es la solución!</p>`;
    }
    pasoEl.innerHTML = (op
      ? `<p class="gauss-op"><span class="texto-suave">Paso ${k} de ${pasos.length}:</span> <b>${operacionTexto(op)}</b></p><p class="gauss-frase">${fraseDe(op)}</p>`
      : `<p class="gauss-op"><span class="texto-suave">El sistema como matriz ampliada.</span> Tocá <b>Siguiente paso</b>.</p>`) + nota;
    botonAnterior.disabled = k === 0;
    botonSiguiente.disabled = k === pasos.length;
  }

  /** Avanza o retrocede un paso (nuevo = paso actual ± 1), moviendo la fila que cambia. */
  function irAPaso(nuevo) {
    if (anim) anim.terminar();
    const { pasos, todas } = estado.gauss;
    if (nuevo < 0 || nuevo > pasos.length) return;
    const viejo = estado.paso;
    const desde = todas[viejo].map((f) => f.map(valor));
    const hasta = todas[nuevo].map((f) => f.map(valor));
    const op = nuevo > viejo ? pasos[nuevo - 1] : pasos[viejo - 1]; // el paso que hay entre los dos
    estado.paso = nuevo;
    mostrarPaso();
    // la fila que se mueve (cambiar de lugar o multiplicar no mueven nada)
    const mueve = op.tipo === 'combinar' && !esEscalar(op);
    const i = mueve ? op.destino : -1;
    estado.antes = mueve && nuevo > viejo ? { i, fila: desde[i] } : null;
    if (esEscalar(op)) avisarGrafico('Este paso no mueve nada: es la misma ecuación');
    if (!mueve || sinMovimiento()) {
      estado.filas = hasta;
      actualizarTodo();
      return;
    }
    anim = animar(ANIM_PASO, (t) => {
      const s = suave(t);
      estado.filas = desde.map((f, r) => (r === i ? f.map((v, c) => v + (hasta[r][c] - v) * s) : hasta[r]));
      cartelEl.hidden = t < 1;
      plano.pedirDibujo();
      dibujar3();
    }, () => {
      anim = null;
      cartelEl.hidden = false;
      estado.filas = hasta;
      actualizarTodo();
    });
  }

  function avisarGrafico(texto) {
    if (estado.sistema.n === 3 && espacio) espacio.avisar(texto);
    else plano._mostrarAviso(texto);
  }

  if (modo === 'gauss') {
    botonSiguiente.addEventListener('click', () => irAPaso(estado.paso + 1));
    botonAnterior.addEventListener('click', () => irAPaso(estado.paso - 1));
    $('[data-reiniciar]').addEventListener('click', () => {
      if (anim) { anim.cancelar(); anim = null; }
      estado.paso = 0;
      estado.antes = null;
      estado.filas = estado.gauss.todas[0].map((f) => f.map(valor));
      mostrarPaso();
      cartelEl.hidden = false;
      actualizarTodo();
    });
  }

  // ------------------------------------------------------------- parámetro k

  let deslizK = null;
  let especiales = [];
  if (modo === 'parametro') {
    deslizK = conectarDeslizador($('.deslizador[data-param="k"]'), (v) => {
      // imán: si está cerca de un valor especial, se queda ahí
      const cerca = especiales.find((e) => Math.abs(e - v) < 0.15);
      if (cerca !== undefined && Math.abs(cerca - v) > 1e-9) { deslizK.poner(cerca, false, false); v = cerca; }
      ponerK(v);
    }, { formato: (v) => num(v, 2) });
  }

  /** Los valores de k donde el sistema deja de tener una sola solución. */
  function buscarEspeciales() {
    const s = estado.sistema;
    const det = (k) => {
      const m = filasCon(s, k).map((f) => f.slice(0, s.n).map(valor));
      if (s.n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
      return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    };
    const lista = [];
    // los números "lindos" (enteros y medios) donde el determinante da 0
    for (let k = -20; k <= 20; k += 0.5) if (Math.abs(det(k)) < 1e-9) lista.push(k);
    return lista;
  }

  function ponerK(v) {
    estado.k = v;
    estado.filas = filasCon(estado.sistema, Math.round(v * 1000) / 1000).map((f) => f.map(valor));
    actualizarTodo();
  }

  // ------------------------------------------------------------- casillas y ejemplos

  casillas = conectarCasillas($('[data-casillas]'), () => actualizarTodo());

  async function elegir(i) {
    if (anim) { anim.cancelar(); anim = null; }
    estado.indice = (i + textos.length) % textos.length;
    const t = textos[estado.indice];
    contadorEl.textContent = `Sistema ${estado.indice + 1} de ${textos.length}`;
    estado.antes = null;
    if (modo === 'gauss') {
      const g = leerGauss(t);
      estado.sistema = g.sistema;
      estado.gauss = { ...g, todas: recorrido(g.filas, g.pasos) };
      estado.paso = 0;
    } else estado.sistema = leerSistema(t);

    const n = estado.sistema.n;
    graf2.hidden = n !== 2;
    graf3.hidden = n !== 3;
    // casillas que van solo con rectas o solo con planos
    for (const [nombre, solo] of [['cortes', 3], ['funciones', 2], ['p1', 3], ['p2', 3], ['p3', 3]]) {
      const b = raiz.querySelector(`[data-casilla="${nombre}"]`);
      if (b) b.hidden = n !== solo;
    }
    raiz.querySelector('.casillas-extras').hidden = n !== 3;
    if (n === 3) await prepararEspacio();

    if (modo === 'gauss') {
      ecuacionesEl.hidden = true;
      matrizEl.hidden = false;
      pasoEl.hidden = false;
      estado.filas = estado.gauss.todas[0].map((f) => f.map(valor));
      mostrarPaso();
    } else if (modo === 'parametro') {
      especiales = buscarEspeciales();
      estado.filas = filasCon(estado.sistema, estado.k).map((f) => f.map(valor));
    } else {
      estado.filas = filasCon(estado.sistema).map((f) => f.map(valor));
      if (n === 2) estado.manijas = estado.filas.map(manijasDe);
    }
    // que la solución se vea en el gráfico 2D
    if (n === 2) {
      const cl = clasificar(estado.filas);
      const [x, y] = cl.solucion ?? [0, 0];
      const cx = Math.abs(x) > 4 ? Math.round(x) : 0;
      plano.vista = { xMin: cx - 6, xMax: cx + 6, yCentro: Math.abs(y) > 4 ? Math.round(y) : 0 };
      plano.vistaInicial();
    }
    actualizarTodo();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  if (modo === 'parametro') estado.k = deslizK.valor;
  await elegir(0);
}
