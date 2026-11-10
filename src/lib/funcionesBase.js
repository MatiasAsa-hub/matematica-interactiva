// ==========================================================================
// FUNCIONES BASE DEL LABORATORIO (y sus transformaciones)
//
// Cada función base f(u) sabe:
//   - calcularse: f(u, k) (k es la base de kˣ y logₖ)
//   - escribirse: html(arg, k)
//   - su dominio, su imagen, su período (si se repite) y sus asíntotas
//   - dónde vale un número t (raices: los u con f(u) = t), usando la inversa
//   - dónde tiene máximos y mínimos
//
// La función transformada es F(x) = a · f(b(x − c)) + d.
// Como u = b(x − c), cada cosa de la base se "traslada": x = c + u / b.
// Así las raíces, los extremos y las asíntotas salen exactos, sin buscarlos
// con números (la √ o el ln pueden tener raíces muy lejos).
// ==========================================================================

const PI = Math.PI;
const X = '<i>x</i>';

/** Los enteros n con desde ≤ inicio + n · paso ≤ hasta (para las funciones que se repiten). */
function repetir(inicio, paso, desde, hasta) {
  const res = [];
  if (!Number.isFinite(desde) || !Number.isFinite(hasta)) return res;
  for (let n = Math.ceil((desde - inicio) / paso); inicio + n * paso <= hasta + 1e-12; n++) res.push(inicio + n * paso);
  return res;
}

const R = { tipo: 'R' };
const desde0 = (cerrado) => ({ tipo: 'intervalo', lo: 0, hi: Infinity, loCerrado: cerrado, hiCerrado: false });

/**
 * dominio: 'R' | 'mayorIgual0' (u ≥ 0) | 'mayor0' (u > 0) | 'distinto0' | 'tan'
 * imagen:  { tipo: 'R' } | { tipo: 'intervalo', lo, hi, loCerrado, hiCerrado } | { tipo: 'menos', valor }
 * asintotas: { verticales(uDesde, uHasta) → [u…], horizontal: y de la base o null }
 */
