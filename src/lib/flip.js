// Animación "FLIP" (compartida): se mide dónde estaba cada elemento con
// data-id, se hace el cambio y cada elemento "viaja" desde su lugar viejo
// hasta el nuevo. Sirve para fichas que se reordenan, se agrupan, etc.

import { sinMovimiento } from './grafico/animacion.js';

/**
 * @param {HTMLElement} contenedor  donde están los elementos con data-id
 * @param {() => void} cambio       la función que cambia el HTML
 * @param {object} opciones
 *   duracion   milisegundos del viaje
 *   idViejo    (id nuevo) => id que tenía antes (por si el elemento cambió de nombre)
 */
export function animarCambio(contenedor, cambio, { duracion = 700, idViejo = (id) => id, easing = 'cubic-bezier(.5,-0.2,.3,1.3)' } = {}) {
  const antes = new Map([...contenedor.querySelectorAll('[data-id]')].map((el) => [el.dataset.id, el.getBoundingClientRect()]));
  cambio();
  if (sinMovimiento()) return;
  for (const el of contenedor.querySelectorAll('[data-id]')) {
    const r0 = antes.get(idViejo(el.dataset.id));
    if (!r0) continue;
    const r1 = el.getBoundingClientRect();
    const dx = r0.left - r1.left;
    const dy = r0.top - r1.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: duracion, easing });
  }
}
