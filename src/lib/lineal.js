// ==========================================================================
// ECUACIONES E INECUACIONES LINEALES (con una sola letra, x)
//
// Lee textos como "3x + 1 = x + 7" o "2x − 3 > 5" y arma los pasos para
// resolverlos, como en el pizarrón. Lo usan la balanza y la recta de
// inecuaciones. Se usa al armar el sitio (para avisar si una ecuación del
// .md está mal escrita) y en el navegador.
//
// Cada lado se guarda como { x, n }: "3x + 1" es { x: 3, n: 1 }.
// ==========================================================================

import { num } from './numeros.js';

const SIGNOS = ['≤', '≥', '<', '>', '='];

/** Normaliza lo que escribe una persona: −, <=, >=, espacios. */
function limpiar(texto) {
  return String(texto)
    .replace(/[−–]/g, '-')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/\s+/g, '');
}

/** Lee un lado ("3x+1", "-x", "7") y devuelve { x, n }. */
function leerLado(s, original) {
  if (!s) throw new Error(`Falta un lado en "${original}"`);
  const lado = { x: 0, n: 0 };
  const re = /([+-]?)(\d*)(x?)/gy;
  let pos = 0;
  while (pos < s.length) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m || m[0] === '' || (m[2] === '' && m[3] === '')) {
      throw new Error(`No se entiende "${s.slice(pos)}" en "${original}". Usá solo números, x, + y −`);
    }
    if (pos > 0 && m[1] === '') throw new Error(`Falta un + o un − en "${original}"`);
    const signo = m[1] === '-' ? -1 : 1;
    if (m[3]) lado.x += signo * (m[2] === '' ? 1 : Number(m[2]));
    else lado.n += signo * Number(m[2]);
    pos = re.lastIndex;
  }
  return lado;
}

/**
 * Lee una ecuación o inecuación.
 * @returns {{ izq: {x,n}, der: {x,n}, signo: string, texto: string }}
 */
export function leerEcuacion(texto) {
  const s = limpiar(texto);
  const signos = SIGNOS.filter((g) => s.includes(g));
  const cantidad = [...s].filter((c) => SIGNOS.includes(c)).length;
  if (cantidad !== 1) throw new Error(`"${texto}" tiene que tener un solo signo (=, <, >, ≤ o ≥)`);
  const signo = signos[0];
  const [a, b] = s.split(signo);
  const izq = leerLado(a, texto);
  const der = leerLado(b, texto);
  if (izq.x === 0 && der.x === 0) throw new Error(`"${texto}" no tiene x`);
  return { izq, der, signo, texto: String(texto) };
}

// --------------------------------------------------------------------------
// Escribir
// --------------------------------------------------------------------------

const X = '<i>x</i>';

/** Un lado escrito lindo en HTML: "3x + 1", "−x", "0". */
export function ladoHtml({ x, n }) {
  const partes = [];
  if (x !== 0) {
    const abs = Math.abs(x);
    partes.push(`${x < 0 ? '−' : ''}${abs === 1 ? '' : num(abs)}${X}`);
  }
  if (n !== 0 || partes.length === 0) {
    if (partes.length === 0) partes.push(num(n));
    else partes.push(`${n < 0 ? '−' : '+'} ${num(Math.abs(n))}`);
  }
  return partes.join(' ');
}

/** Un término suelto con su signo, para las notas: "+ 3", "− 2x". */
function terminoConSigno(v, conX) {
  const abs = Math.abs(v);
  const cuerpo = conX ? `${abs === 1 ? '' : num(abs)}${X}` : num(abs);
  return `${v < 0 ? '−' : '+'} ${cuerpo}`;
}

/** Un número con paréntesis si es negativo: (−2) */
const par = (v) => (v < 0 ? `(${num(v)})` : num(v));

/** El signo que queda si se da vuelta la desigualdad. */
export function signoDadoVuelta(signo) {
  return { '<': '>', '>': '<', '≤': '≥', '≥': '≤', '=': '=' }[signo];
}

/** ¿Se cumple "v1 signo v2"? */
export function cumple(v1, signo, v2) {
  const e = 1e-9;
  switch (signo) {
    case '=': return Math.abs(v1 - v2) < e;
    case '<': return v1 < v2 - e;
    case '>': return v1 > v2 + e;
    case '≤': return v1 <= v2 + e;
    case '≥': return v1 >= v2 - e;
    default: return false;
  }
}

export const valorLado = ({ x, n }, valorX) => x * valorX + n;

/** La cuenta de un lado con un valor de x: "2 · 3 + 1 = 7" (o "7" si no hay cuenta). */
export function cuentaHtml(lado, v) {
  const partes = [];
  if (lado.x !== 0) partes.push(lado.x === 1 ? par(v) : lado.x === -1 ? `−${par(v)}` : `${num(lado.x)} · ${par(v)}`);
  if (lado.n !== 0 || partes.length === 0) {
    if (partes.length === 0) partes.push(num(lado.n));
    else partes.push(`${lado.n < 0 ? '−' : '+'} ${num(Math.abs(lado.n))}`);
  }
  const total = valorLado(lado, v);
  // si no hay cuenta para hacer (un número solo, o una x sola), va directo el total
  const hayCuenta = partes.length > 1 || (lado.x !== 0 && lado.x !== 1);
  return hayCuenta ? `${partes.join(' ')} = ${num(total)}` : num(total);
}

