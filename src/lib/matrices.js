// ==========================================================================
// Cuentas con matrices, paso a paso: suma, resta, producto por un número,
// producto de matrices y determinante (2×2, y 3×3 por Sarrus o por la
// primera fila). Lo usa el interactivo "matrices".
//
// Cómo se escribe una cuenta en el .md (las filas se separan con ";"):
//   "(1 2 ; 3 4) + (5 0 ; -1 2)"
//   "3 · (1 -2 ; 0 4)"
//   "(1 2 ; 3 4) · (2 0 ; 1 -1)"
//   "det(2 1 3 ; 0 -1 2 ; 1 4 1)"
// ==========================================================================

import { leerNumero, num } from './numeros.js';

/** Lee "(1 2 ; 3 4)" → [[1, 2], [3, 4]]. */
function leerMatriz(texto, cuenta) {
  const filas = texto.split(';').map((f) => f.trim().split(/[\s,]+/).filter(Boolean).map((x) => leerNumero(x)));
  if (filas.some((f) => f.some((x) => Number.isNaN(x)))) throw new Error(`Hay un número mal escrito en la matriz de "${cuenta}"`);
  if (filas.some((f) => f.length !== filas[0].length)) throw new Error(`Todas las filas tienen que tener la misma cantidad de números en "${cuenta}"`);
  return filas;
}

const tam = (m) => `${m.length}×${m[0].length}`;

/** Un número para una cuenta: los negativos van entre paréntesis después de una operación. */
export const n = (v) => num(v);
export const np = (v) => (v < 0 ? `(${num(v)})` : num(v));

/**
 * Lee una cuenta. Devuelve { tipo, A, B?, k?, resultado, pasos, texto }.
 * tipo: 'suma' | 'resta' | 'escalar' | 'producto' | 'det'
 */
export function leerCuenta(texto) {
  const s = String(texto).replace(/−/g, '-').replace(/[*×]/g, '·').trim();
  const matrices = [...s.matchAll(/\(([^()]*)\)/g)].map((m) => leerMatriz(m[1], texto));
  const forma = s.replace(/\(([^()]*)\)/g, 'M').replace(/\s+/g, '');
  let c;
  if (/^detM$/i.test(forma)) {
    const A = matrices[0];
    if (A.length !== A[0].length) throw new Error(`El determinante es solo para matrices cuadradas: "${texto}"`);
    if (A.length < 2 || A.length > 3) throw new Error(`El determinante va para 2×2 o 3×3: "${texto}"`);
    c = { tipo: 'det', A };
  } else if (forma === 'M+M' || forma === 'M-M') {
    const [A, B] = matrices;
    if (tam(A) !== tam(B)) throw new Error(`Para sumar o restar, las matrices tienen que ser del mismo tamaño: "${texto}"`);
    c = { tipo: forma === 'M+M' ? 'suma' : 'resta', A, B };
  } else if (forma === 'M·M') {
    const [A, B] = matrices;
    if (A[0].length !== B.length) throw new Error(`Para multiplicar, las columnas de la primera (${A[0].length}) tienen que ser tantas como las filas de la segunda (${B.length}): "${texto}"`);
    c = { tipo: 'producto', A, B };
  } else {
    const m = forma.match(/^(-?[\d./]+)·M$/);
    if (!m) throw new Error(`No entiendo la cuenta "${texto}". Ejemplos: "(1 2 ; 3 4) + (5 0 ; -1 2)", "3 · (1 2 ; 3 4)", "det(1 2 ; 3 4)"`);
    c = { tipo: 'escalar', A: matrices[0], k: leerNumero(m[1]) };
  }
  c.texto = String(texto);
  armarPasos(c);
  return c;
}

/**
 * Arma los pasos. Cada paso de suma/resta/escalar/producto dice qué casillero
 * del resultado se llena y con qué cuenta: { i, j, cuenta, valor, filaA, colB }.
 */
