// ==========================================================================
// INTERACTIVO: sumar y restar con signos en la recta numérica.
//
// Arrancás en a y das saltitos de a 1: a la derecha si sumás un positivo,
// a la izquierda si sumás un negativo. Restar es sumar el opuesto:
//   a − b = a + (−b)
// El HTML está en src/components/interactivos/RectaSignos.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { num } from '../lib/numeros.js';
import { dibujarSaltos } from '../lib/grafico/saltos.js';

const MS_POR_SALTO = 260;

/** Un número escrito con paréntesis si es negativo: (−5) */
const conParentesis = (n) => (n < 0 ? `(${num(n)})` : num(n));

export function iniciarRectaSignos(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { a: 3, b: -5, op: '+' };

  // cuánto me muevo de verdad (restar b = sumar −b)
  const movimiento = () => (estado.op === '+' ? estado.b : -estado.b);
  const resultado = () => estado.a + movimiento();

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -7.5, xMax: 7.5 },
    soloEjeX: true,
    separacionNumeros: 36,
    descripcion: 'Recta numérica',
  });
  const col = plano.colores;

  // progreso de la animación: cuántos saltos se ven (con decimales = salto a mitad de camino)
  let saltosVisibles = Infinity;
  let anim = null;

  plano.agregarCapa((p) => {
    const { a } = estado;
    const m = movimiento();
    const n = Math.abs(m);
    const dir = Math.sign(m);
    const color = dir >= 0 ? col.positivo : col.negativo;

    // saltitos (de a 1, desde a)
    const hechos = Math.min(n, saltosVisibles);
    const { altura } = dibujarSaltos(p, { desde: a, paso: dir || 1, cantidad: n, visibles: saltosVisibles });

    // cartel arriba de los saltos: "5 a la izquierda"
    if (n > 0 && hechos >= n) {
      const texto = `${num(n)} ${n === 1 ? 'lugar' : 'lugares'} a la ${dir > 0 ? 'derecha' : 'izquierda'}`;
      p.etiqueta(texto, a + m / 2, 0, { color, dx: 0, dy: -altura - 16, alinear: 'center', tamano: 15 });
    }

    // punto de partida
    p.punto(a, 0, { color: col.texto, radio: 8 });
    p.etiqueta('arranco', a, 0, { color: col.textoSuave, dx: 0, dy: 34, alinear: 'center', tamano: 13, negrita: false });

    // resultado
    if (hechos >= n) {
      p.punto(resultado(), 0, { color: col.funcion, radio: 9 });
      p.etiqueta(`llego a ${num(resultado())}`, resultado(), 0, {
        color: col.funcion, dx: 0, dy: n === 0 ? 52 : 52, alinear: 'center', tamano: 15,
      });
    }
  });

  // Los dos puntos se pueden arrastrar con el dedo (se acomodan a números enteros)
  const deslA = conectarDeslizador(raiz.querySelector('.deslizador[data-param="a"]'), (v) => { estado.a = v; cambio(); });
  const deslB = conectarDeslizador(raiz.querySelector('.deslizador[data-param="b"]'), (v) => { estado.b = v; cambio(); });
  plano.agregarArrastrable({
    posicion: () => [estado.a, 0],
    mover: (x) => deslA.poner(Math.round(x)),
  });
  plano.agregarArrastrable({
    posicion: () => [resultado(), 0],
    mover: (x) => {
      const m = Math.round(x) - estado.a;
      deslB.poner(estado.op === '+' ? m : -m);
    },
  });

  // Botones + y −
  const botonesOp = [...raiz.querySelectorAll('[data-op]')];
  for (const boton of botonesOp) {
    boton.addEventListener('click', () => {
      estado.op = boton.dataset.op;
      for (const b of botonesOp) b.setAttribute('aria-checked', String(b === boton));
      cambio();
      reproducir();
    });
  }

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const explicacionEl = $('[data-explicacion]');

  function actualizarTextos() {
    const { a, b, op } = estado;
    const m = movimiento();
    const v = (p, t) => `<span class="valor" data-p="${p}">${t}</span>`;
    let s = `${v('a', num(a))} ${op} ${v('b', conParentesis(b))}`;
    if (op === '−') s += ` = ${num(a)} + ${conParentesis(m)}`;
    s += ` = <b class="resultado">${num(resultado())}</b>`;
    expresionEl.innerHTML = s;

    const lugares = (n) => `${num(Math.abs(n))} ${Math.abs(n) === 1 ? 'lugar' : 'lugares'}`;
    let texto = `Arrancás en <b>${num(a)}</b>. `;
    if (op === '−') {
      texto += `Restar ${conParentesis(b)} es lo mismo que <b>sumar ${conParentesis(m)}</b> (el opuesto). `;
    }
    if (m > 0) texto += `Sumar un número <b class="pos">positivo</b> te lleva <b class="pos">${lugares(m)} a la derecha</b>. `;
    else if (m < 0) texto += `Sumar un número <b class="neg">negativo</b> te lleva <b class="neg">${lugares(m)} a la izquierda</b>. `;
    else texto += 'Sumar 0 no te mueve. ';
    texto += `Llegás a <b>${num(resultado())}</b>.`;
    explicacionEl.innerHTML = texto;
  }

  function cambio() {
    anim?.terminar();
    saltosVisibles = Infinity;
    plano.mostrarRango(Math.min(estado.a, resultado(), 0), Math.max(estado.a, resultado(), 0), 1.6);
    plano.pedirDibujo();
    actualizarTextos();
  }

  // Animación: los saltitos de a uno
  function reproducir() {
    anim?.cancelar();
    const n = Math.abs(movimiento());
    if (sinMovimiento() || n === 0) { saltosVisibles = Infinity; plano.pedirDibujo(); return; }
    saltosVisibles = 0;
    anim = animar(n * MS_POR_SALTO, (t) => {
      saltosVisibles = t * n;
      plano.pedirDibujo();
    }, () => { saltosVisibles = Infinity; anim = null; plano.pedirDibujo(); });
  }
  $('[data-repetir]').addEventListener('click', reproducir);

  actualizarTextos();

  // La animación arranca cuando la recta aparece en pantalla
  saltosVisibles = 0;
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((e) => e.isIntersecting)) {
      observador.disconnect();
      reproducir();
    }
  }, { threshold: 0.6 });
  observador.observe($('[data-grafico]'));
}
