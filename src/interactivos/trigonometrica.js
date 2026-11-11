// ==========================================================================
// INTERACTIVO: funciones trigonométricas (seno, coseno y tangente)
//
// A la izquierda, una circunferencia de radio 1 con un punto que gira.
// A la derecha, el gráfico de la función, que se va dibujando a medida que
// el punto da la vuelta (estilo 3Blue1Brown):
//   - seno: la ALTURA del punto;
//   - coseno: cuánto se corre el punto a la DERECHA del centro;
//   - tangente: la altura donde el radio, alargado, corta la recta tangente
//     de la derecha (tan x = sen x : cos x).
// El ángulo se puede ver en grados o en radianes (botón).
// El HTML está en src/components/interactivos/Trigonometrica.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { dibujarBarrasDeSigno } from '../lib/grafico/signos.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { num, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
// El gráfico de la onda va "apretado" a lo ancho: el ángulo x (en radianes)
// se dibuja en x · ANCHO_ONDA. Así la circunferencia y la onda entran en el celular.
const ANCHO_ONDA = 0.5;
const CENTRO = -1.3; // centro de la circunferencia (en el eje x)
const RAD = Math.PI / 180;

const NOMBRES = { seno: 'sen', coseno: 'cos', tangente: 'tan' };
const FUNCIONES = { seno: Math.sin, coseno: Math.cos, tangente: Math.tan };

/** Puntos notables de cada función en una vuelta (en grados). */
const NOTABLES = {
  seno: {
    ceros: [0, 180, 360], maximos: [90], minimos: [270], asintotas: [], periodo: 360,
    positivo: [[0, 180, false, false]], negativo: [[180, 360, false, false]],
  },
  coseno: {
    ceros: [90, 270], maximos: [0, 360], minimos: [180], asintotas: [], periodo: 360,
    positivo: [[0, 90, true, false], [270, 360, false, true]], negativo: [[90, 270, false, false]],
  },
  tangente: {
    ceros: [0, 180, 360], maximos: [], minimos: [], asintotas: [90, 270], periodo: 180,
    positivo: [[0, 90, false, false], [180, 270, false, false]], negativo: [[90, 180, false, false], [270, 360, false, false]],
  },
};

const mcd = (a, b) => (b ? mcd(b, a % b) : a);

/** Un ángulo en radianes, escrito con π si se puede: 30° → "π/6", 270° → "3π/2". */
export function radianes(grados) {
  const g = Math.round(grados * 1000) / 1000;
  if (Math.abs(g) < 1e-9) return '0';
  if (Math.abs(g / 15 - Math.round(g / 15)) < 1e-9) {
    const n = Math.round(g / 15);
    const d = mcd(Math.abs(n), 12);
    const arriba = n / d;
    const abajo = 12 / d;
    const signo = arriba < 0 ? '−' : '';
    const coef = Math.abs(arriba) === 1 ? '' : String(Math.abs(arriba));
    return `${signo}${coef}π${abajo === 1 ? '' : '/' + abajo}`;
  }
  return '≈ ' + num(grados * RAD);
}

