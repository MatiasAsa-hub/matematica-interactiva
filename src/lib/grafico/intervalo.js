// ==========================================================================
// INTERVALOS EN LA RECTA NUMÉRICA (compartido)
//
// Pinta un conjunto de números sobre el eje x: una franja gruesa, con
// flecha si sigue hasta el infinito, y en cada punta un punto
// relleno (el número está: cerrado, corchete) o hueco (no está: abierto, paréntesis).
// ==========================================================================

/**
 * @param {Plano} p
 * @param {object} op
 *   desde, hasta   las puntas (pueden ser -Infinity / Infinity)
 *   cerradoDesde, cerradoHasta   ¿la punta está incluida?
 *   color
 *   alfa           transparencia (para animar)
 */
export function dibujarIntervalo(p, { desde, hasta, cerradoDesde = false, cerradoHasta = false, color, alfa = 1 }) {
  const ctx = p.ctx;
  const Y0 = p.py(0);
  const X1 = Number.isFinite(desde) ? p.px(desde) : -20;
  const X2 = Number.isFinite(hasta) ? p.px(hasta) : p.ancho + 20;
  ctx.save();
  ctx.globalAlpha = alfa;

  // franja suave arriba del eje, y la línea gruesa sobre el eje
  ctx.fillStyle = color;
  ctx.globalAlpha = alfa * 0.16;
  ctx.fillRect(X1, Y0 - 34, X2 - X1, 34);
  ctx.globalAlpha = alfa;
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(Math.max(X1, -10), Y0);
  ctx.lineTo(Math.min(X2, p.ancho + 10), Y0);
  ctx.stroke();
  ctx.restore();

  // flechas hacia el infinito (pegadas al borde)
  if (!Number.isFinite(hasta)) p.flechaPx(p.ancho - 34, Y0 - 20, p.ancho - 8, Y0 - 20, { color, ancho: 3, punta: 10 });
  if (!Number.isFinite(desde)) p.flechaPx(34, Y0 - 20, 8, Y0 - 20, { color, ancho: 3, punta: 10 });

  // puntas: relleno = está incluido; hueco = no está
  if (Number.isFinite(desde)) p.punto(desde, 0, { color, radio: 8, hueco: !cerradoDesde, alfa });
  if (Number.isFinite(hasta)) p.punto(hasta, 0, { color, radio: 8, hueco: !cerradoHasta, alfa });
}

/** Una crucecita (✗) en la recta, para los números que NO cumplen. */
export function dibujarCruz(p, x, { color, tamano = 6, alfa = 1 } = {}) {
  const ctx = p.ctx;
  const X = p.px(x);
  const Y = p.py(0);
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(X - tamano, Y - tamano); ctx.lineTo(X + tamano, Y + tamano);
  ctx.moveTo(X + tamano, Y - tamano); ctx.lineTo(X - tamano, Y + tamano);
  ctx.stroke();
  ctx.restore();
}
