// ==========================================================================
// INTERACTIVO: límites
//
// - La curva, una línea vertical en x = a y dos puntos sobre la curva:
//   uno a la izquierda de a (lila) y otro a la derecha (rosa), los dos a
//   distancia d de a.
// - "Acercarse a a" achica d (1 → 0.1 → 0.01 → 0.001), animado: los puntos
//   se acercan a a y arriba se leen sus valores de f(x).
// - Una tablita x | f(x) con a en el medio, que se llena desde las puntas,
//   como se hace en el pizarrón.
// - Al final dice a qué se acerca cada lado y si el límite existe:
//   hueco (0 : 0), continua, salto (los lados no coinciden) o infinito.
// - Casilla "Qué pasa justo en a": muestra f(a), que puede no existir o
//   ser otro número. El límite mira lo que pasa CERCA de a, no EN a.
// Los ejemplos vienen del tema (campo "limites:" del .md).
// El HTML está en src/components/interactivos/Limite.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { animar, sinMovimiento } from '../lib/grafico/animacion.js';
import { leerLimite, analizarLimite } from '../lib/limites.js';
import { condicionHtml } from '../lib/partidas.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, igual } from '../lib/numeros.js';

const X = '<i>x</i>';
const F = '<i>f</i>';
const HITOS = [1, 0.1, 0.01, 0.001]; // las distancias que se anotan en la tabla
const D_FINAL = 0.001;               // hasta dónde llega "Acercarse a a"
const EPS = 1e-9;

const decimalesDe = (v) => (String(Math.abs(v)).split('.')[1] ?? '').length;

/** Redondea d: de a 0.01 si es grande; con 2 cifras si es chico (0.035, 0.0012). */
function redondearD(d) {
  if (Math.abs(d) >= 0.1) return Math.round(d * 100) / 100;
  return Number(d.toPrecision(2));
}

/** Un valor del límite escrito: 2, +∞, −∞ */
function limiteTexto(v) {
  if (v === Infinity) return '+∞';
  if (v === -Infinity) return '−∞';
  return num(v, 3);
}

/** lím con la flechita abajo: lím x→1 (o x→1⁻ / x→1⁺ con lado) */
function limHtml(a, lado = '') {
  return `<span class="lim">lím<sub>${X} → ${num(a)}${lado}</sub></span> ${F}(${X})`;
}

