// ==========================================================================
// INTERACTIVO: la balanza de las ecuaciones.
//
// Cada plato tiene fichas (como en Términos semejantes): una barrita es una x,
// un cuadradito es un 1, y las rojas punteadas son negativas.
//
// Modo "probar": se elige un valor para x y la balanza se inclina hacia el lado
// que pesa más. Cuando se equilibra, ese valor es la solución.
// Modo "resolver": se despeja paso a paso. Lo que se hace de un lado se hace
// del otro, y por eso la balanza siempre queda equilibrada.
//
// El HTML está en src/components/interactivos/Balanza.astro.
// Las cuentas (leer la ecuación y armar los pasos) están en src/lib/lineal.js.
// ==========================================================================

import { leerEcuacion, pasosEcuacion, ecuacionHtml, valorLado } from '../lib/lineal.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { sinMovimiento } from '../lib/grafico/animacion.js';
import { animarCambio } from '../lib/flip.js';
import { num } from '../lib/numeros.js';

const X = '<i>x</i>';
const par = (v) => (v < 0 ? `(${num(v)})` : num(v));
const TIEMPO_ACCION = 1500; // ms que se ve la acción (fichas que llegan o se anulan) antes del resultado

// --------------------------------------------------------------------------
// Fichas de un plato
// --------------------------------------------------------------------------
// Cada ficha: { id, tipo: 'x' | '1' | 'bloque', neg, clase, texto }
// Los id son fijos ("i" o "d" + tipo + signo + número), así la animación sabe
// qué ficha es cuál de un paso al otro.

function agregar(lista, p, tipo, desde, hasta, neg, clase = '') {
  for (let i = desde; i < hasta; i++) lista.push({ id: `${p}${tipo}${neg ? '-' : '+'}${i}`, tipo, neg, clase });
}

/** Las fichas de un lado { x, n }. Si n no es entero, va un bloque con el número. */
function fichasDe(lado, p) {
  const l = [];
  agregar(l, p, 'x', 0, Math.max(lado.x, 0), false);
  agregar(l, p, 'x', 0, Math.max(-lado.x, 0), true);
  if (Number.isInteger(lado.n)) {
    agregar(l, p, '1', 0, Math.max(lado.n, 0), false);
    agregar(l, p, '1', 0, Math.max(-lado.n, 0), true);
  } else {
    l.push({ id: `${p}bloque`, tipo: 'bloque', neg: lado.n < 0, clase: '', texto: num(lado.n) });
  }
  return l;
}

/**
 * Las fichas mientras se suma lo mismo a los dos lados: llegan las nuevas
 * y cada positiva se anula con una negativa del mismo tipo.
 * Se anulan las últimas de cada grupo, así las que quedan conservan su id.
 */
function fichasSumando(lado, accion, p) {
  const l = [];
  for (const [tipo, actual, suma] of [['x', lado.x, accion.x], ['1', lado.n, accion.n]]) {
    const P0 = Math.max(actual, 0);
    const N0 = Math.max(-actual, 0);
    const P = P0 + Math.max(suma, 0);
    const N = N0 + Math.max(-suma, 0);
    const m = Math.min(P, N);
    const clase = (i, cant, cant0) => [i >= cant0 ? 'nueva' : '', i >= cant - m ? 'anulada' : ''].join(' ');
    for (let i = 0; i < P; i++) l.push({ id: `${p}${tipo}+${i}`, tipo, neg: false, clase: clase(i, P, P0) });
    for (let i = 0; i < N; i++) l.push({ id: `${p}${tipo}-${i}`, tipo, neg: true, clase: clase(i, N, N0) });
  }
  return l;
}

/** Las fichas repartidas en k grupos (devuelve una lista de grupos). */
function gruposRepartiendo(lado, k, p) {
  const grupos = Array.from({ length: k }, () => []);
  if (lado.x !== 0) {
    for (let g = 0; g < k; g++) grupos[g].push({ id: `${p}x+${g}`, tipo: 'x', neg: false, clase: '' });
    return grupos;
  }
  const n = lado.n;
  if (n % k !== 0) return null; // no se reparte justo: se muestra como división
  const q = Math.abs(n / k);
  for (let g = 0; g < k; g++) agregar(grupos[g], p, '1', g * q, (g + 1) * q, n < 0);
  return grupos;
}

