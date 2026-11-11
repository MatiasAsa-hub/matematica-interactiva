// ==========================================================================
// INTERACTIVO: función cuadrática, en dos formas
//   - polinómica:  f(x) = ax² + bx + c      (la que aparece primero)
//   - canónica:    f(x) = a(x − h)² + k
// Un botón cambia de forma (y de deslizadores); la parábola queda igual.
// El HTML está en src/components/interactivos/Cuadratica.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { num, numAprox, igual } from '../lib/numeros.js';
import { conjuntos, dibujarBarrasDeSigno, tramoCrecimiento, intervaloAbierto, Y_CRECIMIENTO } from '../lib/grafico/signos.js';

const EPS = 1e-9;

// --------------------------------------------------------------------------
// Cuentas
// --------------------------------------------------------------------------

/** Raíces reales de ax² + bx + c (sirve también si a = 0: recta). */
export function raicesDe(a, b, c) {
  if (Math.abs(a) < EPS) {
    if (Math.abs(b) < EPS) return []; // constante (si c = 0, son todos los x: se trata aparte)
    return [-c / b];
  }
  const delta = b * b - 4 * a * c;
  if (Math.abs(delta) < 1e-9) return [-b / (2 * a)];
  if (delta < 0) return [];
  const r = Math.sqrt(delta);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((x, y) => x - y);
}

/** Polinomio a·x² + b·x + c escrito lindo, con cada coeficiente marcado. */
function polinomio(a, b, c, { marcar = false, aproximar = false } = {}) {
  const v = (p, texto) => (marcar ? `<span class="valor" data-p="${p}">${texto}</span>` : texto);
  const terminos = [];
  const agregar = (coef, letra, p) => {
    if (Math.abs(coef) < 0.005) return;
    const abs = Math.abs(coef);
    const numero = aproximar ? numAprox(abs).replace('≈ ', '') : num(abs);
    const t = letra && Math.abs(abs - 1) < 0.005 ? letra : v(p, numero) + letra;
    terminos.push({ signo: coef < 0 ? '−' : '+', t });
  };
  agregar(a, '<i>x</i>²', 'a');
  agregar(b, '<i>x</i>', 'b');
  agregar(c, '', 'c');
  if (terminos.length === 0) return '0';
  return terminos
    .map((x, i) => (i === 0 ? (x.signo === '−' ? '−' : '') + x.t : ` ${x.signo} ${x.t}`))
    .join('');
}

/** Forma canónica escrita linda, con cada valor marcado. */
function canonica(a, h, k) {
  const v = (p, texto) => `<span class="valor" data-p="${p}">${texto}</span>`;
  if (a === 0) return v('k', num(k));
  let s = '';
  if (a === -1) s += v('a', '−');
  else if (a !== 1) s += v('a', num(a));
  s += Math.abs(h) < 0.005 ? '<i>x</i>²' : `(<i>x</i> ${h > 0 ? '−' : '+'} ${v('h', num(Math.abs(h)))})²`;
  if (Math.abs(k) >= 0.005) s += ` ${k > 0 ? '+' : '−'} ${v('k', num(Math.abs(k)))}`;
  return s;
}

const intervalo = intervaloAbierto;

// --------------------------------------------------------------------------
// El interactivo
// --------------------------------------------------------------------------