function armarPasos(c) {
  const { A, B, k } = c;
  c.pasos = [];
  if (c.tipo === 'suma' || c.tipo === 'resta') {
    const sg = c.tipo === 'suma' ? 1 : -1;
    c.resultado = A.map((f, i) => f.map((a, j) => a + sg * B[i][j]));
    A.forEach((f, i) => f.forEach((a, j) => c.pasos.push({
      i, j, valor: c.resultado[i][j],
      cuenta: `${n(a)} ${sg > 0 ? '+' : '−'} ${np(B[i][j])} = ${n(c.resultado[i][j])}`,
    })));
  } else if (c.tipo === 'escalar') {
    c.resultado = A.map((f) => f.map((a) => k * a));
    A.forEach((f, i) => f.forEach((a, j) => c.pasos.push({
      i, j, valor: c.resultado[i][j], cuenta: `${n(k)} · ${np(a)} = ${n(c.resultado[i][j])}`,
    })));
  } else if (c.tipo === 'producto') {
    c.resultado = A.map((f) => B[0].map((_, j) => f.reduce((s, a, t) => s + a * B[t][j], 0)));
    c.resultado.forEach((f, i) => f.forEach((v, j) => c.pasos.push({
      i, j, valor: v, filaA: i, colB: j,
      cuenta: `${A[i].map((a, t) => `${np(a)} · ${np(B[t][j])}`).join(' + ')} = ${n(v)}`,
    })));
  } else if (c.tipo === 'det') {
    c.resultado = det(A);
  }
}

/** Determinante de una matriz 2×2 o 3×3. */
export function det(A) {
  if (A.length === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1])
    - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
    + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
}

/**
 * Pasos del determinante.
 * forma: 'sarrus' (o la de 2×2, que es igual: diagonales) o 'fila' (por la primera fila).
 * Cada paso: { celdas: [[i, j], ...], signo: +1 | -1, cuenta, valor, menor? }
 * En Sarrus 3×3 las columnas 3 y 4 son las dos primeras repetidas.
 */
export function pasosDet(A, forma = 'sarrus') {
  const pasos = [];
  if (A.length === 2) {
    const p1 = A[0][0] * A[1][1];
    const p2 = A[0][1] * A[1][0];
    pasos.push({ celdas: [[0, 0], [1, 1]], signo: 1, valor: p1, cuenta: `${np(A[0][0])} · ${np(A[1][1])} = ${n(p1)}` });
    pasos.push({ celdas: [[0, 1], [1, 0]], signo: -1, valor: p2, cuenta: `${np(A[0][1])} · ${np(A[1][0])} = ${n(p2)}` });
    return pasos;
  }
  if (forma === 'sarrus') {
    // tres diagonales hacia abajo (suman) y tres hacia arriba (restan)
    for (let s = 0; s < 3; s++) {
      const celdas = [0, 1, 2].map((i) => [i, s + i]);
      const v = celdas.reduce((p, [i, j]) => p * A[i][j % 3], 1);
      pasos.push({ celdas, signo: 1, valor: v, cuenta: `${celdas.map(([i, j]) => np(A[i][j % 3])).join(' · ')} = ${n(v)}` });
    }
    for (let s = 0; s < 3; s++) {
      const celdas = [0, 1, 2].map((i) => [2 - i, s + i]);
      const v = celdas.reduce((p, [i, j]) => p * A[i][j % 3], 1);
      pasos.push({ celdas, signo: -1, valor: v, cuenta: `${celdas.map(([i, j]) => np(A[i][j % 3])).join(' · ')} = ${n(v)}` });
    }
    return pasos;
  }
  // por la primera fila: + a·|menor| − b·|menor| + c·|menor|
  for (let j = 0; j < 3; j++) {
    const menor = [1, 2].map((i) => [0, 1, 2].filter((c) => c !== j).map((c) => A[i][c]));
    const dm = det(menor);
    const v = A[0][j] * dm;
    const signo = j === 1 ? -1 : 1;
    const menorTxt = `(${np(menor[0][0])} · ${np(menor[1][1])} − ${np(menor[0][1])} · ${np(menor[1][0])})`;
    pasos.push({
      celdas: [[0, j]], menor: { fila: 0, col: j }, signo, valor: v,
      cuenta: `${np(A[0][j])} · ${menorTxt} = ${np(A[0][j])} · ${np(dm)} = ${n(v)}`,
    });
  }
  return pasos;
}
