// ==========================================================================
// C⁺, C⁻ Y C⁰, Y CRECE / DECRECE (compartido por los gráficos de funciones)
//
//   - conjuntos(): C⁺, C⁻ y C⁰ escritos como intervalos.
//   - dibujarBarrasDeSigno(): barras sobre el eje x (C⁺ lisa y verde,
//     C⁻ punteada y roja) con su etiqueta.
//   - tramoCrecimiento(): una flecha "crece" o "decrece" en la franja de
//     arriba del gráfico.
// ==========================================================================

import { num, numAprox } from '../numeros.js';

const EPS = 1e-9;

/** Intervalo abierto escrito con la convención de la página. */
export const intervaloAbierto = (desde, hasta) => `(${num(desde)}, ${num(hasta)})`;

/**
 * C⁺, C⁻ y C⁰ como texto, para cualquier función continua con esas raíces:
 * se prueba el signo en cada tramo entre raíces.
 * todoCero: true si la función vale 0 siempre.
 */
export function conjuntos(f, raices, todoCero = false) {
  if (todoCero) return { pos: '∅', neg: '∅', cero: 'ℝ' };
  const cortes = [-Infinity, ...raices, Infinity];
  const pos = [];
  const neg = [];
  for (let i = 0; i < cortes.length - 1; i++) {
    const a = cortes[i];
    const b = cortes[i + 1];
    const medio = !Number.isFinite(a) && !Number.isFinite(b) ? 0 : !Number.isFinite(a) ? b - 1 : !Number.isFinite(b) ? a + 1 : (a + b) / 2;
    const y = f(medio);
    const texto = !Number.isFinite(a) && !Number.isFinite(b) ? 'ℝ' : intervaloAbierto(a, b);
    if (y > EPS) pos.push(texto);
    else if (y < -EPS) neg.push(texto);
  }
  const unir = (l) => (l.length ? l.join(' ∪ ') : '∅');
  const cero = raices.length ? `{${raices.map((r) => numAprox(r).replace('≈ ', '≈')).join(', ')}}` : '∅';
  return { pos: unir(pos), neg: unir(neg), cero };
}

/** Barras sobre el eje x que muestran C⁺ (lisa) y C⁻ (punteada), con etiqueta. */
export function dibujarBarrasDeSigno(p, f, raices) {
  const col = p.colores;
  const cortes = [p.xMin, ...raices.filter((r) => r > p.xMin && r < p.xMax), p.xMax];
  const Y0 = p.py(0);
  if (Y0 < -10 || Y0 > p.alto + 10) return;
  for (let i = 0; i < cortes.length - 1; i++) {
    const x1 = cortes[i];
    const x2 = cortes[i + 1];
    const y = f((x1 + x2) / 2);
    if (!Number.isFinite(y) || Math.abs(y) < EPS) continue; // sin barra donde vale 0 o donde la función no existe
    const positivo = y > 0;
    const ctx = p.ctx;
    ctx.save();
    ctx.strokeStyle = positivo ? col.positivo : col.negativo;
    ctx.lineWidth = 5;
    ctx.lineCap = 'butt';
    if (!positivo) ctx.setLineDash([9, 6]);
    ctx.beginPath();
    ctx.moveTo(p.px(x1) + 3, Y0);
    ctx.lineTo(p.px(x2) - 3, Y0);
    ctx.stroke();
    ctx.restore();
    if (p.px(x2) - p.px(x1) > 46) {
      // la etiqueta va adentro de la zona pintada, a media altura
      // (sin meterse debajo de los botones de zoom)
      const xm = (x1 + Math.min(x2, p.mx(p.ancho - 60))) / 2;
      const ym = Math.max(p.yMin, Math.min(p.yMax, f(xm))) / 2;
      p.etiqueta(positivo ? 'C⁺' : 'C⁻', xm, ym, {
        color: positivo ? col.positivo : col.negativo,
        dx: 0, dy: 0, alinear: 'center', tamano: 18,
      });
    }
  }
}

/** Altura (en píxeles) de la franja de crece / decrece, arriba del gráfico. */
export const Y_CRECIMIENTO = 30;

/** Una flecha "crece" o "decrece" entre dos píxeles horizontales, arriba del gráfico. */
export function tramoCrecimiento(p, X1, X2, crece) {
  if (X2 - X1 < 30) return;
  const Y = Y_CRECIMIENTO;
  const color = crece ? p.colores.crece : p.colores.decrece;
  const m = 5; // inclinación de la flecha
  p.flechaPx(X1 + 8, crece ? Y + m : Y - m, X2 - 8, crece ? Y - m : Y + m, { color, ancho: 3 });
  const ctx = p.ctx;
  ctx.save();
  ctx.font = `700 14px ${p.fuente}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  p._textoConHalo(crece ? 'crece' : 'decrece', (X1 + X2) / 2, Y - 9);
  ctx.restore();
}
