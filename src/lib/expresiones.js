// ==========================================================================
// CUENTAS PASO A PASO
//
// Lee una cuenta escrita como texto (por ejemplo "3 * 2^2 - (7 - 1) : 3"),
// la arma como "árbol" y la resuelve de a una operación, respetando el orden:
//   1. lo que está entre paréntesis
//   2. potencias
//   3. multiplicaciones y divisiones, de izquierda a derecha
//   4. sumas y restas, de izquierda a derecha
//
// Cómo se escriben las cuentas: números enteros, + - * : ^ y paréntesis.
// El menos de un número negativo va pegado: "(-3)", o al principio: "-4 + 2".
// ==========================================================================

import { num } from './numeros.js';

const PRIORIDAD = { '+': 1, '-': 1, '*': 2, ':': 2, '^': 3 };
const SIMBOLO = { '+': '+', '-': '−', '*': '·', ':': ':' };

let contadorIds = 0;
const nuevoNumero = (valor) => ({ tipo: 'num', valor });
const nuevaOperacion = (op, izq, der) => ({ tipo: 'op', op, izq, der, id: ++contadorIds });

// --------------------------------------------------------------------------
// Lectura
// --------------------------------------------------------------------------

function separarEnPiezas(texto) {
  const piezas = [];
  const re = /\s*(\d+(?:\.\d+)?|[-+*:^()])/y;
  let m;
  while (re.lastIndex < texto.length) {
    m = re.exec(texto);
    if (!m) {
      if (/^\s*$/.test(texto.slice(re.lastIndex))) break;
      throw new Error(`No entiendo la cuenta "${texto}"`);
    }
    piezas.push(m[1]);
  }
  return piezas;
}

/** Convierte el texto en un árbol de operaciones. */
export function leerCuenta(texto) {
  const piezas = separarEnPiezas(texto.replace(/−/g, '-').replace(/·|×/g, '*'));
  let i = 0;
  const mirar = () => piezas[i];
  const tomar = (esperado) => {
    const p = piezas[i++];
    if (esperado && p !== esperado) throw new Error(`Esperaba "${esperado}" en "${texto}"`);
    return p;
  };

  function suma() {
    let nodo = producto();
    while (mirar() === '+' || mirar() === '-') nodo = nuevaOperacion(tomar(), nodo, producto());
    return nodo;
  }
  function producto() {
    let nodo = potencia();
    while (mirar() === '*' || mirar() === ':') nodo = nuevaOperacion(tomar(), nodo, potencia());
    return nodo;
  }
  function potencia() {
    const base = unario();
    if (mirar() === '^') { tomar(); return nuevaOperacion('^', base, potencia()); }
    return base;
  }
  function unario() {
    if (mirar() === '-') {
      tomar();
      const n = unario();
      if (n.tipo === 'num') return nuevoNumero(-n.valor);
      return nuevaOperacion('*', nuevoNumero(-1), n);
    }
    return primario();
  }
  function primario() {
    const p = tomar();
    if (p === '(') { const n = suma(); tomar(')'); return n; }
    if (p !== undefined && /^\d/.test(p)) return nuevoNumero(Number(p));
    throw new Error(`No entiendo la cuenta "${texto}"`);
  }

  const arbol = suma();
  if (i < piezas.length) throw new Error(`Sobra algo en la cuenta "${texto}"`);
  return arbol;
}

// --------------------------------------------------------------------------
// ¿Qué se hace ahora?
// --------------------------------------------------------------------------

/** ¿El hijo necesita paréntesis adentro de su padre? */
function llevaParentesis(hijo, padre, esDerecho) {
  if (hijo.tipo !== 'op') return false;
  const ph = PRIORIDAD[hijo.op];
  const pp = PRIORIDAD[padre.op];
  if (padre.op === '^') return true; // la base o el exponente con cuentas, siempre entre paréntesis
  if (ph < pp) return true;
  if (ph === pp && esDerecho && (padre.op === '-' || padre.op === ':' || hijo.op === '-' || hijo.op === ':')) return true;
  return false;
}

/**
 * Busca la próxima operación a resolver.
 * Devuelve { nodo, regla } o null si la cuenta ya es un número.
 */
export function proximaOperacion(arbol) {
  const listas = []; // operaciones con dos números (se pueden hacer ya)
  let orden = 0;
  const recorrer = (nodo, parentesis, padre, esDerecho) => {
    if (nodo.tipo !== 'op') return;
    const p = parentesis + (padre && llevaParentesis(nodo, padre, esDerecho) ? 1 : 0);
    recorrer(nodo.izq, p, nodo, false);
    if (nodo.izq.tipo === 'num' && nodo.der.tipo === 'num') {
      listas.push({ nodo, parentesis: p, prioridad: PRIORIDAD[nodo.op], orden: orden++ });
    }
    recorrer(nodo.der, p, nodo, true);
  };
  recorrer(arbol, 0, null, false);
  if (listas.length === 0) return null;
  listas.sort((a, b) => b.parentesis - a.parentesis || b.prioridad - a.prioridad || a.orden - b.orden);
  const elegida = listas[0];
  let regla;
  if (elegida.parentesis > 0) regla = 'Primero, lo que está entre paréntesis';
  else if (elegida.prioridad === 3) regla = 'Potencias';
  else if (elegida.prioridad === 2) regla = 'Multiplicaciones y divisiones, de izquierda a derecha';
  else regla = 'Sumas y restas, de izquierda a derecha';
  return { nodo: elegida.nodo, regla };
}

