// ==========================================================================
// FÓRMULAS CON x
//
// Lee la regla de una función escrita como texto, por ejemplo
//   "2x + 1"   "x^2 - 2x"   "3(x - 1)"   "6 : x"   "-x^2 + 4"
// y la convierte en:
//   - una función de JavaScript para calcular f(x);
//   - HTML lindo para mostrarla (2x + 1, x², 6 : x);
//   - la cuenta con un número reemplazado: f(3) = 2 · 3 + 1.
//
// Se puede escribir: números (con punto decimal), x, + - * · : / ^ y paréntesis.
// "2x" quiere decir 2 · x. El ^ es "elevado a": x^2 es x².
// ==========================================================================

import { num } from './numeros.js';

const SUPER = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

/** Separa el texto en piezas: números, x, operaciones y paréntesis. */
function piezasDe(texto) {
  const s = String(texto).replace(/[−–]/g, '-').replace(/[·×*]/g, '*').replace(/\//g, ':');
  const piezas = [];
  const re = /\s*(\d+(?:\.\d+)?|x|[-+*:^()])/y;
  while (re.lastIndex < s.length) {
    const inicio = re.lastIndex;
    const m = re.exec(s);
    if (!m) {
      if (/^\s*$/.test(s.slice(inicio))) break;
      throw new Error(`No se entiende "${s.slice(inicio).trim()}" en la fórmula "${texto}"`);
    }
    const p = m[1];
    piezas.push(/\d/.test(p) ? { t: 'num', v: Number(p) } : p === 'x' ? { t: 'x' } : { t: p });
  }
  // multiplicaciones que no se escriben: 2x, 3(x+1), x(x-1), (x+1)(x-1)
  const conPor = [];
  for (const p of piezas) {
    const ant = conPor[conPor.length - 1];
    const terminaValor = ant && (ant.t === 'num' || ant.t === 'x' || ant.t === ')');
    const empiezaValor = p.t === 'num' || p.t === 'x' || p.t === '(';
    if (terminaValor && empiezaValor) conPor.push({ t: '*', oculta: true });
    conPor.push(p);
  }
  return conPor;
}

/**
 * Lee una fórmula. Devuelve { f, html(), cuenta(v) }.
 * Avisa con un error claro si está mal escrita.
 */
export function leerFormula(texto) {
  const piezas = piezasDe(texto);
  let i = 0;
  const mirar = () => piezas[i];
  const error = (que) => new Error(`${que} en la fórmula "${texto}"`);

  // Cada nodo sabe calcularse (val) y escribirse (escribir) con o sin un número en lugar de x.
  function suma() {
    let nodo = producto();
    while (mirar()?.t === '+' || mirar()?.t === '-') {
      const op = piezas[i++].t;
      nodo = { tipo: 'op', op, izq: nodo, der: producto() };
    }
    return nodo;
  }
  function producto() {
    let nodo = unario();
    while (mirar()?.t === '*' || mirar()?.t === ':') {
      const p = piezas[i++];
      nodo = { tipo: 'op', op: p.t, oculta: p.oculta, izq: nodo, der: unario() };
    }
    return nodo;
  }
  function unario() {
    if (mirar()?.t === '-') { i++; return { tipo: 'menos', hijo: unario() }; }
    if (mirar()?.t === '+') { i++; return unario(); }
    return potencia();
  }
  function potencia() {
    const base = atomo();
    if (mirar()?.t === '^') {
      i++;
      return { tipo: 'pot', base, exp: unario() };
    }
    return base;
  }
  function atomo() {
    const p = piezas[i++];
    if (!p) throw error('Falta algo al final');
    if (p.t === 'num') return { tipo: 'num', v: p.v };
    if (p.t === 'x') return { tipo: 'x' };
    if (p.t === '(') {
      const adentro = suma();
      if (piezas[i++]?.t !== ')') throw error('Falta cerrar un paréntesis');
      return { tipo: 'par', hijo: adentro };
    }
    throw error(`Sobra un "${p.t}"`);
  }

  const arbol = suma();
  if (i < piezas.length) throw error(`Sobra "${piezas[i].t}"`);

  const calcular = (n, x) => {
    switch (n.tipo) {
      case 'num': return n.v;
      case 'x': return x;
      case 'par': return calcular(n.hijo, x);
      case 'menos': return -calcular(n.hijo, x);
      case 'pot': return calcular(n.base, x) ** calcular(n.exp, x);
      default: {
        const a = calcular(n.izq, x);
        const b = calcular(n.der, x);
        if (n.op === '+') return a + b;
        if (n.op === '-') return a - b;
        if (n.op === '*') return a * b;
        return b === 0 ? NaN : a / b; // dividir por 0: no se puede
      }
    }
  };

  /**
   * Escribe el árbol. Si v es un número, va en lugar de x. Un negativo lleva
   * paréntesis si va después de una operación o si se eleva: 3 · (−2), (−2)².
   * "suelto" = está al principio (de todo o de un paréntesis), sin operación antes.
   */
  const escribir = (n, v, suelto = true) => {
    const conX = v === undefined;
    switch (n.tipo) {
      case 'num': return num(n.v);
      case 'x': return conX ? '<i>x</i>' : v < 0 && !suelto ? `(${num(v)})` : num(v);
      case 'par': return `(${escribir(n.hijo, v, true)})`;
      case 'menos': return `−${escribir(n.hijo, v, false)}`;
      case 'pot': {
        const exp = n.exp.tipo === 'num' && Number.isInteger(n.exp.v) && n.exp.v >= 0
          ? String(n.exp.v).split('').map((c) => SUPER[c]).join('')
          : null;
        const base = escribir(n.base, v, false);
        return exp ? `${base}${exp}` : `${base}<sup>${escribir(n.exp, v, true)}</sup>`;
      }
      default: {
        const a = escribir(n.izq, v, suelto);
        const b = escribir(n.der, v, false);
        if (n.op === '*' && n.oculta && conX) return `${a}${b}`;
        const simbolo = { '+': '+', '-': '−', '*': '·', ':': ':' }[n.op];
        // un número negativo después de una operación va entre paréntesis (ya lo pone "x")
        return `${a} ${simbolo} ${b}`;
      }
    }
  };

  return {
    texto: String(texto),
    f: (x) => calcular(arbol, x),
    html: () => escribir(arbol),
    cuenta: (v) => escribir(arbol, v),
  };
}
