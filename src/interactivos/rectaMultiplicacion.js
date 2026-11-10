// ==========================================================================
// INTERACTIVO: multiplicar y dividir con signos en la recta numérica.
//
// Multiplicar a · b: desde el 0, hacés |a| saltos de tamaño b.
//   Si a es negativo, al final se "da vuelta" todo (espejo en el 0).
//   Por eso (−)·(−) = +: el segundo negativo da vuelta al primero.
// Dividir a : b: ¿cuántos saltos de tamaño b hacen falta para llegar a a?
//   Si hay que saltar al revés del signo de b, la cantidad es negativa.
// El HTML está en src/components/interactivos/RectaMultiplicacion.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { animar, sinMovimiento, suave } from '../lib/grafico/animacion.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { dibujarSaltos } from '../lib/grafico/saltos.js';
import { num } from '../lib/numeros.js';

const MS_POR_SALTO = 380;
const MS_GIRO = 1100;

const par = (n) => (n < 0 ? `(${num(n)})` : num(n));
const saltos = (n) => `${num(n)} ${n === 1 ? 'salto' : 'saltos'}`;

export function iniciarRectaMultiplicacion(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { modo: 'mult', a: 3, b: -2, c: -6, d: 2 };

  // animación
  let visibles = Infinity; // saltos que se ven
  let espejo = 1;          // 1 normal, −1 dado vuelta
  let anim = null;
  const espejoFinal = () => (estado.modo === 'mult' && estado.a < 0 ? -1 : 1);
  const animando = () => anim !== null;

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -8.5, xMax: 8.5 },
    soloEjeX: true,
    separacionNumeros: 36,
    descripcion: 'Recta numérica',
  });
  const col = plano.colores;

  /** Qué saltos hay que dibujar según el modo. */
  function datosSaltos() {
    if (estado.modo === 'mult') {
      return { paso: estado.b, cantidad: Math.abs(estado.a) };
    }
    const { c, d } = estado;
    if (d === 0 || c === 0) return { paso: 1, cantidad: 0 };
    const q = c / d;
    return { paso: Math.sign(c) * Math.abs(d), cantidad: Math.abs(q) };
  }

  const resultado = () => (estado.modo === 'mult' ? estado.a * estado.b : estado.c / estado.d);
  // el punto donde se termina en la recta
  const llegada = () => (estado.modo === 'mult' ? estado.a * estado.b : estado.c);

  plano.agregarCapa((p) => {
    const { paso, cantidad } = datosSaltos();
    const hechos = Math.min(cantidad, visibles) >= cantidad - 1e-9;
    const terminado = hechos && !animando();
    const mult = estado.modo === 'mult';

    // fantasma: dónde estaba antes de dar vuelta
    if (mult && espejo < 1 && cantidad > 0) {
      dibujarSaltos(p, { paso, cantidad, alfa: 0.22 });
      p.punto(cantidad * paso, 0, { color: col.texto, radio: 6, alfa: 0.35 });
    }
    const { altura } = dibujarSaltos(p, { paso, cantidad, visibles, espejo });

    // cartel arriba de los saltos
    if (cantidad > 0 && hechos) {
      let texto;
      if (mult) {
        texto = espejo < 0 && terminado ? '¡dado vuelta!' : `${saltos(cantidad)} de ${num(paso)}`;
      } else {
        const q = resultado();
        texto = q > 0 ? `${saltos(q)} de ${num(estado.d)}` : `${saltos(-q)} de ${num(estado.d)}, al revés`;
      }
      const medio = (espejo * cantidad * paso) / 2;
      const color = espejo * paso > 0 ? col.positivo : col.negativo;
      p.etiqueta(texto, medio, 0, { color, dx: 0, dy: -altura - 16, alinear: 'center', tamano: 15 });
    }

    // el 0, de donde se arranca
    p.punto(0, 0, { color: col.texto, radio: 8 });
    p.etiqueta('arranco', 0, 0, { color: col.textoSuave, dx: 0, dy: 34, alinear: 'center', tamano: 13, negrita: false });

    // a dónde se llega
    if (!mult && estado.d === 0) return;
    if (!mult || terminado) {
      const x = llegada();
      p.punto(x, 0, { color: col.funcion, radio: 9 });
      p.etiqueta(mult ? `llego a ${num(x)}` : `quiero llegar a ${num(x)}`, x, 0, {
        color: col.funcion, dx: 0, dy: 52, alinear: 'center', tamano: 15,
      });
    }
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const explicacionEl = $('[data-explicacion]');
  const casos = [...raiz.querySelectorAll('[data-caso]')];

  function actualizarTextos() {
    const mult = estado.modo === 'mult';
    const [x, y] = mult ? [estado.a, estado.b] : [estado.c, estado.d];
    const signo = mult ? '·' : ':';
    const v = (p, t) => `<span class="valor" data-p="${p}">${t}</span>`;

    if (!mult && y === 0) {
      expresionEl.innerHTML = `${v('c', par(x))} : ${v('d', '0')} = <b class="neg">?</b>`;
      explicacionEl.innerHTML = '<b>No se puede dividir por 0.</b> Con saltos de tamaño 0 no llegás a ningún lado: no hay ninguna cantidad de saltos que sirva.';
    } else {
      const r = resultado();
      expresionEl.innerHTML = `${v(mult ? 'a' : 'c', par(x))} ${signo} ${v(mult ? 'b' : 'd', par(y))} = <b class="resultado">${num(r)}</b>`;
      explicacionEl.innerHTML = mult ? explicarMult() : explicarDiv();
    }

    // regla de los signos: se marca el caso que se está usando
    const s = (n) => (n > 0 ? '+' : '−');
    const caso = x !== 0 && y !== 0 ? s(x) + s(y) : null;
    for (const el of casos) {
      el.classList.toggle('activo', el.dataset.caso === caso);
      el.querySelector('.op').textContent = signo;
    }
  }

  function explicarMult() {
    const { a, b } = estado;
    if (a === 0) return 'Hacés <b>0 saltos</b>: te quedás en el 0. Cualquier número por 0 da 0.';
    if (b === 0) return 'Los saltos son de tamaño <b>0</b>: no te movés. Da 0.';
    const sinGirar = Math.abs(a) * b;
    if (a > 0) {
      return `Desde el 0 hacés <b>${saltos(a)}</b> de <b>${num(b)}</b> y llegás a <b>${num(a * b)}</b>.`;
    }
    return `Primero hacés <b>${saltos(-a)}</b> de <b>${num(b)}</b> y llegás a ${num(sinGirar)}. `
      + `Como ${par(a)} es <b class="neg">negativo</b>, <b>das vuelta todo</b> (espejo en el 0): llegás a <b>${num(a * b)}</b>.`
      + (b < 0 ? ' Por eso <b>menos por menos da más</b>: el segundo "menos" da vuelta al primero.' : '');
  }

  function explicarDiv() {
    const { c, d } = estado;
    if (c === 0) return `Ya estás en el 0: hacen falta <b>0 saltos</b>. 0 dividido cualquier número (que no sea 0) da 0.`;
    const q = c / d;
    const exacto = Number.isInteger(q);
    let t = `¿Cuántos saltos de <b>${num(d)}</b> necesitás para ir del 0 al <b>${num(c)}</b>? `;
    if (q > 0) t += `<b>${saltos(q)}</b>, para el mismo lado que ${par(d)}. `;
    else t += `<b>${saltos(-q)}</b>, pero <b class="neg">al revés</b> de ${par(d)}: por eso la cantidad es <b>negativa</b>, ${num(q)}. `;
    t += exacto ? `Comprobación: ${par(q)} · ${par(d)} = ${num(c)}.` : 'No da justo: el último salto queda cortito.';
    return t;
  }

  // --------------------------------------------------------------- controles

  function cambio() {
    anim?.cancelar();
    anim = null;
    visibles = Infinity;
    espejo = espejoFinal();
    const fin = estado.modo === 'mult' ? Math.abs(estado.a) * estado.b : 0;
    const x = llegada();
    plano.mostrarRango(Math.min(0, x, fin), Math.max(0, x, fin), 1.6);
    plano.pedirDibujo();
    actualizarTextos();
  }

  function reproducir() {
    anim?.cancelar();
    const { cantidad } = datosSaltos();
    if (sinMovimiento() || cantidad === 0) { anim = null; cambio(); return; }
    visibles = 0;
    espejo = 1;
    anim = animar(cantidad * MS_POR_SALTO, (t) => {
      visibles = t * cantidad;
      plano.pedirDibujo();
    }, () => {
      visibles = Infinity;
      if (espejoFinal() === 1) { anim = null; plano.pedirDibujo(); return; }
      // dar vuelta: el espejo va de 1 a −1
      anim = animar(MS_GIRO, (t) => {
        espejo = 1 - 2 * suave(t);
        plano.pedirDibujo();
      }, () => { espejo = -1; anim = null; plano.pedirDibujo(); });
    });
  }

  for (const nombre of ['a', 'b', 'c', 'd']) {
    conectarDeslizador(raiz.querySelector(`.deslizador[data-param="${nombre}"]`), (v) => {
      estado[nombre] = v;
      cambio();
    });
  }

  const botonesModo = [...raiz.querySelectorAll('[data-modo]')];
  for (const boton of botonesModo) {
    boton.addEventListener('click', () => {
      estado.modo = boton.dataset.modo;
      for (const b of botonesModo) b.setAttribute('aria-checked', String(b === boton));
      for (const g of raiz.querySelectorAll('[data-grupo]')) g.hidden = g.dataset.grupo !== estado.modo;
      cambio();
      reproducir();
    });
  }
  $('[data-repetir]').addEventListener('click', reproducir);

  cambio();

  // La animación arranca cuando la recta aparece en pantalla
  visibles = 0;
  espejo = 1;
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((e) => e.isIntersecting)) {
      observador.disconnect();
      reproducir();
    }
  }, { threshold: 0.6 });
  observador.observe($('[data-grafico]'));
}