export function iniciarLimite(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const ejemplos = JSON.parse(raiz.dataset.limites);
  const estado = { indice: 0, lim: leerLimite(ejemplos[0]), d: 1 };
  let datos = analizarLimite(estado.lim);

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -3, xMax: 5, yCentro: 2 },
    descripcion: 'Gráfico de la función con dos puntos que se acercan a a',
  });
  const col = plano.colores;
  const colIzq = col.vertice;
  const colDer = col.ordenada;
  let casillas = {};

  const f = (x) => estado.lim.f(x);
  const a = () => estado.lim.a;

  // --- Capa 1: la línea vertical en x = a y la horizontal del límite ---
  plano.agregarCapa((p) => {
    p.lineaVertical(a(), { color: col.textoSuave, ancho: 1.5, guiones: [6, 6], alfa: 0.8 });
    p.etiqueta(`a = ${num(a())}`, a(), p.yMin, { color: col.textoSuave, dx: 6, dy: -10, tamano: 13 });
    if (datos.existe && estado.d <= 0.01 + EPS) {
      p.lineaHorizontal(datos.L, { color: col.raices, ancho: 1.5, guiones: [6, 6], alfa: 0.9 });
      p.etiqueta(`L = ${limiteTexto(datos.L)}`, p.xMin, datos.L, { color: col.raices, dx: 8, dy: -8, tamano: 13 });
    }
  });

  // --- Capa 2: la curva (si es partida, cada tramo con sus puntas) ---
  plano.agregarCapa((p) => {
    const { tramos } = estado.lim;
    if (!tramos) { p.curva(f, { color: col.funcion, ancho: 3.5 }); return; }
    for (const t of tramos) {
      p.curva((x) => t.formula.f(x), { color: col.funcion, ancho: 3.5, desde: t.lo, hasta: t.hi });
    }
    for (const t of tramos) {
      if (Number.isFinite(t.lo)) p.punto(t.lo, t.formula.f(t.lo), { color: col.funcion, radio: 6, hueco: !t.loCerrado });
      if (Number.isFinite(t.hi)) p.punto(t.hi, t.formula.f(t.hi), { color: col.funcion, radio: 6, hueco: !t.hiCerrado });
    }
  });

  // --- Capa 3: el hueco y lo que pasa justo en a ---
  plano.agregarCapa((p) => {
    if (datos.caso === 'hueco') p.punto(a(), datos.L, { color: col.funcion, radio: 7, hueco: true });
    if (!casillas.enA) return;
    if (Number.isFinite(datos.valor)) {
      p.punto(a(), datos.valor, { color: col.raices, radio: 7 });
      p.etiqueta(`f(${num(a())}) =${num(datos.valor, 3)}`, a(), datos.valor, { color: col.raices, dx: 12, dy: 18, tamano: 13 });
    } else if (datos.caso === 'hueco') {
      p.etiqueta(`f(${num(a())}) no existe`, a(), datos.L, { color: col.raices, dx: 12, dy: 18, tamano: 13 });
    }
  });

  // --- Capa 4: los dos puntos que se acercan ---
  plano.agregarCapa((p) => {
    const { d } = estado;
    for (const [lado, color] of [[-1, colIzq], [1, colDer]]) {
      const x = a() + lado * d;
      const y = f(x);
      if (!Number.isFinite(y)) continue;
      p.segmento(x, 0, x, y, { color, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
      p.punto(x, 0, { color, radio: 4 });
      p.punto(x, y, { color, radio: 7.5 });
    }
    // el hueco va encima, para que se siga viendo cuando los puntos llegan
    if (datos.caso === 'hueco') p.punto(a(), datos.L, { color: col.funcion, radio: 7, hueco: true });
  });

  // Los puntos se arrastran sobre la curva: cambian d (los dos a la vez).
  for (const lado of [-1, 1]) {
    plano.agregarArrastrable({
      posicion: () => [a() + lado * estado.d, f(a() + lado * estado.d)],
      mover: (x) => {
        detener();
        const d = Math.round(Math.abs(x - a()) * 20) / 20;
        ponerD(Math.max(0.05, Math.min(2, d)));
      },
    });
  }

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const tablaEl = $('[data-tabla]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  function actualizarExpresion() {
    const { tramos, formula } = estado.lim;
    if (formula) {
      expresionEl.className = 'expresion';
      expresionEl.innerHTML = `${F}(${X}) = ${formula.html()}`;
      return;
    }
    expresionEl.className = 'expresion expresion-llave';
    const filas = tramos.map((t) =>
      `<span class="llave-fila"><span class="llave-formula">${t.formula.html()}</span><span class="llave-si">si ${condicionHtml(t)}</span></span>`).join('');
    expresionEl.innerHTML = `<span class="llave-nombre">${F}(${X}) =</span><span class="llave" style="--filas:${tramos.length}">${filas}</span>`;
  }

  /** Un valor de f para la lectura y la tabla, con tantos decimales como d. */
  function valorTexto(v, d) {
    if (!Number.isFinite(v)) return 'no existe';
    return num(v, Math.min(6, Math.max(2, decimalesDe(d))));
  }

  function actualizarLectura() {
    const { d } = estado;
    const k = Math.max(2, decimalesDe(d));
    const renglon = (lado, color, nombre) => {
      const x = a() + lado * d;
      return `<span style="color:${color}">${nombre}: ${X} = ${num(x, k)} → ${F}(${X}) = <b>${valorTexto(f(x), d)}</b></span>`;
    };
    lecturaEl.innerHTML = renglon(-1, colIzq, 'por izquierda') + renglon(1, colDer, 'por derecha');
  }

  function actualizarTabla() {
    if (!casillas.tabla) { tablaEl.hidden = true; return; }
    tablaEl.hidden = false;
    const visto = (m) => estado.d <= m + EPS;
    const celdasX = [];
    const celdasF = [];
    for (const m of HITOS) {
      const x = a() - m;
      const c = visto(m) ? '' : 'oculta';
      celdasX.push(`<td class="${c} col-izq">${num(x, 3)}</td>`);
      celdasF.push(`<td class="${c} col-izq">${valorTexto(f(x), m)}</td>`);
    }
    const llegue = visto(D_FINAL);
    celdasX.push(`<td class="col-a"><b>${num(a())}</b></td>`);
    celdasF.push(`<td class="col-a"><b>${llegue && datos.existe ? limiteTexto(datos.L) : '?'}</b></td>`);
    for (const m of [...HITOS].reverse()) {
      const x = a() + m;
      const c = visto(m) ? '' : 'oculta';
      celdasX.push(`<td class="${c} col-der">${num(x, 3)}</td>`);
      celdasF.push(`<td class="${c} col-der">${valorTexto(f(x), m)}</td>`);
    }
    let nota;
    if (!llegue) nota = `Acercate a <i>a</i> por los dos lados y fijate a qué número se acerca ${F}(${X}).`;
    else if (datos.existe) nota = `Por los dos lados se acerca a <b class="color-raices">${limiteTexto(datos.L)}</b>.`;
    else if (datos.caso === 'infinito') nota = `Por los dos lados crece sin parar: se va a <b>${limiteTexto(datos.izq)}</b>.`;
    else nota = `Por izquierda: <b>${limiteTexto(datos.izq)}</b>. Por derecha: <b>${limiteTexto(datos.der)}</b>. No coinciden.`;
    tablaEl.innerHTML = `<table class="tabla-valores tabla-limite"><tr><th>${X}</th>${celdasX.join('')}</tr><tr><th>${F}(${X})</th>${celdasF.join('')}</tr></table>` +
      `<p class="tabla-nota">${nota}</p>`;
    // que se vea la columna del medio (la de a)
    const medio = tablaEl.querySelector('.col-a');
    if (medio) tablaEl.scrollLeft = medio.offsetLeft - tablaEl.clientWidth / 2 + medio.offsetWidth / 2;
  }

  function actualizarInfo() {
    const partes = [];
    const { izq, der, L, valor, caso } = datos;
    const llegue = estado.d <= 0.01 + EPS;
    const an = num(a());

    partes.push(itemInfo(colIzq, 'Por izquierda:', `${X} se acerca a ${an} con números más chicos. ` +
      (llegue ? `${F}(${X}) ${Number.isFinite(izq) ? "se acerca a" : "se va a"} <b>${limiteTexto(izq)}</b>: ${limHtml(a(), '⁻')} = ${limiteTexto(izq)}.` : '')));
    partes.push(itemInfo(colDer, 'Por derecha:', `${X} se acerca a ${an} con números más grandes. ` +
      (llegue ? `${F}(${X}) ${Number.isFinite(der) ? "se acerca a" : "se va a"} <b>${limiteTexto(der)}</b>: ${limHtml(a(), '⁺')} = ${limiteTexto(der)}.` : '')));

    if (llegue) {
      let cuerpo;
      if (datos.existe) cuerpo = `los dos lados se acercan al mismo número, así que el límite <b>existe</b>: ${limHtml(a())} = <b>${limiteTexto(L)}</b>.`;
      else if (caso === 'infinito') cuerpo = `los dos lados crecen sin parar. Se escribe ${limHtml(a())} = ${limiteTexto(izq)}: en ${X} = ${an} hay una <b>asíntota vertical</b>.`;
      else if (caso === 'salto' && (!Number.isFinite(izq) || !Number.isFinite(der))) cuerpo = `por izquierda se va a ${limiteTexto(izq)} y por derecha a ${limiteTexto(der)}, así que el límite <b>no existe</b>. En ${X} = ${an} hay una <b>asíntota vertical</b>.`;
      else if (caso === 'salto') cuerpo = `cada lado se acerca a un número distinto (${limiteTexto(izq)} y ${limiteTexto(der)}), así que el límite <b>no existe</b>. En el gráfico se ve un salto.`;
      else cuerpo = 'la función no se acerca a ningún número.';
      partes.push(itemInfo(col.raices, 'El límite:', cuerpo));
    }

    if (casillas.enA) {
      let cuerpo;
      const { formula } = estado.lim;
      const cuenta = formula ? `${F}(${an}) = ${formula.cuenta(a())}` : `${F}(${an})`;
      if (caso === 'hueco') cuerpo = `${cuenta} → da 0 : 0, que no se puede hacer: <b>${F}(${an}) no existe</b>. Pero el límite sí existe: en el gráfico hay un <b>hueco</b>. El límite no mira lo que pasa <b>en</b> ${an}, sino <b>cerca</b>.`;
      else if (caso === 'continua') cuerpo = `${cuenta} = ${num(valor, 3)}, igual que el límite. Cuando pasa eso, la función es <b>continua</b> en ${an}: se dibuja sin levantar el lápiz. Ahí el límite se calcula reemplazando.`;
      else if (caso === 'distinto') cuerpo = `${cuenta} = ${num(valor, 3)}, pero el límite es ${limiteTexto(L)}. El punto está "fuera de lugar".`;
      else if (Number.isFinite(valor)) cuerpo = `${cuenta} = ${num(valor, 3)}. Aunque exista, el límite igual puede no existir.`;
      else cuerpo = `${cuenta} no existe (no se puede dividir por 0).`;
      partes.push(itemInfo(col.raices, `Justo en ${X} = ${an}:`, cuerpo));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
  }

  function actualizar() {
    plano.pedirDibujo();
    actualizarLectura();
    actualizarTabla();
    actualizarInfo();
    actualizarBoton();
  }

  // --------------------------------------------------------------- controles

  const formatoD = (v) => num(v, Math.max(2, decimalesDe(v)));
  const deslD = conectarDeslizador($('.deslizador[data-param="d"]'), (v) => { detener(); ponerD(v); }, { formato: formatoD });

  function ponerD(v) {
    estado.d = redondearD(Math.max(D_FINAL, v));
    deslD.poner(estado.d, false, false);
    actualizar();
  }

  // "Acercarse a a": d va hacia 0.001 (cada 1.8 segundos, 10 veces más chico)
  const boton = $('[data-acercar]');
  let anim = null;
  function detener() {
    if (anim) { anim.cancelar(); anim = null; actualizarBoton(); }
  }
  function actualizarBoton() {
    if (anim) boton.innerHTML = 'Parar';
    else if (estado.d <= D_FINAL + EPS) boton.innerHTML = 'Alejarse de nuevo';
    else boton.innerHTML = 'Acercarse a <i>a</i>';
  }
  boton.addEventListener('click', () => {
    if (anim) { detener(); return; }
    if (estado.d <= D_FINAL + EPS) { ponerD(1); return; }
    const d0 = estado.d;
    const veces = Math.log10(d0 / D_FINAL);
    const duracion = sinMovimiento() ? 1 : Math.max(800, veces * 1800);
    anim = animar(duracion, (t) => {
      estado.d = redondearD(d0 * (D_FINAL / d0) ** t);
      deslD.poner(estado.d, false, false);
      actualizar();
    }, () => { anim = null; ponerD(D_FINAL); });
    actualizarBoton();
  });

  casillas = conectarCasillas($('[data-casillas]'), () => { plano.pedirDibujo(); actualizarTabla(); actualizarInfo(); });

  function elegir(i) {
    detener();
    estado.indice = (i + ejemplos.length) % ejemplos.length;
    estado.lim = leerLimite(ejemplos[estado.indice]);
    datos = analizarLimite(estado.lim);
    contadorEl.textContent = `Ejemplo ${estado.indice + 1} de ${ejemplos.length}`;
    // la vista: a en el medio y, de alto, el límite (o el valor en a, o 0)
    const yc = datos.existe ? datos.L : Number.isFinite(datos.izq) ? (datos.izq + datos.der) / 2 : 0;
    plano.vista = { xMin: a() - 4, xMax: a() + 4, yCentro: Number.isFinite(yc) ? yc : 0 };
    plano.vistaInicial();
    actualizarExpresion();
    ponerD(1);
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  elegir(0);
}
