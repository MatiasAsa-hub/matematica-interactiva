// ==========================================================================
// INTERACTIVO: función exponencial f(x) = a · kˣ
//   k: la base (por cuánto se multiplica cada vez que se avanza 1 en x)
//   a: el valor inicial (f(0) = a)
// La idea central: la lineal SUMA siempre lo mismo; la exponencial
// MULTIPLICA siempre por lo mismo ("saltos ×k").
// El HTML está en src/components/interactivos/Exponencial.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { tramoCrecimiento } from '../lib/grafico/signos.js';
import { num, numAprox, esExacto } from '../lib/numeros.js';
import { rectaHtml } from './lineal.js';

const EPS = 1e-9;
const X = '<i>x</i>';

/** a · kˣ escrito lindo. Con marcar, cada valor queda marcado (para resaltarlo al mover el deslizador). */
export function exponencialHtml(a, k, { marcar = false, variable = X } = {}) {
  const v = (p, t) => (marcar ? `<span class="valor" data-p="${p}">${t}</span>` : t);
  const potencia = `${v('k', num(k))}<sup>${variable}</sup>`;
  if (Math.abs(a - 1) < 0.005) return potencia;
  return `${v('a', num(a))} · ${potencia}`;
}

export function iniciarExponencial(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { a: 1, k: 2 };
  const f = (x) => estado.a * estado.k ** x;
  // la lineal que arranca en el mismo punto y pasa por el mismo (1, f(1))
  const g = (x) => estado.a + estado.a * (estado.k - 1) * x;
  const kEs1 = () => Math.abs(estado.k - 1) < EPS;
  const aEs0 = () => Math.abs(estado.a) < EPS;
  const crece = () => (estado.a > 0) === (estado.k > 1);

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -4, xMax: 5, yCentro: 3 },
    descripcion: 'Gráfico de la función exponencial',
  });
  const col = plano.colores;
  let casillas = {};

  // --- Capa 1: la lineal para comparar (debajo de todo) ---
  plano.agregarCapa((p) => {
    if (!casillas.lineal) return;
    p.curva(g, { color: col.fantasma, ancho: 2.5, guiones: [8, 6] });
    // etiqueta cerca del borde derecho, donde se vea
    const xe = p.mx(p.ancho - 70);
    const ye = Math.max(p.yMin, Math.min(p.yMax, g(xe)));
    p.etiqueta('lineal', xe, ye, { color: col.fantasma, dx: 0, dy: 16, alinear: 'center', tamano: 14 });
  });

  // --- Capas 2 y 3: la curva y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, { f, color: col.funcion, tabla: tablaCaja });

  // --- Capa 4: los saltos "×k" (avanzo 1, multiplico por k) ---
  const dentroY = (p, y) => Math.max(p.yMin, Math.min(p.yMax, y));
  plano.agregarCapa((p) => {
    if (!casillas.saltos || aEs0()) return;
    // mientras aparecen los puntos de la animación, no se mezclan los saltos
    if (animacion.hastaX !== Infinity) return;
    const { k } = estado;
    const n1 = Math.ceil(p.xMin);
    const n2 = Math.floor(p.xMax) - 1;
    const fuera = (y) => y > p.yMax || y < p.yMin;
    for (let n = n1; n <= n2; n++) {
      const y0 = f(n);
      const y1 = f(n + 1);
      if (fuera(y0) && fuera(y1)) continue;
      p.segmento(n, y0, n + 1, y0, { color: col.vertice, ancho: 2.5, guiones: [5, 5] });
      const X1 = p.px(n + 1);
      const Y0 = Math.max(-20, Math.min(p.alto + 20, p.py(y0)));
      const Y1 = Math.max(-20, Math.min(p.alto + 20, p.py(y1)));
      if (Math.abs(Y1 - Y0) > 14) p.flechaPx(X1, Y0, X1, Y1, { color: col.vertice, ancho: 3, punta: 9 });
      else p.segmento(n + 1, y0, n + 1, y1, { color: col.vertice, ancho: 3 });
      if (Math.abs(Y1 - Y0) > 26) {
        p.etiqueta(`×${num(k)}`, n + 1, (dentroY(p, y0) + dentroY(p, y1)) / 2, { color: col.vertice, dx: 8, dy: 0, alinear: 'left', tamano: 14 });
      }
    }
    for (let n = n1; n <= n2 + 1; n++) {
      if (!fuera(f(n))) p.punto(n, f(n), { color: col.vertice, radio: 4.5 });
    }
  });

  // --- Capa 5: asíntota, crece / decrece y ordenada al origen ---
  plano.agregarCapa((p) => {
    const { a, k } = estado;
    if (casillas.asintotas && !aEs0() && !kEs1()) {
      p.lineaHorizontal(0, { color: col.texto, ancho: 2, guiones: [3, 6], alfa: 0.85 });
      // la etiqueta va del lado donde la curva se acerca al eje
      const xe = k > 1 ? p.xMin : p.mx(p.ancho - 60);
      p.etiqueta('asíntota y = 0', xe, 0, { color: col.texto, dx: k > 1 ? 8 : 0, dy: a > 0 ? 16 : -16, alinear: k > 1 ? 'left' : 'right', tamano: 14 });
    }
    if (casillas.crece) {
      if (aEs0() || kEs1()) p.etiqueta('constante: ni crece ni decrece', p.cx, p.yMax, { color: col.fantasma, dx: 0, dy: 30, alinear: 'center', tamano: 14 });
      else tramoCrecimiento(p, 0, p.ancho - 56, crece());
    }
    if (casillas.ordenada) {
      p.punto(0, a, { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      p.etiqueta(`(0, ${num(a)})`, 0, a, { color: col.ordenada, dx: -10, dy: -14, alinear: 'right' });
    }
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const infoEl = $('[data-info]');
  const avisoEl = $('[data-aviso]');
  let parametroActivo = null;

  function actualizarExpresion() {
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${exponencialHtml(estado.a, estado.k, { marcar: true })}`;
    if (parametroActivo) expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');
  }

  const item = (color, titulo, cuerpo) =>
    `<li><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;

  /** "1 → 2 → 4 → 8 → 16": los valores en x = 0, 1, 2, 3, 4 */
  const cadena = (desde, hasta, paso = 1) => {
    const lista = [];
    for (let n = desde; paso > 0 ? n <= hasta : n >= hasta; n += paso) lista.push(numAprox(f(n)).replace('≈ ', '≈'));
    return lista.join(' → ');
  };

  function textoSaltos() {
    const { k } = estado;
    const inverso = 1 / k;
    let texto = `cada vez que avanzás 1 en ${X}, <i>f</i>(${X}) <b>se multiplica por ${num(k)}</b>: <span class="info-despeje">${cadena(0, 4)}</span>`;
    if (k < 1) {
      texto += esExacto(inverso)
        ? `. Multiplicar por ${num(k)} es lo mismo que dividir por ${num(inverso)}: por eso se achica.`
        : `. Multiplicar por un número menor que 1 achica: por eso baja.`;
    } else {
      texto += esExacto(inverso)
        ? `. Para la izquierda es al revés, se divide por ${num(k)}: <span class="info-despeje">${cadena(0, -2, -1)}</span>`
        : '.';
    }
    return texto;
  }

  function textoLineal() {
    const { a, k } = estado;
    const m = a * (k - 1);
    const gHtml = rectaHtml(m, a);
    let texto = `<i>g</i>(${X}) = ${gHtml} arranca en el mismo punto y pasa por el mismo (1, ${num(f(1))}), pero <b>${m < 0 ? 'resta' : 'suma'}</b> siempre ${num(Math.abs(m))}. La exponencial <b>multiplica</b> por ${num(k)}.`;
    if (k > 1) texto += ` En ${X} = 5: <i>g</i>(5) = ${numAprox(g(5))}, pero <i>f</i>(5) = ${numAprox(f(5))}. A la larga, la exponencial le gana a cualquier lineal.`;
    else if (k < 1) texto += ' La lineal sigue bajando y cruza el eje x; la exponencial se achica cada vez menos y nunca llega a 0.';
    return texto;
  }

  function actualizarInfo() {
    const { a, k } = estado;
    avisoEl.hidden = !(kEs1() || aEs0());
    if (aEs0()) avisoEl.innerHTML = 'Con <i>a</i> = 0 todo da 0: <i>f</i>(<i>x</i>) = 0 · <i>k</i><sup><i>x</i></sup> = 0. Ya no es una exponencial.';
    else if (kEs1()) avisoEl.innerHTML = `Con <i>k</i> = 1 nunca cambia: 1 multiplicado por 1 siempre da 1. Queda la función <b>constante</b> <i>f</i>(<i>x</i>) = ${num(a)}.`;

    const partes = [];
    if (casillas.saltos && !aEs0()) partes.push(item(col.vertice, 'Saltos:', textoSaltos()));
    if (casillas.ordenada) {
      partes.push(item(col.ordenada, 'Ordenada al origen:', `(0, ${num(a)}). Como ${num(k)}<sup>0</sup> = 1, queda <i>f</i>(0) = ${num(a)} · 1 = ${num(a)}: es donde arranca.`));
    }
    if (casillas.lineal && !aEs0()) partes.push(item(col.fantasma, 'Comparada con la lineal:', textoLineal()));
    if (casillas.asintotas && !aEs0() && !kEs1()) {
      const lado = k > 1 ? 'Hacia la izquierda' : 'Hacia la derecha';
      partes.push(item(col.texto, 'Asíntota horizontal: y = 0.', `${lado}, la curva se acerca cada vez más al eje x, pero <b>nunca lo toca</b>. Por eso la exponencial <b>no tiene raíces</b>.`));
    }
    if (casillas.crece) {
      if (aEs0() || kEs1()) partes.push(item(col.fantasma, 'Constante:', 'ni crece ni decrece.'));
      else {
        const porque = a > 0
          ? (k > 1 ? `la base es mayor que 1 (cada salto agranda)` : `la base está entre 0 y 1 (cada salto achica)`)
          : `<i>a</i> es negativo y da vuelta la curva`;
        partes.push(item(crece() ? col.crece : col.decrece, crece() ? 'Crece en ℝ:' : 'Decrece en ℝ:', `${porque}.`));
      }
    }
    if (casillas.dominio) {
      const imagen = aEs0() ? '{0}' : kEs1() ? `{${num(a)}}` : a > 0 ? '(0, +∞)' : '(−∞, 0)';
      partes.push(item(col.funcion, 'Dominio: ℝ.', `Cualquier número sirve de exponente.`));
      partes.push(item(col.funcion, `Imagen: ${imagen}.`, aEs0() || kEs1() ? '' : `${a > 0 ? 'Siempre da positivo' : 'Siempre da negativo'}: la curva nunca cruza el eje x.`));
    }

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba para ver qué tiene de especial esta curva.</p>';
  }

  // --------------------------------------------------------------- controles

  function redibujarTodo() {
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarInfo();
  }

  for (const nombre of ['k', 'a']) {
    const control = conectarDeslizador(raiz.querySelector(`.deslizador[data-param="${nombre}"]`), (v) => {
      estado[nombre] = v;
      redibujarTodo();
    }, {
      alEmpezar: () => { parametroActivo = nombre; actualizarExpresion(); },
      alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
    });
    estado[nombre] = control.valor;
  }

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
  plano.alCambiarVista.push(() => { if (!animacion.animando) animacion.calcularXs(); });

  actualizarExpresion();
  actualizarInfo();

  // La animación arranca recién cuando el gráfico aparece en pantalla.
  if (casillas.animacion) {
    animacion.visibles = 0;
    animacion.hastaX = -Infinity;
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        observador.disconnect();
        if (casillas.animacion) animacion.reproducir(); else animacion.terminar();
      }
    }, { threshold: 0.6 });
    observador.observe($('[data-grafico]'));
  }
}
