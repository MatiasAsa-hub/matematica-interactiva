// ==========================================================================
// INTERACTIVO: sumar, restar, multiplicar y dividir fracciones, paso a paso.
//   - Sumar y restar: se "recortan" las barras hasta que los pedazos sean del
//     mismo tamaño (denominador común) y después se juntan o se sacan.
//   - Multiplicar: "la parte de una parte", con un cuadrado cortado en columnas y filas.
//   - Dividir: la segunda fracción se da vuelta como una carta y ":" pasa a "·".
// El HTML está en src/components/interactivos/FraccionesOperaciones.astro.
// ==========================================================================

import { conectarDeslizador } from '../lib/grafico/controles.js';
import { mcd, mcm, fracHtml, barrasSvg } from '../lib/fracciones.js';
import { num, igual } from '../lib/numeros.js';

const AZUL = 'var(--c-funcion)';
const LILA = 'var(--c-vertice)';
const AMARILLO = 'var(--c-raices)';
const ANCHO = 300;

const F1 = (a, b) => fracHtml(a, b, { color: AZUL });
const F2 = (a, b) => fracHtml(a, b, { color: LILA });
const FR = (a, b) => fracHtml(a, b, { clase: 'frac-resultado' });
const op = (s) => ` <span class="op-frac">${s}</span> `;

/** Un grupo de barras con un titulito arriba. Devuelve { svg, alto }. */
function grupoBarras(y, titulo, opciones) {
  const enteros = opciones.enteros ?? 1;
  const svg = `<text x="10" y="${y + 13}" class="svg-titulo">${titulo}</text>`
    + barrasSvg({ x: 10, y: y + 20, ancho: ANCHO, alto: 34, separacion: 8, ...opciones, enteros });
  return { svg, alto: 20 + enteros * 42 + 8 };
}

function apilar(grupos) {
  let y = 4;
  let svg = '';
  for (const [titulo, opciones] of grupos) {
    const g = grupoBarras(y, titulo, opciones);
    svg += g.svg;
    y += g.alto;
  }
  return `<svg viewBox="0 0 ${ANCHO + 20} ${y}" role="img" aria-label="Fracciones dibujadas con barras">${svg}</svg>`;
}

const enterosPara = (n, partes) => Math.max(1, Math.ceil(n / partes));

/** Paso final de simplificar (o decir que no se puede). */
function pasoSimplificar(num_, den, exprAntes, svgDe) {
  const g = mcd(num_, den);
  const valor = num_ / den;
  if (g > 1 && num_ !== 0) {
    return {
      expr: `${exprAntes} = ${FR(num_ / g, den / g)}`,
      svg: svgDe ? svgDe(g) : null,
      texto: `Se puede <b>simplificar</b>: dividiendo arriba y abajo por <b>${g}</b> queda ${num(num_ / g)}/${num(den / g)}. `
        + `Y como una fracción es una división: ${num(num_ / g)} : ${num(den / g)} ${igual(valor)}.`,
    };
  }
  return {
    expr: exprAntes,
    svg: svgDe ? svgDe(0) : null,
    texto: `${num_ === 0 ? 'Da 0.' : `No se puede simplificar: ${num(Math.abs(num_))}/${num(den)} ya está en su forma más simple.`} `
      + `Como una fracción es una división: ${num(num_)} : ${num(den)} ${igual(valor)}.`,
  };
}

// --------------------------------------------------------------------------
// Pasos de cada operación
// --------------------------------------------------------------------------

