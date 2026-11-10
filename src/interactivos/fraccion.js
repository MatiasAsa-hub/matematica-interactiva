// ==========================================================================
// INTERACTIVO: qué es una fracción.
// a/b: cada entero se corta en b pedazos iguales y se pintan a pedazos.
// Además: dónde cae en la recta y que a/b ES la división a : b.
// El HTML está en src/components/interactivos/Fraccion.astro.
// ==========================================================================

import { conectarDeslizador } from '../lib/grafico/controles.js';
import { mcd, fracHtml, barrasSvg } from '../lib/fracciones.js';
import { num, igual } from '../lib/numeros.js';

const ANCHO = 320;

export function iniciarFraccion(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { a: 3, b: 4, simplificar: false };
  const dibujoEl = $('[data-dibujo]');
  const expresionEl = $('[data-expresion]');
  const textoEl = $('[data-texto]');
  const azul = 'var(--c-funcion)';

  function dibujar() {
    const { a, b, simplificar } = estado;
    const enteros = Math.max(1, Math.ceil(a / b));
    const g = mcd(a, b);
    const altoBarra = 40;
    const sep = 12;
    let svg = barrasSvg({
      x: 10, y: 10, ancho: ANCHO, alto: altoBarra, separacion: sep,
      partes: b, enteros,
      pintados: [{ desde: 0, cantidad: a, color: azul }],
      cortesFinos: simplificar && g > 1,
      grupo: simplificar && g > 1 ? g : 0,
    });

    // recta numérica debajo
    const yRecta = 10 + enteros * (altoBarra + sep) + 22;
    const maximo = enteros;
    const px = (v) => 10 + (v / maximo) * ANCHO;
    svg += `<line x1="0" y1="${yRecta}" x2="${ANCHO + 20}" y2="${yRecta}" stroke="var(--texto)" stroke-opacity=".7" stroke-width="2"/>`;
    for (let k = 0; k <= maximo * b; k++) {
      const entero = k % b === 0;
      svg += `<line x1="${px(k / b)}" y1="${yRecta - (entero ? 8 : 5)}" x2="${px(k / b)}" y2="${yRecta + (entero ? 8 : 5)}" stroke="var(--texto)" stroke-opacity="${entero ? 0.9 : 0.5}" stroke-width="${entero ? 2 : 1.2}"/>`;
      if (entero) svg += `<text x="${px(k / b)}" y="${yRecta + 26}" text-anchor="middle" class="svg-numero">${k / b}</text>`;
    }
    svg += `<circle cx="${px(a / b)}" cy="${yRecta}" r="7" fill="${azul}" stroke="var(--fondo-grafico)" stroke-width="2.5"/>`;
    // flecha desde el punto hasta el final de lo pintado en la última barra no hace falta: con la recta alcanza
    const alto = yRecta + 36;
    dibujoEl.innerHTML = `<svg viewBox="0 0 ${ANCHO + 20} ${alto}" role="img" aria-label="La fracción ${a}/${b} dibujada con barras y en la recta">${svg}</svg>`;

    // la fracción es una división
    const valor = a / b;
    let expr = `${fracHtml(a, b, { color: azul })} = ${num(a)} : ${num(b)} ${igual(valor)}`;
    if (simplificar && g > 1) expr = `${fracHtml(a, b, { color: azul })} = ${fracHtml(a / g, b / g, { color: azul })} = ${num(a)} : ${num(b)} ${igual(valor)}`;
    expresionEl.innerHTML = expr;

    const partes = [];
    partes.push(`Cada entero se corta en <b>${b}</b> ${b === 1 ? 'pedazo' : 'pedazos iguales'} (el <b>denominador</b>) y se pintan <b>${a}</b> (el <b>numerador</b>).`);
    partes.push(`Y como una fracción <b>es una división</b>: ${num(a)} : ${num(b)} ${igual(valor)}.`);
    if (a >= b && b > 1 && a % b !== 0) {
      const q = Math.floor(a / b);
      const r = a % b;
      partes.push(`Con la galera, ${a} : ${b} da cociente <b>${q}</b> y resto <b>${r}</b>: son <b>${q} ${q === 1 ? 'entero' : 'enteros'} y ${r}/${b}</b>.`);
    } else if (a % b === 0 && a > 0) {
      partes.push(`¡Da justo! Son <b>${a / b} ${a / b === 1 ? 'entero' : 'enteros'}</b>.`);
    }
    if (simplificar) {
      partes.push(g > 1
        ? `<b>Simplificar:</b> si juntás los pedazos de a ${g}, queda ${a / g}/${b / g}. Es la misma cantidad pintada, con pedazos más grandes (dividí arriba y abajo por ${g}).`
        : `<b>${a}/${b} no se puede simplificar:</b> no hay ningún número (además del 1) que divida a ${a} y a ${b}.`);
    }
    textoEl.innerHTML = partes.map((p) => `<p>${p}</p>`).join('');
  }

  conectarDeslizador($('.deslizador[data-param="a"]'), (v) => { estado.a = v; dibujar(); });
  conectarDeslizador($('.deslizador[data-param="b"]'), (v) => { estado.b = v; dibujar(); });
  const casilla = $('[data-casilla="simplificar"]');
  casilla.addEventListener('click', () => {
    estado.simplificar = !estado.simplificar;
    casilla.setAttribute('aria-pressed', String(estado.simplificar));
    dibujar();
  });
  dibujar();
}
