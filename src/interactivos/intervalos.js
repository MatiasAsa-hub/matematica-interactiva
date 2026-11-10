// ==========================================================================
// INTERACTIVO: desigualdades e intervalos en la recta numérica.
//
// Se elige una desigualdad (x > a, o a < x ≤ b, etc.) y se ve pintado en la
// recta qué números la cumplen, junto con cómo se escribe como intervalo.
// Punto relleno = el número está (corchete); hueco = no está (paréntesis).
// El HTML está en src/components/interactivos/Intervalos.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { dibujarIntervalo, dibujarCruz } from '../lib/grafico/intervalo.js';
import { cumple } from '../lib/lineal.js';
import { num } from '../lib/numeros.js';

const X = '<i>x</i>';
const PALABRAS = { '>': 'mayores que', '≥': 'mayores o iguales que', '<': 'menores que', '≤': 'menores o iguales que' };

export function iniciarIntervalos(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { forma: 'una', signo: '>', puntas: '<<', a: 2, b: 5, probar: false, p: 3 };

  /** El conjunto como { desde, hasta, cd (¿cerrado desde?), ch (¿cerrado hasta?) } */
  function conjunto() {
    const { forma, signo, puntas, a, b } = estado;
    if (forma === 'dos') return { desde: a, hasta: b, cd: puntas[0] === '≤', ch: puntas[1] === '≤' };
    if (signo === '>' || signo === '≥') return { desde: a, hasta: Infinity, cd: signo === '≥', ch: false };
    return { desde: -Infinity, hasta: a, cd: false, ch: signo === '≤' };
  }

  function esta(v) {
    const { forma, signo, puntas, a, b } = estado;
    if (forma === 'una') return cumple(v, signo, a);
    return cumple(a, puntas[0], v) && cumple(v, puntas[1], b);
  }

  // ------------------------------------------------------------------ recta
  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -7.5, xMax: 7.5 },
    soloEjeX: true,
    separacionNumeros: 36,
    descripcion: 'Recta numérica con el intervalo pintado',
  });
  const col = plano.colores;

  plano.agregarCapa((p) => {
    const c = conjunto();
    dibujarIntervalo(p, { desde: c.desde, hasta: c.hasta, cerradoDesde: c.cd, cerradoHasta: c.ch, color: col.positivo });
    // nombres de las puntas
    const nombre = { dy: 50, dx: 0, alinear: 'center', tamano: 14, color: col.textoSuave };
    if (Number.isFinite(c.desde)) p.etiqueta('a', c.desde, 0, nombre);
    if (Number.isFinite(c.hasta)) p.etiqueta(estado.forma === 'dos' ? 'b' : 'a', c.hasta, 0, nombre);

    if (estado.probar) {
      const v = estado.p;
      const ok = esta(v);
      if (ok) p.punto(v, 0, { color: col.texto, radio: 7 });
      else dibujarCruz(p, v, { color: col.negativo, tamano: 7 });
      p.etiqueta(`${num(v)} ${ok ? '✓' : '✗'}`, v, 0, { color: ok ? col.positivo : col.negativo, dx: 0, dy: -52, alinear: 'center', tamano: 16 });
    }
  });

  const deslA = conectarDeslizador($('.deslizador[data-param="a"]'), (v) => {
    estado.a = v;
    if (estado.forma === 'dos' && estado.a >= estado.b) {
      if (v < 8) deslB.poner(v + 1); else deslA.poner(estado.b - 1);
    }
    cambio();
  });
  const deslB = conectarDeslizador($('.deslizador[data-param="b"]'), (v) => {
    estado.b = v;
    if (estado.forma === 'dos' && estado.b <= estado.a) {
      if (v > -8) deslA.poner(v - 1); else deslB.poner(estado.a + 1);
    }
    cambio();
  });

  // puntos que se arrastran: las puntas y el número de prueba
  const limitar = (v) => Math.max(-8, Math.min(8, Math.round(v)));
  plano.agregarArrastrable({ posicion: () => [estado.a, 0], mover: (x) => deslA.poner(limitar(x)) });
  plano.agregarArrastrable({
    posicion: () => (estado.forma === 'dos' ? [estado.b, 0] : [NaN, NaN]),
    mover: (x) => deslB.poner(limitar(x)),
  });
  plano.agregarArrastrable({
    posicion: () => (estado.probar ? [estado.p, 0] : [NaN, NaN]),
    mover: (x) => { estado.p = Math.round(x * 2) / 2; cambio(); },
    radio: 20,
  });

  // ------------------------------------------------------------------ botones
  function elegir(botones, boton) {
    for (const b of botones) b.setAttribute('aria-checked', String(b === boton));
  }
  const botonesForma = [...raiz.querySelectorAll('[data-forma]')];
  for (const boton of botonesForma) {
    boton.addEventListener('click', () => {
      estado.forma = boton.dataset.forma;
      elegir(botonesForma, boton);
      $('[data-signos-una]').hidden = estado.forma !== 'una';
      $('[data-signos-dos]').hidden = estado.forma !== 'dos';
      $('[data-solo-dos]').hidden = estado.forma !== 'dos';
      if (estado.forma === 'dos' && estado.b <= estado.a) deslB.poner(Math.min(8, estado.a + 3));
      cambio();
    });
  }
  const botonesSigno = [...raiz.querySelectorAll('[data-signo]')];
  for (const boton of botonesSigno) {
    boton.addEventListener('click', () => { estado.signo = boton.dataset.signo; elegir(botonesSigno, boton); cambio(); });
  }
  const botonesPuntas = [...raiz.querySelectorAll('[data-puntas]')];
  for (const boton of botonesPuntas) {
    boton.addEventListener('click', () => { estado.puntas = boton.dataset.puntas; elegir(botonesPuntas, boton); cambio(); });
  }
  const casilla = $('[data-casilla="probar"]');
  casilla.addEventListener('click', () => {
    estado.probar = !estado.probar;
    casilla.setAttribute('aria-pressed', String(estado.probar));
    $('[data-prueba]').hidden = !estado.probar;
    cambio();
  });

  // ------------------------------------------------------------------ textos
  const expresionEl = $('[data-expresion]');
  const intervaloEl = $('[data-intervalo]');
  const explicacionEl = $('[data-explicacion]');
  const pruebaEl = $('[data-prueba]');

  const v = (p, t) => `<span class="valor" data-p="${p}">${t}</span>`;

  function textos() {
    const { forma, signo, puntas, a, b } = estado;
    const c = conjunto();
    const izq = Number.isFinite(c.desde) ? `${c.cd ? '[' : '('}${num(c.desde)}` : '(−∞';
    const der = Number.isFinite(c.hasta) ? `${num(c.hasta)}${c.ch ? ']' : ')'}` : '+∞)';
    intervaloEl.innerHTML = `Como intervalo: <b class="intervalo-nota">${izq}, ${der}</b>`;

    const puntaTexto = (n, incluida) => incluida
      ? `El ${num(n)} <b>sí</b> está: punto relleno y <b>corchete</b>.`
      : `El ${num(n)} <b>no</b> está: punto hueco y <b>paréntesis</b>.`;
    let t;
    if (forma === 'una') {
      expresionEl.innerHTML = `${X} ${signo} ${v('a', num(a))}`;
      t = `Todos los números <b class="pos">${PALABRAS[signo]} ${num(a)}</b>. ${puntaTexto(a, signo === '≥' || signo === '≤')} `;
      t += `Del lado del ${signo === '>' || signo === '≥' ? '+∞' : '−∞'} siempre va paréntesis: el infinito no es un número, nunca se llega.`;
    } else {
      expresionEl.innerHTML = `${v('a', num(a))} ${puntas[0]} ${X} ${puntas[1]} ${v('b', num(b))}`;
      t = `Todos los números <b class="pos">entre ${num(a)} y ${num(b)}</b>. ${puntaTexto(a, c.cd)} ${puntaTexto(b, c.ch)}`;
    }
    explicacionEl.innerHTML = t;

    if (estado.probar) {
      const p = estado.p;
      const ok = esta(p);
      const motivo = forma === 'una'
        ? `${num(p)} ${signo} ${num(a)}`
        : `${num(a)} ${puntas[0]} ${num(p)} ${puntas[1]} ${num(b)}`;
      pruebaEl.innerHTML = `¿El <b>${num(p)}</b> está? ${ok ? `<b class="pos">Sí</b>: ${motivo} es verdad.` : `<b class="neg">No</b>: ${motivo} es falso.`} Arrastrá el punto blanco para probar otros.`;
    }
  }

  function cambio() {
    const c = conjunto();
    const puntos = [c.desde, c.hasta, estado.probar ? estado.p : NaN].filter(Number.isFinite);
    if (puntos.length) plano.mostrarRango(Math.min(...puntos), Math.max(...puntos), 1.5);
    plano.pedirDibujo();
    textos();
  }

  cambio();
}