export function iniciarTrigonometrica(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { modo: 'seno', unidad: 'grados', grados: 30 };

  // (mientras da la vuelta, el ángulo tiene decimales: se muestra redondeado)
  const angulo = (g) => (estado.unidad === 'grados' ? `${num(Math.round(g))}°` : radianes(g));
  const fn = () => FUNCIONES[estado.modo];
  const nombre = () => NOMBRES[estado.modo];
  /** ¿La tangente no existe en este ángulo? (90°, 270°) */
  const sinTangente = (g) => estado.modo === 'tangente' && Math.abs(((g % 180) + 180) % 180 - 90) < 1e-9;
  const valor = (g) => (sinTangente(g) ? NaN : fn()(g * RAD));
  // la onda, en coordenadas del gráfico (x apretada)
  const onda = (x) => {
    const g = x / ANCHO_ONDA / RAD;
    return sinTangente(g) ? NaN : fn()(x / ANCHO_ONDA);
  };
  const xOnda = (g) => g * RAD * ANCHO_ONDA;
  const FIN = xOnda(360);

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -2.45, xMax: FIN + 0.3, yCentro: 0 },
    descripcion: 'Circunferencia con un punto que gira y el gráfico de la función',
    ejeX: {
      paso: xOnda(45),
      separacion: 34,
      texto: (x) => {
        if (x < -1e-9) return null; // a la izquierda está la circunferencia
        const g = Math.round(x / ANCHO_ONDA / RAD);
        return angulo(g).replace('≈ ', '');
      },
    },
  });
  const col = plano.colores;
  let casillas = {};

  /** Dentro de una vuelta (o de las que se vean, si está prendido "Período"). */
  const hastaOnda = () => (casillas.periodo ? Math.max(FIN, plano.xMax) : FIN);
  const ondaVisible = (x) => (x >= 0 && x <= hastaOnda() ? onda(x) : NaN);

  // --- Capa 1: C⁺ y C⁻ en el gráfico ---
  plano.agregarCapa((p) => {
    if (!casillas.signos) return;
    const enVuelta = (x) => (x >= 0 && x <= FIN ? onda(x) : NaN);
    p.zonaSigno(enVuelta, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(enVuelta, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    const n = NOTABLES[estado.modo];
    const cortes = [0, ...n.ceros, ...n.asintotas, 360].map(xOnda).sort((a, b) => a - b);
    dibujarBarrasDeSigno(p, enVuelta, cortes);
  });

  // --- Capa 2: la circunferencia, el ángulo y los segmentos ---
  plano.agregarCapa((p) => {
    const a = estado.grados * RAD;
    const cx = CENTRO + Math.cos(a);
    const cy = Math.sin(a);
    const ctx = p.ctx;

    // circunferencia y su eje vertical
    ctx.save();
    ctx.strokeStyle = col.texto;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = p.grosor(2);
    ctx.beginPath();
    ctx.arc(p.px(CENTRO), p.py(0), p.escala, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    p.segmento(CENTRO, -1.2, CENTRO, 1.2, { color: col.texto, ancho: 1, guiones: [3, 5], alfa: 0.45 });
    p.punto(CENTRO, 0, { color: col.texto, radio: 3 });

    // en la tangente: la recta tangente de la derecha
    if (estado.modo === 'tangente') {
      p.segmento(CENTRO + 1, p.yMin, CENTRO + 1, p.yMax, { color: col.texto, ancho: 1.5, alfa: 0.5 });
    }

    // el ángulo (arco lila) y el radio
    ctx.save();
    ctx.strokeStyle = col.vertice;
    ctx.lineWidth = p.grosor(3);
    ctx.beginPath();
    ctx.arc(p.px(CENTRO), p.py(0), p.escala * 0.28, 0, -a, true);
    ctx.stroke();
    ctx.restore();
    if (estado.grados > 12) {
      const medio = a / 2;
      p.etiqueta('x', CENTRO + 0.45 * Math.cos(medio), 0.45 * Math.sin(medio), { color: col.vertice, dx: 0, dy: 0, alinear: 'center', tamano: 15 });
    }
    p.segmento(CENTRO, 0, cx, cy, { color: col.texto, ancho: 2.5 });

    const v = valor(estado.grados);
    const xq = xOnda(estado.grados);
    if (estado.modo === 'seno') {
      p.segmento(cx, 0, cx, cy, { color: col.funcion, ancho: 4.5 });
      p.segmento(cx, cy, xq, cy, { color: col.funcion, ancho: 1.5, guiones: [3, 5], alfa: 0.7 });
    } else if (estado.modo === 'coseno') {
      p.segmento(cx, cy, cx, 0, { color: col.texto, ancho: 1.5, guiones: [3, 5], alfa: 0.6 });
      p.segmento(CENTRO, 0, cx, 0, { color: col.funcion, ancho: 4.5 });
    } else if (Number.isFinite(v)) {
      // el radio alargado hasta la recta tangente
      const tope = Math.max(p.yMin - 1, Math.min(p.yMax + 1, v));
      const ty = tope;
      const tx = CENTRO + 1;
      p.segmento(CENTRO, 0, tx, ty * 1, { color: col.texto, ancho: 1.5, guiones: [5, 5], alfa: 0.7 });
      p.segmento(tx, 0, tx, ty, { color: col.funcion, ancho: 4.5 });
      p.segmento(tx, ty, xq, ty, { color: col.funcion, ancho: 1.5, guiones: [3, 5], alfa: 0.7 });
    }
  });

  // --- Capa 3: la onda (lo recorrido, fuerte; lo que falta, suave) ---
  plano.agregarCapa((p) => {
    const xq = xOnda(estado.grados);
    p.curva(ondaVisible, { color: col.funcion, ancho: 2.5, alfa: 0.25, desde: 0 });
    p.curva(ondaVisible, { color: col.funcion, ancho: 3.5, desde: 0, hasta: xq });
  });

  // --- Capa 4: puntos notables, período y asíntotas ---
  plano.agregarCapa((p) => {
    const n = NOTABLES[estado.modo];
    if (casillas.asintotas && estado.modo === 'tangente') {
      for (const g of n.asintotas) p.lineaVertical(xOnda(g), { color: col.texto, ancho: 1.5, guiones: [3, 6], alfa: 0.8 });
      if (casillas.periodo) {
        for (let g = 450; xOnda(g) < p.xMax; g += 180) p.lineaVertical(xOnda(g), { color: col.texto, ancho: 1.5, guiones: [3, 6], alfa: 0.5 });
      }
    }
    if (casillas.periodo) {
      const y = estado.modo === 'tangente' ? p.yMax - 0.35 : 1.35;
      const x1 = xOnda(0);
      const x2 = xOnda(n.periodo);
      p.segmento(x1, y, x2, y, { color: col.ordenada, ancho: 2.5 });
      p.segmento(x1, y - 0.1, x1, y + 0.1, { color: col.ordenada, ancho: 2.5 });
      p.segmento(x2, y - 0.1, x2, y + 0.1, { color: col.ordenada, ancho: 2.5 });
      p.etiqueta(`se repite cada ${angulo(n.periodo)}`, (x1 + x2) / 2, y, { color: col.ordenada, dx: 0, dy: -13, alinear: 'center', tamano: 13 });
    }
    if (casillas.ceros || casillas.signos) {
      for (const g of n.ceros) p.punto(xOnda(g), 0, { color: col.raices, radio: 5.5 });
    }
    if (casillas.extremos) {
      for (const g of n.maximos) p.punto(xOnda(g), 1, { color: col.vertice, forma: 'rombo', radio: 5 });
      for (const g of n.minimos) p.punto(xOnda(g), -1, { color: col.vertice, forma: 'rombo', radio: 5 });
    }

    // el punto en la circunferencia y el punto en la onda
    const a = estado.grados * RAD;
    const v = valor(estado.grados);
    const xq = xOnda(estado.grados);
    if (Number.isFinite(v)) {
      p.segmento(xq, 0, xq, Math.max(p.yMin - 1, Math.min(p.yMax + 1, v)), { color: col.funcion, ancho: 4.5 });
      if (v > p.yMin && v < p.yMax) p.punto(xq, v, { color: col.funcion, radio: 7 });
    } else {
      p.lineaVertical(xq, { color: col.negativo, ancho: 2, guiones: [4, 5], alfa: 0.9 });
      p.etiqueta('no existe', xq, 0, { color: col.negativo, dx: 6, dy: -14, alinear: 'left', tamano: 13 });
    }
    p.punto(CENTRO + Math.cos(a), Math.sin(a), { color: col.funcion, radio: 9 });
  });

  // --- Puntos que se arrastran: el de la circunferencia y el de la onda ---
  function ajustar(g) {
    g = Math.round(g);
    // se pega a los ángulos "lindos"
    for (const lindo of [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360]) {
      if (Math.abs(g - lindo) <= 3) return lindo;
    }
    return g;
  }
  plano.agregarArrastrable({
    posicion: () => [CENTRO + Math.cos(estado.grados * RAD), Math.sin(estado.grados * RAD)],
    mover: (x, y) => {
      let g = Math.atan2(y, x - CENTRO) / RAD;
      if (g < 0) g += 360;
      // si venía cerca de 360 y pasa el 0, se queda en 360 (y al revés)
      if (estado.grados > 300 && g < 20) g = 360;
      ponerAngulo(ajustar(g));
    },
  });
  plano.agregarArrastrable({
    posicion: () => {
      const v = valor(estado.grados);
      return [xOnda(estado.grados), Number.isFinite(v) ? Math.max(plano.yMin, Math.min(plano.yMax, v)) : 0];
    },
    mover: (x) => ponerAngulo(ajustar(Math.max(0, Math.min(360, x / ANCHO_ONDA / RAD)))),
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');

  function actualizarExpresion() {
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${nombre()}(${X})`;
  }

  function actualizarLectura() {
    const g = estado.grados;
    const v = valor(g);
    const ang = angulo(g);
    if (!Number.isFinite(v)) {
      lecturaEl.innerHTML = `${X} = ${ang}: <b>tan(${ang.replace('≈ ', '')}) no existe</b> <span class="texto-suave">(el radio queda parado y nunca corta la recta)</span>`;
      return;
    }
    lecturaEl.innerHTML = `${X} = ${ang} → ${nombre()}(${ang.replace('≈ ', '')}) <b>${igual(v)}</b>`;
  }

  const item = (color, titulo, cuerpo) =>
    `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

  const lista = (gs) => gs.map(angulo).join(', ').replace(/, ([^,]*)$/, ' y $1');
  const intervalos = (tramos) =>
    tramos.map(([a, b, ca, cb]) => `${ca ? '[' : '('}${angulo(a)}, ${angulo(b)}${cb ? ']' : ')'}`).join(' ∪ ');

  function actualizarInfo() {
    const { modo } = estado;
    const n = NOTABLES[modo];
    const partes = [];

    const queEs = {
      seno: `es la <b>altura</b> del punto en la circunferencia (que tiene radio 1). Arriba del centro es positivo; abajo, negativo.`,
      coseno: `es cuánto se corre el punto <b>a la derecha</b> del centro. Si está a la izquierda, es negativo.`,
      tangente: `es la altura donde el radio, alargado, corta la <b>recta tangente</b> de la derecha. También: tan ${X} = sen ${X} : cos ${X}. (En algunas escuelas se escribe tg.)`,
    };
    partes.push(item(col.funcion, `${nombre()} ${X}`, queEs[modo]));

    if (casillas.ceros) {
      const donde = { seno: 'el punto está a la altura del centro', coseno: 'el punto está justo arriba o justo abajo del centro', tangente: 'el radio está acostado' };
      partes.push(item(col.raices, 'Ceros:', `en una vuelta, en ${lista(n.ceros)}: ${donde[modo]}.`));
    }
    if (casillas.extremos) {
      if (modo === 'tangente') partes.push(item(col.vertice, 'Máximos y mínimos:', 'no tiene: sube sin parar hasta cada asíntota.'));
      else partes.push(item(col.vertice, 'Máximo 1 y mínimo −1:', `máximo en ${lista(n.maximos)}, mínimo en ${lista(n.minimos)}. Nunca se pasa de 1 ni de −1, porque el radio mide 1.`));
    }
    if (casillas.signos) {
      partes.push(item(col.positivo, 'C⁺ (en una vuelta) =', intervalos(n.positivo)));
      partes.push(item(col.negativo, 'C⁻ (en una vuelta) =', intervalos(n.negativo)));
    }
    if (casillas.periodo) {
      partes.push(item(col.ordenada, `Período: ${angulo(n.periodo)}.`, modo === 'tangente'
        ? `La tangente se repite cada media vuelta: el radio alargado del otro lado corta la recta en el mismo lugar.`
        : `Después de una vuelta entera, el punto vuelve al mismo lugar: la curva se repite igual para siempre.`));
    }
    if (casillas.asintotas && modo === 'tangente') {
      partes.push(item(col.texto, 'Asíntotas:', `en ${lista(n.asintotas)} (y cada ${angulo(180)}). Ahí el radio queda parado, paralelo a la recta tangente, y no la corta nunca.`));
    }
    if (casillas.dominio) {
      if (modo === 'tangente') {
        partes.push(item(col.funcion, 'Dominio:', `ℝ menos las asíntotas (${lista(n.asintotas)}, y así cada ${angulo(180)}).`));
        partes.push(item(col.funcion, 'Imagen: ℝ.', 'Puede dar cualquier número.'));
      } else {
        partes.push(item(col.funcion, 'Dominio: ℝ.', 'Se puede girar cualquier ángulo (también más de una vuelta, o para atrás).'));
        partes.push(item(col.funcion, 'Imagen: [−1, 1].', 'El punto nunca sale de la circunferencia de radio 1.'));
      }
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  // --------------------------------------------------------------- controles

  let vuelta = null;
  const botonVuelta = $('[data-vuelta]');

  function ponerAngulo(g, desdeDeslizador = false) {
    estado.grados = g;
    if (!desdeDeslizador) control.poner(g, false, false);
    plano.pedirDibujo();
    actualizarLectura();
  }

  const control = conectarDeslizador(raiz.querySelector('.deslizador[data-param="x"]'), (v) => {
    detenerVuelta();
    ponerAngulo(v, true);
  }, { formato: (v) => angulo(Math.round(v)).replace('≈ ', '≈') });
  estado.grados = control.valor;

  function detenerVuelta() {
    vuelta?.cancelar();
    vuelta = null;
    botonVuelta.textContent = 'Dar una vuelta';
  }

  botonVuelta.addEventListener('click', () => {
    if (vuelta) { detenerVuelta(); return; }
    if (sinMovimiento()) { ponerAngulo(360); return; }
    botonVuelta.textContent = 'Parar';
    vuelta = animar(7000, (t) => ponerAngulo(Math.round(t * 360)), () => { vuelta = null; botonVuelta.textContent = 'Dar una vuelta'; });
  });

  // Seno / Coseno / Tangente
  const botonesModo = [...raiz.querySelectorAll('[data-modo]')];
  const casillaAsintotas = raiz.querySelector('[data-casilla="asintotas"]');
  for (const b of botonesModo) {
    b.addEventListener('click', () => {
      estado.modo = b.dataset.modo;
      for (const o of botonesModo) o.setAttribute('aria-checked', String(o === b));
      casillaAsintotas.hidden = estado.modo !== 'tangente';
      actualizarExpresion();
      actualizarLectura();
      actualizarInfo();
      plano.pedirDibujo();
    });
  }

  // Grados / Radianes
  const botonesUnidad = [...raiz.querySelectorAll('[data-unidad]')];
  for (const b of botonesUnidad) {
    b.addEventListener('click', () => {
      estado.unidad = b.dataset.unidad;
      for (const o of botonesUnidad) o.setAttribute('aria-checked', String(o === b));
      control.mostrar();
      actualizarLectura();
      actualizarInfo();
      plano.pedirDibujo();
    });
  }

  casillas = conectarCasillas($('[data-casillas]'), (nombreCasilla, activa) => {
    if (nombreCasilla === 'periodo') {
      if (activa) plano.mostrarRango(-2.45, xOnda(720), 0.2);
      else plano.vistaInicial();
    }
    plano.pedirDibujo();
    actualizarInfo();
  });
  casillaAsintotas.hidden = true;
  plano.alCambiarVista.push(() => plano.pedirDibujo());

  actualizarExpresion();
  actualizarLectura();
  actualizarInfo();
}
