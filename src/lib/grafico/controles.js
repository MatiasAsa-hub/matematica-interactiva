// ==========================================================================
// Controles compartidos: deslizadores y casillas (botones que se prenden y
// apagan). El HTML lo arman los componentes Deslizador.astro y Casillas.astro;
// acá se les da vida.
// ==========================================================================

import { num } from '../numeros.js';

/**
 * Conecta un deslizador.
 * @param {HTMLElement} el   el <div class="deslizador">
 * @param {(valor:number) => void} alCambiar
 * @returns {{ valor: number, poner: (v:number) => void }}
 */
export function conectarDeslizador(el, alCambiar, { alEmpezar = () => {}, alTerminar = () => {}, formato = null } = {}) {
  // formato (opcional): (valor) => texto, para mostrar el valor de otra forma (ej. "90°" o "π/2").
  // Si el formato cambia, se llama a control.mostrar() para actualizar el texto.
  const input = el.querySelector('input[type="range"]');
  const salida = el.querySelector('output');
  const min = Number(input.min);
  const max = Number(input.max);
  const paso = Number(input.step) || 0.1;
  const decimales = Math.max(0, (String(paso).split('.')[1] ?? '').length);

  const control = {
    valor: Number(input.value),
    /**
     * Cambia el valor. Con redondear = false se guarda el valor exacto
     * (sirve cuando el valor viene de una cuenta, ej. al pasar de una forma a otra).
     */
    poner(v, avisar = true, redondear = true) {
      v = Math.min(max, Math.max(min, v));
      if (redondear) {
        v = Math.round(v / paso) * paso;
        v = Number(v.toFixed(decimales)); // evita cosas como 0.30000000000000004
      }
      input.value = String(v);
      control.valor = v;
      mostrar();
      if (avisar) alCambiar(v);
    },
  };

  function mostrar() {
    salida.textContent = formato ? formato(control.valor) : num(control.valor, Math.max(decimales, 2));
    el.style.setProperty('--porcentaje', `${((control.valor - min) / (max - min)) * 100}%`);
  }

  input.addEventListener('input', () => control.poner(Number(input.value)));
  input.addEventListener('pointerdown', () => alEmpezar());
  input.addEventListener('focus', () => alEmpezar());
  input.addEventListener('pointerup', () => alTerminar());
  input.addEventListener('blur', () => alTerminar());

  // Botones − y + (para ajustar fino con el dedo)
  for (const b of el.querySelectorAll('[data-delta]')) {
    b.addEventListener('click', () => {
      alEmpezar();
      control.poner(control.valor + Number(b.dataset.delta));
      alTerminar();
    });
  }

  control.mostrar = mostrar;
  mostrar();
  return control;
}

/**
 * Conecta un grupo de casillas.
 * @param {HTMLElement} raiz  donde están los botones [data-casilla]
 * @param {(nombre:string, activa:boolean, estado:object) => void} alCambiar
 * @returns {object} estado: { nombre: true/false, ... }
 */
export function conectarCasillas(raiz, alCambiar) {
  const estado = {};
  for (const b of raiz.querySelectorAll('[data-casilla]')) {
    const nombre = b.dataset.casilla;
    estado[nombre] = b.getAttribute('aria-pressed') === 'true';
    b.addEventListener('click', () => {
      estado[nombre] = !estado[nombre];
      b.setAttribute('aria-pressed', String(estado[nombre]));
      alCambiar(nombre, estado[nombre], estado);
    });
  }
  return estado;
}