function pasosSumaResta(a, b, c, d, resta) {
  const signo = resta ? '−' : '+';
  const m = mcm(b, d);
  const a2 = (a * m) / b;
  const c2 = (c * m) / d;
  const total = resta ? a2 - c2 : a2 + c2;
  const pasos = [];
  const inicio = `${F1(a, b)}${op(signo)}${F2(c, d)}`;

  const barrasOriginales = apilar([
    [`${a}/${b}`, { partes: b, enteros: enterosPara(a, b), pintados: [{ desde: 0, cantidad: a, color: AZUL }] }],
    [`${c}/${d}`, { partes: d, enteros: enterosPara(c, d), pintados: [{ desde: 0, cantidad: c, color: LILA }] }],
  ]);
  pasos.push({
    expr: `${inicio} = ?`,
    svg: barrasOriginales,
    texto: b === d
      ? `Las dos fracciones tienen el mismo denominador (${b}): los pedazos son <b>del mismo tamaño</b>. Así se pueden ${resta ? 'restar' : 'sumar'} directo.`
      : `Para ${resta ? 'restar' : 'sumar'}, los pedazos tienen que ser <b>del mismo tamaño</b>. Mirá las barras: ¿son iguales los pedazos de ${a}/${b} y los de ${c}/${d}?`,
  });

  let exprComun = inicio;
  if (b !== d) {
    exprComun = `${F1(a2, m)}${op(signo)}${F2(c2, m)}`;
    pasos.push({
      expr: `${inicio} = ${exprComun}`,
      svg: apilar([
        [`${a}/${b} = ${a2}/${m}`, { partes: m, enteros: enterosPara(a2, m), cortesNuevos: true, pintados: [{ desde: 0, cantidad: a2, color: AZUL }] }],
        [`${c}/${d} = ${c2}/${m}`, { partes: m, enteros: enterosPara(c2, m), cortesNuevos: true, pintados: [{ desde: 0, cantidad: c2, color: LILA }] }],
      ]),
      texto: `<b>Recortamos</b> las dos barras en <b>${m}</b> pedazos (${m} es el mínimo común múltiplo de ${b} y ${d}). `
        + `Cada pedazo de ${a}/${b} se parte en ${m / b}, y cada uno de ${c}/${d} en ${m / d}. `
        + `Por eso ${a}/${b} = ${a2}/${m} (arriba y abajo por ${m / b}) y ${c}/${d} = ${c2}/${m} (por ${m / d}).`,
    });
  }

  // juntar o sacar
  let pintados;
  let texto;
  if (!resta) {
    pintados = [{ desde: 0, cantidad: a2, color: AZUL }, { desde: a2, cantidad: c2, color: LILA, nuevo: true }];
    texto = `Ahora sí: <b>se suman los numeradores</b>, ${a2} + ${c2} = ${total}. El denominador queda <b>${m}</b>, porque el tamaño del pedazo no cambia.`;
  } else if (total >= 0) {
    pintados = [{ desde: 0, cantidad: total, color: AZUL }, { desde: total, cantidad: c2, color: LILA, rayado: true, nuevo: true }];
    texto = `Ahora sí: a los ${a2} pedazos les <b>sacamos ${c2}</b> (los tachados). Quedan ${a2} − ${c2} = <b>${total}</b>. El denominador sigue siendo ${m}.`;
  } else {
    pintados = [{ desde: 0, cantidad: a2, color: AZUL, rayado: true }, { desde: a2, cantidad: -total, color: 'var(--c-negativo)', nuevo: true }];
    texto = `Queremos sacar ${c2} pedazos pero hay solo ${a2}: <b>faltan ${-total}</b>. El resultado es <b>negativo</b>: ${a2} − ${c2} = ${num(total)}.`;
  }
  // al simplificar, en la resta se muestra solo lo que quedó
  const soloResultado = [{ desde: 0, cantidad: Math.abs(total), color: total < 0 ? 'var(--c-negativo)' : AZUL }];
  const svgResultado = (grupo) => apilar([
    [resta ? 'resultado' : 'juntamos todo', {
      partes: m,
      enteros: grupo > 1 ? enterosPara(Math.abs(total), m) : enterosPara(resta ? Math.max(a2, c2) : total, m),
      pintados: grupo > 1 && resta ? soloResultado : pintados.map((p) => ({ ...p, nuevo: grupo ? false : p.nuevo })),
      grupo,
      cortesFinos: grupo > 1,
    }],
  ]);
  const exprResultado = `${inicio} = ${exprComun === inicio ? '' : `${exprComun} = `}${FR(total, m)}`;
  pasos.push({ expr: exprResultado, svg: svgResultado(0), texto });
  pasos.push(pasoSimplificar(total, m, exprResultado, svgResultado));
  return pasos;
}