export function iniciarCuadratica(raiz) {
  const $ = (sel) => raiz.querySelector(sel);

  // a, b, c (polinómica) y h, k (canónica) se mantienen siempre sincronizados.
  const estado = { forma: 'polinomica', a: 1, b: -2, c: -3, h: 1, k: -4 };
  const f = (x) => estado.a * x * x + estado.b * x + estado.c;
  const esCuadratica = () => Math.abs(estado.a) > EPS;

  function canonicaDesdePolinomica() {
    if (!esCuadratica()) return; // sin x² no hay vértice
    estado.h = -estado.b / (2 * estado.a);
    estado.k = f(estado.h);
  }
  function polinomicaDesdeCanonica() {
    const { a, h, k } = estado;
    estado.b = -2 * a * h;
    estado.c = a * h * h + k;
  }

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 0 },
    descripcion: 'Gráfico de la parábola',
  });
  const col = plano.colores;
  let casillas = {};

  const datos = () => {
    const { a, b, c } = estado;
    const todoCero = Math.abs(a) < EPS && Math.abs(b) < EPS && Math.abs(c) < EPS;
    return { raices: raicesDe(a, b, c), delta: b * b - 4 * a * c, todoCero };
  };

  // --- Capa 1: zonas C⁺ y C⁻ (debajo de la curva) ---
  plano.agregarCapa((p) => {
    if (!casillas.signos) return;
    p.zonaSigno(f, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(f, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    dibujarBarrasDeSigno(p, f, datos().raices);
  });

  // --- Capa 2: rectas auxiliares (eje de simetría, máximo o mínimo) ---
  plano.agregarCapa((p) => {
    if (!esCuadratica()) return;
    const { h, k } = estado;
    if (casillas.eje) {
      p.lineaVertical(h, { color: col.vertice, guiones: [8, 7], ancho: 2, alfa: 0.9 });
      p.etiqueta(`x = ${num(h)}`, h, p.yMax, { color: col.vertice, dx: 8, dy: casillas.crece ? 62 : 22, tamano: 14 });
    }
    if (casillas.extremo) {
      p.segmento(0, k, h, k, { color: col.vertice, guiones: [2, 5], ancho: 2 });
    }
  });

  // --- Capas 3 y 4: la curva y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, { f, color: col.funcion, tabla: tablaCaja });

  // --- Capa 5: puntos notables y etiquetas ---
  plano.agregarCapa((p) => {
    const { a, b, c, h, k } = estado;
    const d = datos();

    // raíces (C⁰)
    if (casillas.raices || casillas.signos) {
      const varias = d.raices.length > 1;
      const arriba = esCuadratica() ? a > 0 : true;
      d.raices.forEach((r, i) => {
        p.punto(r, 0, { color: col.raices, radio: 6.5 });
        if (casillas.raices) {
          const nombre = varias ? `x${i === 0 ? '₁' : '₂'}` : 'x';
          const izq = varias ? i === 0 : false;
          p.etiqueta(`${nombre} ${igual(r)}`, r, 0, {
            color: col.raices, dx: izq ? -8 : 8, dy: arriba ? -16 : 16, alinear: izq ? 'right' : 'left',
          });
        }
      });
      if (d.todoCero && casillas.raices) {
        p.etiqueta('¡todos los x son raíces!', p.cx, 0, { color: col.raices, dy: -16, alinear: 'center' });
      }
    }

    // ordenada al origen
    if (casillas.ordenada) {
      p.punto(0, c, { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      const izq = !esCuadratica() || h >= 0;
      p.etiqueta(`(0, ${numAprox(c)})`, 0, c, { color: col.ordenada, dx: izq ? -10 : 10, dy: 0, alinear: izq ? 'right' : 'left' });
    }

    // vértice (y máximo o mínimo)
    if (esCuadratica() && (casillas.vertice || casillas.extremo)) {
      p.punto(h, k, { color: col.vertice, forma: 'rombo', radio: 6 });
      const extremo = a > 0 ? 'mínimo' : 'máximo';
      let texto;
      if (casillas.vertice && casillas.extremo) texto = `V = (${num(h)}, ${num(k)}) · ${extremo}`;
      else if (casillas.vertice) texto = `V = (${num(h)}, ${num(k)})`;
      else texto = `${extremo}: y = ${num(k)}`;
      p.etiqueta(texto, h, k, { color: col.vertice, dx: 0, dy: a > 0 ? 24 : -24, alinear: 'center' });
    }

    // crece / decrece (franja arriba del gráfico)
    if (casillas.crece && !(Math.abs(a) < EPS && Math.abs(b) < EPS)) dibujarCrecimiento(p);
  });

  // Franja arriba del gráfico (sin pisar los botones de zoom de la derecha)
  function dibujarCrecimiento(p) {
    const { a, b, h } = estado;
    const Y = Y_CRECIMIENTO;
    const derecha = p.ancho - 56;
    const tramo = (X1, X2, crece) => tramoCrecimiento(p, X1, X2, crece);
    if (!esCuadratica()) { tramo(0, derecha, b > 0); return; } // recta
    const Xh = Math.min(Math.max(p.px(h), 0), derecha);
    tramo(0, Xh, a < 0);
    tramo(Xh, derecha, a > 0);
    if (Xh > 0 && Xh < derecha) {
      p.ctx.save();
      p.ctx.strokeStyle = col.vertice;
      p.ctx.lineWidth = p.grosor(2);
      p.ctx.beginPath();
      p.ctx.moveTo(Xh, Y - 10);
      p.ctx.lineTo(Xh, Y + 10);
      p.ctx.stroke();
      p.ctx.restore();
    }
  }

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const infoEl = $('[data-info]');
  const avisoA0 = $('[data-aviso-a0]');
  const plantillaResolvente = $('template[data-resolvente]');
  let parametroActivo = null;

  function actualizarExpresion() {
    const { a, b, c, h, k } = estado;
    const fx = '<i>f</i>(<i>x</i>) = ';
    expresionEl.innerHTML = fx + (estado.forma === 'polinomica'
      ? polinomio(a, b, c, { marcar: true })
      : canonica(a, h, k));
    if (parametroActivo) {
      expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');
    }
  }

  function item(color, titulo, cuerpo, clase = '') {
    return `<li class="${clase}"><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;
  }

  function actualizarInfo() {
    const { forma, a, b, c, h, k } = estado;
    const d = datos();
    const cuad = esCuadratica();
    avisoA0.hidden = cuad;
    avisoA0.innerHTML = forma === 'polinomica'
      ? 'Con <i>a</i> = 0 desaparece la <i>x</i>²: queda <i>f</i>(<i>x</i>) = <i>bx</i> + <i>c</i>, que es una <b>función lineal</b> (una recta).'
      : 'Con <i>a</i> = 0 desaparece la <i>x</i>²: queda <i>f</i>(<i>x</i>) = <i>k</i>, que no es una parábola sino una recta horizontal.';
    const partes = [];

    if (casillas.raices) {
      if (!cuad) {
        const texto = d.todoCero ? 'todos los x (la función vale 0 siempre).'
          : d.raices.length ? `x ${igual(d.raices[0])}` : 'no tiene (es una recta horizontal que no toca el eje x).';
        partes.push(item(col.raices, 'Raíces:', texto));
      } else {
        let resultado;
        if (d.raices.length === 2) {
          resultado = `<p class="info-resultado">Dos raíces: <b>x₁ ${igual(d.raices[0])}</b> y <b>x₂ ${igual(d.raices[1])}</b></p>`;
        } else if (d.raices.length === 1) {
          resultado = `<p class="info-resultado">Una sola raíz (doble): <b>x ${igual(d.raices[0])}</b>. La parábola toca el eje x justo en el vértice.</p>`;
        } else {
          resultado = `<p class="cartel-aviso"><b>No hay raíces reales.</b> b² − 4ac ${igual(d.delta)} es negativo, y no existe la raíz cuadrada de un número negativo: la parábola no toca el eje x.</p>`;
        }
        const coeficientes = forma === 'polinomica'
          ? `<p>a ${igual(a)}, b ${igual(b)}, c ${igual(c)}.</p>`
          : `<p>Desarrollando: <i>f</i>(<i>x</i>) = ${polinomio(a, b, c, { aproximar: true })}, o sea a ${igual(a)}, b ${igual(b)}, c ${igual(c)}.</p>`;
        partes.push(item(col.raices, 'Raíces', `(donde la parábola corta al eje x)
          ${coeficientes}<p>Con la resolvente:</p>${plantillaResolvente.innerHTML}
          <p>b² − 4ac ${igual(d.delta)}</p>${resultado}`, 'info-larga'));
      }
    }

    if (cuad && casillas.vertice) {
      const comoSale = forma === 'polinomica'
        ? `<span class="texto-suave">(x<sub>v</sub> = −b / (2a), y después y<sub>v</sub> = f(x<sub>v</sub>))</span>`
        : '<span class="texto-suave">(en la forma canónica se lee directo: (h, k))</span>';
      partes.push(item(col.vertice, 'Vértice:', `V = (${numAprox(h)}, ${numAprox(k)}) ${comoSale}`));
    }
    if (cuad && casillas.eje) partes.push(item(col.vertice, 'Eje de simetría:', `la recta x ${igual(h)}`));

    if (casillas.ordenada) {
      partes.push(item(col.ordenada, 'Ordenada al origen:', `(0, ${numAprox(c)}). Es f(0): donde la curva corta al eje y.${forma === 'polinomica' ? ' En la forma polinómica es directamente c.' : ''}`));
    }

    if (casillas.signos) {
      const s = conjuntos(f, d.raices, d.todoCero);
      partes.push(item(col.positivo, 'C⁺ =', `${s.pos} <span class="texto-suave">(donde f(x) > 0)</span>`));
      partes.push(item(col.negativo, 'C⁻ =', `${s.neg} <span class="texto-suave">(donde f(x) < 0)</span>`));
      partes.push(item(col.raices, 'C⁰ =', `${s.cero} <span class="texto-suave">(donde f(x) = 0)</span>`));
    }

    if (casillas.crece) {
      if (cuad) {
        const izq = intervalo(-Infinity, h);
        const der = intervalo(h, Infinity);
        partes.push(item(col.crece, 'Crece en', a > 0 ? der : izq));
        partes.push(item(col.decrece, 'Decrece en', a > 0 ? izq : der));
      } else if (Math.abs(b) > EPS) {
        partes.push(item(b > 0 ? col.crece : col.decrece, b > 0 ? 'Crece en' : 'Decrece en', 'ℝ (es una recta)'));
      } else {
        partes.push(item(col.fantasma, 'Constante:', 'ni crece ni decrece.'));
      }
    }

    if (casillas.extremo && cuad) {
      partes.push(item(col.vertice, a > 0 ? 'Mínimo:' : 'Máximo:',
        `y ${igual(k)}, en x ${igual(h)}. ${a > 0 ? 'Abre para arriba (a > 0): el vértice es el punto más bajo.' : 'Abre para abajo (a < 0): el vértice es el punto más alto.'}`));
    }

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba para ver los puntos importantes de la parábola.</p>';
  }

  // --------------------------------------------------------------- controles

  const redibujarTodo = () => {
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarInfo();
  };

  const deslizadores = {};
  for (const nombre of ['a', 'b', 'c', 'h', 'k']) {
    const el = raiz.querySelector(`.deslizador[data-param="${nombre}"]`);
    deslizadores[nombre] = conectarDeslizador(el, (v) => {
      estado[nombre] = v;
      // mantener la otra forma al día
      if (estado.forma === 'polinomica') canonicaDesdePolinomica();
      else polinomicaDesdeCanonica();
      redibujarTodo();
    }, {
      alEmpezar: () => { parametroActivo = nombre; actualizarExpresion(); },
      alTerminar: () => { parametroActivo = null; actualizarExpresion(); },
    });
  }
  // valores iniciales, tomados de los deslizadores de la forma polinómica
  for (const n of ['a', 'b', 'c']) estado[n] = deslizadores[n].valor;
  canonicaDesdePolinomica();
  deslizadores.h.poner(estado.h, false, false);
  deslizadores.k.poner(estado.k, false, false);

  // Botón para cambiar de forma
  const botonesForma = [...raiz.querySelectorAll('[data-selector-forma] [data-forma]')];
  for (const boton of botonesForma) {
    boton.addEventListener('click', () => {
      const forma = boton.dataset.forma;
      if (forma === estado.forma) return;
      estado.forma = forma;
      for (const b of botonesForma) b.setAttribute('aria-checked', String(b === boton));
      for (const g of raiz.querySelectorAll('[data-grupo]')) g.hidden = g.dataset.grupo !== forma;
      // los deslizadores de la forma nueva muestran la misma parábola
      if (forma === 'canonica') {
        if (!esCuadratica()) polinomicaDesdeCanonica(); // sin x² no hay vértice: se usa el último que hubo
        deslizadores.h.poner(estado.h, false, false);
        deslizadores.k.poner(estado.k, false, false);
      } else {
        deslizadores.b.poner(estado.b, false, false);
        deslizadores.c.poner(estado.c, false, false);
      }
      redibujarTodo();
    });
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

  // Al cambiar el zoom, los puntos de la tabla se recalculan (si no se está animando)
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
        animacion.reproducir();
      }
    }, { threshold: 0.6 });
    observador.observe($('[data-grafico]'));
  }
}