export const BASES = {
  lineal: {
    boton: X, nombre: 'lineal',
    f: (u) => u,
    // con un número adelante hacen falta paréntesis: 2(x − 1)
    html: (arg, k, arriba, conA) => (conA ? arg.conParentesis : arg.texto),
    dominio: 'R', imagen: () => R,
    raices: (t) => [t],
  },
  cuadratica: {
    boton: `${X}²`, nombre: 'cuadrática', par: true,
    f: (u) => u * u,
    html: (arg) => `${arg.conParentesis}²`,
    dominio: 'R', imagen: () => desde0(true),
    raices: (t) => (t > 0 ? [-Math.sqrt(t), Math.sqrt(t)] : t === 0 ? [0] : []),
    extremos: () => [{ u: 0, tipo: 'min' }],
  },
  cubica: {
    boton: `${X}³`, nombre: 'cúbica (polinomio de grado 3)',
    f: (u) => u * u * u,
    html: (arg) => `${arg.conParentesis}³`,
    dominio: 'R', imagen: () => R,
    raices: (t) => [Math.cbrt(t)],
  },
  modulo: {
    boton: `|${X}|`, nombre: 'valor absoluto (módulo)', par: true,
    f: (u) => Math.abs(u),
    html: (arg) => `|${arg.texto}|`,
    dominio: 'R', imagen: () => desde0(true),
    raices: (t) => (t > 0 ? [-t, t] : t === 0 ? [0] : []),
    extremos: () => [{ u: 0, tipo: 'min' }],
  },
  raiz: {
    boton: `√${X}`, nombre: 'raíz cuadrada',
    f: (u) => Math.sqrt(u),
    html: (arg) => `√<span class="radicando">${arg.texto}</span>`,
    dominio: 'mayorIgual0', imagen: () => desde0(true),
    raices: (t) => (t >= 0 ? [t * t] : []),
  },
  inversa: {
    boton: `1/${X}`, nombre: 'homográfica (1 sobre x)',
    f: (u) => 1 / u,
    // la "a" va arriba: a / (b(x − c))
    html: (arg, k, arriba) => `<span class="frac"><span class="frac-num">${arriba}</span><span class="frac-den">${arg.texto}</span></span>`,
    dominio: 'distinto0', imagen: () => ({ tipo: 'menos', valor: 0 }),
    raices: (t) => (t !== 0 ? [1 / t] : []),
    asintotas: { verticales: () => [0], horizontal: 0 },
  },
  seno: {
    boton: 'sen', nombre: 'seno', palabra: true,
    f: (u) => Math.sin(u),
    html: (arg) => `sen(${arg.texto})`,
    dominio: 'R', periodo: 2 * PI,
    imagen: () => ({ tipo: 'intervalo', lo: -1, hi: 1, loCerrado: true, hiCerrado: true }),
    raices: (t, u1, u2) => {
      if (Math.abs(t) > 1) return [];
      const s = Math.asin(t);
      return [...repetir(s, 2 * PI, u1, u2), ...repetir(PI - s, 2 * PI, u1, u2)];
    },
    extremos: (u1, u2) => [
      ...repetir(PI / 2, 2 * PI, u1, u2).map((u) => ({ u, tipo: 'max' })),
      ...repetir(-PI / 2, 2 * PI, u1, u2).map((u) => ({ u, tipo: 'min' })),
    ],
  },
  coseno: {
    boton: 'cos', nombre: 'coseno', palabra: true, par: true,
    f: (u) => Math.cos(u),
    html: (arg) => `cos(${arg.texto})`,
    dominio: 'R', periodo: 2 * PI,
    imagen: () => ({ tipo: 'intervalo', lo: -1, hi: 1, loCerrado: true, hiCerrado: true }),
    raices: (t, u1, u2) => {
      if (Math.abs(t) > 1) return [];
      const s = Math.acos(t);
      return [...repetir(s, 2 * PI, u1, u2), ...repetir(-s, 2 * PI, u1, u2)];
    },
    extremos: (u1, u2) => [
      ...repetir(0, 2 * PI, u1, u2).map((u) => ({ u, tipo: 'max' })),
      ...repetir(PI, 2 * PI, u1, u2).map((u) => ({ u, tipo: 'min' })),
    ],
  },
  tangente: {
    boton: 'tan', nombre: 'tangente', palabra: true,
    f: (u) => Math.tan(u),
    html: (arg) => `tan(${arg.texto})`,
    dominio: 'tan', periodo: PI, imagen: () => R,
    raices: (t, u1, u2) => repetir(Math.atan(t), PI, u1, u2),
    asintotas: { verticales: (u1, u2) => repetir(PI / 2, PI, u1, u2), horizontal: null },
  },
  exponencial: {
    boton: `e<sup>${X}</sup>`, nombre: 'exponencial',
    f: (u) => Math.exp(u),
    html: (arg) => `e<sup>${arg.texto}</sup>`,
    dominio: 'R', imagen: () => desde0(false),
    raices: (t) => (t > 0 ? [Math.log(t)] : []),
    asintotas: { verticales: () => [], horizontal: 0 },
  },
  exponencialK: {
    boton: `<i>k</i><sup>${X}</sup>`, nombre: 'exponencial de base k', conBase: true,
    f: (u, k) => k ** u,
    html: (arg, k) => `${k}<sup>${arg.texto}</sup>`,
    empiezaConNumero: true,
    dominio: 'R', imagen: () => desde0(false),
    raices: (t, u1, u2, k) => (t > 0 ? [Math.log(t) / Math.log(k)] : []),
    asintotas: { verticales: () => [], horizontal: 0 },
  },
  ln: {
    boton: 'ln', nombre: 'logaritmo natural', palabra: true,
    f: (u) => Math.log(u),
    html: (arg) => `ln(${arg.texto})`,
    dominio: 'mayor0', imagen: () => R,
    raices: (t) => [Math.exp(t)],
    asintotas: { verticales: () => [0], horizontal: null },
  },
  logK: {
    boton: 'log<sub><i>k</i></sub>', nombre: 'logaritmo de base k', conBase: true, palabra: true,
    f: (u, k) => Math.log(u) / Math.log(k),
    html: (arg, k) => `log<sub>${k}</sub>(${arg.texto})`,
    dominio: 'mayor0', imagen: () => R,
    raices: (t, u1, u2, k) => [k ** t],
    asintotas: { verticales: () => [0], horizontal: null },
  },
};

export const ORDEN_BASES = ['lineal', 'cuadratica', 'cubica', 'modulo', 'raiz', 'inversa', 'seno', 'coseno', 'tangente', 'exponencial', 'exponencialK', 'ln', 'logK'];

// ------------------------------------------------------------------------
// La función transformada
// ------------------------------------------------------------------------

/**
 * Arma todo lo que hace falta de F(x) = a · f(b(x − c)) + d.
 * ventana: [x1, x2] donde se buscan las cosas que se repiten (seno, coseno, tangente).
 * Devuelve null en los casos raros (b = 0, base 1): ahí no hay nada que analizar.
 */
