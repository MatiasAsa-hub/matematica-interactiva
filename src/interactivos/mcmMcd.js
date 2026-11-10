// ==========================================================================
// INTERACTIVO: múltiplos y divisores (mcm y mcd).
//   - mcm: desde el 0 se salta de a "a" (arriba) y de a "b" (abajo).
//     El primer lugar donde caen los dos es el mínimo común múltiplo.
//   - mcd: las listas de divisores de los dos números; el más grande que
//     está en las dos es el máximo común divisor.
// El HTML está en src/components/interactivos/McmMcd.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { dibujarSaltos } from '../lib/grafico/saltos.js';
import { mcd, mcm } from '../lib/fracciones.js';

const divisores = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

export function iniciarMcmMcd(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { modo: 'mcm', a: 4, b: 6, p: 12, q: 18 };
  let progreso = 1; // 0 → 1 (animación de los saltos)
  let anim = null;

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -1, xMax: 14 },
    soloEjeX: true,
    alturaEje: 0.5,
    separacionNumeros: 36,
    descripcion: 'Recta numérica con saltos',
  });
  const col = plano.colores;
  const AZUL = col.funcion;
  const LILA = col.vertice;

  plano.agregarCapa((p) => {
    const { a, b } = estado;
    const m = mcm(a, b);
    dibujarSaltos(p, { paso: a, cantidad: m / a, visibles: (m / a) * progreso, color: AZUL });
    dibujarSaltos(p, { paso: b, cantidad: m / b, visibles: (m / b) * progreso, color: LILA, debajo: true });
    for (let k = a; k <= m; k += a) p.punto(k, 0, { color: AZUL, radio: 4, alfa: progreso >= k / m ? 1 : 0 });
    for (let k = b; k <= m; k += b) p.punto(k, 0, { color: LILA, radio: 4, alfa: progreso >= k / m ? 1 : 0 });
    p.punto(0, 0, { color: col.texto, radio: 6 });
    p.etiqueta(`de a ${a}`, a / 2, 0, { color: AZUL, dx: 0, dy: -60, alinear: 'center', tamano: 14 });
    p.etiqueta(`de a ${b}`, b / 2, 0, { color: LILA, dx: 0, dy: 62, alinear: 'center', tamano: 14 });
    if (progreso >= 1) {
      p.punto(m, 0, { color: col.raices, radio: 9 });
      p.etiqueta(`¡los dos caen en ${m}!`, m, 0, { color: col.raices, dx: 0, dy: -62, alinear: 'center', tamano: 15 });
    }
  });

  const expresionEl = $('[data-expresion]');
  const listasEl = $('[data-listas]');
  const textoEl = $('[data-texto]');

  const fichas = (lista, comunes, destacado) => lista
    .map((n) => `<span class="numero-lista${comunes.includes(n) ? ' comun' : ''}${n === destacado ? ' destacado' : ''}">${n}</span>`)
    .join('');

  function dibujar() {
    for (const g of raiz.querySelectorAll('[data-grupo]')) g.hidden = g.dataset.grupo !== estado.modo;
    if (estado.modo === 'mcm') {
      const { a, b } = estado;
      const m = mcm(a, b);
      const multA = Array.from({ length: Math.ceil((m * 1.5) / a) }, (_, i) => (i + 1) * a);
      const multB = Array.from({ length: Math.ceil((m * 1.5) / b) }, (_, i) => (i + 1) * b);
      const comunes = multA.filter((n) => multB.includes(n));
      expresionEl.innerHTML = `mcm(${a}, ${b}) = <b class="resultado">${m}</b>`;
      listasEl.innerHTML = `<p><span class="lista-nombre" style="color:var(--c-funcion)">Múltiplos de ${a}:</span> ${fichas(multA, comunes, m)} …</p>`
        + `<p><span class="lista-nombre" style="color:var(--c-vertice)">Múltiplos de ${b}:</span> ${fichas(multB, comunes, m)} …</p>`;
      textoEl.innerHTML = `Los <b>múltiplos</b> son los resultados de la tabla: saltando de a ${a} caés en ${multA.slice(0, 4).join(', ')}… `
        + `El <b>mínimo común múltiplo</b> es el primer número donde caen los dos: <b>${m}</b>. `
        + `Sirve para el <b>denominador común</b>: para sumar 1/${a} + 1/${b} se pasa todo a ${m}avos.`;
      plano.mostrarRango(0, m, 1.2);
      plano.pedirDibujo();
    } else {
      const { p, q } = estado;
      const g = mcd(p, q);
      const dp = divisores(p);
      const dq = divisores(q);
      const comunes = dp.filter((n) => dq.includes(n));
      expresionEl.innerHTML = `mcd(${p}, ${q}) = <b class="resultado">${g}</b>`;
      listasEl.innerHTML = `<p><span class="lista-nombre" style="color:var(--c-funcion)">Divisores de ${p}:</span> ${fichas(dp, comunes, g)}</p>`
        + `<p><span class="lista-nombre" style="color:var(--c-vertice)">Divisores de ${q}:</span> ${fichas(dq, comunes, g)}</p>`;
      textoEl.innerHTML = `Los <b>divisores</b> de un número son los que lo dividen justo (resto 0). Los que están en las dos listas son los <b>divisores comunes</b> (${comunes.join(', ')}), `
        + `y el más grande es el <b>máximo común divisor</b>: <b>${g}</b>. `
        + (g > 1
          ? `Sirve para <b>simplificar</b> de una: ${p}/${q} = ${p / g}/${q / g} (arriba y abajo dividido ${g}).`
          : `Como es 1, la fracción ${p}/${q} ya no se puede simplificar.`);
    }
  }

  function reproducir() {
    anim?.cancelar();
    if (sinMovimiento()) { progreso = 1; plano.pedirDibujo(); return; }
    progreso = 0;
    anim = animar(2200, (t) => { progreso = t; plano.pedirDibujo(); }, () => { anim = null; });
  }

  for (const n of ['a', 'b']) conectarDeslizador($(`.deslizador[data-param="${n}"]`), (v) => { estado[n] = v; anim?.terminar(); progreso = 1; dibujar(); });
  for (const n of ['p', 'q']) conectarDeslizador($(`.deslizador[data-param="${n}"]`), (v) => { estado[n] = v; dibujar(); });
  const botones = [...raiz.querySelectorAll('[data-modo]')];
  for (const b of botones) {
    b.addEventListener('click', () => {
      estado.modo = b.dataset.valor;
      for (const o of botones) o.setAttribute('aria-checked', String(o === b));
      dibujar();
      if (estado.modo === 'mcm') reproducir();
    });
  }
  $('[data-repetir]').addEventListener('click', reproducir);

  dibujar();
  progreso = 0;
  const observador = new IntersectionObserver((e) => {
    if (e.some((x) => x.isIntersecting)) { observador.disconnect(); reproducir(); }
  }, { threshold: 0.6 });
  observador.observe($('[data-grafico]'));
}
