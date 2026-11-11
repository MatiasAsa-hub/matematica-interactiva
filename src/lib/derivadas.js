// ==========================================================================
// DERIVADAS (cuentas compartidas por los interactivos de la Etapa 6)
//
// leerDerivable(texto) lee una función escrita en el tema, por ejemplo
//   "x^2"   "x^3 - 3x"   "2x + 1"   "sen(x)"   "cos(x)"   "e^x"
// y devuelve:
//   f(x)            el valor de la función
//   d(x)            el valor de la derivada f'(x) (exacto si se puede)
//   html            la fórmula escrita linda
//   derivadaHtml    la fórmula de f'(x), o null si no la sabemos escribir
//   coef            los coeficientes, si es un polinomio (si no, null)
//
// Si es un polinomio, se averiguan sus coeficientes probando números
// (así no hace falta escribir la derivada a mano en el tema).
// ==========================================================================

import { leerFormula } from './formula.js';
import { evaluar, derivar, polinomioHtml } from './polinomios.js';

const X = '<i>x</i>';

/**
 * Las funciones que no son polinomios y sabemos derivar.
 * prim / primHtml: una primitiva (una función cuya derivada es f), para las integrales.
 */
const ESPECIALES = {
  sen: { f: Math.sin, d: Math.cos, html: `sen(${X})`, derivadaHtml: `cos(${X})`, prim: (x) => -Math.cos(x), primHtml: `−cos(${X})` },
  cos: { f: Math.cos, d: (x) => -Math.sin(x), html: `cos(${X})`, derivadaHtml: `−sen(${X})`, prim: Math.sin, primHtml: `sen(${X})` },
  exp: { f: Math.exp, d: Math.exp, html: `<i>e</i><sup>${X}</sup>`, derivadaHtml: `<i>e</i><sup>${X}</sup>`, prim: Math.exp, primHtml: `<i>e</i><sup>${X}</sup>` },
};

function especialDe(texto) {
  const s = String(texto).replace(/\s+/g, '').toLowerCase();
  if (s === 'sen(x)' || s === 'senx' || s === 'sin(x)') return ESPECIALES.sen;
  if (s === 'cos(x)' || s === 'cosx') return ESPECIALES.cos;
  if (s === 'e^x' || s === 'e^(x)') return ESPECIALES.exp;
  return null;
}

/**
 * Si f es un polinomio de grado ≤ 6, devuelve sus coeficientes
 * (del término independiente al de mayor grado). Si no, null.
 */
function coeficientesDe(f) {
  const n = 7;
  const xs = Array.from({ length: n }, (_, i) => i - 3); // −3 … 3
  const ys = xs.map(f);
  if (!ys.every(Number.isFinite)) return null;
  // sistema de Vandermonde, resuelto con Gauss
  const m = xs.map((x, i) => [...Array.from({ length: n }, (_, k) => x ** k), ys[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
    [m[c], m[piv]] = [m[piv], m[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const k = m[r][c] / m[c][c];
      for (let j = c; j <= n; j++) m[r][j] -= k * m[c][j];
    }
  }
  const coef = m.map((fila, i) => {
    const v = fila[n] / fila[i];
    const r = Math.round(v * 1e6) / 1e6;
    return Math.abs(r) < 1e-9 ? 0 : r;
  });
  // comprobar con otros números: si no da, no era un polinomio
  for (const x of [-4.3, -1.7, 0.6, 2.9, 5.1]) {
    const y = f(x);
    if (!Number.isFinite(y) || Math.abs(evaluar(coef, x) - y) > 1e-6 * Math.max(1, Math.abs(y))) return null;
  }
  while (coef.length > 1 && coef[coef.length - 1] === 0) coef.pop();
  return coef;
}

/** Lee una función para los interactivos de derivadas. */
export function leerDerivable(texto) {
  const esp = especialDe(texto);
  if (esp) return { ...esp, coef: null, texto: String(texto) };
  const formula = leerFormula(texto);
  const coef = coeficientesDe(formula.f);
  if (coef) {
    const dcoef = derivar(coef);
    return {
      texto: String(texto),
      f: (x) => evaluar(coef, x),
      d: (x) => evaluar(dcoef, x),
      html: formula.html(),
      derivadaHtml: polinomioHtml(dcoef.length ? dcoef : [0]),
      coef,
    };
  }
  // otra cosa (ej. 6 : x): la derivada se calcula con números
  const h = 1e-5;
  return {
    texto: String(texto),
    f: formula.f,
    d: (x) => (formula.f(x + h) - formula.f(x - h)) / (2 * h),
    html: formula.html(),
    derivadaHtml: null,
    coef: null,
  };
}

/**
 * Para un polinomio y un x fijo, el cociente incremental
 * (f(x + h) − f(x)) : h escrito como polinomio en h:
 *   f'(x) + (f''(x) : 2) · h + (f'''(x) : 6) · h² + …
 * Devuelve los coeficientes (del término sin h al de mayor grado).
 */
export function cocienteEnH(coef, x) {
  const res = [];
  let d = coef;
  let factorial = 1;
  for (let k = 1; k < coef.length; k++) {
    d = derivar(d);
    factorial *= k;
    res.push(evaluar(d, x) / factorial);
  }
  return res.length ? res : [0];
}

/** Los x de [a, b] donde g cambia de signo (buscados con números). */
export function cambiosDeSigno(g, a, b, pasos = 1200) {
  const res = [];
  let x0 = a;
  let y0 = g(x0);
  for (let i = 1; i <= pasos; i++) {
    const x1 = a + ((b - a) * i) / pasos;
    const y1 = g(x1);
    if (Number.isFinite(y0) && Number.isFinite(y1) && y0 !== 0 && Math.sign(y0) !== Math.sign(y1)) {
      let lo = x0;
      let hi = x1;
      let ylo = y0;
      for (let k = 0; k < 50; k++) {
        const m = (lo + hi) / 2;
        const ym = g(m);
        if (Math.sign(ym) === Math.sign(ylo)) { lo = m; ylo = ym; } else hi = m;
      }
      res.push((lo + hi) / 2);
    } else if (y1 === 0) res.push(x1);
    x0 = x1;
    y0 = y1;
  }
  return res.filter((x, i) => i === 0 || Math.abs(x - res[i - 1]) > 1e-6);
}