function calcular(op, a, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case ':': return a / b;
    case '^': return a ** b;
    default: throw new Error(op);
  }
}

/** Resuelve una operación: devuelve un árbol nuevo con esa operación reemplazada por su resultado. */
export function resolverPaso(arbol, nodoElegido) {
  const copiar = (nodo) => {
    if (nodo === nodoElegido) return nuevoNumero(calcular(nodo.op, nodo.izq.valor, nodo.der.valor));
    if (nodo.tipo === 'num') return nodo;
    return { ...nodo, izq: copiar(nodo.izq), der: copiar(nodo.der) };
  };
  return copiar(arbol);
}

/** Todos los pasos: [{ arbol, proxima }] desde la cuenta original hasta el resultado. */
export function pasosDe(texto) {
  let arbol = leerCuenta(texto);
  const pasos = [];
  for (let n = 0; n < 50; n++) {
    const proxima = proximaOperacion(arbol);
    pasos.push({ arbol, proxima });
    if (!proxima) break;
    arbol = resolverPaso(arbol, proxima.nodo);
  }
  return pasos;
}

// --------------------------------------------------------------------------
// Escritura (HTML)
// --------------------------------------------------------------------------

/**
 * Escribe el árbol como HTML.
 * opciones:
 *   marcar: id de la operación a resaltar (la próxima)
 *   terminos: true para encerrar cada término en una cajita
 *   nuevo: un número recién calculado (para resaltarlo)
 */
export function aHtml(arbol, { marcar = null, terminos = false } = {}) {
  let primero = true; // el primer número de toda la cuenta no lleva paréntesis aunque sea negativo

  const escribir = (nodo, padre = null, esDerecho = false) => {
    if (nodo.tipo === 'num') {
      const neg = nodo.valor < 0;
      const t = num(nodo.valor);
      const conPar = neg && (!primero || (padre && padre.op === '^'));
      primero = false;
      return `<span class="cuenta-num${nodo.recien ? ' recien' : ''}">${conPar ? `(${t})` : t}</span>`;
    }
    let s;
    if (nodo.op === '^') {
      const base = escribir(nodo.izq, nodo, false);
      const exp = escribir(nodo.der, nodo, true);
      s = `${base}<sup>${exp}</sup>`;
    } else {
      const izq = escribir(nodo.izq, nodo, false);
      const der = escribir(nodo.der, nodo, true);
      s = `${izq} <span class="cuenta-op">${SIMBOLO[nodo.op]}</span> ${der}`;
    }
    if (padre && llevaParentesis(nodo, padre, esDerecho)) s = `(${s})`;
    if (nodo.id === marcar) s = `<span class="cuenta-marcada">${s}</span>`;
    return s;
  };

  if (!terminos) return escribir(arbol);

  // Separar en términos: los + y − de "afuera" separan la cuenta en partes
  const partes = [];
  const juntar = (nodo, signo) => {
    if (nodo.tipo === 'op' && (nodo.op === '+' || nodo.op === '-') && nodo.id !== marcar) {
      juntar(nodo.izq, signo);
      partes.push({ signo: nodo.op, nodo: nodo.der });
    } else {
      partes.push({ signo, nodo });
    }
  };
  juntar(arbol, null);
  return partes
    .map((p, i) => {
      const signo = i === 0 ? '' : ` <span class="cuenta-op">${SIMBOLO[p.signo]}</span> `;
      return `${signo}<span class="cuenta-termino">${escribir(p.nodo, i === 0 ? null : { op: p.signo }, i > 0)}</span>`;
    })
    .join('');
}

/** Marca el número que salió del paso (para resaltarlo en la línea nueva). */
export function marcarRecien(arbolAntes, arbolDespues) {
  // el número nuevo es el que no existía en el árbol anterior
  const viejos = new Set();
  const juntar = (n) => { viejos.add(n); if (n.tipo === 'op') { juntar(n.izq); juntar(n.der); } };
  juntar(arbolAntes);
  const marcar = (n) => {
    if (n.tipo === 'num') return viejos.has(n) ? n : { ...n, recien: true };
    return { ...n, izq: marcar(n.izq), der: marcar(n.der) };
  };
  return marcar(arbolDespues);
}
