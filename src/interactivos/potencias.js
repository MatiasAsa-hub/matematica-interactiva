// ==========================================================================
// INTERACTIVO: potencias y raíces.
// Tres modos:
//   - Qué es: aⁿ como multiplicación repetida (fichas), con el cuadrado (n = 2)
//     y el cubo (n = 3) dibujados. Signo con base negativa, y la trampa −aⁿ.
//   - Propiedades: con fichas "a" que se juntan (producto), se tachan (cociente)
//     o se agrupan (potencia de potencia). Así aparecen a⁰ = 1 y los exponentes negativos.
//   - Raíces: la raíz cuadrada como el lado de un cuadrado de área dada.
// El HTML está en src/components/interactivos/Potencias.astro.
// ==========================================================================

import { conectarDeslizador } from '../lib/grafico/controles.js';
import { num, igual } from '../lib/numeros.js';

const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '−': '⁻' };
const sup = (n) => String(n).replace('-', '−').split('').map((c) => SUP[c] ?? c).join('');
const par = (a) => (a < 0 ? `(${num(a)})` : num(a));

/** Fichas (una por factor), que aparecen de a una. */
function fichas(cantidad, texto, clase = '', desde = 0) {
  let s = '';
  for (let i = 0; i < cantidad; i++) {
    s += `<span class="ficha ${clase}" style="--i:${desde + i}">${texto}</span>`;
  }
  return s;
}

function cuadradoSvg(a) {
  const L = 180;
  const u = L / a;
  let s = `<rect x="10" y="10" width="${L}" height="${L}" fill="var(--c-funcion)" fill-opacity=".25" stroke="var(--texto)" stroke-width="2"/>`;
  for (let k = 1; k < a; k++) {
    s += `<line x1="${10 + k * u}" y1="10" x2="${10 + k * u}" y2="${10 + L}" stroke="var(--texto)" stroke-opacity=".5"/>`;
    s += `<line x1="10" y1="${10 + k * u}" x2="${10 + L}" y2="${10 + k * u}" stroke="var(--texto)" stroke-opacity=".5"/>`;
  }
  s += `<text x="${10 + L / 2}" y="${L + 30}" text-anchor="middle" class="svg-numero">${a}</text>`;
  s += `<text x="${L + 18}" y="${10 + L / 2}" class="svg-numero">${a}</text>`;
  return `<svg viewBox="0 0 ${L + 40} ${L + 40}" class="dibujo-potencia" role="img" aria-label="Cuadrado de ${a} por ${a}">${s}</svg>`;
}

function cuboSvg(a) {
  const S = 110;
  const u = S / a;
  const ox = S * 0.866 + 10;
  const oy = S + 10;
  const p = (x, y, z) => `${(ox + (x - y) * u * 0.866).toFixed(1)},${(oy + (x + y) * u * 0.5 - z * u).toFixed(1)}`;
  const cara = (puntos, opac) => `<polygon points="${puntos.join(' ')}" fill="var(--c-funcion)" fill-opacity="${opac}" stroke="var(--texto)" stroke-width="2" stroke-linejoin="round"/>`;
  const linea = (a1, a2) => `<line x1="${a1.split(',')[0]}" y1="${a1.split(',')[1]}" x2="${a2.split(',')[0]}" y2="${a2.split(',')[1]}" stroke="var(--texto)" stroke-opacity=".45"/>`;
  let s = '';
  s += cara([p(0, 0, a), p(a, 0, a), p(a, a, a), p(0, a, a)], 0.35); // arriba
  s += cara([p(a, 0, 0), p(a, a, 0), p(a, a, a), p(a, 0, a)], 0.22); // derecha
  s += cara([p(0, a, 0), p(a, a, 0), p(a, a, a), p(0, a, a)], 0.12); // izquierda
  for (let k = 1; k < a; k++) {
    s += linea(p(k, 0, a), p(k, a, a)) + linea(p(0, k, a), p(a, k, a));
    s += linea(p(a, k, 0), p(a, k, a)) + linea(p(a, 0, k), p(a, a, k));
    s += linea(p(k, a, 0), p(k, a, a)) + linea(p(0, a, k), p(a, a, k));
  }
  return `<svg viewBox="0 0 ${2 * ox} ${2 * S + 24}" class="dibujo-potencia" role="img" aria-label="Cubo de ${a} por ${a} por ${a}">${s}</svg>`;
}

