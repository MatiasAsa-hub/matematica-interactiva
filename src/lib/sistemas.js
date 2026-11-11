// ==========================================================================
// Sistemas de ecuaciones lineales (2×2 y 3×3): leer lo que se escribe en el
// tema, hacer las cuentas con fracciones exactas, los pasos de Gauss y la
// clasificación (compatible determinado, indeterminado o incompatible).
// Se usa al armar el sitio (para avisar si algo está mal escrito) y en el
// navegador (interactivos de sistemas).
//
// Cómo se escribe un sistema en el .md: las ecuaciones separadas por ";"
//   "2x + y = 5 ; x - y = 1"
//   "x + y + z = 6 ; 2x - y + z = 3 ; x + 2y - z = 2"
// Puede llevar un parámetro k:  "x + y = 2 ; x + k y = 3"  o  "(k - 1)z".
// ==========================================================================

import { num } from './numeros.js';

// ------------------------------------------------------------- fracciones

function mcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Una fracción exacta { n, d } con d > 0 y simplificada. */
export function fr(n, d = 1) {
  // decimales como 2.5: se pasan a fracción
  if (!Number.isInteger(n) || !Number.isInteger(d)) return fr(Math.round(n * 1e6), Math.round(d * 1e6));
  if (d === 0) throw new Error('División por cero');
  if (d < 0) { n = -n; d = -d; }
  const g = mcd(n, d);
  return { n: n / g, d: d / g };
}
export const suma = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d);
export const resta = (a, b) => fr(a.n * b.d - b.n * a.d, a.d * b.d);
export const por = (a, b) => fr(a.n * b.n, a.d * b.d);
export const dividido = (a, b) => fr(a.n * b.d, a.d * b.n);
export const esCero = (a) => a.n === 0;
export const valor = (a) => a.n / a.d;
const CERO = fr(0);
const UNO = fr(1);

/** Una fracción escrita: entera, o apilada (1 arriba, 3 abajo). */
export function frHtml(a, { conSigno = true } = {}) {
  const signo = conSigno && a.n < 0 ? '−' : '';
  const n = Math.abs(a.n);
  if (a.d === 1) return signo + n;
  return `${signo}<span class="fr"><span>${n}</span><span>${a.d}</span></span>`;
}

/** Un número cualquiera escrito lindo: fracción chica si se puede, si no decimal. */
export function numeroHtml(v) {
  if (Math.abs(v - Math.round(v)) < 1e-9) return num(Math.round(v));
  for (let q = 2; q <= 12; q++) {
    const p = v * q;
    if (Math.abs(p - Math.round(p)) < 1e-9) return frHtml(fr(Math.round(p), q));
  }
  return '≈ ' + num(v);
}

// ------------------------------------------------- leer lo que se escribe

const LETRAS = ['x', 'y', 'z'];