function htmlFicha(f, i, valorX) {
  const tipoClase = f.tipo === 'x' ? 'equis' : f.tipo === '1' ? 'uno' : 'bloque';
  let texto;
  if (f.tipo === 'bloque') texto = f.texto;
  else if (f.tipo === 'x') texto = valorX === undefined ? `${f.neg ? '−' : ''}${X}` : num(f.neg ? -valorX : valorX);
  else texto = f.neg ? '−1' : '1';
  return `<span class="ficha-algebra ${tipoClase}${f.neg ? ' negativa' : ''} ${f.clase}" data-id="${f.id}" style="--i:${i}">${texto}</span>`;
}

const htmlFichas = (lista, valorX) => lista.map((f, i) => htmlFicha(f, i, valorX)).join('');

// --------------------------------------------------------------------------

export function iniciarBalanza(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const ecuaciones = JSON.parse(raiz.dataset.ecuaciones);
  const modo = raiz.dataset.modo;

  const balanzaEl = $('[data-balanza]');
  const brazo = $('[data-brazo]');
  const platos = { izq: $('[data-plato="izq"]'), der: $('[data-plato="der"]') };
  const fichasEl = { izq: platos.izq.querySelector('[data-fichas]'), der: platos.der.querySelector('[data-fichas]') };
  const expresionEl = $('[data-expresion]');
  const textoEl = $('[data-texto]');
  const contadorEl = $('[data-contador]');

  // ---- Inclinación: positiva = baja el plato derecho
  let grados = 0;
  function inclinar(g) {
    grados = g;
    const L = brazo.offsetWidth;
    const dy = (L / 2) * Math.sin((g * Math.PI) / 180);
    brazo.style.transform = `rotate(${g}deg)`;
    platos.izq.style.transform = `translateY(${-dy}px)`;
    platos.der.style.transform = `translateY(${dy}px)`;
    balanzaEl.classList.toggle('desequilibrada', g !== 0);
  }
  new ResizeObserver(() => inclinar(grados)).observe(balanzaEl);

  /** Ángulo según cuánto más pesa la derecha (diferencia de pesos). */
  const anguloPara = (dif) => (dif === 0 ? 0 : Math.sign(dif) * Math.min(12, Math.max(4, Math.abs(dif) * 2)));

  let indice = 0;
  const cabecera = { anterior: $('[data-anterior]'), proxima: $('[data-proxima]') };

  if (modo === 'probar') iniciarProbar(); else iniciarResolver();

  function elegirEcuacion(i, alElegir) {
    indice = (i + ecuaciones.length) % ecuaciones.length;
    contadorEl.textContent = `Ecuación ${indice + 1} de ${ecuaciones.length}`;
    alElegir(leerEcuacion(ecuaciones[indice]));
  }

  // ======================================================================
  // Modo probar
  // ======================================================================
  function iniciarProbar() {
    let ec;
    let valor = 0;
    const probados = new Map();
    const probadosEl = $('[data-probados]');

    /** "2 · 3 + 1 = 7" (cuánto pesa un lado con ese valor de x) */
    function cuenta(lado, v) {
      const partes = [];
      if (lado.x !== 0) partes.push(lado.x === 1 ? par(v) : lado.x === -1 ? `−${par(v)}` : `${num(lado.x)} · ${par(v)}`);
      if (lado.n !== 0 || partes.length === 0) {
        if (partes.length === 0) partes.push(num(lado.n));
        else partes.push(`${lado.n < 0 ? '−' : '+'} ${num(Math.abs(lado.n))}`);
      }
      const total = valorLado(lado, v);
      // si no hay cuenta para hacer (un número solo, o una x sola), va directo el total
      const hayCuenta = partes.length > 1 || (lado.x !== 0 && lado.x !== 1);
      return hayCuenta ? `${partes.join(' ')} = ${num(total)}` : num(total);
    }

    function dibujar() {
      const pi = valorLado(ec.izq, valor);
      const pd = valorLado(ec.der, valor);
      fichasEl.izq.innerHTML = htmlFichas(fichasDe(ec.izq, 'i'), valor);
      fichasEl.der.innerHTML = htmlFichas(fichasDe(ec.der, 'd'), valor);
      inclinar(anguloPara(pd - pi));
      expresionEl.innerHTML = ecuacionHtml(ec.izq, '=', ec.der);

      let t = `Con ${X} = <b>${num(valor)}</b> (cada barrita pesa ${num(valor)}): la izquierda pesa <b>${cuenta(ec.izq, valor)}</b> y la derecha pesa <b>${cuenta(ec.der, valor)}</b>. `;
      if (pi === pd) {
        t += `<b class="pos">¡Está equilibrada!</b> ${X} = ${num(valor)} es la <b>solución</b>: con ese valor, los dos lados dan lo mismo.`;
      } else {
        t += `Pesa más la <b>${pd > pi ? 'derecha' : 'izquierda'}</b>: ${X} = ${num(valor)} no es solución.`;
        const k = ec.izq.x - ec.der.x;
        if (k !== 0) {
          const sol = (ec.der.n - ec.izq.n) / k;
          t += ` Probá con un número más ${sol > valor ? 'grande' : 'chico'}.`;
        }
      }
      textoEl.innerHTML = t;
      textoEl.classList.toggle('final', pi === pd);

      probadosEl.innerHTML = probados.size
        ? `Probaste: ${[...probados.entries()].sort((a, b) => a[0] - b[0]).map(([v, ok]) => `<span class="probado ${ok ? 'si' : 'no'}">${num(v)} ${ok ? '✓' : '✗'}</span>`).join(' ')}`
        : '';
    }

    function probar(v) {
      valor = v;
      probados.set(v, valorLado(ec.izq, v) === valorLado(ec.der, v));
      dibujar();
    }

    const desl = conectarDeslizador($('.deslizador[data-param="x"]'), probar);
    const alElegir = (nueva) => { ec = nueva; probados.clear(); desl.poner(0); probar(0); };
    cabecera.anterior.addEventListener('click', () => elegirEcuacion(indice - 1, alElegir));
    cabecera.proxima.addEventListener('click', () => elegirEcuacion(indice + 1, alElegir));
    elegirEcuacion(0, alElegir);
  }

  // ======================================================================
  // Modo resolver (paso a paso)
  // ======================================================================
  function iniciarResolver() {
    expresionEl.hidden = true;
    const renglonesEl = $('[data-renglones]');
    const botonSiguiente = $('[data-siguiente]');
    const botonTodo = $('[data-todo]');
    let pasos = [];
    let paso = 0;
    let temporizador = null;

    // Al dar vuelta la ecuación, cada plato se queda con las fichas del otro
    const prefijos = (i) => (pasos[i]?.accion?.tipo === 'girar' ? { izq: 'd', der: 'i' } : { izq: 'i', der: 'd' });

    function inclinacionDe(i) {
      const p = pasos[i];
      return p.fin === 'ninguno' ? anguloPara(p.der.n - p.izq.n) : 0;
    }

    /** Las fichas del resultado del paso i. */
    function ponerResultado(i, animar) {
      const p = pasos[i];
      const pre = prefijos(i);
      const cambio = () => {
        fichasEl.izq.innerHTML = htmlFichas(fichasDe(p.izq, pre.izq));
        fichasEl.der.innerHTML = htmlFichas(fichasDe(p.der, pre.der));
      };
      if (animar) animarCambio(balanzaEl, cambio, { duracion: 650 }); else cambio();
      inclinar(inclinacionDe(i));
    }

    /** Las fichas mientras se hace la acción del paso i (llegan, se anulan o se reparten). */
    function ponerAccion(i) {
      const ant = pasos[i - 1];
      const { accion } = pasos[i];
      if (accion.tipo === 'sumar') {
        fichasEl.izq.innerHTML = htmlFichas(fichasSumando(ant.izq, accion, 'i'));
        fichasEl.der.innerHTML = htmlFichas(fichasSumando(ant.der, accion, 'd'));
      } else if (accion.tipo === 'repartir') {
        animarCambio(balanzaEl, () => {
          for (const [lado, p] of [['izq', 'i'], ['der', 'd']]) {
            const grupos = gruposRepartiendo(ant[lado], accion.k, p);
            fichasEl[lado].innerHTML = grupos
              ? grupos.map((g, j) => `<span class="grupo-plato${j > 0 ? ' tenue' : ''}">${htmlFichas(g)}</span>`).join('')
              : htmlFichas([{ id: `${p}bloque`, tipo: 'bloque', neg: ant[lado].n < 0, clase: 'nueva', texto: `${num(ant[lado].n)} : ${num(accion.k)}` }]);
          }
        });
      }
    }

    function escribir() {
      const lineas = [];
      for (let j = 0; j <= paso; j++) {
        const p = pasos[j];
        const nota = j < paso ? pasos[j + 1].nota : '';
        const clases = ['renglon'];
        if (j === paso) clases.push('actual');
        if (p.fin === 'solucion' && j === paso) clases.push('final');
        // si la solución no es entera, se escribe como fracción y decimal: x = 5/2 = 2.5
        const cuenta = p.fin === 'solucion' && p.cociente && p.izq.x === 1 && !Number.isInteger(p.der.n)
          ? `${X} = ${p.cociente}`
          : ecuacionHtml(p.izq, '=', p.der);
        lineas.push(`<li class="${clases.join(' ')}"><span class="renglon-cuenta">${cuenta}</span>${nota ? `<span class="renglon-nota">${nota}</span>` : ''}</li>`);
      }
      renglonesEl.innerHTML = lineas.join('');
      const ult = renglonesEl.lastElementChild;
      if (paso > 0 && ult) ult.classList.add('nuevo');

      const p = pasos[paso];
      const ultimo = paso === pasos.length - 1;
      textoEl.innerHTML = paso === 0
        ? `Para encontrar ${X}, hay que dejarla <b>sola en un plato</b>, sin que la balanza se desequilibre. Tocá <b>Siguiente paso</b>.`
        : `<span class="regla-num">Paso ${paso} de ${pasos.length - 1}</span> ${p.regla}`;
      textoEl.classList.toggle('final', ultimo);
      botonSiguiente.disabled = ultimo;
      botonTodo.disabled = ultimo;
    }

    function terminarAnimacion() {
      if (!temporizador) return;
      clearTimeout(temporizador);
      temporizador = null;
      ponerResultado(paso, false);
    }

    function irA(i, animar) {
      terminarAnimacion();
      paso = i;
      escribir();
      const accion = pasos[i].accion;
      if (!animar || sinMovimiento() || !accion || accion.tipo === 'girar') {
        ponerResultado(i, animar && accion?.tipo === 'girar');
        return;
      }
      ponerAccion(i);
      temporizador = setTimeout(() => { temporizador = null; ponerResultado(i, true); }, TIEMPO_ACCION);
    }

    botonSiguiente.addEventListener('click', () => { if (paso < pasos.length - 1) irA(paso + 1, true); });
    botonTodo.addEventListener('click', () => irA(pasos.length - 1, false));
    $('[data-reiniciar]').addEventListener('click', () => irA(0, false));

    const alElegir = (ec) => { pasos = pasosEcuacion(ec); irA(0, false); };
    cabecera.anterior.addEventListener('click', () => elegirEcuacion(indice - 1, alElegir));
    cabecera.proxima.addEventListener('click', () => elegirEcuacion(indice + 1, alElegir));
    elegirEcuacion(0, alElegir);
  }
}
