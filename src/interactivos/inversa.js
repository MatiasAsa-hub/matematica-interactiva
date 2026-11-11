// ==========================================================================
// INTERACTIVO: función inversa, f⁻¹
//
// La inversa "deshace" lo que hace f: si f(2) = 5, entonces f⁻¹(5) = 2.
// - Un punto P = (a, f(a)) que se arrastra sobre f, y su espejo
//   Q = (f(a), a) sobre f⁻¹, unidos por una línea que cruza la recta y = x.
// - Si f es lineal, se muestra el despeje paso a paso: y = 2x + 1 → … → f⁻¹.
// - Si f no es inyectiva (por ejemplo x²), el espejo no es una función:
//   para un mismo x hay dos valores. Con "Quedarse con una mitad" se arregla.
// Los ejemplos vienen del tema (campo "inversas:" del .md).
// El HTML está en src/components/interactivos/Inversa.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas } from '../lib/grafico/controles.js';
import { leerFormula } from '../lib/formula.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox, igual } from '../lib/numeros.js';
import { rectaHtml } from './lineal.js';

const X = '<i>x</i>';
const Y = '<i>y</i>';
const v2 = (v) => numAprox(v).replace('≈ ', '≈');
const RANGO = [-8, 8]; // donde se estudia la función

export function iniciarInversa(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const ejemplos = JSON.parse(raiz.dataset.ejemplos);
  const estado = { indice: 0, a: 2 };
  let F; // la fórmula
  let lineal = null; // { m, b } si es lineal
  let extremo = null; // si no es inyectiva: el x donde da la vuelta
  const f = (x) => F.f(x);

  /** Analiza la función: ¿es lineal? ¿es inyectiva (siempre crece o siempre decrece)? */
  function analizar() {
    const b = f(0);
    const m = f(1) - b;
    lineal = [-3, -1.5, 2, 5].every((x) => Math.abs(f(x) - (m * x + b)) < 1e-9) ? { m, b } : null;
    extremo = null;
    let signo = 0;
    const paso = 0.01;
    for (let x = RANGO[0]; x < RANGO[1]; x += paso) {
      const d = f(x + paso) - f(x);
      if (!Number.isFinite(d) || Math.abs(d) < 1e-12) continue;
      const s = Math.sign(d);
      if (signo && s !== signo) { extremo = Math.round(x * 100) / 100; break; }
      signo = s;
    }
  }
  const inyectiva = () => extremo === null || casillas.mitad;
  /** Dónde vale f (con "mitad", solo del extremo para la derecha). */
  const desde = () => (extremo !== null && casillas.mitad ? extremo : -Infinity);

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -5, xMax: 5, yCentro: 0.5 },
    descripcion: 'Gráfico de la función y su inversa',
  });
  const col = plano.colores;
  const colInversa = col.ordenada;
  let casillas = {};

  /** Dibuja el espejo de f: los puntos (f(t), t). */
  function dibujarEspejo(p, { color, guiones = null, ancho = 3.5 }) {
    const ctx = p.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = p.grosor(ancho);
    ctx.lineJoin = 'round';
    if (guiones) ctx.setLineDash(guiones);
    ctx.beginPath();
    let empezo = false;
    const t0 = Math.max(desde(), Math.min(p.xMin, p.yMin) - 1);
    const t1 = Math.max(p.xMax, p.yMax) + 1;
    for (let t = t0; t <= t1; t += 0.01) {
      const y = f(t);
      if (!Number.isFinite(y) || Math.abs(y) > 1e4) { empezo = false; continue; }
      if (!empezo) { ctx.moveTo(p.px(y), p.py(t)); empezo = true; } else ctx.lineTo(p.px(y), p.py(t));
    }
    ctx.stroke();
    ctx.restore();
    // etiqueta: el primer punto del espejo que se vea, bajando desde arriba
    for (let t = p.yMax - 0.6; t > p.yMin; t -= 0.25) {
      if (t < desde()) break;
      const x = f(t);
      if (Number.isFinite(x) && x > p.xMin + 0.3 && x < p.xMax - 0.8) {
        p.etiqueta('f⁻¹', x, t, { color, dx: 12, dy: 0, alinear: 'left', tamano: 15 });
        break;
      }
    }
  }

  plano.agregarCapa((p) => {
    // la recta y = x
    if (casillas.espejo) {
      p.curva((x) => x, { color: col.fantasma, ancho: 1.5, guiones: [4, 6] });
      const xe = p.mx(p.ancho - 60);
      p.etiqueta('y = x', xe, xe, { color: col.fantasma, dx: 0, dy: 18, alinear: 'center', tamano: 13 });
    }
    // f (con "mitad", la parte que no se usa queda en gris)
    if (extremo !== null && casillas.mitad) {
      p.curva(f, { color: col.fantasma, ancho: 2, guiones: [6, 6], hasta: extremo });
      p.curva(f, { color: col.funcion, ancho: 3.5, desde: extremo });
    } else p.curva(f, { color: col.funcion, ancho: 3.5 });
    // la inversa (el espejo): si no es función, en rojo punteado
    if (lineal && lineal.m === 0) return;
    dibujarEspejo(p, inyectiva() ? { color: colInversa } : { color: col.negativo, guiones: [7, 6], ancho: 3 });
    // etiquetas
    const xf = p.mx(p.ancho - 40);
    if (Number.isFinite(f(xf)) && f(xf) > p.yMin && f(xf) < p.yMax) p.etiqueta('f', xf, f(xf), { color: col.funcion, dx: 0, dy: -14, alinear: 'center', tamano: 15 });

    // el punto P y su espejo Q
    const a = estado.a;
    const b = f(a);
    if (!Number.isFinite(b)) return;
    if (casillas.espejo) p.segmento(a, b, b, a, { color: col.vertice, ancho: 2, guiones: [2, 5] });
    // si no es inyectiva, el otro x con el mismo valor
    const otro = otroX(a);
    if (otro !== null) {
      p.punto(otro, b, { color: col.negativo, radio: 6, hueco: true });
      p.punto(b, otro, { color: col.negativo, radio: 7 });
      p.etiqueta(`(${v2(b)}, ${v2(otro)})`, b, otro, { color: col.negativo, dx: 10, dy: 14, alinear: 'left', tamano: 13 });
    }
    p.punto(b, a, { color: colInversa, radio: 8 });
    p.etiqueta(`(${v2(b)}, ${num(a)})`, b, a, { color: colInversa, dx: 10, dy: -14, alinear: 'left', tamano: 14 });
    p.punto(a, b, { color: col.funcion, radio: 9 });
    p.etiqueta(`(${num(a)}, ${v2(b)})`, a, b, { color: col.funcion, dx: -10, dy: -14, alinear: 'right', tamano: 14 });
  });

  /** Si f no es inyectiva: otro x (≠ a) donde f da lo mismo. */
  function otroX(a) {
    if (inyectiva()) return null;
    const objetivo = f(a);
    let mejor = null;
    for (let x = RANGO[0]; x <= RANGO[1]; x += 0.005) {
      if (Math.abs(x - a) < 0.05) continue;
      if (Math.abs(f(x) - objetivo) < 0.02 && (mejor === null || Math.abs(f(x) - objetivo) < Math.abs(f(mejor) - objetivo))) mejor = x;
    }
    return mejor === null ? null : Math.round(mejor * 100) / 100;
  }

  // El punto P se arrastra sobre f (de a 0.5).
  plano.agregarArrastrable({
    posicion: () => [estado.a, Number.isFinite(f(estado.a)) ? f(estado.a) : 0],
    mover: (x) => {
      let a = Math.round(x * 2) / 2;
      a = Math.max(Math.max(desde(), plano.xMin), Math.min(plano.xMax, a));
      estado.a = a;
      actualizar();
    },
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const infoEl = $('[data-info]');
  const avisoEl = $('[data-aviso]');
  const casillaMitad = raiz.querySelector('[data-casilla="mitad"]');
  const contadorEl = $('[data-contador]');

  /** El despeje de una lineal: y = mx + b → y − b = mx → x = (y − b) : m */
  function despeje({ m, b }) {
    const pasos = [`${Y} = ${rectaHtml(m, b)}`];
    let izquierda = Y;
    if (Math.abs(b) > 1e-9) {
      izquierda = `${Y} ${b > 0 ? '−' : '+'} ${num(Math.abs(b))}`;
      pasos.push(`${izquierda} = ${rectaHtml(m, 0)}`);
    }
    if (Math.abs(m - 1) > 1e-9) {
      const arriba = Math.abs(b) > 1e-9 ? `(${izquierda})` : Y;
      pasos.push(`${X} = ${arriba} : ${m < 0 ? `(${num(m)})` : num(m)}`);
    } else if (Math.abs(b) > 1e-9) pasos.push(`${X} = ${izquierda}`);
    // lo que quedó a la derecha del último paso, con x en lugar de y: (x − 1) : 2
    const derecha = pasos[pasos.length - 1].split(' = ').slice(1).join(' = ').split(Y).join(X);
    return { texto: pasos.join(' → '), derecha };
  }

  /** La inversa de la lineal: "(x − 1) : 2 = 0.5x − 0.5" (o una sola forma, si dan igual). */
  function formaInversa() {
    const { derecha } = despeje(lineal);
    const simple = rectaHtml(1 / lineal.m, -lineal.b / lineal.m);
    return derecha === simple ? simple : `${derecha} = ${simple}`;
  }

  function actualizar() {
    const a = estado.a;
    const b = f(a);
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${F.html()}` + (lineal && lineal.m !== 0
      ? `<span class="linea-inversa"><i>f</i><sup>−1</sup>(${X}) = ${formaInversa()}</span>`
      : '');

    avisoEl.hidden = true;
    if (lineal && lineal.m === 0) {
      avisoEl.hidden = false;
      avisoEl.innerHTML = `Es una función <b>constante</b>: a todos los ${X} les da ${num(lineal.b)}. Si sale ${num(lineal.b)}, no hay forma de saber qué entró: <b>no tiene inversa</b>.`;
    }
    casillaMitad.hidden = extremo === null;

    const otro = otroX(a);
    if (!Number.isFinite(b)) lecturaEl.innerHTML = `<i>f</i>(${num(a)}) no existe.`;
    else if (otro !== null) {
      lecturaEl.innerHTML = `<i>f</i>(${num(a)}) ${igual(b)}, pero también <i>f</i>(${v2(otro)}) ${igual(b)}: ` +
        `¿<i>f</i><sup>−1</sup>(${v2(b)}) es ${num(a)} o ${v2(otro)}? <b>No se sabe</b>`;
    } else {
      lecturaEl.innerHTML = `<i>f</i>(${num(a)}) = ${F.cuenta(a)} <b>${igual(b)}</b> <span class="texto-suave">→</span> ` +
        `<span style="color:var(--c-ordenada)"><i>f</i><sup>−1</sup>(${v2(b)}) = <b>${num(a)}</b></span>`;
    }

    const partes = [];
    if (otro === null) partes.push(itemInfo(colInversa, 'La inversa deshace:', `si <i>f</i> lleva el ${num(a)} al ${Number.isFinite(b) ? v2(b) : '…'}, <i>f</i><sup>−1</sup> lleva el ${Number.isFinite(b) ? v2(b) : '…'} de vuelta al ${num(a)}. Es la máquina andando para atrás.`));
    if (casillas.espejo) {
      partes.push(itemInfo(col.fantasma, 'Espejo:', `para dibujar <i>f</i><sup>−1</sup> se cambian ${X} por ${Y} en cada punto: (${num(a)}, ${Number.isFinite(b) ? v2(b) : '…'}) pasa a (${Number.isFinite(b) ? v2(b) : '…'}, ${num(a)}). Por eso el gráfico queda reflejado en la recta ${Y} = ${X}.`));
    }
    if (lineal && lineal.m !== 0 && Math.abs(1 / lineal.m - lineal.m) < 1e-9 && Math.abs(-lineal.b / lineal.m - lineal.b) < 1e-9) {
      partes.push(itemInfo(colInversa, '¡Es su propia inversa!', `El espejo cae justo sobre la misma recta: <i>f</i> y <i>f</i><sup>−1</sup> son iguales.`));
    }
    if (casillas.despeje) {
      if (lineal && lineal.m !== 0) {
        partes.push(itemInfo(colInversa, 'Despejando:', `se escribe ${Y} en lugar de <i>f</i>(${X}) y se despeja ${X}, como en una ecuación: <span class="info-despeje">${despeje(lineal).texto}</span>. Después se cambia el nombre de las letras: <i>f</i><sup>−1</sup>(${X}) = ${formaInversa()}.`));
      } else if (!lineal) {
        partes.push(itemInfo(colInversa, 'Despejando:', 'con esta función el despeje necesita herramientas de otros temas (raíces o logaritmos). El espejo sirve igual para dibujarla.'));
      }
    }
    if (extremo !== null) {
      partes.push(itemInfo(col.negativo, casillas.mitad ? 'Con una mitad, sí:' : '¡Ojo! El espejo no es una función:', casillas.mitad
        ? `quedándonos con los ${X} ≥ ${v2(extremo)} la función siempre ${f(extremo + 1) > f(extremo) ? 'crece' : 'decrece'}, y cada valor sale de un solo ${X}. Ahí sí tiene inversa.`
        : `hay valores que salen de <b>dos</b> ${X} distintos, así que al volver no se sabe cuál elegir. Prendé <b>Quedarse con una mitad</b>.`));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
    plano.pedirDibujo();
  }

  // --------------------------------------------------------------- controles

  function elegir(i) {
    estado.indice = (i + ejemplos.length) % ejemplos.length;
    F = leerFormula(ejemplos[estado.indice]);
    analizar();
    // un punto de arranque donde P y su espejo se vean bien separados
    estado.a = [1, 1.5, 2, 0.5, -1].find((a) => Number.isFinite(f(a)) && Math.abs(f(a) - a) > 0.5 && Math.abs(f(a)) < 4.5) ?? 1;
    contadorEl.textContent = `Ejemplo ${estado.indice + 1} de ${ejemplos.length}`;
    actualizar();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  casillas = conectarCasillas($('[data-casillas]'), (nombre) => {
    if (nombre === 'mitad' && casillas.mitad && extremo !== null && estado.a < extremo) estado.a = Math.ceil(extremo * 2) / 2 + 1;
    actualizar();
  });
  plano.alCambiarVista.push(() => plano.pedirDibujo());
  elegir(0);
}
