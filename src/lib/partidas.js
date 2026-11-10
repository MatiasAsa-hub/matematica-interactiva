// ==========================================================================
// FUNCIONES PARTIDAS (por tramos)
//
// Lee una función partida escrita como texto, casi como en el pizarrón:
//   "x + 2 si x < 1 ; 3 si x >= 1"
//   "-1 si x < -2 ; x + 1 si -2 <= x < 2 ; 3 si x >= 2"
// Cada tramo es "fórmula si condición", separados por ";".
// Condiciones: x < 1, x <= 1, x > 1, x >= 1, o entre dos números: -2 <= x < 2
// (también se puede usar ≤ y ≥).
// Las fórmulas se leen con src/lib/formula.js.
// ==========================================================================

import { leerFormula } from './formula.js';
import { leerNumero, num } from './numeros.js';

const X = '<i>x</i>';

/** Lee una condición: devuelve { lo, hi, loCerrado, hiCerrado }. */
function leerCondicion(texto, todo) {
  const s = texto.replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/−/g, '-').replace(/\s+/g, ' ').trim();
  const numero = '([+-]?\\d+(?:[.,]\\d+)?)';
  let m = s.match(new RegExp(`^x ?(<=|<|>=|>) ?${numero}$`));
  if (m) {
    const v = leerNumero(m[2]);
    if (m[1][0] === '<') return { lo: -Infinity, hi: v, loCerrado: false, hiCerrado: m[1] === '<=' };
    return { lo: v, hi: Infinity, loCerrado: m[1] === '>=', hiCerrado: false };
  }
  m = s.match(new RegExp(`^${numero} ?(<=|<) ?x ?(<=|<) ?${numero}$`));
  if (m) {
    const lo = leerNumero(m[1]);
    const hi = leerNumero(m[4]);
    if (!(lo < hi)) throw new Error(`En "${todo}": el primer número tiene que ser más chico que el segundo`);
    return { lo, hi, loCerrado: m[2] === '<=', hiCerrado: m[3] === '<=' };
  }
  throw new Error(`No entiendo la condición "${texto}" en "${todo}". Ejemplos que sí: x < 1, x >= 1, -2 <= x < 2`);
}

/**
 * Lee una función partida. Devuelve una lista de tramos:
 *   { formula (de leerFormula), texto, lo, hi, loCerrado, hiCerrado }
 * ordenados de izquierda a derecha. Avisa si dos tramos se pisan.
 */
export function leerPartida(texto) {
  const tramos = String(texto).split(';').map((parte) => {
    const [formula, condicion] = parte.split(/\s+si\s+/);
    if (!condicion) throw new Error(`Falta el "si" en "${parte.trim()}" (de "${texto}")`);
    return { formula: leerFormula(formula.trim()), texto: formula.trim(), ...leerCondicion(condicion, texto) };
  });
  tramos.sort((p, q) => p.lo - q.lo);
  for (let i = 0; i < tramos.length - 1; i++) {
    const a = tramos[i];
    const b = tramos[i + 1];
    if (a.hi > b.lo || (a.hi === b.lo && a.hiCerrado && b.loCerrado)) {
      throw new Error(`En "${texto}" hay dos tramos que se pisan: para algún x no se sabe cuál usar`);
    }
  }
  return tramos;
}

/** ¿El x está en el tramo? */
export const enTramo = (t, x) =>
  (x > t.lo || (t.loCerrado && x === t.lo)) && (x < t.hi || (t.hiCerrado && x === t.hi));

/** La condición escrita linda: "x < 1", "−2 ≤ x < 2". Con v, en lugar de x va el número. */
export function condicionHtml(t, v) {
  const equis = v === undefined ? X : num(v);
  const izq = t.loCerrado ? '≤' : '<';
  const der = t.hiCerrado ? '≤' : '<';
  if (Number.isFinite(t.lo) && Number.isFinite(t.hi)) return `${num(t.lo)} ${izq} ${equis} ${der} ${num(t.hi)}`;
  if (Number.isFinite(t.hi)) return `${equis} ${der} ${num(t.hi)}`;
  if (Number.isFinite(t.lo)) return `${equis} ${t.loCerrado ? '≥' : '>'} ${num(t.lo)}`;
  return `${equis} ∈ ℝ`;
}

