// Utilidades con números que se usan tanto al armar el sitio como en el navegador.

/**
 * Convierte lo que escribe una persona en un número.
 * Acepta: 3   -2.5   −2.5   2,5   1/2   -3/4
 */
export function leerNumero(texto) {
  const s = String(texto).trim().replace(/−/g, '-').replace(/\s+/g, '').replace(',', '.');
  if (s === '') return NaN;
  const fraccion = s.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
  if (fraccion) return Number(fraccion[1]) / Number(fraccion[2]);
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)) return NaN;
  return Number(s);
}

/**
 * Escribe un número "lindo": con punto decimal, hasta 2 decimales,
 * y el signo menos tipográfico (−).
 */
export function num(valor, decimales = 2) {
  if (!Number.isFinite(valor)) return valor > 0 ? '+∞' : valor < 0 ? '−∞' : '?';
  const factor = 10 ** decimales;
  let r = Math.round(valor * factor) / factor;
  if (Object.is(r, -0) || r === 0) r = 0;
  const texto = String(Math.abs(r));
  return (r < 0 ? '−' : '') + texto;
}

/** true si el número, redondeado a 2 decimales, queda exacto. */
export function esExacto(valor, decimales = 2) {
  const factor = 10 ** decimales;
  return Math.abs(Math.round(valor * factor) - valor * factor) < 1e-6;
}

/** Como num(), pero agrega "≈" si el número no es exacto. */
export function numAprox(valor, decimales = 2) {
  return (esExacto(valor, decimales) ? '' : '≈ ') + num(valor, decimales);
}

/** "= 2" si el número es exacto, o "≈ 1.27" si está redondeado. */
export function igual(valor, decimales = 2) {
  return (esExacto(valor, decimales) ? '= ' : '≈ ') + num(valor, decimales);
}