/** Máximo común divisor (para simplificar fracciones). */
const mcd = (a, b) => (b === 0 ? Math.abs(a) : mcd(b, a % b));

/** Una división escrita lindo: "4", "5/2 = 2.5" o "7/3 ≈ 2.33". */
export function cocienteHtml(n, k) {
  if (n % k === 0) return num(n / k);
  const g = mcd(n, k) * Math.sign(k);
  const p = n / g;
  const q = k / g;
  const v = p / q;
  const exacto = Math.abs(Math.round(v * 100) - v * 100) < 1e-9;
  return `${p < 0 ? '−' : ''}${Math.abs(p)}/${q} ${exacto ? '=' : '≈'} ${num(v)}`;
}

// --------------------------------------------------------------------------
// Pasos para resolver
// --------------------------------------------------------------------------

/**
 * Pasos para resolver una ECUACIÓN, pensada para la balanza: las x se juntan
 * del lado que tiene más (así quedan positivas, y se pueden "repartir").
 *
 * Cada paso: { izq, der, accion, regla, nota }
 *   accion: null (el primero) | { tipo: 'sumar', x, n } (se suma lo mismo a los
 *   dos lados) | { tipo: 'repartir', k } (se divide en k grupos) | { tipo: 'girar' }
 * Al final: { fin: 'solucion' | 'todos' | 'ninguno', valor }
 */
export function pasosEcuacion(ec) {
  let izq = { ...ec.izq };
  let der = { ...ec.der };
  const pasos = [{ izq, der, accion: null, nota: '', regla: 'La ecuación como está. La balanza está equilibrada: los dos lados pesan lo mismo.' }];

  const sumar = (x, n, regla, nota) => {
    izq = { x: izq.x + x, n: izq.n + n };
    der = { x: der.x + x, n: der.n + n };
    pasos.push({ izq, der, accion: { tipo: 'sumar', x, n }, regla, nota });
  };

  // ¿De qué lado quedan las x? Del que tiene más (si empatan, de la izquierda).
  const xIzq = izq.x >= der.x;

  // 1) Sacar las x del otro lado
  const otro = xIzq ? der : izq;
  if (otro.x !== 0 && izq.x !== der.x) {
    const v = -otro.x;
    sumar(v, 0,
      v < 0
        ? `Sacamos ${Math.abs(v) === 1 ? 'una' : num(Math.abs(v))} ${X} de cada lado (una ${X} negativa anula a una positiva). Si sacás lo mismo de los dos platos, la balanza sigue equilibrada.`
        : `Sumamos ${v === 1 ? 'una' : num(v)} ${X} de cada lado: así se anulan las ${X} negativas.`,
      `${terminoConSigno(v, true)} de los dos lados`);
  }

  // Si las x se anularon de los dos lados: o vale siempre, o nunca
  if (izq.x === der.x) {
    sumar(-izq.x, 0, `Sacamos ${Math.abs(izq.x) === 1 ? 'una' : num(Math.abs(izq.x))} ${X} de cada lado y… ¡no queda ninguna ${X}!`, `${terminoConSigno(-izq.x, true)} de los dos lados`);
    const ok = izq.n === der.n;
    pasos[pasos.length - 1].fin = ok ? 'todos' : 'ninguno';
    pasos[pasos.length - 1].regla += ok
      ? ` Queda ${num(izq.n)} = ${num(der.n)}, que es verdad siempre: <b>cualquier número</b> es solución.`
      : ` Queda ${num(izq.n)} = ${num(der.n)}, que es falso: la balanza nunca se equilibra. <b>No hay solución</b>.`;
    return pasos;
  }

  // 2) Sacar el número del lado de las x
  const ladoX = () => (xIzq ? izq : der);
  if (ladoX().n !== 0) {
    const v = -ladoX().n;
    sumar(0, v,
      v < 0
        ? `Sacamos ${num(Math.abs(v))} de cada lado (un −1 anula a un 1), para que las ${X} queden solas.`
        : `Sumamos ${num(v)} de cada lado: un positivo con un negativo se anulan, y las ${X} quedan solas.`,
      `${terminoConSigno(v, false)} de los dos lados`);
  }

  // 3) Repartir en k grupos (dividir por k)
  const k = ladoX().x;
  const numero = (xIzq ? der : izq).n;
  if (k !== 1) {
    izq = xIzq ? { x: 1, n: 0 } : { x: 0, n: numero / k };
    der = xIzq ? { x: 0, n: numero / k } : { x: 1, n: 0 };
    pasos.push({
      izq, der,
      accion: { tipo: 'repartir', k },
      regla: `Hay ${num(k)} ${X}: repartimos cada lado en ${num(k)} grupos iguales y nos quedamos con uno. Es dividir por ${num(k)} de los dos lados.`,
      nota: `: ${num(k)} de los dos lados`,
      cociente: cocienteHtml(numero, k),
    });
  }

  // 4) Si la x quedó a la derecha, se da vuelta (es lo mismo)
  if (!xIzq) {
    const ult = pasos[pasos.length - 1];
    pasos.push({
      izq: der, der: izq, accion: { tipo: 'girar' }, nota: 'es lo mismo',
      cociente: ult.cociente,
      regla: `Es lo mismo leerlo al revés: ${X} va primero.`,
    });
  }
  const ult = pasos[pasos.length - 1];
  ult.fin = 'solucion';
  ult.valor = numero / k;
  ult.regla += ` <b>La solución es ${X} = ${cocienteHtml(numero, k)}.</b>`;
  return pasos;
}

