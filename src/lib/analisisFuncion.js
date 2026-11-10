// ==========================================================================
// ANÁLISIS DE UNA FUNCIÓN TRANSFORMADA (compartido)
//
// A partir de lo que arma transformar() (src/lib/funcionesBase.js), escribe
// los textos de raíces, ordenada, extremos, C⁺ / C⁻, crece / decrece,
// asíntotas, dominio e imagen. Lo usan el Laboratorio y los temas de
// módulo, raíz y homográfica.
// ==========================================================================

import { numAprox, igual } from './numeros.js';

const X = '<i>x</i>';

/** Número para los intervalos: "3", "≈1.57", "+∞". */
export const n = (v) => (Number.isFinite(v) ? numAprox(v).replace('≈ ', '≈') : v > 0 ? '+∞' : '−∞');

/** Los bordes del dominio que caen adentro (asíntotas y el punto donde arranca la raíz o el ln). */
export function bordes(t) {
  const res = new Set(t.verticales);
  for (const tr of t.tramos) {
    if (Number.isFinite(tr.desde)) res.add(tr.desde);
    if (Number.isFinite(tr.hasta)) res.add(tr.hasta);
  }
  return [...res];
}

/**
 * Parte el dominio en pedacitos, cortando en los x de "cortes".
 * Cada pedacito: { desde, hasta, desdeCerrado, hastaCerrado, xm } (xm: un x del medio).
 */
export function partir(t, cortes) {
  const res = [];
  for (const tr of t.tramos) {
    const adentro = [...new Set(cortes)].filter((x) => x > tr.desde + 1e-9 && x < tr.hasta - 1e-9).sort((p, q) => p - q);
    const puntos = [tr.desde, ...adentro, tr.hasta];
    for (let i = 0; i < puntos.length - 1; i++) {
      const p = puntos[i];
      const q = puntos[i + 1];
      const xm = !Number.isFinite(p) && !Number.isFinite(q) ? 0 : !Number.isFinite(p) ? q - 1 : !Number.isFinite(q) ? p + 1 : (p + q) / 2;
      res.push({
        desde: p, hasta: q, xm,
        // el borde cerrado del dominio (ej. la raíz) cuenta solo si ahí no vale 0
        desdeCerrado: i === 0 && tr.desdeCerrado && Math.abs(t.F(p)) > 1e-9,
        hastaCerrado: i === puntos.length - 2 && tr.hastaCerrado && Math.abs(t.F(q)) > 1e-9,
      });
    }
  }
  return res;
}

/**
 * Escribe una lista de pedacitos como unión de intervalos.
 * repite: en las funciones periódicas se escriben solo los que están completos, con "…".
 * conBordes: true para respetar los bordes cerrados (C⁺ y C⁻); crece y decrece van siempre abiertos.
 */
export function escribir(tramos, repite, conBordes) {
  let lista = tramos;
  if (repite && !(lista.length === 1 && !Number.isFinite(lista[0].desde) && !Number.isFinite(lista[0].hasta))) {
    lista = lista.filter((tr) => Number.isFinite(tr.desde) && Number.isFinite(tr.hasta));
  }
  if (!lista.length) return '∅';
  const textos = lista.map((tr) => {
    if (!Number.isFinite(tr.desde) && !Number.isFinite(tr.hasta)) return 'ℝ';
    const izq = conBordes && tr.desdeCerrado ? '[' : '(';
    const der = conBordes && tr.hastaCerrado ? ']' : ')';
    return `${izq}${n(tr.desde)}, ${n(tr.hasta)}${der}`;
  });
  const unidos = textos.join(' ∪ ');
  return repite && textos[0] !== 'ℝ' ? `… ∪ ${unidos} ∪ …` : unidos;
}

export function dominioTexto(t, base) {
  if (base.dominio === 'R') return 'ℝ';
  if (base.dominio === 'distinto0') return `ℝ − {${n(t.verticales[0])}}`;
  if (base.dominio === 'tan') return `ℝ menos las asíntotas <span class="texto-suave">(se repiten cada ${numAprox(t.periodo)})</span>`;
  const tr = t.tramos[0];
  return `${tr.desdeCerrado ? '[' : '('}${n(tr.desde)}, ${n(tr.hasta)}${tr.hastaCerrado ? ']' : ')'}`;
}

export function imagenTexto(im) {
  if (im.tipo === 'R') return 'ℝ';
  if (im.tipo === 'punto') return `{${n(im.valor)}}`;
  if (im.tipo === 'menos') return `ℝ − {${n(im.valor)}}`;
  return `${im.loCerrado ? '[' : '('}${n(im.lo)}, ${n(im.hi)}${im.hiCerrado ? ']' : ')'}`;
}

