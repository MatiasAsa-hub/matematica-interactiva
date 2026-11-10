// ==========================================================================
// POLINOMIOS (cuentas compartidas)
//
// Un polinomio se guarda como la lista de sus coeficientes, del término
// independiente al de mayor grado: x³ − 2x + 5 es [5, −2, 0, 1].
//
//   - desdeRaices(a, [r1, r2…]): desarrolla a(x − r1)(x − r2)…
//   - evaluar, derivar
//   - raicesConCambioDeSigno: los x donde el polinomio cambia de signo
//     (se buscan con números: se recorre un tramo y se afina con bisección).
//     Sirve para los máximos y mínimos (donde cambia el signo de f')
//     y los puntos de inflexión (donde cambia el signo de f'').
//   - polinomioHtml: escrito lindo, de mayor a menor grado.
// ==========================================================================

import { num, numAprox } from './numeros.js';

const SUPER = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

/** a(x − r1)(x − r2)… desarrollado. */
export function desdeRaices(a, raices) {
  let coef = [a];
  for (const r of raices) {
    // multiplicar por (x − r)
    const nuevo = new Array(coef.length + 1).fill(0);
    coef.forEach((c, i) => {
      nuevo[i + 1] += c;
      nuevo[i] -= r * c;
    });
    coef = nuevo;
  }
  return coef;
}

/** Valor del polinomio en x (método de Horner). */
export function evaluar(coef, x) {
  let y = 0;
  for (let i = coef.length - 1; i >= 0; i--) y = y * x + coef[i];
  return y;
}

export function derivar(coef) {
  return coef.slice(1).map((c, i) => c * (i + 1));
}

/**
 * Los x de [desde, hasta] donde el polinomio cambia de signo.
 * (Una raíz doble, donde toca y rebota, no cuenta: no cambia de signo.)
 */
export function raicesConCambioDeSigno(coef, desde, hasta, pasos = 4000) {
  const f = (x) => evaluar(coef, x);
  const escala = Math.max(...coef.map(Math.abs), 1e-12);
  const casiCero = (y) => Math.abs(y) < escala * 1e-12;
  const res = [];
  let x0 = desde;
  let y0 = f(x0);
  for (let i = 1; i <= pasos; i++) {
    const x1 = desde + ((hasta - desde) * i) / pasos;
    const y1 = f(x1);
    if (casiCero(y1)) {
      // justo en un punto de la grilla: hay que mirar el signo de antes y de después
      const antes = f(x1 - 1e-7 * (hasta - desde));
      const despues = f(x1 + 1e-7 * (hasta - desde));
      if (Math.sign(antes) !== Math.sign(despues) && !casiCero(antes) && !casiCero(despues)) res.push(x1);
    } else if (!casiCero(y0) && Math.sign(y0) !== Math.sign(y1)) {
      let a = x0;
      let b = x1;
      let ya = y0;
      for (let k = 0; k < 60; k++) {
        const m = (a + b) / 2;
        const ym = f(m);
        if (Math.sign(ym) === Math.sign(ya)) { a = m; ya = ym; } else b = m;
      }
      res.push((a + b) / 2);
    }
    x0 = x1;
    y0 = y1;
  }
  // sin repetidos (por si una raíz cayó justo en el borde de dos tramos)
  return res.filter((x, i) => i === 0 || Math.abs(x - res[i - 1]) > 1e-6);
}

/** El polinomio escrito de mayor a menor grado: x³ − 2x² − 5x + 6 */
export function polinomioHtml(coef) {
  const partes = [];
  for (let i = coef.length - 1; i >= 0; i--) {
    const c = coef[i];
    if (Math.abs(c) < 0.005) continue;
    const abs = Math.abs(c);
    const letra = i === 0 ? '' : i === 1 ? '<i>x</i>' : `<i>x</i>${SUPER[i] ?? `<sup>${i}</sup>`}`;
    const numero = i > 0 && Math.abs(abs - 1) < 0.005 ? '' : numAprox(abs).replace('≈ ', '');
    const termino = numero + letra;
    if (partes.length === 0) partes.push((c < 0 ? '−' : '') + termino);
    else partes.push(` ${c < 0 ? '−' : '+'} ${termino}`);
  }
  return partes.join('') || '0';
}

/** Agrupa raíces iguales: [1, 1, 3] → [{ x: 1, veces: 2 }, { x: 3, veces: 1 }] */
export function agruparRaices(raices) {
  const orden = [...raices].sort((a, b) => a - b);
  const grupos = [];
  for (const r of orden) {
    const ult = grupos[grupos.length - 1];
    if (ult && Math.abs(ult.x - r) < 1e-9) ult.veces++;
    else grupos.push({ x: r, veces: 1 });
  }
  return grupos;
}

/** "(x + 2)", "(x − 1)" o "x" para el factor de una raíz */
export function factorHtml(r) {
  if (Math.abs(r) < 1e-9) return '<i>x</i>';
  return `(<i>x</i> ${r > 0 ? '−' : '+'} ${num(Math.abs(r))})`;
}