/** Separa "a + b - c" en términos con su signo (sin cortar dentro de paréntesis). */
function terminos(s) {
  const lista = [];
  let actual = '';
  let prof = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(') prof++;
    if (ch === ')') prof--;
    if ((ch === '+' || ch === '-') && prof === 0 && actual.trim() !== '' && !/[*/(]$/.test(actual.trim())) {
      lista.push(actual);
      actual = ch;
    } else actual += ch;
  }
  if (actual.trim() !== '') lista.push(actual);
  return lista.map((t) => t.replace(/\s+/g, ''));
}

/** Un número escrito: 3, 2.5, 1/2. */
function leerFraccion(s) {
  const m = s.match(/^(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
  if (!m) return null;
  const n = Number(m[1]);
  const d = m[2] ? Number(m[2]) : 1;
  return fr(n, d);
}

/**
 * Un coeficiente que puede tener k: devuelve { p, q } (vale p + q·k).
 * Acepta "", "3", "1/2", "k", "2k", "(k - 1)", "2(k + 1)", "-k".
 */
function leerCoeficiente(s, texto) {
  let signo = 1;
  while (s.startsWith('+') || s.startsWith('-')) {
    if (s[0] === '-') signo = -signo;
    s = s.slice(1);
  }
  let res;
  if (s === '') res = { p: UNO, q: CERO };
  else {
    const conParentesis = s.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)?\((.*)\)$/);
    if (conParentesis) {
      const factor = conParentesis[1] ? leerFraccion(conParentesis[1]) : UNO;
      let p = CERO;
      let q = CERO;
      for (const t of terminos(conParentesis[2])) {
        const c = leerCoeficiente(t, texto);
        p = suma(p, c.p);
        q = suma(q, c.q);
      }
      res = { p: por(factor, p), q: por(factor, q) };
    } else if (s.endsWith('k')) {
      const antes = s.slice(0, -1);
      const c = antes === '' ? UNO : leerFraccion(antes);
      if (!c) throw new Error(`No entiendo "${s}" en "${texto}"`);
      res = { p: CERO, q: c };
    } else {
      const c = leerFraccion(s);
      if (!c) throw new Error(`No entiendo "${s}" en "${texto}"`);
      res = { p: c, q: CERO };
    }
  }
  return signo < 0 ? { p: fr(-res.p.n, res.p.d), q: fr(-res.q.n, res.q.d) } : res;
}

/** Un lado de la ecuación: { x, y, z, n } (cada uno { p, q }). */
function leerLado(s, texto) {
  const lado = { x: null, y: null, z: null, n: null };
  const sumar = (clave, c) => {
    lado[clave] = lado[clave] ? { p: suma(lado[clave].p, c.p), q: suma(lado[clave].q, c.q) } : c;
  };
  for (const t of terminos(s)) {
    const m = t.match(/^(.*?)([xyz])$/);
    if (m) sumar(m[2], leerCoeficiente(m[1], texto));
    else sumar('n', leerCoeficiente(t, texto));
  }
  return lado;
}

const restaK = (a, b) => ({ p: resta(a?.p ?? CERO, b?.p ?? CERO), q: resta(a?.q ?? CERO, b?.q ?? CERO) });

/**
 * Lee un sistema. Devuelve { n, filas, conK, texto }:
 *   n: 2 o 3 incógnitas; filas: [[a, b, (c), d], ...] con cada número { p, q }.
 */
export function leerSistema(texto) {
  const limpio = String(texto)
    .replace(/−/g, '-').replace(/[·*]/g, '').replace(/\s+/g, ' ').trim();
  const ecuaciones = limpio.split(';').map((e) => e.trim()).filter(Boolean);
  if (ecuaciones.length < 2 || ecuaciones.length > 3) throw new Error(`El sistema tiene que tener 2 o 3 ecuaciones: "${texto}"`);
  const lados = ecuaciones.map((e) => {
    const partes = e.split('=');
    if (partes.length !== 2) throw new Error(`Cada ecuación tiene que tener un "=": "${e}"`);
    return [leerLado(partes[0], texto), leerLado(partes[1], texto)];
  });
  const usaZ = lados.some(([i, d]) => i.z || d.z);
  const n = ecuaciones.length === 3 || usaZ ? 3 : 2;
  if (n !== ecuaciones.length) throw new Error(`Con ${n} letras hacen falta ${n} ecuaciones: "${texto}"`);
  const filas = lados.map(([i, d]) => {
    const fila = LETRAS.slice(0, n).map((l) => restaK(i[l], d[l]));
    fila.push(restaK(d.n, i.n));
    return fila;
  });
  const conK = filas.some((f) => f.some((c) => !esCero(c.q)));
  return { n, filas, conK, texto: String(texto) };
}

/** Las filas con un valor de k puesto (como fracciones si k es "lindo", si no números). */
export function filasCon(sistema, k = 0) {
  const kf = fr(Math.round(k * 1000), 1000);
  return sistema.filas.map((f) => f.map((c) => suma(c.p, por(c.q, kf))));
}

// ----------------------------------------------------- escribir ecuaciones

/** Un coeficiente con k escrito: 2, k, 2k, (k − 1). */
function coefKHtml(c) {
  if (esCero(c.q)) return { html: frHtml(c.p, { conSigno: false }), negativo: c.p.n < 0, uno: c.p.n === c.p.d || c.p.n === -c.p.d, cero: esCero(c.p) };
  const kTxt = (q) => (Math.abs(q.n) === q.d ? '' : frHtml(q, { conSigno: false })) + '<i>k</i>';
  if (esCero(c.p)) return { html: kTxt(c.q), negativo: c.q.n < 0, uno: false, cero: false };
  const ini = c.q.n < 0 ? '−' : '';
  return { html: `(${ini}${kTxt(c.q)} ${c.p.n < 0 ? '−' : '+'} ${frHtml(c.p, { conSigno: false })})`, negativo: false, uno: false, cero: false, compuesto: true };
}

/**
 * Una ecuación escrita: "2x + y − z = 5".
 * fila: lista de fracciones (o de { p, q } si tiene k).
 */
export function ecuacionHtml(fila) {
  const n = fila.length - 1;
  const partes = [];
  for (let i = 0; i < n; i++) {
    const c = fila[i].p ? coefKHtml(fila[i]) : coefKHtml({ p: fila[i], q: CERO });
    if (c.cero) continue;
    const letra = `<i>${LETRAS[i]}</i>`;
    const cuerpo = (c.uno ? '' : c.html) + letra;
    if (partes.length === 0) partes.push((c.negativo ? '−' : '') + cuerpo);
    else partes.push(` ${c.negativo ? '−' : '+'} ${cuerpo}`);
  }
  const d = fila[n].p ? coefKHtml(fila[n]) : coefKHtml({ p: fila[n], q: CERO });
  const der = d.cero ? '0' : (d.negativo ? '−' : '') + d.html;
  return `${partes.join('') || '0'} = ${der}`;
}

// ------------------------------------------------------- operaciones de filas

const SUB = ['₀', '₁', '₂', '₃'];
const F = (i) => `F${SUB[i + 1]}`;

/** Aplica una operación a la matriz (lista de filas de fracciones). Devuelve una nueva. */
export function aplicar(filas, op) {
  const nuevas = filas.map((f) => f.slice());
  if (op.tipo === 'cambiar') {
    [nuevas[op.i], nuevas[op.j]] = [nuevas[op.j], nuevas[op.i]];
    return nuevas;
  }
  nuevas[op.destino] = filas[op.destino].map((_, c) =>
    op.terminos.reduce((acc, t) => suma(acc, por(t.coef, filas[t.fila][c])), CERO));
  return nuevas;
}

/** "F₂ − 2·F₁ → F₂", "F₃ : 2 → F₃", "F₁ ↔ F₂" (la notación de la escuela). */
export function operacionTexto(op) {
  if (op.tipo === 'cambiar') return `${F(op.i)} ↔ ${F(op.j)}`;
  const partes = [];
  // primero la fila de destino, después las demás
  const ordenados = [...op.terminos].sort((a, b) => (a.fila === op.destino ? -1 : b.fila === op.destino ? 1 : a.fila - b.fila));
  for (const t of ordenados) {
    const c = t.coef;
    const abs = fr(Math.abs(c.n), c.d);
    const neg = c.n < 0;
    let cuerpo;
    if (abs.n === 1 && abs.d === 1) cuerpo = F(t.fila);
    else if (abs.n === 1 && ordenados.length === 1) cuerpo = `${F(t.fila)} : ${abs.d}`;
    else cuerpo = `${abs.d === 1 ? abs.n : `${abs.n}/${abs.d}`}·${F(t.fila)}`;
    if (partes.length === 0) {
      // si el primero es negativo y está solo: (−1)·F₂ o F₂ : (−2)
      if (neg && ordenados.length === 1) {
        cuerpo = abs.n === 1 && abs.d !== 1 ? `${F(t.fila)} : (−${abs.d})` : `(−${abs.d === 1 ? abs.n : `${abs.n}/${abs.d}`})·${F(t.fila)}`;
        partes.push(cuerpo);
      } else partes.push((neg ? '−' : '') + cuerpo);
    } else partes.push(` ${neg ? '−' : '+'} ${cuerpo}`);
  }
  return `${partes.join('')} → ${F(op.destino)}`;
}

/** true si la operación no cambia el plano (multiplicar o dividir una fila). */
export const esEscalar = (op) => op.tipo !== 'cambiar' && op.terminos.length === 1;

/**
 * Lee una operación escrita en el tema:
 *   "F2 - 2F1 -> F2", "3F2 - 2F1 -> F2", "F3 : 2 -> F3", "-1F2 -> F2", "F1 <-> F2".
 */
export function leerOperacion(texto, n) {
  const s = String(texto).replace(/−/g, '-').replace(/[·*\s]/g, '')
    .replace(/[₀₁₂₃]/g, (c) => String('₀₁₂₃'.indexOf(c))).replace(/→/g, '->').replace(/↔/g, '<->');
  const cambio = s.match(/^F(\d)<->F(\d)$/i);
  const fila = (d) => {
    const i = Number(d) - 1;
    if (!(i >= 0 && i < n)) throw new Error(`La fila F${d} no existe en "${texto}"`);
    return i;
  };
  if (cambio) return { tipo: 'cambiar', i: fila(cambio[1]), j: fila(cambio[2]) };
  const m = s.match(/^(.*)->F(\d)$/i);
  if (!m) throw new Error(`No entiendo la operación "${texto}". Ejemplo: "F2 - 2F1 -> F2"`);
  const destino = fila(m[2]);
  const lista = [];
  for (const t of terminos(m[1])) {
    const mt = t.match(/^([+-]?)\(?([+-]?)([\d./]*)\)?F(\d)(?::\(?([+-]?)([\d./]+)\)?)?$/i);
    if (!mt) throw new Error(`No entiendo "${t}" en la operación "${texto}"`);
    let coef = mt[3] === '' ? UNO : leerFraccion(mt[3]);
    if (!coef) throw new Error(`No entiendo "${t}" en la operación "${texto}"`);
    if ((mt[1] === '-') !== (mt[2] === '-')) coef = fr(-coef.n, coef.d);
    if (mt[6]) {
      let div = leerFraccion(mt[6]);
      if (mt[5] === '-') div = fr(-div.n, div.d);
      coef = dividido(coef, div);
    }
    lista.push({ fila: fila(mt[4]), coef });
  }
  const propio = lista.find((t) => t.fila === destino);
  if (!propio || esCero(propio.coef)) throw new Error(`En "${texto}", la fila F${destino + 1} tiene que estar en la cuenta (si no, no es un paso de Gauss)`);
  return { tipo: 'combinar', destino, terminos: lista };
}

// --------------------------------------------------------- clasificación

/** Rango de una matriz de números (con tolerancia). */
function rangoNum(m) {
  const a = m.map((f) => f.slice());
  let r = 0;
  const cols = a[0].length;
  for (let c = 0; c < cols && r < a.length; c++) {
    let mejor = r;
    for (let i = r + 1; i < a.length; i++) if (Math.abs(a[i][c]) > Math.abs(a[mejor][c])) mejor = i;
    if (Math.abs(a[mejor][c]) < 1e-9) continue;
    [a[r], a[mejor]] = [a[mejor], a[r]];
    for (let i = r + 1; i < a.length; i++) {
      const f = a[i][c] / a[r][c];
      for (let j = c; j < cols; j++) a[i][j] -= f * a[r][j];
    }
    r++;
  }
  return r;
}

/**
 * Clasifica el sistema (filas de números).
 * Devuelve { tipo: 'CD' | 'CI' | 'I', rangoA, rangoAmp, solucion }.
 */
export function clasificar(filasNum) {
  const n = filasNum[0].length - 1;
  const A = filasNum.map((f) => f.slice(0, n));
  const rangoA = rangoNum(A);
  const rangoAmp = rangoNum(filasNum);
  const tipo = rangoA < rangoAmp ? 'I' : rangoA === n ? 'CD' : 'CI';
  let solucion = null;
  if (tipo === 'CD') solucion = resolverNum(filasNum);
  return { tipo, rangoA, rangoAmp, solucion };
}

/** Resuelve un sistema compatible determinado (números). */
export function resolverNum(filasNum) {
  const n = filasNum[0].length - 1;
  const a = filasNum.map((f) => f.slice());
  for (let c = 0; c < n; c++) {
    let mejor = c;
    for (let i = c + 1; i < n; i++) if (Math.abs(a[i][c]) > Math.abs(a[mejor][c])) mejor = i;
    [a[c], a[mejor]] = [a[mejor], a[c]];
    for (let i = 0; i < n; i++) {
      if (i === c) continue;
      const f = a[i][c] / a[c][c];
      for (let j = c; j <= n; j++) a[i][j] -= f * a[c][j];
    }
  }
  return a.map((f, i) => f[n] / f[i]);
}

export const NOMBRE_TIPO = {
  CD: 'Compatible determinado',
  CI: 'Compatible indeterminado',
  I: 'Incompatible',
};
export const QUE_QUIERE_DECIR = {
  CD: 'una sola solución',
  CI: 'infinitas soluciones',
  I: 'no tiene solución',
};

// ---------------------------------------------------------- Gauss solo

const esUnoAbs = (a) => Math.abs(a.n) === 1 && a.d === 1;
const neg = (a) => fr(-a.n, a.d);

/** Si toda la fila se puede dividir por un mismo número entero (> 1), ese número. */
function factorComun(fila) {
  if (fila.some((c) => c.d !== 1)) return 1;
  const g = fila.reduce((acc, c) => (c.n === 0 ? acc : mcd(acc, c.n)), 0);
  return g > 1 ? g : 1;
}

/** true si la fila dice 0 = (algo distinto de 0). */
export const contradiccion = (f) => f.slice(0, -1).every(esCero) && !esCero(f[f.length - 1]);

/** ¿Está escalonada? (cada fila empieza más a la derecha que la de arriba) */
export function estaEscalonada(filas) {
  const n = filas[0].length - 1;
  let antes = -1;
  for (const f of filas) {
    let primero = f.slice(0, n).findIndex((c) => !esCero(c));
    if (primero === -1) primero = n; // fila de ceros (0 = algo) va abajo de todo
    if (primero <= antes && primero !== n) return false;
    if (primero === n && antes === n) continue;
    antes = primero;
  }
  return true;
}

/**
 * Los pasos de Gauss que hace la página sola (si el tema no los escribe).
 * Primero hasta escalonada (sin fracciones: si hace falta, multiplica) y,
 * si el sistema tiene una sola solución, sigue hasta los planos "derechos".
 * Devuelve { pasos: [op...], escalonadaEn: cantidad de pasos hasta escalonada }.
 */
export function pasosGauss(filasIni) {
  const n = filasIni[0].length - 1;
  let filas = filasIni.map((f) => f.slice());
  const pasos = [];
  const hacer = (op) => { pasos.push(op); filas = aplicar(filas, op); };

  // --- ida: escalonar ---
  let r = 0;
  for (let c = 0; c < n && r < filas.length; c++) {
    let piv = -1;
    for (let i = r; i < filas.length; i++) if (!esCero(filas[i][c])) { piv = i; break; }
    if (piv === -1) continue;
    // si el pivote no es ±1 y más abajo hay un ±1, conviene cambiar las filas
    if (!esUnoAbs(filas[piv][c])) {
      for (let i = piv + 1; i < filas.length; i++) if (esUnoAbs(filas[i][c])) { piv = i; break; }
    }
    if (piv !== r) hacer({ tipo: 'cambiar', i: r, j: piv });
    for (let i = r + 1; i < filas.length; i++) {
      const q = filas[i][c];
      if (esCero(q)) continue;
      const p = filas[r][c];
      const cociente = dividido(q, p);
      if (cociente.d === 1 && p.d === 1 && q.d === 1) {
        hacer({ tipo: 'combinar', destino: i, terminos: [{ fila: i, coef: UNO }, { fila: r, coef: neg(cociente) }] });
      } else if (p.d === 1 && q.d === 1) {
        const g = mcd(p.n, q.n);
        let a = p.n / g;
        let b = -q.n / g;
        if (a < 0) { a = -a; b = -b; }
        hacer({ tipo: 'combinar', destino: i, terminos: [{ fila: i, coef: fr(a) }, { fila: r, coef: fr(b) }] });
      } else {
        hacer({ tipo: 'combinar', destino: i, terminos: [{ fila: i, coef: UNO }, { fila: r, coef: neg(cociente) }] });
      }
      const g = factorComun(filas[i]);
      if (g > 1) {
        // se divide por el factor común (con el signo, para que la fila empiece en positivo)
        const primero = filas[i].find((x) => !esCero(x));
        hacer({ tipo: 'combinar', destino: i, terminos: [{ fila: i, coef: fr(primero.n < 0 ? -1 : 1, g) }] });
      }
      // si aparece 0 = (algo que no es 0), ya está: no tiene solución
      if (filas.some(contradiccion)) break;
    }
    if (filas.some(contradiccion)) break;
    r++;
  }
  const escalonadaEn = pasos.length;

  // --- vuelta: solo si hay una única solución ---
  const tipo = clasificar(filas.map((f) => f.map(valor))).tipo;
  if (tipo === 'CD') {
    for (let c = n - 1; c >= 0; c--) {
      const p = filas[c][c];
      if (!(p.n === 1 && p.d === 1)) hacer({ tipo: 'combinar', destino: c, terminos: [{ fila: c, coef: dividido(UNO, p) }] });
      for (let i = c - 1; i >= 0; i--) {
        const q = filas[i][c];
        if (esCero(q)) continue;
        hacer({ tipo: 'combinar', destino: i, terminos: [{ fila: i, coef: UNO }, { fila: c, coef: neg(q) }] });
      }
    }
  }
  return { pasos, escalonadaEn, tipo };
}

/** Las filas después de cada paso: [inicial, después del 1, ...]. */
export function recorrido(filasIni, pasos) {
  const lista = [filasIni];
  for (const op of pasos) lista.push(aplicar(lista[lista.length - 1], op));
  return lista;
}

/**
 * Prepara un ejemplo de Gauss del tema: { sistema, pasos, escalonadaEn }.
 * ej: un texto (el sistema) o { sistema, pasos: [...] } con los pasos escritos.
 */
export function leerGauss(ej) {
  const texto = typeof ej === 'string' ? ej : ej.sistema;
  const sistema = leerSistema(texto);
  if (sistema.conK) throw new Error(`Para Gauss, el sistema no puede tener k: "${texto}"`);
  const filas = filasCon(sistema);
  if (typeof ej === 'object' && Array.isArray(ej.pasos)) {
    const pasos = ej.pasos.map((p) => leerOperacion(p, sistema.n));
    const todas = recorrido(filas, pasos);
    let escalonadaEn = todas.findIndex((f) => estaEscalonada(f));
    if (escalonadaEn === -1) escalonadaEn = pasos.length;
    const tipo = clasificar(filas.map((f) => f.map(valor))).tipo;
    return { sistema, filas, pasos, escalonadaEn, tipo };
  }
  return { sistema, filas, ...pasosGauss(filas) };
}
