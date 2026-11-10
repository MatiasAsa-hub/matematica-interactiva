// ==========================================================================
// INTERACTIVO: Laboratorio de funciones (el "supergraficador")
//   F(x) = a · f(b(x − c)) + d
// Se elige una función base f (x², √x, sen x, ln x…) y se transforma con
// cuatro deslizadores. La original queda dibujada como "fantasma".
// Las cuentas de cada función base están en src/lib/funcionesBase.js.
// El HTML está en src/components/interactivos/Laboratorio.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { dibujarBarrasDeSigno, tramoCrecimiento } from '../lib/grafico/signos.js';
import { BASES, transformar, argumentoHtml } from '../lib/funcionesBase.js';
import { num, numAprox } from '../lib/numeros.js';
import { bordes, renglonesInfo } from '../lib/analisisFuncion.js';

const X = '<i>x</i>';

export function iniciarLaboratorio(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { base: 'cuadratica', a: 1, b: 1, c: 2, d: -1, k: 2 };

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 1 },
    descripcion: 'Gráfico de la función transformada y de la original',
  });
  const col = plano.colores;
  let casillas = {};

  // "texto": para escribir los intervalos (en las que se repiten, unos pocos períodos)
  // "dibujo": lo que se ve en el gráfico
  let texto;
  let dibujo;
  function recalcular() {
    const { base, a, b, c, d, k } = estado;
    const p = { a, b, c, d, k };
    const periodo = BASES[base].periodo && b !== 0 ? BASES[base].periodo / Math.abs(b) : 0;
    texto = transformar(base, p, periodo ? [c - 1.6 * periodo, c + 1.6 * periodo] : [-1, 1]);
    const margen = (plano.xMax - plano.xMin) * 0.1;
    dibujo = transformar(base, p, [plano.xMin - margen, plano.xMax + margen]);
  }
  const F = (x) => dibujo.F(x);
  recalcular();

  // --- Capa 1: la original (fantasma) ---
  plano.agregarCapa((p) => {
    if (!casillas.fantasma) return;
    const base = BASES[estado.base];
    const desde = base.dominio === 'mayorIgual0' || base.dominio === 'mayor0' ? 0 : -Infinity;
    p.curva(dibujo.original, { color: col.fantasma, ancho: 2.5, guiones: [8, 7], desde });
  });

  // --- Capa 2: C⁺ y C⁻ ---
  plano.agregarCapa((p) => {
    if (!casillas.signos || dibujo.raro || dibujo.todoCero) return;
    p.zonaSigno(F, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(F, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    const cortes = [...dibujo.raices, ...bordes(dibujo)].sort((x, y) => x - y);
    dibujarBarrasDeSigno(p, F, cortes);
  });

  // --- Capas 3 y 4: la curva (por tramos, para respetar los cortes) y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, {
    f: F,
    color: col.funcion,
    tabla: tablaCaja,
    dibujarCurva: (hasta) => {
      const tramos = dibujo.raro ? [{ desde: -Infinity, hasta: Infinity }] : dibujo.tramos;
      for (const t of tramos) plano.curva(F, { color: col.funcion, ancho: 3.5, desde: t.desde, hasta: Math.min(t.hasta, hasta) });
    },
  });

  // --- Capa 5: asíntotas y puntos notables ---
  const dentro = (x) => x >= plano.xMin && x <= plano.xMax;
  plano.agregarCapa((p) => {
    if (dibujo.raro) return;
    if (casillas.asintotas) {
      for (const x of dibujo.verticales) p.lineaVertical(x, { color: col.texto, ancho: 1.5, guiones: [3, 6], alfa: 0.75 });
      if (dibujo.horizontal !== null) p.lineaHorizontal(dibujo.horizontal, { color: col.texto, ancho: 1.5, guiones: [3, 6], alfa: 0.75 });
    }
    if (casillas.crece && estado.a !== 0) {
      const derecha = p.ancho - 56;
      const cortes = [...dibujo.extremos.map((e) => e.x), ...bordes(dibujo)]
        .map((x) => Math.min(Math.max(p.px(x), 0), derecha));
      const lista = [0, ...cortes, derecha].sort((x, y) => x - y);
      for (let i = 0; i < lista.length - 1; i++) {
        const xm = p.mx((lista[i] + lista[i + 1]) / 2);
        const s = pendiente(xm);
        if (Number.isFinite(s) && s !== 0) tramoCrecimiento(p, lista[i], lista[i + 1], s > 0);
      }
    }
    if (casillas.ordenada && Number.isFinite(F(0))) {
      p.punto(0, F(0), { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      p.etiqueta(`(0, ${numAprox(F(0))})`, 0, F(0), { color: col.ordenada, dx: -10, dy: -12, alinear: 'right' });
    }
    if (casillas.extremos) {
      const visibles = dibujo.extremos.filter((e) => dentro(e.x));
      for (const e of visibles) {
        const y = F(e.x);
        const nombre = e.tipo === 'max' ? 'máx' : 'mín';
        p.punto(e.x, y, { color: col.vertice, forma: 'rombo', radio: 6 });
        p.etiqueta(visibles.length > 3 ? nombre : `${nombre} (${numAprox(e.x)}, ${numAprox(y)})`, e.x, y,
          { color: col.vertice, dx: 0, dy: e.tipo === 'max' ? -20 : 22, alinear: 'center', tamano: 14 });
      }
    }
    if (casillas.raices) {
      const visibles = dibujo.raices.filter(dentro);
      visibles.forEach((x, i) => {
        p.punto(x, 0, { color: col.raices, radio: 6.5 });
        if (visibles.length <= 5) p.etiqueta(numAprox(x), x, 0, { color: col.raices, dx: 0, dy: i % 2 === 0 ? 20 : 38, alinear: 'center', tamano: 14 });
      });
    }
  });

  /** Pendiente aproximada de F en x (para saber si crece o decrece). */
  function pendiente(x) {
    const h = 1e-5 * Math.max(1, Math.abs(x));
    return (F(x + h) - F(x - h)) / (2 * h);
  }

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const originalEl = $('[data-original]');
  const efectoEl = $('[data-efecto]');
  const avisoEl = $('[data-aviso]');
  const infoEl = $('[data-info]');
  let parametroActivo = null;

  function actualizarExpresion() {
    const v = (p, t) => `<span class="valor" data-p="${p}">${t}</span>`;
    const { a, b, c, d, k } = estado;
    const base = BASES[estado.base];
    const arg = argumentoHtml(b, c, v, num);
    const kTexto = v('k', num(k));
    let cuerpo;
    if (estado.base === 'inversa') {
      cuerpo = base.html(arg, kTexto, v('a', num(a)));
    } else {
      const conA = a !== 1;
      const f = base.html(arg, kTexto, null, conA);
      const adelante = a === 1 ? '' : a === -1 ? v('a', '−')
        : `${v('a', num(a))}${a === 0 || base.empiezaConNumero ? ' · ' : base.palabra ? ' ' : ''}`;
      cuerpo = adelante + f;
    }
    const final = d === 0 ? '' : ` ${d > 0 ? '+' : '−'} ${v('d', num(Math.abs(d)))}`;
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${cuerpo}${final}`;
    if (parametroActivo) expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');

    const simple = { texto: X, conParentesis: X, simple: true };
    originalEl.innerHTML = `Original: <span class="texto-fantasma">${base.html(simple, num(k), '1', false)}</span>`;
  }

  function actualizarEfecto() {
    const { a, b, c, d } = estado;
    const base = BASES[estado.base];
    const cambios = [];
    if (c > 0) cambios.push(`corrida <b>${num(c)} a la derecha</b>`);
    if (c < 0) cambios.push(`corrida <b>${num(-c)} a la izquierda</b>`);
    if (d > 0) cambios.push(`<b>subida ${num(d)}</b>`);
    if (d < 0) cambios.push(`<b>bajada ${num(-d)}</b>`);
    if (a === 0) cambios.push('<b>aplastada del todo</b> (queda una recta horizontal)');
    else {
      if (a < 0) cambios.push('<b>dada vuelta</b> (espejo arriba-abajo)');
      if (Math.abs(a) > 1) cambios.push(`<b>estirada</b> arriba-abajo (×${num(Math.abs(a))})`);
      if (Math.abs(a) < 1) cambios.push(`<b>aplastada</b> arriba-abajo (×${num(Math.abs(a))})`);
    }
    if (b < 0) cambios.push(`<b>espejada de izquierda a derecha</b>${base.par ? ' (no se nota: es simétrica)' : ''}`);
    if (Math.abs(b) > 1) cambios.push(`<b>más angosta</b> (${num(Math.abs(b))} veces)`);
    if (b !== 0 && Math.abs(b) < 1) cambios.push(`<b>más ancha</b> (${num(1 / Math.abs(b))} veces)`);
    if (!cambios.length) { efectoEl.innerHTML = 'Es igual a la original. Mové los deslizadores.'; return; }
    const lista = cambios.length === 1 ? cambios[0] : `${cambios.slice(0, -1).join(', ')} y ${cambios[cambios.length - 1]}`;
    efectoEl.innerHTML = `Comparada con la original: ${lista}.`;
  }

  function actualizarInfo() {
    const { a, b, k } = estado;
    const base = BASES[estado.base];
    const t = texto;

    avisoEl.hidden = !t.raro;
    if (t.raro) {
      avisoEl.innerHTML = b === 0
        ? `Con <i>b</i> = 0, adentro de la función queda siempre 0: da lo mismo para cualquier ${X} (o no existe, si con 0 no se puede calcular).`
        : 'Con base 1 no sirve: 1 elevado a cualquier cosa da 1 (y no hay logaritmo de base 1). Probá otra base.';
      infoEl.innerHTML = '';
      return;
    }

    const lado = estado.base === 'exponencial' || estado.base === 'exponencialK'
      ? ` <span class="texto-suave">(hacia la ${(b > 0) === (estado.base === 'exponencial' || k > 1) ? 'izquierda' : 'derecha'})</span>`
      : '';
    const partes = renglonesInfo(t, base, casillas, col, { a, centro: estado.c, ladoHorizontal: lado });

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba.</p>';
  }

  // --------------------------------------------------------------- controles

  function cambio() {
    recalcular();
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarEfecto();
    actualizarInfo();
  }

  const conTexto = (nombre) => ({
    alEmpezar: () => { parametroActivo = nombre; actualizarExpresion(); },
    alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
  });
  const deslizadores = {};
  for (const p of ['a', 'b', 'c', 'd', 'k']) {
    deslizadores[p] = conectarDeslizador($(`.deslizador[data-param="${p}"]`), (v) => { estado[p] = v; cambio(); }, conTexto(p));
    estado[p] = deslizadores[p].valor;
  }

  // función base
  const botonesBase = [...raiz.querySelectorAll('[data-base]')];
  const controlK = $('[data-control-k]');
  function elegirBase(nombre) {
    estado.base = nombre;
    for (const b of botonesBase) b.setAttribute('aria-checked', String(b.dataset.base === nombre));
    controlK.hidden = !BASES[nombre].conBase;
    $('[data-nombre-base]').textContent = BASES[nombre].nombre;
  }
  for (const boton of botonesBase) {
    boton.addEventListener('click', () => {
      elegirBase(boton.dataset.base);
      cambio();
      if (casillas.animacion) animacion.reproducir();
    });
  }

  $('[data-reiniciar]').addEventListener('click', () => {
    deslizadores.a.poner(1, false);
    deslizadores.b.poner(1, false);
    deslizadores.c.poner(0, false);
    deslizadores.d.poner(0, false);
    Object.assign(estado, { a: 1, b: 1, c: 0, d: 0 });
    cambio();
  });

  const botonRepetir = $('[data-repetir]');
  casillas = conectarCasillas($('[data-casillas]'), (nombre, activa) => {
    if (nombre === 'animacion') {
      botonRepetir.hidden = !activa;
      if (activa) animacion.reproducir(); else animacion.terminar();
    }
    if (nombre === 'tabla') tablaCaja.hidden = !activa;
    plano.pedirDibujo();
    actualizarInfo();
  });
  botonRepetir.hidden = !casillas.animacion;
  tablaCaja.hidden = !casillas.tabla;
  botonRepetir.addEventListener('click', () => animacion.reproducir());
  plano.alCambiarVista.push(() => {
    recalcular();
    if (!animacion.animando) animacion.calcularXs();
  });

  elegirBase(estado.base);
  cambio();

  if (casillas.animacion) {
    animacion.visibles = 0;
    animacion.hastaX = -Infinity;
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        observador.disconnect();
        // (si mientras tanto apagaron la animación, se dibuja la curva entera)
        if (casillas.animacion) animacion.reproducir(); else animacion.terminar();
      }
    }, { threshold: 0.6 });
    observador.observe($('[data-grafico]'));
  }
}
