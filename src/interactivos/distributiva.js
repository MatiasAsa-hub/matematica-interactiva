// ==========================================================================
// INTERACTIVO: propiedad distributiva y factor común, con el modelo de área.
//
// Un rectángulo de alto a y ancho (b + c) se puede ver entero, a · (b + c),
// o separado en dos pedazos, a · b + a · c. Separar es DISTRIBUIR;
// juntar es SACAR FACTOR COMÚN. Es el mismo dibujo, en los dos sentidos.
// Modos: con números, con x, y con dos paréntesis (x + a)(x + b).
// El HTML está en src/components/interactivos/Distributiva.astro.
// ==========================================================================

import { conectarDeslizador } from '../lib/grafico/controles.js';
import { num } from '../lib/numeros.js';

const AZUL = 'var(--c-funcion)';
const LILA = 'var(--c-vertice)';
const AMARILLO = 'var(--c-raices)';
const LARGO_X = 4.6; // cuánto mide "x" en el dibujo (a propósito no es entero: es un número desconocido)
const SEP = 16;      // separación entre pedazos, en píxeles

const X = '<i>x</i>';
/** Término "coef·letra" escrito lindo: 1x → x, 2x → 2x. */
const termino = (coef, letra = X) => (coef === 1 ? letra : `${num(coef)}${letra}`);

/**
 * Arma el dibujo. columnas y filas: [{ largo, texto }]; color(i, j) y area(i, j) por pedazo.
 */
