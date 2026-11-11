// ==========================================================================
// INTERACTIVO 7.b: la integral acumulada
//
// - Arriba, la curva f con un punto que se arrastra. Se pinta el área desde
//   a hasta el x del punto (verde suma, rojo resta).
// - Abajo, con el mismo eje x, se dibuja F(x) = cuánta área se juntó desde a.
//   Si el punto vuelve hacia a, el dibujo se va borrando.
// - Casilla "Pendiente de F": en el punto de abajo, la recta con pendiente
//   f(x). Así se ve que F' = f (es el espejo de "La gráfica de f'(x)").
// - "Recorrer solo": el punto va desde a hasta el borde derecho.
// Los ejemplos vienen del tema (campo "integrales:" del .md).
// El HTML está en src/components/interactivos/Acumulada.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas } from '../lib/grafico/controles.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { leerIntegral, primitivaDe, integrarNum, fraccionHtml } from '../lib/integrales.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
const F = '<i>F</i>';
const NICE = [1, 0.5, 0.25, 0.2, 0.1, 0.05];
const ANCHO = 8; // cuántas unidades de x se ven

export function iniciarAcumulada(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.integrales);
  const estado = { indice: 0, datos: null, prim: null, a: 0, x: 1.5 };

  const arriba = new Plano($('[data-grafico]'), {
    vista: { xMin: -1, xMax: 7, yCentro: 0 },
    descripcion: 'Gráfico de la función con el área que se va juntando',
  });
  const abajo = new Plano($('[data-grafico-acumulada]'), {
    vista: { xMin: -1, xMax: 7, yCentro: 0 },
    descripcion: 'Gráfico de la integral acumulada, que se va dibujando',
  });
  const col = arriba.colores;
  let casillas = {};

  const f = (x) => estado.datos.f.f(x);
  /** F(x): el área con signo desde a hasta x */
  const Fx = (x) => (estado.prim ? estado.prim.P(x) - estado.prim.P(estado.a) : integrarNum(f, estado.a, x, 200));

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

  arriba.agregarCapa((p) => {
    const { a, x } = estado;
    // el área de a hasta x: columnitas de 1 píxel
    const ctx = p.ctx;
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let X0 = Math.floor(p.px(a)); X0 < p.px(x); X0++) {
      const t = p.mx(X0 + 0.5);
      const y = f(t);
      if (!Number.isFinite(y)) continue;
      ctx.fillStyle = y >= 0 ? col.positivo : col.negativo;
      ctx.fillRect(X0, p.py(Math.max(0, y)), 1, Math.abs(p.py(0) - p.py(y)));
    }
    ctx.restore();
    p.curva(f, { color: col.funcion, ancho: 3.5 });
    p.segmento(a, p.yMin, a, p.yMax, { color: col.integral, ancho: 1.5, guiones: [6, 5], alfa: 0.8 });
    p.etiqueta(`a = ${num(a)}`, a, p.yMin, { color: col.integral, dx: 6, dy: -14, alinear: 'left', tamano: 13 });
    p.segmento(x, f(x), x, p.yMin, { color: col.fantasma, ancho: 1.5, guiones: [3, 5], alfa: 0.7 });
    p.punto(x, f(x), { color: col.funcion, radio: 9 });
  });

  // ------------------------------------------------------- gráfico de abajo

  abajo.agregarCapa((p) => {
    const { a, x } = estado;
    if (casillas.entera) p.curva(Fx, { color: col.fantasma, ancho: 2.5, guiones: [8, 6], alfa: 0.8 });
    p.segmento(a, p.yMin, a, p.yMax, { color: col.integral, ancho: 1.5, guiones: [6, 5], alfa: 0.5 });
    p.curva(Fx, { color: col.integral, ancho: 3.5, desde: a, hasta: x });
    const y = Fx(x);
    p.segmento(x, p.yMax, x, y, { color: col.fantasma, ancho: 1.5, guiones: [3, 5], alfa: 0.7 });
    if (casillas.pendiente) {
      const m = f(x);
      const d = 0.9;
      p.segmento(x - d, y - m * d, x + d, y + m * d, { color: col.funcion, ancho: 3 });
      p.etiqueta(`pendiente = f(${num(x)}) ${igual(m)}`, x, y, { color: col.funcion, dx: 12, dy: m > 0 ? 16 : -16, tamano: 13 });
    }
    p.punto(x, y, { color: col.integral, radio: 8 });
  });

  // El punto se arrastra en cualquiera de los dos gráficos (de a 0.05, y nunca antes de a).
  const moverA = (x) => {
    detener();
    ponerX(Math.max(estado.a, Math.min(arriba.xMax - 0.05, Math.round(x * 20) / 20)));
  };
  arriba.agregarArrastrable({ posicion: () => [estado.x, f(estado.x)], mover: moverA });
  abajo.agregarArrastrable({ posicion: () => [estado.x, Fx(estado.x)], mover: moverA });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const primitivaEl = $('[data-primitiva]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  /** La fórmula de F (la primitiva menos su valor en a). */
  function formulaF() {
    if (!estado.prim) return null;
    const pa = estado.prim.P(estado.a);
    if (Math.abs(pa) < 1e-9) return estado.prim.html;
    return `${estado.prim.html} ${pa > 0 ? '−' : '+'} ${fraccionHtml(Math.abs(pa))}`;
  }

  function actualizarLectura() {
    const { a, x } = estado;
    lecturaEl.innerHTML = `${X} = ${num(x)} → ${F}(${num(x)}) <b class="color-integral">${igual(Fx(x))}</b>: ` +
      `el área de ${num(a)} a ${num(x)}`;
  }

  function actualizarFormulas() {
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${estado.datos.f.html}`;
    primitivaEl.hidden = !casillas.formula;
    const fF = formulaF();
    primitivaEl.innerHTML = fF ? `${F}(${X}) = ${fF}` : `${F}(${X}): esta fórmula todavía no la sabemos escribir`;
  }

  function actualizarInfo() {
    const { a, x } = estado;
    const partes = [];
    partes.push(itemInfo(col.positivo, 'Arriba:', `se pinta el área desde <i>a</i> = ${num(a)} hasta el punto. Lo de arriba del eje suma (verde) y lo de abajo resta (rojo).`));
    partes.push(itemInfo(col.integral, 'Abajo:', `${F}(${X}) dice cuánta área se juntó. Donde <i>f</i> es positiva, ${F} <b>sube</b>; donde es negativa, ${F} <b>baja</b>. Donde <i>f</i> vale 0, ${F} tiene un máximo o un mínimo.`));
    partes.push(itemInfo(col.funcion, 'F\' = f:', `la pendiente de ${F} en cada punto es <i>f</i>(${X}): es lo mismo que pasaba con <i>f</i> y <i>f</i>'. La integral es la <b>inversa</b> de la derivada.`));
    if (casillas.pendiente) {
      partes.push(itemInfo(col.funcion, 'Pendiente de F:', `en ${X} = ${num(x)} es ${igual(f(x)).replace('= ', '')}, igual a la altura de <i>f</i> arriba.`));
    }
    if (casillas.formula && formulaF()) {
      partes.push(itemInfo(col.integral, 'Fórmula:', `${F}(${X}) = ${formulaF()}. Si la derivás, da <i>f</i>(${X}) = ${estado.datos.f.html}.`));
    }
    if (abajo.relacionY < 1) {
      partes.push(itemInfo(col.fantasma, 'Ojo:', `en el gráfico de abajo el eje <i>y</i> está achicado (cada cuadradito vale más), para que entre ${F}. Mirá los números del eje.`));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  function ponerX(x) {
    estado.x = x;
    arriba.pedirDibujo();
    abajo.pedirDibujo();
    actualizarLectura();
    if (casillas.pendiente) actualizarInfo();
  }

  // --------------------------------------------------------------- vistas

  function ajustarVistas() {
    const { a } = estado;
    // se mira el tramo más interesante: de a hasta a + 4
    const muestras = Array.from({ length: 81 }, (_, i) => a + (4 * i) / 80);
    const ys = [0, ...muestras.map(f).filter(Number.isFinite).map((y) => Math.max(-5, Math.min(5, y)))];
    const yLo = Math.min(...ys);
    const yHi = Math.max(...ys);
    const mitadAlto = (arriba.alto / (arriba.ancho / ANCHO)) / 2; // media altura, en unidades
    // centrado, pero sin que se corte la parte de abajo
    arriba.vista = { xMin: a - 1, xMax: a + ANCHO - 1, yCentro: Math.min((yLo + yHi) / 2, yLo - 0.6 + mitadAlto) };
    arriba.vistaInicial();

    const Fs = muestras.map(Fx).filter(Number.isFinite);
    const lo = Math.min(0, ...Fs) - 0.3;
    const hi = Math.max(0, ...Fs) + 0.3;
    const altoUnidades = (abajo.alto / abajo.escala) * 0.85;
    const necesaria = altoUnidades / Math.max(hi - lo, 1e-6);
    abajo.relacionY = NICE.find((r) => r <= necesaria) ?? NICE[NICE.length - 1];
    abajo.vista = { xMin: a - 1, xMax: a + ANCHO - 1, yCentro: (lo + hi) / 2 };
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
    const a = estado.a;
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
    estado.datos = leerIntegral(textos[estado.indice]);
    estado.prim = primitivaDe(estado.datos.f);
    estado.a = estado.datos.a;
    contadorEl.textContent = `Función ${estado.indice + 1} de ${textos.length}`;
    ajustarVistas();
    actualizarFormulas();
    ponerX(estado.a + 1.5);
    actualizarInfo();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  elegir(0);
}
