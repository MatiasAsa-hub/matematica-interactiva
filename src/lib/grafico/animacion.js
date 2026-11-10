// Ayudas para animar.

/** ¿La persona pidió "reducir movimiento" en su sistema? */
export function sinMovimiento() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Curva de velocidad suave (arranca y frena despacio). */
export const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Llama a alCuadro(t) con t de 0 a 1 durante "duracion" milisegundos.
 * Devuelve un objeto con cancelar() (corta ahí) y terminar() (salta al final).
 */
export function animar(duracion, alCuadro, alTerminar = () => {}) {
  let inicio = null;
  let id = null;
  let vivo = true;
  const cuadro = (ahora) => {
    if (!vivo) return;
    if (inicio === null) inicio = ahora;
    const t = Math.min(1, (ahora - inicio) / duracion);
    alCuadro(t);
    if (t < 1) id = requestAnimationFrame(cuadro);
    else { vivo = false; alTerminar(); }
  };
  id = requestAnimationFrame(cuadro);
  return {
    cancelar() { vivo = false; cancelAnimationFrame(id); },
    terminar() {
      if (!vivo) return;
      vivo = false;
      cancelAnimationFrame(id);
      alCuadro(1);
      alTerminar();
    },
  };
}
