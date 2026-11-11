// ==========================================================================
// INTEGRALES (cuentas compartidas por los interactivos de la Etapa 7)
//
// leerIntegral(texto) lee un ejemplo escrito en el tema, con partes
// separadas por ";":
//   "x^2 ; de 0 a 3"                    f(x) = x², entre 0 y 3
//   "x + 2 ; abajo: x^2 ; de -1 a 2"    el área entre x + 2 (arriba) y x² (abajo)
//   "x^2 - 1 ; desde 0"                 para la integral acumulada: arranca en 0
// Los extremos tienen que ser números enteros.
//
// primitivaDe(fn): una primitiva F (con F' = f) y su fórmula, si la sabemos.
// integrarNum(f, a, b): el área con signo, calculada con números (Simpson).
// ==========================================================================

import { leerDerivable } from './derivadas.js';
import { evaluar } from './polinomios.js';
import { num, numAprox } from './numeros.js';

const SUPER = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷' };

/** Lee un ejemplo de integral. Avisa con un error claro si está mal escrito. */
export function leerIntegral(texto) {
  const res = { texto: String(texto), f: null, g: null, a: 0, b: null };
  for (const parte of String(texto).split(';').map((p) => p.trim()).filter(Boolean)) {
    const de = parte.match(/^de\s+(-?\d+)\s+a\s+(-?\d+)$/i);
    const desde = parte.match(/^desde\s+(-?\d+)$/i);
    const abajo = parte.match(/^abajo\s*:\s*(.+)$/i);
    const arriba = parte.match(/^arriba\s*:\s*(.+)$/i);
    if (de) { res.a = Number(de[1]); res.b = Number(de[2]); }
    else if (desde) res.a = Number(desde[1]);
    else if (abajo) res.g = leerDerivable(abajo[1]);
    else res.f = leerDerivable(arriba ? arriba[1] : parte);
  }
  if (!res.f) throw new Error(`Falta la función en "${texto}"`);
  if (res.b !== null && !(res.b > res.a)) throw new Error(`En "${texto}" el segundo número tiene que ser más grande que el primero`);
  // la resta f − g (si hay g), como una sola función
  res.h = res.g ? restar(res.f, res.g) : res.f;
  return res;
}

/** f − g como una función (si las dos son polinomios, con su fórmula). */
function restar(f, g) {
  if (f.coef && g.coef) return leerDerivable(`(${f.texto}) - (${g.texto})`);
  return { f: (x) => f.f(x) - g.f(x), d: (x) => f.d(x) - g.d(x), coef: null, html: '', texto: '' };
}

/** Una fracción linda: 1/3 apilado. Si no es una fracción simple, el decimal. */
export function fraccionHtml(v) {
  const abs = Math.abs(v);
  const signo = v < 0 ? '−' : '';
  if (Math.abs(abs - Math.round(abs)) < 1e-9) return signo + num(abs);
  for (let q = 2; q <= 12; q++) {
    const p = abs * q;
    if (Math.abs(p - Math.round(p)) < 1e-9) return `${signo}<span class="fr"><span>${Math.round(p)}</span><span>${q}</span></span>`;
  }
  return signo + numAprox(abs).replace('≈ ', '');
}

/** Un polinomio con coeficientes que pueden ser fracciones: x³/3 − x */
function polinomioFracHtml(coef) {
  const partes = [];
  for (let i = coef.length - 1; i >= 0; i--) {
    const c = coef[i];
    if (Math.abs(c) < 1e-9) continue;
    const letra = i === 0 ? '' : i === 1 ? '<i>x</i>' : `<i>x</i>${SUPER[i] ?? `<sup>${i}</sup>`}`;
    const n = i > 0 && Math.abs(Math.abs(c) - 1) < 1e-9 ? '' : fraccionHtml(Math.abs(c));
    const termino = n + letra;
    partes.push(partes.length === 0 ? (c < 0 ? '−' : '') + termino : ` ${c < 0 ? '−' : '+'} ${termino}`);
  }
  return partes.join('') || '0';
}

/** Una primitiva de fn: { P(x), html } o null si no la sabemos. */
export function primitivaDe(fn) {
  if (fn.coef) {
    const pc = [0, ...fn.coef.map((c, i) => c / (i + 1))];
    return { P: (x) => evaluar(pc, x), html: polinomioFracHtml(pc) };
  }
  if (fn.prim) return { P: fn.prim, html: fn.primHtml };
  return null;
}

/** El área con signo de f entre a y b, con la regla de Simpson. */
export function integrarNum(f, a, b, n = 400) {
  if (a === b) return 0;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** La integral de fn entre a y b: exacta si hay primitiva; si no, con números. */
export function integral(fn, a, b) {
  const p = primitivaDe(fn);
  return p ? p.P(b) - p.P(a) : integrarNum(fn.f, a, b);
}

/** ∫ con los límites chiquitos: ∫₀³ */
export function integralHtml(a, b) {
  return `∫<span class="limites"><sup>${num(b)}</sup><sub>${num(a)}</sub></span>`;
}