function pasosMultiplicacion(a, b, c, d) {
  const inicio = `${F1(a, b)}${op('·')}${F2(c, d)}`;
  const n = a * c;
  const den = b * d;
  const exprResultado = `${inicio} = ${FR(n, den)}`;
  const pasos = [];
  const propias = a <= b && c <= d;

  if (!propias) {
    pasos.push({ expr: `${inicio} = ?`, svg: null, texto: 'Para multiplicar fracciones: <b>numerador por numerador</b> y <b>denominador por denominador</b>. (El dibujo del cuadrado sirve para fracciones menores que 1: probá con numeradores más chicos.)' });
    pasos.push({ expr: exprResultado, svg: null, texto: `${a} · ${c} = ${n} arriba y ${b} · ${d} = ${den} abajo.` });
    pasos.push(pasoSimplificar(n, den, exprResultado, null));
    return pasos;
  }

  const L = 200;
  const x0 = (ANCHO + 20 - L) / 2;
  const y0 = 8;
  const cuadrado = ({ columnas = 0, filas = 0, cruce = false, nuevoCol = false, nuevoFil = false }) => {
    let s = '';
    const w = L / b;
    const h = L / d;
    if (columnas) s += `<rect class="pedazo${nuevoCol ? ' nuevo' : ''}" x="${x0}" y="${y0}" width="${w * a}" height="${L}" fill="${AZUL}" fill-opacity=".35"/>`;
    if (filas) s += `<rect class="pedazo${nuevoFil ? ' nuevo' : ''}" x="${x0}" y="${y0 + L - h * c}" width="${L}" height="${h * c}" fill="${LILA}" fill-opacity=".35"/>`;
    if (cruce) s += `<rect class="pedazo nuevo" x="${x0}" y="${y0 + L - h * c}" width="${w * a}" height="${h * c}" fill="${AMARILLO}" fill-opacity=".85"/>`;
    if (columnas) for (let k = 1; k < b; k++) s += `<line class="corte${nuevoCol ? ' nuevo' : ''}" x1="${x0 + k * w}" y1="${y0}" x2="${x0 + k * w}" y2="${y0 + L}" stroke="var(--texto)" stroke-opacity=".8" stroke-width="1.5"/>`;
    if (filas) for (let k = 1; k < d; k++) s += `<line class="corte${nuevoFil ? ' nuevo' : ''}" x1="${x0}" y1="${y0 + k * h}" x2="${x0 + L}" y2="${y0 + k * h}" stroke="var(--texto)" stroke-opacity=".8" stroke-width="1.5"/>`;
    s += `<rect x="${x0}" y="${y0}" width="${L}" height="${L}" fill="none" stroke="var(--texto)" stroke-width="2"/>`;
    return `<svg viewBox="0 0 ${ANCHO + 20} ${L + 16}" role="img" aria-label="Cuadrado que representa un entero">${s}</svg>`;
  };

  pasos.push({
    expr: `${inicio} = ?`,
    svg: cuadrado({}),
    texto: `Multiplicar fracciones es buscar <b>"la parte de una parte"</b>: ${c}/${d} de ${a}/${b}. El cuadrado es <b>1 entero</b>.`,
  });
  pasos.push({
    expr: `${inicio} = ?`,
    svg: cuadrado({ columnas: true, nuevoCol: true }),
    texto: `Cortamos en <b>${b}</b> columnas y pintamos <b>${a}</b>: eso es ${a}/${b}.`,
  });
  pasos.push({
    expr: `${inicio} = ?`,
    svg: cuadrado({ columnas: true, filas: true, nuevoFil: true }),
    texto: `Ahora cortamos en <b>${d}</b> filas y pintamos <b>${c}</b>: tomamos ${c}/${d} de lo anterior.`,
  });
  pasos.push({
    expr: exprResultado,
    svg: cuadrado({ columnas: true, filas: true, cruce: true }),
    texto: `Donde se cruzan quedan <b>${n}</b> rectangulitos (${a} · ${c}), y el cuadrado tiene <b>${den}</b> en total (${b} · ${d}). `
      + 'Por eso: <b>numerador por numerador</b> y <b>denominador por denominador</b>.',
  });
  pasos.push(pasoSimplificar(n, den, exprResultado, null));
  // el último paso mantiene el dibujo
  pasos[pasos.length - 1].svg = cuadrado({ columnas: true, filas: true, cruce: true });
  return pasos;
}

