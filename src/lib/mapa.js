// ==========================================================================
// Mapa de correlativas: dónde va cada tema en el dibujo.
// Cada unidad es una columna (como un plan de estudios) y, adentro, los
// temas van uno debajo del otro en el orden del recorrido.
// Las flechas salen de "necesita:" en cada tema.
// ==========================================================================

export const MEDIDAS = {
  ancho: 158,        // ancho de un tema
  alto: 62,          // alto de un tema
  separacionX: 40,   // entre columnas
  separacionY: 16,   // entre temas
  margen: 40,
  cabecera: 92,      // lugar arriba para el nombre de la etapa y de la unidad
};

/** Corta un texto en renglones de hasta "max" letras (sin cortar palabras). */
export function renglones(texto, max = 19) {
  const palabras = texto.split(/\s+/);
  const out = [];
  let linea = '';
  for (const p of palabras) {
    if (linea && (linea + ' ' + p).length > max) { out.push(linea); linea = p; }
    else linea = linea ? linea + ' ' + p : p;
  }
  if (linea) out.push(linea);
  return out;
}

/**
 * Arma todo lo que hace falta para dibujar el mapa.
 * @param unidades  listaDeUnidades() (cada una con sus temas, que traen "necesita")
 * @param etapas    datosDelSitio().etapas
 */
export function armarMapa(unidades, etapas) {
  const M = MEDIDAS;
  const nodos = [];
  const lugar = new Map();
  unidades.forEach((u, col) => {
    u.temas.forEach((t, fila) => {
      const x = M.margen + col * (M.ancho + M.separacionX);
      const y = M.margen + M.cabecera + fila * (M.alto + M.separacionY);
      const n = { slug: t.slug, titulo: t.titulo, necesita: t.necesita, col, fila, x, y, unidad: u.id };
      nodos.push(n);
      lugar.set(t.slug, n);
    });
  });

  const flechas = [];
  for (const n of nodos) {
    for (const s of n.necesita) {
      const a = lugar.get(s);
      if (a) flechas.push({ desde: a.slug, hasta: n.slug, d: camino(a, n) });
    }
  }

  const columnas = unidades.map((u, col) => ({
    id: u.id, numero: u.numero, nombre: u.nombre, etapa: u.etapa,
    x: M.margen + col * (M.ancho + M.separacionX),
  }));
  const grupos = etapas.map((e) => {
    const cols = columnas.filter((c) => c.etapa === e.id);
    if (cols.length === 0) return null;
    return { nombre: e.nombre, x: cols[0].x, ancho: cols[cols.length - 1].x + M.ancho - cols[0].x };
  }).filter(Boolean);

  const maxFilas = Math.max(...unidades.map((u) => u.temas.length));
  const ancho = M.margen * 2 + unidades.length * M.ancho + (unidades.length - 1) * M.separacionX;
  const alto = M.margen * 2 + M.cabecera + maxFilas * M.alto + (maxFilas - 1) * M.separacionY;
  return { nodos, flechas, columnas, grupos, ancho, alto };
}

/** La curva de una flecha, del tema "a" (el que se necesita) al tema "b". */
function camino(a, b) {
  const M = MEDIDAS;
  const ya = a.y + M.alto / 2;
  const yb = b.y + M.alto / 2;
  if (a.col === b.col) {
    // en la misma columna: una curva por el costado izquierdo
    const x = a.x;
    const panza = Math.min(M.separacionX - 6, 14 + 6 * Math.abs(b.fila - a.fila));
    return `M${x},${ya} C${x - panza},${ya} ${x - panza},${yb} ${x - 3},${yb}`;
  }
  if (a.col < b.col) {
    const x1 = a.x + M.ancho;
    const x2 = b.x - 3;
    const c = Math.max(30, (x2 - x1) * 0.45);
    return `M${x1},${ya} C${x1 + c},${ya} ${x2 - c},${yb} ${x2},${yb}`;
  }
  // (raro) el que se necesita está en una unidad que viene después
  const x1 = a.x;
  const x2 = b.x + M.ancho + 3;
  const c = Math.max(30, (x1 - x2) * 0.45);
  return `M${x1},${ya} C${x1 - c},${ya} ${x2 + c},${yb} ${x2},${yb}`;
}
