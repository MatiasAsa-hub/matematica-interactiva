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
import { num, numAprox, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
// número para los intervalos: "3", "≈1.57"
const n = (v) => (Number.isFinite(v) ? numAprox(v).replace('≈ ', '≈') : v > 0 ? '+∞' : '−∞');

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

  const item = (color, titulo, cuerpo) =>
    `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

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

    const repite = t.periodo !== null;
    // en las que se repiten, se escriben solo las de un período para cada lado
    const cerca = (x) => !repite || Math.abs(x - estado.c) <= t.periodo + 1e-9;
    const cadaPeriodo = repite ? ` <span class="texto-suave">(se repiten cada ${numAprox(t.periodo)})</span>` : '';
    const partes = [];
    if (casillas.raices) {
      let cuerpo;
      if (t.todoCero) cuerpo = 'todos los números: la función vale 0 siempre.';
      else if (!t.raices.length) cuerpo = 'no tiene: la curva no toca el eje x.';
      else {
        const lista = t.raices.filter(cerca).map((x) => `${X} ${igual(x)}`).join(', ');
        cuerpo = repite ? `…, ${lista}, …${cadaPeriodo}` : `${lista}.`;
      }
      partes.push(item(col.raices, 'Raíces:', cuerpo));
    }
    if (casillas.ordenada) {
      const y0 = t.F(0);
      partes.push(item(col.ordenada, 'Ordenada al origen:', Number.isFinite(y0)
        ? `<i>f</i>(0) ${igual(y0)}.`
        : `no tiene: ${X} = 0 no está en el dominio.`));
    }
    if (casillas.extremos) {
      const lista = t.extremos.filter((e) => cerca(e.x))
        .map((e) => `${e.tipo === 'max' ? 'máximo' : 'mínimo'} en (${numAprox(e.x)}, ${numAprox(t.F(e.x))})`);
      partes.push(item(col.vertice, 'Máximos y mínimos:', lista.length
        ? `${lista.join('; ')}${repite ? `…${cadaPeriodo}` : '.'}`
        : 'no tiene.'));
    }
    if (casillas.signos && !t.todoCero) {
      const cortes = [...t.raices, ...bordes(t)];
      const tramos = partir(t, cortes);
      const unir = (signo) => escribir(tramos.filter((tr) => Math.sign(t.F(tr.xm)) === signo), repite, true);
      partes.push(item(col.positivo, 'C⁺ =', `${unir(1)} <span class="texto-suave">(donde f(x) > 0)</span>`));
      partes.push(item(col.negativo, 'C⁻ =', `${unir(-1)} <span class="texto-suave">(donde f(x) < 0)</span>`));
    }
    if (casillas.crece && a !== 0) {
      const tramos = partir(t, [...t.extremos.map((e) => e.x), ...bordes(t)]);
      const pend = (x) => (t.F(x + 1e-5) - t.F(x - 1e-5));
      partes.push(item(col.crece, 'Crece en', escribir(tramos.filter((tr) => pend(tr.xm) > 0), repite, false)));
      partes.push(item(col.decrece, 'Decrece en', escribir(tramos.filter((tr) => pend(tr.xm) < 0), repite, false)));
    }
    if (casillas.asintotas) {
      const lista = [];
      if (t.verticales.length) {
        lista.push(repite
          ? `verticales en …, ${t.verticales.filter(cerca).map((x) => `${X} ${igual(x)}`).join(', ')}, …${cadaPeriodo}`
          : `vertical en ${X} ${igual(t.verticales[0])}`);
      }
      if (t.horizontal !== null) {
        const lado = estado.base === 'exponencial' || estado.base === 'exponencialK'
          ? ` <span class="texto-suave">(hacia la ${(b > 0) === (estado.base === 'exponencial' || k > 1) ? 'izquierda' : 'derecha'})</span>`
          : '';
        lista.push(`horizontal en <i>y</i> = ${numAprox(t.horizontal)}${lado}`);
      }
      partes.push(item(col.texto, 'Asíntotas:', lista.length
        ? `${lista.join('; ')}. Son rectas a las que la curva se acerca cada vez más, sin tocarlas.`
        : 'no tiene.'));
    }
    if (casillas.dominio) {
      partes.push(item(col.funcion, 'Dominio:', `${dominioTexto(t, base)} <span class="texto-suave">(los ${X} que se pueden usar)</span>`));
      partes.push(item(col.funcion, 'Imagen:', `${imagenTexto(t.imagen)} <span class="texto-suave">(los valores que da)</span>`));
    }

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

// ------------------------------------------------------------------ ayudas

/** Los bordes del dominio que caen adentro (asíntotas y el punto donde arranca la raíz o el ln). */
function bordes(t) {
  const res = new Set(t.verticales);
  for (const tr of t.tramos) {
    if (Number.isFinite(tr.desde)) res.add(tr.desde);
    if (Number.isFinite(tr.hasta)) res.add(tr.hasta);
  }
  return [...res];
}

/**
 * Parte el dominio en pedacitos, cortando en los x de "cortes".
 * Cada pedacito: { desde, hasta, desdeCerrado, hastaCerrado, xm } (xm: un x del medio).
 */
function partir(t, cortes) {
  const res = [];
  for (const tr of t.tramos) {
    const adentro = [...new Set(cortes)].filter((x) => x > tr.desde + 1e-9 && x < tr.hasta - 1e-9).sort((p, q) => p - q);
    const puntos = [tr.desde, ...adentro, tr.hasta];
    for (let i = 0; i < puntos.length - 1; i++) {
      const p = puntos[i];
      const q = puntos[i + 1];
      const xm = !Number.isFinite(p) && !Number.isFinite(q) ? 0 : !Number.isFinite(p) ? q - 1 : !Number.isFinite(q) ? p + 1 : (p + q) / 2;
      res.push({
        desde: p, hasta: q, xm,
        // el borde cerrado del dominio (ej. la raíz) cuenta solo si ahí no vale 0
        desdeCerrado: i === 0 && tr.desdeCerrado && Math.abs(t.F(p)) > 1e-9,
        hastaCerrado: i === puntos.length - 2 && tr.hastaCerrado && Math.abs(t.F(q)) > 1e-9,
      });
    }
  }
  return res;
}

/**
 * Escribe una lista de pedacitos como unión de intervalos.
 * repite: en las funciones periódicas se escriben solo los que están completos, con "…".
 * conBordes: true para respetar los bordes cerrados (C⁺ y C⁻); crece y decrece van siempre abiertos.
 */
function escribir(tramos, repite, conBordes) {
  let lista = tramos;
  if (repite && !(lista.length === 1 && !Number.isFinite(lista[0].desde) && !Number.isFinite(lista[0].hasta))) {
    lista = lista.filter((tr) => Number.isFinite(tr.desde) && Number.isFinite(tr.hasta));
  }
  if (!lista.length) return '∅';
  const textos = lista.map((tr) => {
    if (!Number.isFinite(tr.desde) && !Number.isFinite(tr.hasta)) return 'ℝ';
    const izq = conBordes && tr.desdeCerrado ? '[' : '(';
    const der = conBordes && tr.hastaCerrado ? ']' : ')';
    return `${izq}${n(tr.desde)}, ${n(tr.hasta)}${der}`;
  });
  const unidos = textos.join(' ∪ ');
  return repite && textos[0] !== 'ℝ' ? `… ∪ ${unidos} ∪ …` : unidos;
}

function dominioTexto(t, base) {
  if (base.dominio === 'R') return 'ℝ';
  if (base.dominio === 'distinto0') return `ℝ − {${n(t.verticales[0])}}`;
  if (base.dominio === 'tan') return `ℝ menos las asíntotas <span class="texto-suave">(se repiten cada ${numAprox(t.periodo)})</span>`;
  const tr = t.tramos[0];
  return `${tr.desdeCerrado ? '[' : '('}${n(tr.desde)}, ${n(tr.hasta)}${tr.hastaCerrado ? ']' : ')'}`;
}

function imagenTexto(im) {
  if (im.tipo === 'R') return 'ℝ';
  if (im.tipo === 'punto') return `{${n(im.valor)}}`;
  if (im.tipo === 'menos') return `ℝ − {${n(im.valor)}}`;
  return `${im.loCerrado ? '[' : '('}${n(im.lo)}, ${n(im.hi)}${im.hiCerrado ? ']' : ')'}`;
}