/**
 * Pasos para resolver una INECUACIÓN: las x a la izquierda y los números a la
 * derecha (como en la escuela). Si se divide por un negativo, se da vuelta el signo.
 *
 * Cada paso: { izq, der, signo, regla, nota, dadoVuelta }
 * El último trae la solución: { tipo: 'intervalo', valor, signo } o { tipo: 'todos' | 'ninguno' }
 */
export function pasosInecuacion(ec) {
  let izq = { ...ec.izq };
  let der = { ...ec.der };
  let signo = ec.signo;
  const pasos = [{ izq, der, signo, nota: '', regla: 'La inecuación como está.' }];
  const sumar = (x, n, regla, nota) => {
    izq = { x: izq.x + x, n: izq.n + n };
    der = { x: der.x + x, n: der.n + n };
    pasos.push({ izq, der, signo, regla, nota });
  };

  if (der.x !== 0) {
    const v = -der.x;
    sumar(v, 0, `Pasamos las ${X} a la izquierda: ${v < 0 ? 'restamos' : 'sumamos'} ${Math.abs(v) === 1 ? '' : num(Math.abs(v))}${X} de los dos lados. Sumar o restar no cambia el signo.`, `${terminoConSigno(v, true)} de los dos lados`);
  }
  if (izq.x === 0) {
    const ok = cumple(izq.n, signo, der.n);
    const ult = pasos[pasos.length - 1];
    ult.regla += ` No queda ninguna ${X}: ${num(izq.n)} ${signo} ${num(der.n)} es ${ok ? '<b>verdad siempre</b>. La solución son todos los números: ℝ.' : '<b>falso siempre</b>. No hay solución: ∅.'}`;
    ult.solucion = { tipo: ok ? 'todos' : 'ninguno' };
    return pasos;
  }
  if (izq.n !== 0) {
    const v = -izq.n;
    sumar(0, v, `Pasamos el número a la derecha: ${v < 0 ? 'restamos' : 'sumamos'} ${num(Math.abs(v))} de los dos lados. El signo no cambia.`, `${terminoConSigno(v, false)} de los dos lados`);
  }
  const k = izq.x;
  if (k !== 1) {
    const nuevo = k < 0 ? signoDadoVuelta(signo) : signo;
    const regla = k < 0
      ? `Dividimos por ${par(k)} de los dos lados. Como ${num(k)} es <b>negativo</b>, <b>se da vuelta el signo</b>: ${signo} pasa a ser ${nuevo}.`
      : `Dividimos por ${num(k)} de los dos lados. Como ${num(k)} es positivo, el signo queda igual.`;
    const valor = der.n / k;
    izq = { x: 1, n: 0 };
    der = { x: 0, n: valor };
    pasos.push({ izq, der, signo: nuevo, regla, nota: `: ${par(k)} de los dos lados`, dadoVuelta: k < 0, cociente: cocienteHtml(der.n * k, k) });
    signo = nuevo;
  }
  const ult = pasos[pasos.length - 1];
  ult.solucion = { tipo: 'intervalo', valor: der.n, signo };
  ult.regla += ` <b>Solución: ${intervaloHtml(der.n, signo)}</b>.`;
  return pasos;
}

/** "x > 4" escrito como intervalo: (4, +∞) */
export function intervaloHtml(valor, signo, { valorHtml = num(valor) } = {}) {
  switch (signo) {
    case '>': return `(${valorHtml}, +∞)`;
    case '≥': return `[${valorHtml}, +∞)`;
    case '<': return `(−∞, ${valorHtml})`;
    case '≤': return `(−∞, ${valorHtml}]`;
    default: return `{${valorHtml}}`;
  }
}

/** Una ecuación entera en HTML: "3x + 1 = x + 7" */
export function ecuacionHtml(izq, signo, der) {
  return `${ladoHtml(izq)} ${signo} ${ladoHtml(der)}`;
}