function pasosDivision(a, b, c, d) {
  const carta = (volteada) => `<span class="op-frac op-cambia${volteada ? ' cambiada' : ''}"><span class="op-viejo">:</span><span class="op-nuevo">·</span></span>`
    + `<span class="carta-frac${volteada ? ' volteada' : ''}"><span class="cara frente">${F2(c, d)}</span><span class="cara dorso">${F2(d, c)}</span></span>`;
  const inicio = `${F1(a, b)} ${carta(false)}`;
  const n = a * d;
  const den = b * c;
  const exprMult = `${F1(a, b)}${op('·')}${F2(d, c)}`;
  const exprResultado = `${F1(a, b)}${op(':')}${F2(c, d)} = ${exprMult} = ${FR(n, den)}`;
  return [
    {
      expr: `${inicio} = ?`,
      svg: null,
      texto: `Para dividir fracciones hay un truco. Tocá <b>Siguiente paso</b> y mirá la segunda fracción…`,
    },
    {
      expr: `${F1(a, b)} ${carta(false)}`,
      voltear: true,
      svg: null,
      texto: `<b>¡Se da vuelta!</b> ${c}/${d} pasa a ser ${d}/${c} (su <b>inversa</b>), y la división se convierte en <b>multiplicación</b>. `
        + `¿Por qué? Porque ${c}/${d} es ${c} : ${d}. Dividir por eso es <b>dividir por ${c}</b> y <b>multiplicar por ${d}</b>: justo lo que hace ${d}/${c}.`,
    },
    {
      expr: exprResultado,
      svg: null,
      texto: `Ahora es una multiplicación: ${a} · ${d} = ${n} arriba y ${b} · ${c} = ${den} abajo.`,
    },
    pasoSimplificar(n, den, exprResultado, null),
  ];
}

// --------------------------------------------------------------------------
// El interactivo
// --------------------------------------------------------------------------

export function iniciarFraccionesOperaciones(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { modo: '+', a: 1, b: 2, c: 1, d: 3, paso: 0 };
  let pasos = [];

  const expresionEl = $('[data-expresion]');
  const dibujoEl = $('[data-dibujo]');
  const textoEl = $('[data-texto]');
  const botonSiguiente = $('[data-siguiente]');
  const botonTodo = $('[data-todo]');

  function calcular() {
    const { modo, a, b, c, d } = estado;
    if (modo === '+') pasos = pasosSumaResta(a, b, c, d, false);
    else if (modo === '−') pasos = pasosSumaResta(a, b, c, d, true);
    else if (modo === '·') pasos = pasosMultiplicacion(a, b, c, d);
    else pasos = pasosDivision(a, b, c, d);
    estado.paso = Math.min(estado.paso, pasos.length - 1);
  }

  function dibujar() {
    const p = pasos[estado.paso];
    expresionEl.innerHTML = p.expr;
    dibujoEl.innerHTML = p.svg ?? '';
    dibujoEl.hidden = !p.svg;
    textoEl.innerHTML = p.texto;
    const ultimo = estado.paso >= pasos.length - 1;
    botonSiguiente.disabled = ultimo;
    botonTodo.disabled = ultimo;
    textoEl.classList.toggle('final', ultimo);
    // la carta se da vuelta un instante después de aparecer (para que se vea el giro)
    if (p.voltear) {
      // se fuerza a que el navegador dibuje la carta derecha antes de darla vuelta (si no, no se ve el giro)
      const carta = expresionEl.querySelector('.carta-frac');
      void carta?.offsetWidth;
      carta?.classList.add('volteada');
      expresionEl.querySelector('.op-cambia')?.classList.add('cambiada');
    }
  }

  const reiniciar = () => { estado.paso = 0; calcular(); dibujar(); };

  for (const nombre of ['a', 'b', 'c', 'd']) {
    conectarDeslizador($(`.deslizador[data-param="${nombre}"]`), (v) => { estado[nombre] = v; reiniciar(); });
  }
  const botonesModo = [...raiz.querySelectorAll('[data-modo]')];
  for (const boton of botonesModo) {
    boton.addEventListener('click', () => {
      estado.modo = boton.dataset.modo;
      for (const b of botonesModo) b.setAttribute('aria-checked', String(b === boton));
      reiniciar();
    });
  }
  botonSiguiente.addEventListener('click', () => { estado.paso++; dibujar(); });
  botonTodo.addEventListener('click', () => { estado.paso = pasos.length - 1; dibujar(); });
  $('[data-reiniciar]').addEventListener('click', reiniciar);

  reiniciar();
}
