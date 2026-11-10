// ==========================================================================
// SALTOS EN LA RECTA NUMÉRICA (compartido por los interactivos de operaciones)
//
// Dibuja "saltitos" en forma de arco sobre el eje x:
//   - a la derecha: verdes, línea lisa;
//   - a la izquierda: rojos, línea punteada (para no depender solo del color).
// ==========================================================================

/**
 * @param {Plano} p
 * @param {object} op
 *   desde     dónde arranca el primer salto
 *   paso      cuánto avanza cada salto (con signo)
 *   cantidad  cuántos saltos (puede tener decimales: el último queda cortito)
 *   visibles  cuántos saltos se ven (para animar; con decimales, el último está a medio dibujar)
 *   espejo    1 normal, −1 dado vuelta en el 0 (valores intermedios: a mitad del giro)
 *   alfa      transparencia
 *   color     un color fijo para todos los saltos (si no, verde a la derecha y rojo a la izquierda)
 *   debajo    true para dibujar los arcos por debajo del eje
 * @returns {{ altura: number }} la altura de los arcos, para ubicar carteles
 */
export function dibujarSaltos(p, { desde = 0, paso = 1, cantidad = 0, visibles = Infinity, espejo = 1, alfa = 1, color: colorFijo = null, debajo = false }) {
  const ctx = p.ctx;
  // debajo: los arcos van por abajo del eje (se dibuja todo reflejado)
  if (debajo) { ctx.save(); ctx.translate(0, 2 * p.py(0)); ctx.scale(1, -1); }
  const col = p.colores;
  const Y0 = p.py(0);
  const altura = Math.max(22, Math.min(44, p.escala * Math.abs(paso) * 0.9));
  const punta = Math.max(3, Math.min(5, p.escala * Math.abs(paso) * 0.22));
  const hechos = Math.min(cantidad, visibles);

  for (let i = 0; i < Math.ceil(hechos - 1e-9); i++) {
    const largo = Math.min(1, cantidad - i);         // el último salto puede ser parcial
    const progreso = Math.min(1, hechos - i) / largo; // cuánto del arco ya se dibujó
    const X1 = p.px(espejo * (desde + paso * i));
    const X2 = p.px(espejo * (desde + paso * (i + largo)));
    const rx = Math.abs(X2 - X1) / 2;
    if (rx < 0.5) continue;
    const dir = Math.sign(X2 - X1);
    const color = colorFijo ?? (dir > 0 ? col.positivo : col.negativo);
    const f = Math.min(1, progreso);

    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    if (dir < 0 && !colorFijo) ctx.setLineDash([7, 5]);
    ctx.beginPath();
    const cx = (X1 + X2) / 2;
    if (dir > 0) ctx.ellipse(cx, Y0 - 2, rx, altura, 0, Math.PI, Math.PI + Math.PI * f, false);
    else ctx.ellipse(cx, Y0 - 2, rx, altura, 0, 0, -Math.PI * f, true);
    ctx.stroke();
    // punta de flecha cuando el salto terminó
    if (f >= 1) {
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(X2, Y0 - 3);
      ctx.lineTo(X2 - dir * punta - punta, Y0 - 3 - punta * 2);
      ctx.lineTo(X2 - dir * punta + punta, Y0 - 3 - punta * 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  if (debajo) ctx.restore();
  return { altura };
}
