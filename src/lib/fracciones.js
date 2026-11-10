// ==========================================================================
// Ayudas para fracciones: cuentas (mcd, mcm) y dibujos (barras en SVG).
// Las usan los interactivos de fracciones.
// ==========================================================================

import { num } from './numeros.js';

/** Máximo común divisor. */
export function mcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Mínimo común múltiplo. */
export const mcm = (a, b) => Math.abs(a * b) / mcd(a, b);

/** Una fracción escrita "de verdad": numerador arriba, raya, denominador abajo. */
export function fracHtml(a, b, { clase = '', color = '' } = {}) {
  const estilo = color ? ` style="--color-frac:${color}"` : '';
  const signo = a < 0 ? '<span class="frac-signo">−</span>' : '';
  return `${signo}<span class="frac ${clase}"${estilo}><span class="frac-num">${num(Math.abs(a))}</span><span class="frac-den">${num(b)}</span></span>`;
}

/**
 * Barras (cada una es 1 entero) cortadas en "partes" pedazos iguales,
 * con algunos pedazos pintados. Devuelve el SVG (sin la etiqueta <svg>).
 *
 * pintados: lista de { desde, cantidad, color, rayado } (en pedazos, contando de izquierda a derecha)
 * cortesFinos: si los cortes se ven finitos (ej. al simplificar)
 * grupo: cada cuántos pedazos va un corte grueso (para simplificar)
 * nuevos: true si los cortes recién aparecen (se animan)
 */
export function barrasSvg({ x = 0, y = 0, ancho = 300, alto = 40, separacion = 12, partes, enteros = 1, pintados = [], cortesFinos = false, grupo = 0, cortesNuevos = false }) {
  let s = '';
  for (let e = 0; e < enteros; e++) {
    const yy = y + e * (alto + separacion);
    const w = ancho / partes;
    // pedazos pintados de esta barra
    for (const p of pintados) {
      for (let k = p.desde; k < p.desde + p.cantidad; k++) {
        if (Math.floor(k / partes) !== e) continue;
        const xx = x + (k % partes) * w;
        s += `<rect class="pedazo${p.nuevo ? ' nuevo' : ''}" x="${xx}" y="${yy}" width="${w}" height="${alto}" fill="${p.color}" fill-opacity="${p.rayado ? 0.15 : 0.75}"/>`;
        if (p.rayado) {
          s += `<path class="pedazo${p.nuevo ? ' nuevo' : ''}" d="M${xx} ${yy + alto} L${xx + w} ${yy}" stroke="${p.color}" stroke-width="2.5"/>`;
        }
      }
    }
    // cortes
    for (let k = 1; k < partes; k++) {
      const xx = x + k * w;
      const grueso = grupo > 1 && k % grupo === 0;
      const opac = cortesFinos && !grueso ? 0.18 : 0.9;
      s += `<line class="corte${cortesNuevos && !grueso ? ' nuevo' : ''}" x1="${xx}" y1="${yy}" x2="${xx}" y2="${yy + alto}" stroke="var(--texto)" stroke-opacity="${opac}" stroke-width="${grueso ? 3 : 1.5}"/>`;
    }
    // borde del entero
    s += `<rect x="${x}" y="${yy}" width="${ancho}" height="${alto}" rx="4" fill="none" stroke="var(--texto)" stroke-width="2"/>`;
  }
  return s;
}