function rectanguloSvg(columnas, filas, color, areaHtml, separado) {
  // en SVG la cursiva va con <tspan>, no con <i>
  const svgTexto = (t) => String(t).replace(/<i>/g, '<tspan font-style="italic">').replace(/<\/i>/g, '</tspan>');
  const area = (i, j) => svgTexto(areaHtml(i, j));
  const anchoTotal = columnas.reduce((s, c) => s + c.largo, 0);
  const altoTotal = filas.reduce((s, f) => s + f.largo, 0);
  const u = Math.min(30, 270 / anchoTotal, 190 / altoTotal);
  const m = 34; // margen para las etiquetas de los lados
  const W = anchoTotal * u + (columnas.length - 1) * SEP + m + 10;
  const H = altoTotal * u + (filas.length - 1) * SEP + m + 10;
  let s = '';
  let y = 0;
  filas.forEach((f, j) => {
    let x = 0;
    columnas.forEach((c, i) => {
      const estilo = `--col:${i};--fila:${j}`;
      s += `<g class="pedazo-area" style="${estilo}">`
        + `<rect x="${m + x * u}" y="${m + y * u}" width="${c.largo * u}" height="${f.largo * u}" fill="${color(i, j)}" fill-opacity=".3" stroke="${color(i, j)}" stroke-width="2.5" rx="3"/>`
        + `<text x="${m + (x + c.largo / 2) * u}" y="${m + (y + f.largo / 2) * u + 6}" text-anchor="middle" class="svg-area">${area(i, j)}</text>`
        + '</g>';
      // etiqueta del ancho, arriba (solo en la primera fila)
      if (j === 0) s += `<g class="pedazo-area" style="${estilo}"><text x="${m + (x + c.largo / 2) * u}" y="${m - 10}" text-anchor="middle" class="svg-lado">${svgTexto(c.texto)}</text></g>`;
      x += c.largo;
    });
    // etiqueta del alto, a la izquierda
    s += `<g class="pedazo-area" style="--col:0;--fila:${j}"><text x="${m - 10}" y="${m + (y + f.largo / 2) * u + 6}" text-anchor="end" class="svg-lado">${svgTexto(f.texto)}</text></g>`;
    y += f.largo;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="dibujo-area${separado ? ' separado' : ''}" style="--sep:${separado ? 1 : 0}" role="img" aria-label="Rectángulo dividido en pedazos">${s}</svg>`;
}

export function iniciarDistributiva(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { modo: 'numeros', separado: false, a: 3, b: 4, c: 2, por: 'numero', k: 2, cx: 3, p: 2, q: 3 };
  const expresionEl = $('[data-expresion]');
  const dibujoEl = $('[data-dibujo]');
  const textoEl = $('[data-texto]');
  const botonCambiar = $('[data-cambiar]');

  function datos() {
    const { modo } = estado;
    if (modo === 'numeros') {
      const { a, b, c } = estado;
      return {
        columnas: [{ largo: b, texto: num(b) }, { largo: c, texto: num(c) }],
        filas: [{ largo: a, texto: num(a) }],
        color: (i) => (i === 0 ? AZUL : LILA),
        area: (i) => num(a * (i === 0 ? b : c)),
        junto: `${num(a)} · (${num(b)} + ${num(c)})`,
        separado: `${num(a)} · ${num(b)} + ${num(a)} · ${num(c)}`,
        final: `${num(a * b)} + ${num(a * c)} = <b class="resultado">${num(a * (b + c))}</b>`,
        texto: `El rectángulo mide ${num(a)} de alto y ${num(b)} + ${num(c)} de ancho. Su área se puede calcular <b>de una</b>, ${num(a)} · ${num(b + c)} = ${num(a * (b + c))}, `
          + `o <b>por pedazos</b>, ${num(a)} · ${num(b)} + ${num(a)} · ${num(c)} = ${num(a * b)} + ${num(a * c)} = ${num(a * (b + c))}. ¡Da lo mismo! Eso es la <b>distributiva</b>: el ${num(a)} multiplica a <b>cada</b> término del paréntesis.`,
      };
    }
    if (modo === 'x') {
      const { por, k, cx } = estado;
      const alto = por === 'x' ? { largo: LARGO_X, texto: X } : { largo: k, texto: num(k) };
      const factor = por === 'x' ? X : num(k);
      const t1 = por === 'x' ? `${X}²` : termino(k);
      const t2 = por === 'x' ? termino(cx) : num(k * cx);
      return {
        columnas: [{ largo: LARGO_X, texto: X }, { largo: cx, texto: num(cx) }],
        filas: [alto],
        color: (i) => (i === 0 ? AZUL : LILA),
        area: (i) => (i === 0 ? t1 : t2),
        junto: `${factor} · (${X} + ${num(cx)})`,
        separado: `${factor} · ${X} + ${factor} · ${num(cx)}`,
        final: `<b class="resultado">${t1} + ${t2}</b>`,
        texto: `Igual que con números: ${factor} multiplica a la ${X} <b>y también</b> al ${num(cx)}. `
          + `Queda ${t1} + ${t2}. ${por === 'x' ? `Fijate que ${X} · ${X} = ${X}² (el cuadrado de lado ${X}).` : ''} `
          + `Al revés, en ${t1} + ${t2} los dos pedazos tienen el mismo alto, <b>${factor}</b>: ese es el <b>factor común</b>.`,
      };
    }
    // dos paréntesis: (x + p)(x + q)
    const { p, q } = estado;
    const colores = [[AZUL, LILA], [LILA, AMARILLO]];
    const areas = [[`${X}²`, termino(q)], [termino(p), num(p * q)]];
    const cuadrado = p === q;
    return {
      columnas: [{ largo: LARGO_X, texto: X }, { largo: q, texto: num(q) }],
      filas: [{ largo: LARGO_X, texto: X }, { largo: p, texto: num(p) }],
      color: (i, j) => colores[j][i],
      area: (i, j) => areas[j][i],
      junto: `(${X} + ${num(p)}) · (${X} + ${num(q)})`,
      separado: `${X}² + ${termino(q)} + ${termino(p)} + ${num(p * q)}`,
      final: `<b class="resultado">${X}² + ${termino(p + q)} + ${num(p * q)}</b>`,
      texto: `Son <b>4 pedazos</b>: cada término del primer paréntesis multiplica a cada uno del segundo. Los dos pedazos lilas son "de ${X}" y se juntan: ${termino(q)} + ${termino(p)} = ${termino(p + q)}.`
        + (cuadrado ? ` <span class="cartel-aviso" style="display:block;margin-top:.5rem"><b>Ojo:</b> (${X} + ${num(p)})² <b>no</b> es ${X}² + ${num(p * p)}. ¡Faltan los dos pedazos del medio! Es ${X}² + ${termino(2 * p)} + ${num(p * p)}.</span>` : ''),
    };
  }

  function dibujar() {
    for (const g of raiz.querySelectorAll('[data-grupo]')) g.hidden = !g.dataset.grupo.split(' ').includes(estado.modo);
    $('[data-grupo-k]').hidden = !(estado.modo === 'x' && estado.por === 'numero');
    const d = datos();
    const svg = rectanguloSvg(d.columnas, d.filas, d.color, d.area, estado.separado);
    dibujoEl.innerHTML = svg;
    expresionEl.innerHTML = estado.separado
      ? `<span class="tenue">${d.junto} =</span> <span class="activa">${d.separado}</span> = ${d.final}`
      : `<span class="activa">${d.junto}</span> = <span class="tenue">${d.separado}</span> = ${d.final}`;
    textoEl.innerHTML = d.texto;
    botonCambiar.innerHTML = estado.separado
      ? 'Juntar <span class="texto-suave">(sacar factor común)</span>'
      : 'Separar <span class="texto-suave">(distribuir)</span>';
    if (estado.modo === 'dos') botonCambiar.innerHTML = estado.separado ? 'Juntar' : 'Separar en pedazos';
  }

  // separar / juntar: solo cambia la clase, así el dibujo se anima
  botonCambiar.addEventListener('click', () => {
    estado.separado = !estado.separado;
    const svg = dibujoEl.querySelector('svg');
    svg.classList.toggle('separado', estado.separado);
    svg.style.setProperty('--sep', estado.separado ? '1' : '0');
    const d = datos();
    expresionEl.innerHTML = estado.separado
      ? `<span class="tenue">${d.junto} =</span> <span class="activa">${d.separado}</span> = ${d.final}`
      : `<span class="activa">${d.junto}</span> = <span class="tenue">${d.separado}</span> = ${d.final}`;
    botonCambiar.innerHTML = estado.modo === 'dos'
      ? (estado.separado ? 'Juntar' : 'Separar en pedazos')
      : (estado.separado ? 'Juntar <span class="texto-suave">(sacar factor común)</span>' : 'Separar <span class="texto-suave">(distribuir)</span>');
  });

  for (const n of ['a', 'b', 'c', 'k', 'cx', 'p', 'q']) {
    conectarDeslizador($(`.deslizador[data-param="${n}"]`), (v) => { estado[n] = v; dibujar(); });
  }
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
  grupoBotones('[data-por]', 'por');
  dibujar();
}
