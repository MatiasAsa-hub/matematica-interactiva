// ==========================================================================
// INTERACTIVO: qué es una función.
//
// Una "máquina": entra un número x, la regla hace la cuenta y sale f(x).
// Cada número probado queda en la tabla y como punto (x, f(x)) en el gráfico.
// "Unir los puntos" dibuja la curva: si se probaran TODOS los números, los
// puntos quedarían pegados, y eso es el gráfico de la función.
// Si la cuenta no se puede hacer (dividir por 0), ese x no está en el dominio.
// El HTML está en src/components/interactivos/Funcion.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { animar, sinMovimiento, suave } from '../lib/grafico/animacion.js';
import { dibujarCruz } from '../lib/grafico/intervalo.js';
import { leerFormula } from '../lib/formula.js';
import { num } from '../lib/numeros.js';

const X = '<i>x</i>';
const FX = '<i>f</i>(<i>x</i>)';
const X_MIN = -4;
const X_MAX = 4;

export function iniciarFuncion(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const formulas = JSON.parse(raiz.dataset.funciones);
  const estado = { indice: 0, F: null, x: 1, unida: false, hastaX: Infinity };
  const probados = new Map(); // x → f(x) (NaN si no se puede)
  let anim = null;

  const valor = (x) => {
    const y = estado.F.f(x);
    return Number.isFinite(y) ? y : NaN;
  };

  // ------------------------------------------------------------------ gráfico
  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 0 },
    descripcion: 'Gráfico con los puntos (x, f(x)) probados',
  });
  const col = plano.colores;

  /** Una vista donde entren todos los puntos de x = −4 a 4. */
  function ajustarVista() {
    const ys = [];
    for (let x = X_MIN; x <= X_MAX; x++) if (Number.isFinite(valor(x))) ys.push(valor(x));
    const yMin = Math.min(0, ...ys);
    const yMax = Math.max(0, ...ys);
    const proporcion = plano.ancho / Math.max(1, plano.alto);
    const ancho = Math.max(X_MAX - X_MIN + 3, (yMax - yMin + 3) * proporcion);
    plano.vista = { xMin: -ancho / 2, xMax: ancho / 2, yCentro: (yMin + yMax) / 2 };
    plano.vistaInicial();
  }

  plano.agregarCapa((p) => {
    // la curva (cuando se unen los puntos)
    if (estado.unida) p.curva(valor, { color: col.funcion, ancho: 3, hasta: estado.hastaX });

    // los puntos probados
    for (const [x, y] of probados) {
      if (x === estado.x || !Number.isFinite(y)) continue;
      p.punto(x, y, { color: col.funcion, radio: 5.5 });
    }

    // el número que se está probando
    const x = estado.x;
    const y = valor(x);
    if (!Number.isFinite(y)) {
      dibujarCruz(p, x, { color: col.negativo, tamano: 8 });
      p.etiqueta('no se puede', x, 0, { color: col.negativo, dx: 0, dy: -22, alinear: 'center', tamano: 14 });
      return;
    }
    p.segmento(x, 0, x, y, { color: col.textoSuave, ancho: 1.5, guiones: [4, 5] });
    p.segmento(0, y, x, y, { color: col.textoSuave, ancho: 1.5, guiones: [4, 5] });
    p.punto(x, 0, { color: col.texto, radio: 4 });
    p.punto(0, y, { color: col.texto, radio: 4 });
    p.punto(x, y, { color: col.funcion, radio: 8.5 });
    p.etiqueta(`(${num(x)}, ${num(y)})`, x, y, { color: col.funcion, dx: x >= 0 ? 12 : -12, dy: -14, alinear: x >= 0 ? 'left' : 'right', tamano: 16 });
  });

  // ------------------------------------------------------------------ textos
  const entraEl = $('[data-entra]');
  const reglaEl = $('[data-regla]');
  const saleEl = $('[data-sale]');
  const cuentaEl = $('[data-cuenta]');
  const tablaEl = $('[data-tabla]');
  const textoEl = $('[data-texto]');
  const botonUnir = $('[data-unir]');

  function escribir() {
    const { F, x } = estado;
    const y = valor(x);
    const ok = Number.isFinite(y);
    entraEl.innerHTML = `${X} = <b>${num(x)}</b>`;
    reglaEl.innerHTML = `${FX} = ${F.html()}`;
    saleEl.innerHTML = ok ? `<b>${num(y)}</b>` : '<b>✗</b>';
    saleEl.classList.toggle('error', !ok);
    // un "pulso" cada vez que sale un número nuevo
    saleEl.classList.remove('pulso');
    void saleEl.offsetWidth;
    saleEl.classList.add('pulso');

    cuentaEl.innerHTML = ok
      ? `<i>f</i>(${num(x)}) = ${F.cuenta(x)} = <b>${num(y)}</b> &nbsp;→&nbsp; punto <b>(${num(x)}, ${num(y)})</b>`
      : `<i>f</i>(${num(x)}) = ${F.cuenta(x)} → <b class="neg">no se puede</b> (no se divide por 0). El ${num(x)} <b>no está en el dominio</b>.`;

    // tabla x | f(x), ordenada
    const xs = [...probados.keys()].sort((a, b) => a - b);
    const celda = (v, xx) => `<td class="${xx === x ? 'nueva' : ''}">${v}</td>`;
    tablaEl.innerHTML = `<table class="tabla-valores"><tbody>`
      + `<tr><th scope="row">${X}</th>${xs.map((xx) => celda(num(xx), xx)).join('')}</tr>`
      + `<tr><th scope="row">${FX}</th>${xs.map((xx) => celda(Number.isFinite(probados.get(xx)) ? num(probados.get(xx)) : '—', xx)).join('')}</tr>`
      + `</tbody></table>`;

    let t;
    if (estado.unida) {
      t = `Si probáramos con <b>todos</b> los números (también 0.5, 1.37…), los puntos quedarían pegados formando esta línea: <b>el gráfico de ${'<i>f</i>'}</b>.`;
      if ([...probados.values()].some((v) => !Number.isFinite(v))) t += ' Fijate que en el 0 la línea se corta: ahí la función no existe.';
    } else if (probados.size < 3) {
      t = `Mové el deslizador (o arrastrá el punto). Cada número que entra <b>sale convertido</b> por la regla, y cada par (${X}, ${FX}) es un <b>punto</b> del gráfico.`;
    } else {
      t = `Ya tenés ${probados.size} puntos. ¿Te imaginás cómo sigue el dibujo? Tocá <b>Unir los puntos</b>.`;
    }
    textoEl.innerHTML = t;
    botonUnir.disabled = estado.unida;
  }

  function probar(x) {
    estado.x = x;
    probados.set(x, valor(x));
    escribir();
    plano.pedirDibujo();
  }

  // ------------------------------------------------------------------ controles
  const desl = conectarDeslizador($('.deslizador[data-param="x"]'), probar);
  plano.agregarArrastrable({
    posicion: () => [estado.x, Number.isFinite(valor(estado.x)) ? valor(estado.x) : 0],
    mover: (x) => desl.poner(Math.max(X_MIN, Math.min(X_MAX, Math.round(x)))),
  });

  botonUnir.addEventListener('click', () => {
    anim?.cancelar();
    estado.unida = true;
    escribir();
    if (sinMovimiento()) { estado.hastaX = Infinity; plano.pedirDibujo(); return; }
    const x0 = plano.xMin;
    const x1 = plano.xMax;
    anim = animar(1400, (t) => { estado.hastaX = x0 + (x1 - x0) * suave(t); plano.pedirDibujo(); },
      () => { estado.hastaX = Infinity; plano.pedirDibujo(); });
  });

  $('[data-todos]').addEventListener('click', () => {
    anim?.cancelar();
    const xs = [];
    for (let x = X_MIN; x <= X_MAX; x++) if (!probados.has(x)) xs.push(x);
    if (sinMovimiento() || xs.length === 0) { for (const x of xs) probados.set(x, valor(x)); escribir(); plano.pedirDibujo(); return; }
    // aparecen de a uno
    let hechos = 0;
    anim = animar(xs.length * 160, (t) => {
      while (hechos < Math.floor(t * xs.length)) { probados.set(xs[hechos], valor(xs[hechos])); hechos++; }
      escribir();
      plano.pedirDibujo();
    }, () => { for (const x of xs) probados.set(x, valor(x)); escribir(); plano.pedirDibujo(); });
  });

  function borrar() {
    anim?.cancelar();
    probados.clear();
    estado.unida = false;
    estado.hastaX = Infinity;
    probar(estado.x);
  }
  $('[data-borrar]').addEventListener('click', borrar);

  function elegir(i) {
    estado.indice = (i + formulas.length) % formulas.length;
    estado.F = leerFormula(formulas[estado.indice]);
    $('[data-contador]').textContent = `Función ${estado.indice + 1} de ${formulas.length}`;
    ajustarVista();
    borrar();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  // la vista depende del tamaño del gráfico: se ajusta cuando ya está medido
  elegir(0);
  requestAnimationFrame(ajustarVista);
}