export function iniciarPotencias(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { modo: 'que', a: 2, n: 3, prop: 'producto', m: 3, k: 2, area: 49, trampa: false };
  const expresionEl = $('[data-expresion]');
  const dibujoEl = $('[data-dibujo]');
  const textoEl = $('[data-texto]');

  // ---------------------------------------------------------------- modo "qué es"
  function dibujarQue() {
    const { a, n, trampa } = estado;
    const factores = n === 0 ? '' : Array(n).fill(par(a)).join(' · ');
    let expr;
    let texto;
    if (a === 0 && n === 0) {
      expr = `0${sup(0)} = ?`;
      texto = '<b>0⁰ no está definido.</b> Por un lado, cualquier número a la 0 da 1; por el otro, 0 elevado a cualquier cosa da 0. No se puede elegir.';
    } else if (n === 0) {
      expr = `${par(a)}${sup(0)} = <b class="resultado">1</b>`;
      texto = `Cualquier número (menos el 0) elevado a la <b>0</b> da <b>1</b>. ¿Por qué? Mirá el modo <b>Propiedades</b>, en "dividir": cuando se tachan todas las fichas, queda 1.`;
    } else {
      const valor = a ** n;
      expr = `${par(a)}${sup(n)} = ${n > 1 ? `${factores} = ` : ''}<b class="resultado">${num(valor)}</b>`;
      texto = `La <b>base</b> es ${num(a)} y el <b>exponente</b> es ${n}: se multiplica el ${num(a)} por sí mismo <b>${n} ${n === 1 ? 'vez' : 'veces'}</b>.`;
      if (a < 0) {
        texto += ` Con base negativa, cuenta la cantidad de signos menos: ${n} es <b>${n % 2 === 0 ? 'par' : 'impar'}</b>, así que da <b>${n % 2 === 0 ? 'positivo' : 'negativo'}</b>.`;
      }
    }
    if (trampa && a < 0 && n > 0) {
      texto += `<br><span class="cartel-aviso" style="display:block;margin-top:.5rem"><b>Ojo con los paréntesis:</b> −${num(-a)}${sup(n)} (sin paréntesis) es −(${Array(n).fill(num(-a)).join(' · ')}) = <b>${num(-((-a) ** n))}</b>, porque la potencia se hace antes que el signo. En cambio ${par(a)}${sup(n)} = <b>${num(a ** n)}</b>.</span>`;
    }
    expresionEl.innerHTML = expr;

    let dibujo = `<div class="fichas">${fichas(n, par(a))}</div>`;
    if (n === 2 && a > 0) dibujo += cuadradoSvg(a) + `<p class="texto-suave chico centrado">${num(a)}² es el área de un cuadrado de lado ${num(a)}: ${num(a * a)} cuadraditos. Por eso se lee "al cuadrado".</p>`;
    if (n === 3 && a > 0 && a <= 8) dibujo += cuboSvg(a) + `<p class="texto-suave chico centrado">${num(a)}³ son los cubitos de un cubo de lado ${num(a)}: ${num(a ** 3)}. Por eso se lee "al cubo".</p>`;
    dibujoEl.innerHTML = dibujo;
    textoEl.innerHTML = texto;
    $('[data-casilla="trampa"]').hidden = a >= 0;
  }

  // ---------------------------------------------------------------- modo "propiedades"
  function dibujarPropiedades() {
    const { prop, m, k } = estado;
    const A = '<i>a</i>';
    let expr;
    let dibujo;
    let texto;
    if (prop === 'producto') {
      expr = `${A}${sup(m)} · ${A}${sup(k)} = ${A}<sup>${m} + ${k}</sup> = <b class="resultado">${A}${sup(m + k)}</b>`;
      dibujo = `<div class="fichas">${fichas(m, A, 'f-azul')}${m && k ? '<span class="ficha-op">·</span>' : ''}${fichas(k, A, 'f-lila', m)}</div>`;
      texto = `${m} fichas por un lado y ${k} por el otro: en total son <b>${m + k}</b> fichas multiplicadas. Por eso, <b>con la misma base, los exponentes se suman</b>.`;
    } else if (prop === 'cociente') {
      const quedan = m - k;
      const tachadas = Math.min(m, k);
      const arriba = fichas(tachadas, A, 'f-azul tachada') + fichas(Math.max(0, quedan), A, 'f-azul', tachadas);
      const abajo = fichas(tachadas, A, 'f-lila tachada') + fichas(Math.max(0, -quedan), A, 'f-lila', tachadas);
      dibujo = `<div class="fichas-fraccion"><div class="fichas">${arriba || '<span class="ficha-uno">1</span>'}</div><div class="fichas-raya"></div><div class="fichas">${abajo || '<span class="ficha-uno">1</span>'}</div></div>`;
      let resultado;
      if (quedan > 0) {
        resultado = `${A}${sup(quedan)}`;
        texto = `Cada <i>a</i> de abajo se tacha con una de arriba (${A} : ${A} = 1). Quedan <b>${quedan}</b> arriba: <b>los exponentes se restan</b>.`;
      } else if (quedan === 0) {
        resultado = `${A}${sup(0)} = 1`;
        texto = `¡Se tachan <b>todas</b>! Queda 1. Por eso <b><i>a</i>⁰ = 1</b>: es lo que da dividir un número por sí mismo.`;
      } else {
        resultado = `${A}${sup(quedan)} = <span class="frac"><span class="frac-num">1</span><span class="frac-den">${A}${sup(-quedan)}</span></span>`;
        texto = `Ahora sobran <b>${-quedan}</b> abajo: queda 1/<i>a</i>${sup(-quedan)}. Restando exponentes da ${m} − ${k} = ${num(quedan)}. Por eso un <b>exponente negativo</b> quiere decir "uno sobre": <b><i>a</i>${sup(quedan)} = 1/<i>a</i>${sup(-quedan)}</b>.`;
      }
      expr = `${A}${sup(m)} : ${A}${sup(k)} = ${A}<sup>${m} − ${k}</sup> = <b class="resultado">${resultado}</b>`;
    } else {
      let grupos = '';
      for (let g = 0; g < k; g++) grupos += `<span class="grupo-fichas">${fichas(m, A, g % 2 ? 'f-lila' : 'f-azul', g * m)}</span>`;
      dibujo = `<div class="fichas">${grupos || '<span class="ficha-uno">1</span>'}</div>`;
      expr = `(${A}${sup(m)})${sup(k)} = ${A}<sup>${m} · ${k}</sup> = <b class="resultado">${A}${sup(m * k)}</b>`;
      texto = `Son <b>${k}</b> ${k === 1 ? 'grupo' : 'grupos'} de <b>${m}</b> fichas: ${m} · ${k} = ${m * k} en total. <b>Potencia de potencia: los exponentes se multiplican</b>.`;
    }
    expresionEl.innerHTML = expr;
    dibujoEl.innerHTML = dibujo;
    textoEl.innerHTML = texto;
  }

  // ---------------------------------------------------------------- modo "raíces"
  function dibujarRaices() {
    const { area } = estado;
    const lado = Math.sqrt(area);
    const exacta = Number.isInteger(lado);
    expresionEl.innerHTML = `√${num(area)} ${exacta ? '=' : '≈'} <b class="resultado">${num(lado)}</b>`;
    // cuadrado de área "area" dibujado sobre una cuadrícula de 10 x 10
    const L = 200;
    const u = L / 10;
    let s = '';
    for (let kk = 0; kk <= 10; kk++) {
      s += `<line x1="${10 + kk * u}" y1="10" x2="${10 + kk * u}" y2="${10 + L}" stroke="var(--texto)" stroke-opacity=".12"/>`;
      s += `<line x1="10" y1="${10 + kk * u}" x2="${10 + L}" y2="${10 + kk * u}" stroke="var(--texto)" stroke-opacity=".12"/>`;
    }
    const w = lado * u;
    s += `<rect class="cuadrado-raiz" x="10" y="${10 + L - w}" width="${w}" height="${w}" fill="var(--c-funcion)" fill-opacity=".3" stroke="var(--c-funcion)" stroke-width="2.5"/>`;
    s += `<text x="${10 + w / 2}" y="${L + 30}" text-anchor="middle" class="svg-numero">lado ${exacta ? '' : '≈ '}${num(lado)}</text>`;
    dibujoEl.innerHTML = `<svg viewBox="0 0 ${L + 20} ${L + 40}" class="dibujo-potencia" role="img" aria-label="Cuadrado de área ${area}">${s}</svg>`;
    const abajo = Math.floor(lado);
    textoEl.innerHTML = exacta
      ? `La raíz cuadrada es la operación <b>inversa</b> de elevar al cuadrado: √${num(area)} = ${num(lado)} porque <b>${num(lado)}² = ${num(area)}</b>. Es el lado de un cuadrado de área ${num(area)}.`
      : `No da justo: ${abajo}² = ${abajo * abajo} y ${abajo + 1}² = ${(abajo + 1) ** 2}, así que √${num(area)} está entre ${abajo} y ${abajo + 1}: ${igual(lado)}.`;
  }

  function dibujar() {
    for (const g of raiz.querySelectorAll('[data-grupo]')) g.hidden = !g.dataset.grupo.split(' ').includes(estado.modo);
    if (estado.modo === 'que') dibujarQue();
    else if (estado.modo === 'prop') dibujarPropiedades();
    else dibujarRaices();
  }

  // ---------------------------------------------------------------- controles
  conectarDeslizador($('.deslizador[data-param="a"]'), (v) => { estado.a = v; dibujar(); });
  conectarDeslizador($('.deslizador[data-param="n"]'), (v) => { estado.n = v; dibujar(); });
  conectarDeslizador($('.deslizador[data-param="m"]'), (v) => { estado.m = v; dibujar(); });
  conectarDeslizador($('.deslizador[data-param="k"]'), (v) => { estado.k = v; dibujar(); });
  conectarDeslizador($('.deslizador[data-param="area"]'), (v) => { estado.area = v; dibujar(); });

  const grupoBotones = (selector, clave) => {
    const botones = [...raiz.querySelectorAll(selector)];
    for (const b of botones) {
      b.addEventListener('click', () => {
        estado[clave] = b.dataset.valor;
        for (const o of botones) o.setAttribute('aria-checked', String(o === b));
        dibujar();
      });
    }
  };
  grupoBotones('[data-modo]', 'modo');
  grupoBotones('[data-prop]', 'prop');

  const casillaTrampa = $('[data-casilla="trampa"]');
  casillaTrampa.addEventListener('click', () => {
    estado.trampa = !estado.trampa;
    casillaTrampa.setAttribute('aria-pressed', String(estado.trampa));
    dibujar();
  });

  dibujar();
}
