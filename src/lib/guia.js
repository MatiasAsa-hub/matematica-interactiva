// ==========================================================================
// Guías imprimibles: qué entra en la guía de un tema.
// Entran: Para recordar, el ejemplo resuelto y los ejercicios de respuesta
// numérica. Los de opción múltiple quedan afuera (pedido de Mati).
// ==========================================================================

/** Los ejercicios de respuesta numérica de un tema, numerados de nuevo desde 1. */
export function ejerciciosNumericos(tema) {
  return tema.partes
    .filter((p) => p.tipo === 'ejercicios')
    .flatMap((p) => p.ejercicios)
    .filter((e) => e.tipo === 'numero')
    .map((e, i) => ({ ...e, numeroGuia: i + 1 }));
}

/** ¿El tema tiene algo para imprimir? */
export function tieneGuia(tema) {
  return tema.partes.some((p) => p.tipo === 'recordar' || p.tipo === 'ejemplo')
    || ejerciciosNumericos(tema).length > 0;
}

/** Agrega un signo al final de un título, salvo que ya termine en ? ! . o : */
export function conCierre(titulo, signo) {
  return /[?!.:]\s*$/.test(titulo) ? titulo : titulo + signo;
}
