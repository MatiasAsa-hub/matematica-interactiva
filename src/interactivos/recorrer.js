// ==========================================================================
// INTERACTIVO 6.b: recorrer la curva y dibujar f'(x)
//
// - Arriba, la curva f con un punto que se arrastra. En el punto hay un
//   vector (una flechita de largo 1) en la dirección de la tangente,
//   coloreado según el signo de la derivada: turquesa si crece, terracota
//   si decrece, lila si está acostada (f' = 0).
// - Abajo, con el mismo eje x alineado, se va dibujando f'(x): siempre
//   desde el borde izquierdo hasta el x del punto. Si el punto vuelve hacia
//   la izquierda, el dibujo se va borrando.
// - "Recorrer solo": el punto recorre la curva de izquierda a derecha.
// - Los dos gráficos se mueven y hacen zoom juntos (en x).
// Las funciones vienen del tema (campo "funciones:" del .md).
// El HTML está en src/components/interactivos/Recorrer.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas } from '../lib/grafico/controles.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { leerDerivable, cambiosDeSigno } from '../lib/derivadas.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
const F = '<i>f</i>';
const PLANA = 0.02;   // si |f'| es menor que esto, se considera "acostada"
const IMAN = 0.12;    // a esta distancia de un punto con f' = 0, el punto se pega
const NICE = [1, 0.5, 0.25, 0.2, 0.1, 0.05, 0.02, 0.01];

