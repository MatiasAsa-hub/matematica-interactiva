// ==========================================================================
// INTERACTIVO: la ecuación del plano a·x + b·y + c·z = d.
//   - El plano (azul) en 3D, que se gira con el dedo.
//   - El vector normal (a, b, c) (lila): la flecha perpendicular al plano.
//   - Casilla "Cortes con los ejes": dónde el plano corta a x, y, z (amarillo).
// Al mover d, el plano se corre paralelo; al mover a, b o c, gira.
// El HTML está en src/components/interactivos/Plano3d.astro.
// ==========================================================================

import { conectarCasillas, conectarDeslizador } from '../lib/grafico/controles.js';
import { leerEcuacion3, ecuacionHtml, fr, numeroHtml } from '../lib/sistemas.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num } from '../lib/numeros.js';
import { Espacio } from '../lib/grafico/espacio.js';

const LETRAS = ['x', 'y', 'z'];

export function iniciarPlano3d(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.planos);
  const css = getComputedStyle(document.documentElement);
  const c = (n) => css.getPropertyValue(n).trim();
  const estado = { indice: 0, ec: [1, 1, 2, 4] };
  let casillas = {};

  const espacio = new Espacio($('[data-espacio]'), { limite: 5, descripcion: 'Un plano en 3D con su vector normal. Se gira con el dedo.' });
  const plano = espacio.plano({ color: c('--c-ec1') });
  const normal = espacio.flecha({ color: c('--c-vertice') });
  const textoNormal = espacio.etiqueta('', [0, 0, 0], { color: c('--c-vertice') });
  const cortes = [0, 1, 2].map(() => espacio.punto({ color: c('--c-raices'), radio: 0.13 }));
  const textosCortes = [0, 1, 2].map(() => espacio.etiqueta('', [0, 0, 0], { color: c('--c-raices'), clase: 'espacio-etiqueta-chica' }));

  const expresionEl = $('[data-expresion]');
  const infoEl = $('[data-info]');

  function actualizar() {
    const [a, b, cc, d] = estado.ec;
    const n2 = a * a + b * b + cc * cc;
    expresionEl.innerHTML = n2 === 0
      ? `${ecuacionHtml(estado.ec.map((v) => fr(v)))} <span class="texto-suave">(¡no es un plano!)</span>`
      : ecuacionHtml(estado.ec.map((v) => fr(v)));
    plano.poner(estado.ec);
    // el vector normal sale del punto del plano más cercano al origen
    if (n2 > 0 && casillas.normal) {
      const P = [a, b, cc].map((v) => (v * d) / n2);
      const L = Math.sqrt(n2);
      const largoFlecha = 3;
      const Q = P.map((v, i) => v + ([a, b, cc][i] / L) * largoFlecha);
      normal.poner(P, Q);
      textoNormal.pos = Q.map((v, i) => v + ([a, b, cc][i] / L) * 0.7);
      textoNormal.html = `(${num(a)}, ${num(b)}, ${num(cc)})`;
      textoNormal.visible = true;
    } else {
      normal.poner(null);
      textoNormal.visible = false;
    }
    // cortes con los ejes
    [a, b, cc].forEach((coef, i) => {
      const ok = casillas.ejes && coef !== 0 && Math.abs(d / coef) <= espacio.L;
      const p = [0, 0, 0];
      if (ok) p[i] = d / coef;
      cortes[i].poner(ok ? p : null);
      textosCortes[i].visible = ok;
      if (ok) {
        textosCortes[i].pos = p.map((v, k) => (k === i ? v : 0) + (k === 2 && i !== 2 ? -0.5 : 0) + (k === 0 && i === 2 ? -0.6 : 0));
        textosCortes[i].html = `${LETRAS[i]} = ${numeroHtml(d / coef)}`;
      }
    });
    const partes = [
      itemInfo(c('--c-ec1'), 'Plano:', 'los puntos (<i>x</i>, <i>y</i>, <i>z</i>) que cumplen la ecuación forman un plano. Girá el dibujo con el dedo.'),
      itemInfo(c('--c-vertice'), 'Vector normal:', `los números de adelante, (${num(a)}, ${num(b)}, ${num(cc)}), forman una flecha <b>perpendicular</b> al plano. Si los cambiás, el plano gira.`),
      itemInfo(c('--texto-suave'), 'El resultado d:', 'si cambiás solo <i>d</i>, el plano se corre <b>paralelo</b> (la flecha no cambia de dirección). Con <i>d</i> = 0 pasa por el origen.'),
    ];
    if (casillas.ejes) partes.push(itemInfo(c('--c-raices'), 'Cortes con los ejes:', 'para ver dónde corta al eje <i>x</i>, se pone <i>y</i> = 0 y <i>z</i> = 0 y se despeja <i>x</i> (igual con los otros).'));
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
    espacio.pedirDibujo();
  }

  const deslizadores = ['a', 'b', 'c', 'd'].map((nombre, i) => conectarDeslizador(
    $(`.deslizador[data-param="${nombre}"]`),
    (v) => { estado.ec[i] = v; actualizar(); },
    { formato: (v) => num(v) },
  ));

  casillas = conectarCasillas($('[data-casillas]'), () => actualizar());

  function elegir(i) {
    estado.indice = (i + textos.length) % textos.length;
    estado.ec = leerEcuacion3(textos[estado.indice]);
    estado.ec.forEach((v, k) => deslizadores[k].poner(v, false));
    $('[data-contador]').textContent = `Plano ${estado.indice + 1} de ${textos.length}`;
    actualizar();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));
  elegir(0);
}