export function transformar(nombre, { a, b, c, d, k }, ventana) {
  const base = BASES[nombre];
  const F = (x) => a * base.f(b * (x - c), k) + d;
  const original = (x) => base.f(x, k);
  if (b === 0 || (base.conBase && Math.abs(k - 1) < 1e-9)) return { F, original, base, raro: true };

  const aX = (u) => c + u / b;
  // la ventana en "u" (b negativo da vuelta el orden)
  const [x1, x2] = ventana;
  const u1 = Math.min(b * (x1 - c), b * (x2 - c));
  const u2 = Math.max(b * (x1 - c), b * (x2 - c));
  const ordenar = (lista) => [...lista].sort((p, q) => p - q).filter((x, i, l) => i === 0 || Math.abs(x - l[i - 1]) > 1e-9);

  // asíntotas verticales (y cortes del dominio de la tangente)
  const verticales = ordenar((base.asintotas?.verticales(u1, u2) ?? []).map(aX));
  const horizontal = base.asintotas?.horizontal != null && a !== 0 ? a * base.asintotas.horizontal + d : null;

  // dominio en x, como lista de tramos
  let tramos;
  if (base.dominio === 'R') tramos = [{ desde: -Infinity, hasta: Infinity, desdeCerrado: false, hastaCerrado: false }];
  else if (base.dominio === 'mayorIgual0' || base.dominio === 'mayor0') {
    const cerrado = base.dominio === 'mayorIgual0';
    tramos = b > 0
      ? [{ desde: c, hasta: Infinity, desdeCerrado: cerrado, hastaCerrado: false }]
      : [{ desde: -Infinity, hasta: c, desdeCerrado: false, hastaCerrado: cerrado }];
  } else {
    // distinto0 o tangente: cortado en las asíntotas
    const cortes = [-Infinity, ...verticales, Infinity];
    tramos = cortes.slice(0, -1).map((p, i) => ({ desde: p, hasta: cortes[i + 1], desdeCerrado: false, hastaCerrado: false }));
  }

  // raíces: F(x) = 0 ⇔ f(u) = −d / a
  let raices = [];
  let todoCero = false;
  if (a === 0) todoCero = d === 0;
  else raices = ordenar(base.raices(-d / a, u1, u2, k).map(aX)).filter((x) => Number.isFinite(F(x)) && Math.abs(F(x)) < 1e-6);

  // máximos y mínimos (con a negativo, se dan vuelta)
  const extremos = a === 0 ? [] : (base.extremos?.(u1, u2) ?? [])
    .map((e) => ({ x: aX(e.u), tipo: a > 0 ? e.tipo : e.tipo === 'max' ? 'min' : 'max' }))
    .sort((p, q) => p.x - q.x);

  return {
    F, original, base, raro: false,
    periodo: base.periodo ? base.periodo / Math.abs(b) : null,
    tramos, verticales, horizontal, raices, todoCero, extremos,
    imagen: imagenTransformada(base.imagen(k), a, d),
  };
}

/** La imagen de a · f + d, a partir de la imagen de f. */
function imagenTransformada(im, a, d) {
  if (a === 0) return { tipo: 'punto', valor: d };
  if (im.tipo === 'R') return im;
  if (im.tipo === 'menos') return { tipo: 'menos', valor: a * im.valor + d };
  const lo = a * im.lo + d;
  const hi = a * im.hi + d;
  return a > 0
    ? { tipo: 'intervalo', lo, hi, loCerrado: im.loCerrado, hiCerrado: im.hiCerrado }
    : { tipo: 'intervalo', lo: hi, hi: lo, loCerrado: im.hiCerrado, hiCerrado: im.loCerrado };
}

// ------------------------------------------------------------------------
// Cómo se escribe
// ------------------------------------------------------------------------

/**
 * El "adentro" de la función: b(x − c).
 * v(param, texto) envuelve cada número para poder resaltarlo.
 * Devuelve { texto, conParentesis, simple }.
 */
export function argumentoHtml(b, c, v, num) {
  const resta = c === 0 ? X : `${X} ${c > 0 ? '−' : '+'} ${v('c', num(Math.abs(c)))}`;
  let texto;
  if (b === 1) texto = resta;
  else {
    const adelante = b === -1 ? v('b', '−') : v('b', num(b));
    texto = c === 0 ? `${adelante}${X}` : `${adelante}(${resta})`;
  }
  const simple = b === 1 && c === 0;
  return { texto, conParentesis: simple ? X : `(${texto})`, simple };
}