export function iniciarRecorrer(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.funciones);
  const estado = { indice: 0, fn: leerDerivable(textos[0]), x: -2, ceros: [] };

  const arriba = new Plano($('[data-grafico]'), {
    vista: { xMin: -4, xMax: 4, yCentro: 0 },
    descripcion: 'Gráfico de la función con el punto que la recorre',
  });
  const abajo = new Plano($('[data-grafico-derivada]'), {
    vista: { xMin: -4, xMax: 4, yCentro: 0 },
    descripcion: 'Gráfico de la derivada, que se va dibujando',
  });
  const col = arriba.colores;
  let casillas = {};

  const f = (x) => estado.fn.f(x);
  const d = (x) => estado.fn.d(x);
  const colorDe = (m) => (Math.abs(m) < PLANA ? col.vertice : m > 0 ? col.crece : col.decrece);
  const palabraDe = (m) => (Math.abs(m) < PLANA ? 'está acostada' : m > 0 ? 'crece' : 'decrece');

  // --- Los dos gráficos se mueven juntos en x ---
  let sincronizando = false;
  const seguir = (desde, hacia) => () => {
    if (sincronizando) return;
    sincronizando = true;
    hacia.cx = desde.cx;
    hacia.escala = desde.escala;
    hacia._tocado = desde._tocado;
    hacia.pedirDibujo();
    sincronizando = false;
  };
  arriba.alCambiarVista.push(seguir(arriba, abajo));
  abajo.alCambiarVista.push(seguir(abajo, arriba));

  // ------------------------------------------------------- gráfico de arriba

  // la recta tangente
  arriba.agregarCapa((p) => {
    if (!casillas.tangente) return;
    const { x } = estado;
    p.curva((t) => f(x) + d(x) * (t - x), { color: col.derivada, ancho: 2.5, guiones: [9, 6], alfa: 0.85 });
  });
  // la curva
  arriba.agregarCapa((p) => p.curva(f, { color: col.funcion, ancho: 3.5 }));
  // la guía vertical, el vector y el punto
  arriba.agregarCapa((p) => {
    const { x } = estado;
    const y = f(x);
    const m = d(x);
    p.segmento(x, y, x, p.yMin, { color: col.fantasma, ancho: 1.5, guiones: [3, 5], alfa: 0.7 });
    // vector unitario en la dirección de la tangente (los dos ejes tienen la misma escala)
    const largo = Math.hypot(1, m);
    const X0 = p.px(x);
    const Y0 = p.py(y);
    const X1 = p.px(x + 1 / largo);
    const Y1 = p.py(y + m / largo);
    p.flechaPx(X0, Y0, X1, Y1, { color: colorDe(m), ancho: 4.5, punta: 14 });
    p.punto(x, y, { color: col.funcion, radio: 9 });
  });

  // ------------------------------------------------------- gráfico de abajo

  abajo.agregarCapa((p) => {
    const { x } = estado;
    if (casillas.entera) p.curva(d, { color: col.fantasma, ancho: 2.5, guiones: [8, 6], alfa: 0.8 });
    p.curva(d, { color: col.derivada, ancho: 3.5, hasta: x });
    const m = d(x);
    p.segmento(x, p.yMax, x, m, { color: col.fantasma, ancho: 1.5, guiones: [3, 5], alfa: 0.7 });
    // la altura de f'(x): arriba del eje si crece, abajo si decrece
    p.segmento(x, 0, x, m, { color: colorDe(m), ancho: 3 });
    p.punto(x, m, { color: col.derivada, radio: 8 });
  });

  // El punto se arrastra en cualquiera de los dos gráficos (solo importa su x).
  const moverA = (x) => {
    detener();
    let nx = Math.max(arriba.xMin + 0.05, Math.min(arriba.xMax - 0.05, x));
    const cerca = estado.ceros.find((c) => Math.abs(c - nx) < IMAN);
    nx = cerca ?? Math.round(nx * 20) / 20;
    ponerX(nx);
  };
  arriba.agregarArrastrable({ posicion: () => [estado.x, f(estado.x)], mover: moverA });
  abajo.agregarArrastrable({ posicion: () => [estado.x, d(estado.x)], mover: moverA });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const derivadaEl = $('[data-derivada]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  function actualizarLectura() {
    const { x } = estado;
    const m = d(x);
    lecturaEl.innerHTML = `${X} = ${num(x)} → ${F}'(${num(x)}) <b>${igual(Math.abs(m) < 1e-9 ? 0 : m)}</b>: ` +
      `la curva <b style="color:${colorDe(m)}">${palabraDe(m)}</b>`;
  }

  function actualizarFormulas() {
    expresionEl.innerHTML = `${F}(${X}) = ${estado.fn.html}`;
    derivadaEl.hidden = !casillas.formula;
    derivadaEl.innerHTML = estado.fn.derivadaHtml
      ? `${F}'(${X}) = ${estado.fn.derivadaHtml}`
      : `${F}'(${X}): esta fórmula todavía no la sabemos escribir`;
  }

  function actualizarInfo() {
    const partes = [];
    partes.push(itemInfo(col.crece, 'La flechita:', `muestra para dónde va la curva en ese punto (es la dirección de la tangente). ` +
      `<b style="color:${col.crece}">Turquesa</b> si sube (${F}' > 0), <b style="color:${col.decrece}">terracota</b> si baja (${F}' < 0) ` +
      `y <b style="color:${col.vertice}">lila</b> si está acostada (${F}' = 0).`));
    partes.push(itemInfo(col.derivada, 'Abajo:', `se dibuja ${F}'(${X}), la pendiente en cada punto. Donde ${F} crece, ${F}' está <b>arriba</b> del eje; donde decrece, <b>abajo</b>. En los máximos y mínimos, ${F}' vale 0.`));
    if (casillas.formula && estado.fn.derivadaHtml) {
      partes.push(itemInfo(col.derivada, 'Fórmula:', `${F}'(${X}) = ${estado.fn.derivadaHtml}. Probá: ${F}'(${num(estado.x)}) ${igual(d(estado.x))}, igual que en el gráfico.`));
    }
    if (casillas.entera) {
      partes.push(itemInfo(col.fantasma, `${F}' entera:`, `en gris, para comprobar si adivinaste bien la forma antes de recorrer.`));
    }
    if (abajo.relacionY < 1) {
      partes.push(itemInfo(col.fantasma, 'Ojo:', `en el gráfico de abajo el eje <i>y</i> está achicado (cada cuadradito vale más), para que entre ${F}'. Mirá los números del eje.`));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  function ponerX(x) {
    estado.x = x;
    arriba.pedirDibujo();
    abajo.pedirDibujo();
    actualizarLectura();
    if (casillas.formula) actualizarInfo();
  }

  // --------------------------------------------------------------- vistas

  /** Elige dónde centrar los gráficos y cuánto achicar el eje y de f'. */
  function ajustarVistas() {
    const muestras = Array.from({ length: 101 }, (_, i) => -2.5 + (5 * i) / 100);
    const ys = muestras.map(f).filter(Number.isFinite).map((y) => Math.max(-6, Math.min(6, y)));
    arriba.vista.yCentro = Math.round((Math.min(...ys) + Math.max(...ys)) / 2);
    arriba.vistaInicial();

    const ds = muestras.map(d).filter(Number.isFinite);
    const lo = Math.min(0, ...ds);
    const hi = Math.max(0, ...ds);
    const altoUnidades = (abajo.alto / abajo.escala) * 0.85; // lo que entra con relacionY = 1
    const necesaria = altoUnidades / Math.max(hi - lo, 1e-6);
    abajo.relacionY = NICE.find((r) => r <= necesaria) ?? NICE[NICE.length - 1];
    abajo.vista.yCentro = (lo + hi) / 2;
    abajo.vistaInicial();
  }

  // --------------------------------------------------------------- controles

  const botonRecorrer = $('[data-recorrer]');
  const textoRecorrer = botonRecorrer.innerHTML;
  let anim = null;
  function detener() {
    if (!anim) return;
    anim.cancelar();
    anim = null;
    botonRecorrer.innerHTML = textoRecorrer;
  }
  botonRecorrer.addEventListener('click', () => {
    if (anim) { detener(); return; }
    const a = arriba.xMin + 0.1;
    const b = arriba.xMax - 0.1;
    botonRecorrer.innerHTML = 'Parar';
    anim = animar(sinMovimiento() ? 1 : 9000, (t) => ponerX(a + (b - a) * t), () => {
      anim = null;
      botonRecorrer.innerHTML = textoRecorrer;
    });
  });

  casillas = conectarCasillas($('[data-casillas]'), () => {
    arriba.pedirDibujo();
    abajo.pedirDibujo();
    actualizarFormulas();
    actualizarInfo();
  });

  function elegir(i) {
    detener();
    estado.indice = (i + textos.length) % textos.length;
    estado.fn = leerDerivable(textos[estado.indice]);
    estado.ceros = cambiosDeSigno(d, -20, 20, 4000);
    contadorEl.textContent = `Función ${estado.indice + 1} de ${textos.length}`;
    ajustarVistas();
    actualizarFormulas();
    ponerX(-2);
    actualizarInfo();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  elegir(0);
}
