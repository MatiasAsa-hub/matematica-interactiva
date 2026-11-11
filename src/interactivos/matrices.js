// ==========================================================================
// INTERACTIVO: cuentas con matrices, paso a paso.
//   - suma / resta / producto por un número: se llena el resultado casillero
//     por casillero, con la cuenta de cada uno.
//   - producto: se resalta una fila de A (azul) y una columna de B (naranja),
//     y se arma el número del resultado ("fila por columna").
//   - determinante: 2×2 con las dos diagonales; 3×3 por Sarrus (diagonales
//     que suman en verde, que restan en rojo) o por la primera fila (cada
//     número por el determinante 2×2 que queda al tachar su fila y columna).
// El HTML está en src/components/interactivos/Matrices.astro.
// ==========================================================================

import { leerCuenta, pasosDet, n, np } from '../lib/matrices.js';

const NOMBRE = { suma: 'Suma', resta: 'Resta', escalar: 'Producto por un número', producto: 'Producto de matrices', det: 'Determinante' };

export function iniciarMatrices(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.cuentas);
  const estado = { indice: 0, c: null, paso: 0, forma: 'sarrus', pasosDet: [] };

  const cuentaEl = $('[data-cuenta]');
  const pasoEl = $('[data-paso]');
  const formasEl = $('[data-formas]');
  const botonSig = $('[data-paso-siguiente]');
  const botonAnt = $('[data-paso-anterior]');

  /** Cuántos pasos tiene la cuenta (en el determinante, más uno: el resultado final). */
  const total = () => (estado.c.tipo === 'det' ? estado.pasosDet.length + 1 : estado.c.pasos.length);

  /**
   * Una matriz como tabla con corchetes.
   * clase(i, j) → clases extra del casillero; texto(i, j, v) → lo que se escribe.
   */
  function tabla(m, { clase = () => '', texto = (i, j, v) => n(v), extraCols = 0 } = {}) {
    const filas = m.map((f, i) => {
      const celdas = [];
      for (let j = 0; j < f.length + extraCols; j++) {
        const v = f[j % f.length];
        const extra = j >= f.length ? ' repetida' : extraCols && j === f.length - 1 ? ' fin-real' : '';
        celdas.push(`<td class="${clase(i, j)}${extra}">${texto(i, j, v)}</td>`);
      }
      return `<tr>${celdas.join('')}</tr>`;
    }).join('');
    return `<table class="mat"><tbody>${filas}</tbody></table>`;
  }

  const etiqueta = (letra, m) => `<span class="mat-nombre"><i>${letra}</i><small>${m.length}×${m[0].length}</small></span>`;

  function dibujar() {
    const { c, paso } = estado;
    let html = '';
    let textoPaso = '';
    if (c.tipo === 'det') {
      const A = c.A;
      const pasos = estado.pasosDet;
      const actual = paso >= 1 && paso <= pasos.length ? pasos[paso - 1] : null;
      const sarrus = A.length === 3 && estado.forma === 'sarrus';
      const clase = (i, j) => {
        const cls = [];
        if (actual) {
          if (actual.celdas.some(([a, b]) => a === i && b === j)) cls.push(actual.signo > 0 ? 'resalta-mas' : 'resalta-menos');
          if (actual.menor) {
            if (i === actual.menor.fila || j === actual.menor.col) { if (!(i === actual.menor.fila && j === actual.menor.col)) cls.push('tachada'); }
            else cls.push('menor');
          }
        }
        return cls.join(' ');
      };
      html = `<div class="mat-fila"><span class="mat-op">det</span>${tabla(A, { clase, extraCols: sarrus ? 2 : 0 })}</div>`;
      // la lista de productos que ya se hicieron
      const hechos = pasos.slice(0, Math.min(paso, pasos.length));
      const lista = hechos.map((p, k) => `<li class="${p.signo > 0 ? 'mas' : 'menos'}${k === paso - 1 ? ' nuevo' : ''}"><b>${p.signo > 0 ? '+' : '−'}</b> ${p.cuenta}</li>`).join('');
      html += `<ul class="mat-productos">${lista}</ul>`;
      if (paso === 0) {
        textoPaso = A.length === 2
          ? 'Para un 2×2: la diagonal que baja <b class="mas">suma</b> y la que sube <b class="menos">resta</b>. Tocá <b>Siguiente</b>.'
          : sarrus
            ? 'Sarrus: se repiten las dos primeras columnas al costado. Las diagonales que bajan <b class="mas">suman</b> y las que suben <b class="menos">restan</b>.'
            : 'Por la primera fila: cada número de la fila 1 se multiplica por el determinante 2×2 que queda al tachar su fila y su columna. Los signos van <b class="mas">+</b>, <b class="menos">−</b>, <b class="mas">+</b>.';
      } else if (actual) {
        textoPaso = `<span class="texto-suave">Paso ${paso} de ${total()}:</span> ${actual.menor ? `el ${n(A[0][actual.menor.col])} por el determinante de lo que queda` : actual.signo > 0 ? 'diagonal que suma' : 'diagonal que resta'}`;
      } else {
        // una suma escrita: "−2 + 2 + 0"
        const sumaTxt = (vals) => vals.map((v, k) => (k === 0 ? n(v) : v < 0 ? ` − ${n(-v)}` : ` + ${n(v)}`)).join('');
        let partes;
        if (sarrus) {
          // Sarrus: (las que bajan) − (las que suben)
          const baja = pasos.filter((p) => p.signo > 0).map((p) => p.valor);
          const sube = pasos.filter((p) => p.signo < 0).map((p) => p.valor);
          const s1 = baja.reduce((a, b) => a + b, 0);
          const s2 = sube.reduce((a, b) => a + b, 0);
          partes = `(${sumaTxt(baja)}) − (${sumaTxt(sube)}) = ${n(s1)} − ${np(s2)}`;
        } else {
          partes = pasos.map((p, k) => (k === 0 ? (p.signo < 0 ? `−${np(p.valor)}` : n(p.valor)) : ` ${p.signo > 0 ? '+' : '−'} ${np(p.valor)}`)).join('');
        }
        textoPaso = `<span class="mat-final">det = ${partes} = <b>${n(c.resultado)}</b></span>`;
        if (c.resultado === 0) textoPaso += '<br><span class="texto-suave">¡Da 0! Un sistema con estos números adelante no tiene una sola solución.</span>';
      }
    } else {
      const { A, B, k } = c;
      const actual = paso >= 1 ? c.pasos[paso - 1] : null;
      const lleno = new Set(c.pasos.slice(0, paso).map((p) => `${p.i},${p.j}`));
      const claseA = (i, j) => {
        if (!actual) return '';
        if (c.tipo === 'producto') return i === actual.filaA ? 'resalta-a' : '';
        return i === actual.i && j === actual.j ? 'resalta-a' : '';
      };
      const claseB = (i, j) => {
        if (!actual) return '';
        if (c.tipo === 'producto') return j === actual.colB ? 'resalta-b' : '';
        return i === actual.i && j === actual.j ? 'resalta-b' : '';
      };
      const claseR = (i, j) => (actual && i === actual.i && j === actual.j ? 'resalta-r' : lleno.has(`${i},${j}`) ? '' : 'vacia');
      const textoR = (i, j, v) => (lleno.has(`${i},${j}`) ? n(v) : '?');
      const op = { suma: '+', resta: '−', producto: '·' }[c.tipo];
      const izq = c.tipo === 'escalar'
        ? `<span class="mat-op mat-k${actual ? ' resalta-k' : ''}">${n(k)}</span><span class="mat-op">·</span>${tabla(A, { clase: claseA })}`
        : `${tabla(A, { clase: claseA })}<span class="mat-op">${op}</span>${tabla(B, { clase: claseB })}`;
      html = `<div class="mat-fila">${izq}<span class="mat-op">=</span>${tabla(c.resultado, { clase: claseR, texto: textoR })}</div>`;
      html += `<div class="mat-tamanos">${etiqueta('A', A)}${c.tipo !== 'escalar' ? etiqueta('B', B) : ''}<span class="mat-nombre">resultado<small>${c.resultado.length}×${c.resultado[0].length}</small></span></div>`;
      if (paso === 0) {
        textoPaso = {
          suma: 'Se suman los números que están en el mismo lugar. Tocá <b>Siguiente</b>.',
          resta: 'Se restan los números que están en el mismo lugar. Tocá <b>Siguiente</b>.',
          escalar: 'Se multiplica cada número de la matriz por el número de afuera. Tocá <b>Siguiente</b>.',
          producto: `Cada número del resultado sale de <b class="color-a">una fila de A</b> por <b class="color-b">una columna de B</b>: se multiplican de a pares y se suman.${B ? ` Una ${A.length}×${A[0].length} por una ${B.length}×${B[0].length} da una ${A.length}×${B[0].length}.` : ''}`,
        }[c.tipo];
      } else {
        const lugar = `fila ${actual.i + 1}, columna ${actual.j + 1}`;
        const que = c.tipo === 'producto' ? `<b class="color-a">fila ${actual.i + 1} de A</b> por <b class="color-b">columna ${actual.j + 1} de B</b>` : `el casillero de la ${lugar}`;
        textoPaso = `<span class="texto-suave">Paso ${paso} de ${total()}:</span> ${que}<br><span class="mat-final">${actual.cuenta}</span>`;
        if (paso === total()) textoPaso += '<br><span class="texto-suave">¡Listo! Ya está todo el resultado.</span>';
      }
    }
    cuentaEl.innerHTML = `<p class="mat-titulo">${NOMBRE[c.tipo]}</p>${html}`;
    pasoEl.innerHTML = `<p>${textoPaso}</p>`;
    botonAnt.disabled = paso === 0;
    botonSig.disabled = paso >= total();
    $('[data-todo]').disabled = paso >= total();
  }

  function ir(p) {
    estado.paso = Math.max(0, Math.min(total(), p));
    dibujar();
  }
  botonSig.addEventListener('click', () => ir(estado.paso + 1));
  botonAnt.addEventListener('click', () => ir(estado.paso - 1));
  $('[data-todo]').addEventListener('click', () => ir(total()));

  // Sarrus o por la primera fila (solo determinantes 3×3)
  const botonesForma = raiz.querySelectorAll('[data-forma]');
  for (const b of botonesForma) {
    b.addEventListener('click', () => {
      estado.forma = b.dataset.forma;
      for (const o of botonesForma) o.setAttribute('aria-checked', String(o === b));
      estado.pasosDet = pasosDet(estado.c.A, estado.forma);
      ir(0);
    });
  }

  function elegir(i) {
    estado.indice = (i + textos.length) % textos.length;
    estado.c = leerCuenta(textos[estado.indice]);
    $('[data-contador]').textContent = `Cuenta ${estado.indice + 1} de ${textos.length}`;
    const es3 = estado.c.tipo === 'det' && estado.c.A.length === 3;
    formasEl.hidden = !es3;
    if (estado.c.tipo === 'det') estado.pasosDet = pasosDet(estado.c.A, es3 ? estado.forma : 'sarrus');
    ir(0);
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));
  elegir(0);
}
