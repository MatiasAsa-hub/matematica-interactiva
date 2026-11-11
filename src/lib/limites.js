// ==========================================================================
// LÍMITES
//
// Lee un ejemplo de límite y calcula a qué se acerca la función cuando x se
// acerca a "a" por la izquierda y por la derecha.
//
// Los ejemplos se escriben en el tema (campo "limites:") así:
//   - { f: "(x^2 - 1) : (x - 1)", a: 1 }                 un hueco (0 : 0)
//   - { f: "x + 1 si x < 1 ; x - 2 si x >= 1", a: 1 }    una partida (salto)
// La fórmula se lee con src/lib/formula.js y las partidas con src/lib/partidas.js.
// ==========================================================================

import { leerFormula } from './formula.js';
import { leerPartida, enTramo } from './partidas.js';
import { leerNumero } from './numeros.js';

const MUY_CERCA = 1e-7;  // para calcular el límite "de verdad"
const ENORME = 1e5;      // más que esto, se considera que se va a infinito

/**
 * Lee un ejemplo. Devuelve:
 *   { texto, a, f(x), tramos (o null), formula (o null), lateral(lado) }
 * Avisa con un error claro si está mal escrito.
 */
export function leerLimite(ejemplo) {
  if (!ejemplo || typeof ejemplo !== 'object' || ejemplo.f === undefined || ejemplo.a === undefined) {
    throw new Error(`Cada ejemplo de límite se escribe así: { f: "(x^2 - 1) : (x - 1)", a: 1 }. Este está mal: ${JSON.stringify(ejemplo)}`);
  }
  const texto = String(ejemplo.f);
  const a = typeof ejemplo.a === 'number' ? ejemplo.a : leerNumero(String(ejemplo.a));
  if (!Number.isFinite(a)) throw new Error(`En el límite de "${texto}", "a" tiene que ser un número`);

  let f;
  let tramos = null;
  let formula = null;
  if (/\ssi\s/.test(texto)) {
    tramos = leerPartida(texto);
    f = (x) => {
      const t = tramos.find((tr) => enTramo(tr, x));
      return t ? t.formula.f(x) : NaN;
    };
  } else {
    formula = leerFormula(texto);
    f = (x) => formula.f(x);
  }

  /**
   * El límite por un lado (lado = −1: por izquierda, +1: por derecha).
   * Devuelve un número, Infinity, −Infinity o NaN (si no se acerca a nada).
   */
  function lateral(lado) {
    const v1 = f(a + lado * MUY_CERCA);
    const v2 = f(a + lado * MUY_CERCA * 10);
    if (!Number.isFinite(v1)) return Number.isNaN(v1) ? NaN : v1;
    if (Math.abs(v1) > ENORME && Math.abs(v1) > Math.abs(v2)) return Math.sign(v1) * Infinity;
    return Math.round(v1 * 1000) / 1000 + 0; // + 0: que −0 sea 0
  }

  return { texto, a, f, tramos, formula, lateral };
}

/**
 * Qué pasa en el ejemplo. Devuelve:
 *   { izq, der, existe, L, valor, caso }
 * caso: 'continua' (el límite es f(a)), 'hueco' (f(a) no existe pero el límite sí),
 *       'distinto' (f(a) existe pero es otro número), 'salto' (los dos lados no coinciden),
 *       'infinito' (los dos lados se van al mismo infinito), 'nada'.
 */
export function analizarLimite(lim) {
  const izq = lim.lateral(-1);
  const der = lim.lateral(+1);
  const valor = lim.f(lim.a);
  const iguales = izq === der || Math.abs(izq - der) < 1e-6;
  const existe = Number.isFinite(izq) && iguales;
  const L = existe ? izq : null;
  let caso;
  if (existe) {
    if (!Number.isFinite(valor)) caso = 'hueco';
    else if (Math.abs(valor - L) < 1e-6) caso = 'continua';
    else caso = 'distinto';
  } else if (!Number.isFinite(izq) && !Number.isNaN(izq) && izq === der) caso = 'infinito';
  else if (Number.isNaN(izq) || Number.isNaN(der)) caso = 'nada';
  else caso = 'salto';
  return { izq, der, existe, L, valor, caso };
}
