// ==========================================================================
// INTERACTIVO: orden de las operaciones, paso a paso.
// Se elige una cuenta y se resuelve de a una operación, como en el pizarrón:
// cada paso agrega un renglón nuevo y dice qué regla se usó.
// Las cuentas salen del tema (campo "cuentas:" del archivo .md).
// El HTML está en src/components/interactivos/OrdenOperaciones.astro.
// ==========================================================================

import { pasosDe, aHtml, marcarRecien } from '../lib/expresiones.js';
import { num } from '../lib/numeros.js';

export function iniciarOrdenOperaciones(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const cuentas = JSON.parse(raiz.dataset.cuentas);
  const estado = { cuenta: 0, paso: 0, terminos: false };
  let pasos = [];

  const renglonesEl = $('[data-renglones]');
  const reglaEl = $('[data-regla]');
  const contadorEl = $('[data-contador]');
  const botonSiguiente = $('[data-siguiente]');
  const botonTodo = $('[data-todo]');

  function elegirCuenta(i) {
    estado.cuenta = (i + cuentas.length) % cuentas.length;
    estado.paso = 0;
    pasos = pasosDe(cuentas[estado.cuenta]);
    contadorEl.textContent = `Cuenta ${estado.cuenta + 1} de ${cuentas.length}`;
    dibujar(false);
  }

  function dibujar(animarUltimo = true) {
    const lineas = [];
    for (let i = 0; i <= estado.paso; i++) {
      const { arbol, proxima } = pasos[i];
      const actual = i === estado.paso;
      const conRecien = actual && i > 0 ? marcarRecien(pasos[i - 1].arbol, arbol) : arbol;
      const html = aHtml(conRecien, {
        marcar: actual && proxima ? proxima.nodo.id : null,
        terminos: estado.terminos && proxima !== null,
      });
      const clases = ['renglon'];
      if (actual) clases.push('actual');
      if (actual && animarUltimo && i > 0) clases.push('nuevo');
      if (!proxima) clases.push('final');
      lineas.push(`<li class="${clases.join(' ')}"><span class="renglon-igual">${i === 0 ? '' : '='}</span><span class="renglon-cuenta">${html}</span></li>`);
    }
    renglonesEl.innerHTML = lineas.join('');

    const { proxima, arbol } = pasos[estado.paso];
    if (proxima) {
      reglaEl.innerHTML = `<span class="regla-num">Paso ${estado.paso + 1}</span> ${proxima.regla}`;
      reglaEl.classList.remove('listo');
    } else {
      reglaEl.innerHTML = `¡Listo! El resultado es <b>${num(arbol.valor)}</b>.`;
      reglaEl.classList.add('listo');
    }
    botonSiguiente.disabled = !proxima;
    botonTodo.disabled = !proxima;
  }

  botonSiguiente.addEventListener('click', () => {
    if (estado.paso < pasos.length - 1) { estado.paso++; dibujar(); }
  });
  botonTodo.addEventListener('click', () => { estado.paso = pasos.length - 1; dibujar(false); });
  $('[data-reiniciar]').addEventListener('click', () => { estado.paso = 0; dibujar(false); });
  $('[data-anterior]').addEventListener('click', () => elegirCuenta(estado.cuenta - 1));
  $('[data-proxima]').addEventListener('click', () => elegirCuenta(estado.cuenta + 1));

  const casillaTerminos = $('[data-casilla="terminos"]');
  casillaTerminos.addEventListener('click', () => {
    estado.terminos = !estado.terminos;
    casillaTerminos.setAttribute('aria-pressed', String(estado.terminos));
    dibujar(false);
  });

  elegirCuenta(0);
}