export const itemInfo = (color, titulo, cuerpo) =>
  `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

/**
 * Los renglones de información (como <li>) según las casillas prendidas.
 *   t: lo que devuelve transformar();  base: la función base (BASES[...])
 *   op.centro: alrededor de qué x se listan las cosas que se repiten
 *   op.ladoHorizontal: texto extra para la asíntota horizontal (ej. "(hacia la izquierda)")
 *   op.nombreExtremos: título para los extremos (ej. "Vértice:")
 */
export function renglonesInfo(t, base, casillas, col, { a = 1, centro = 0, ladoHorizontal = '', nombreExtremos = 'Máximos y mínimos:' } = {}) {
  const repite = t.periodo !== null && t.periodo !== undefined;
  // en las que se repiten, se escriben solo las de un período para cada lado
  const cerca = (x) => !repite || Math.abs(x - centro) <= t.periodo + 1e-9;
  const cadaPeriodo = repite ? ` <span class="texto-suave">(se repiten cada ${numAprox(t.periodo)})</span>` : '';
  const partes = [];
  if (casillas.raices) {
    let cuerpo;
    if (t.todoCero) cuerpo = 'todos los números: la función vale 0 siempre.';
    else if (!t.raices.length) cuerpo = 'no tiene: la curva no toca el eje x.';
    else {
      const lista = t.raices.filter(cerca).map((x) => `${X} ${igual(x)}`).join(', ');
      cuerpo = repite ? `…, ${lista}, …${cadaPeriodo}` : `${lista}.`;
    }
    partes.push(itemInfo(col.raices, 'Raíces:', cuerpo));
  }
  if (casillas.ordenada) {
    const y0 = t.F(0);
    partes.push(itemInfo(col.ordenada, 'Ordenada al origen:', Number.isFinite(y0)
      ? `<i>f</i>(0) ${igual(y0)}.`
      : `no tiene: ${X} = 0 no está en el dominio.`));
  }
  if (casillas.extremos) {
    const lista = t.extremos.filter((e) => cerca(e.x))
      .map((e) => `${e.tipo === 'max' ? 'máximo' : 'mínimo'} en (${numAprox(e.x)}, ${numAprox(t.F(e.x))})`);
    partes.push(itemInfo(col.vertice, nombreExtremos, lista.length
      ? `${lista.join('; ')}${repite ? `…${cadaPeriodo}` : '.'}`
      : 'no tiene.'));
  }
  if (casillas.signos && !t.todoCero) {
    const cortes = [...t.raices, ...bordes(t)];
    const tramos = partir(t, cortes);
    const unir = (signo) => escribir(tramos.filter((tr) => Math.sign(t.F(tr.xm)) === signo), repite, true);
    partes.push(itemInfo(col.positivo, 'C⁺ =', `${unir(1)} <span class="texto-suave">(donde f(x) > 0)</span>`));
    partes.push(itemInfo(col.negativo, 'C⁻ =', `${unir(-1)} <span class="texto-suave">(donde f(x) < 0)</span>`));
  }
  if (casillas.crece && a !== 0) {
    const tramos = partir(t, [...t.extremos.map((e) => e.x), ...bordes(t)]);
    const pend = (x) => (t.F(x + 1e-5) - t.F(x - 1e-5));
    partes.push(itemInfo(col.crece, 'Crece en', escribir(tramos.filter((tr) => pend(tr.xm) > 0), repite, false)));
    partes.push(itemInfo(col.decrece, 'Decrece en', escribir(tramos.filter((tr) => pend(tr.xm) < 0), repite, false)));
  }
  if (casillas.asintotas) {
    const lista = [];
    if (t.verticales.length) {
      lista.push(repite
        ? `verticales en …, ${t.verticales.filter(cerca).map((x) => `${X} ${igual(x)}`).join(', ')}, …${cadaPeriodo}`
        : `vertical en ${X} ${igual(t.verticales[0])}`);
    }
    if (t.horizontal !== null) lista.push(`horizontal en <i>y</i> = ${numAprox(t.horizontal)}${ladoHorizontal}`);
    partes.push(itemInfo(col.texto, 'Asíntotas:', lista.length
      ? `${lista.join('; ')}. Son rectas a las que la curva se acerca cada vez más, sin tocarlas.`
      : 'no tiene.'));
  }
  if (casillas.dominio) {
    partes.push(itemInfo(col.funcion, 'Dominio:', `${dominioTexto(t, base)} <span class="texto-suave">(los ${X} que se pueden usar)</span>`));
    partes.push(itemInfo(col.funcion, 'Imagen:', `${imagenTexto(t.imagen)} <span class="texto-suave">(los valores que da)</span>`));
  }
  return partes;
}
