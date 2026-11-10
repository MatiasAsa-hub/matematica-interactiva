// ==========================================================================
// INTERACTIVO: función cuadrática en forma canónica  f(x) = a(x − h)² + k
// El HTML está en src/components/interactivos/Cuadratica.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { AnimacionPuntos } from '../lib/grafico/animacionPuntos.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { num, numAprox, igual } from '../lib/numeros.js';

const EPS = 1e-9;

// --------------------------------------------------------------------------
// Cuentas
// --------------------------------------------------------------------------

/** Todo lo que se puede calcular de f(x) = a(x − h)² + k */
export function analizar(a, h, k) {
  const b = -2 * a * h;
  const c = a * h * h + k;
  const delta = b * b - 4 * a * c; // = −4ak
  let raices = [];
  if (a !== 0) {
    if (Math.abs(delta) < EPS) raices = [h];
    else if (delta > 0) {
      const d = Math.sqrt(-k / a);
      raices = [h - d, h + d];
    }
  }
  return { a, h, k, b, c, delta, raices };
}

/** Polinomio desarrollado: a·x² + b·x + c, escrito lindo. */
function polinomio(a, b, c) {
  const terminos = [];
  const agregar = (coef, letra) => {
    if (Math.abs(coef) < 0.005) return;
    const signo = coef < 0 ? '−' : '+';
    const abs = Math.abs(coef);
    let t = letra && Math.abs(abs - 1) < 0.005 ? '' : numAprox(abs).replace('≈ ', '');
    t += letra;
    terminos.push({ signo, t });
  };
  agregar(a, '<i>x</i>²');
  agregar(b, '<i>x</i>');
  agregar(c, '');
  if (terminos.length === 0) return '0';
  return terminos
    .map((x, i) => (i === 0 ? (x.signo === '−' ? '−' : '') + x.t : ` ${x.signo} ${x.t}`))
    .join('');
}

/** La fórmula en vivo, con cada valor marcado para poder resaltarlo. */
function expresionEnVivo(a, h, k) {
  const v = (p, texto) => `<span class="valor" data-p="${p}">${texto}</span>`;
  const fx = '<i>f</i>(<i>x</i>) = ';
  if (a === 0) return fx + v('k', num(k));
  let s = '';
  if (a === -1) s += v('a', '−');
  else if (a !== 1) s += v('a', num(a));
  s += h === 0 ? '<i>x</i>²' : `(<i>x</i> ${h > 0 ? '−' : '+'} ${v('h', num(Math.abs(h)))})²`;
  if (k !== 0) s += ` ${k > 0 ? '+' : '−'} ${v('k', num(Math.abs(k)))}`;
  return fx + s;
}

/** Intervalo abierto escrito con la convención de la página. */
const intervalo = (desde, hasta) => `(${num(desde)}, ${num(hasta)})`;

// Conjuntos C⁺, C⁻ y C⁰ (como texto)
function conjuntos({ a, k, raices }) {
  const R = 'ℝ';
  const vacio = '∅';
  if (a === 0) {
    if (k > 0) return { pos: R, neg: vacio, cero: vacio };
    if (k < 0) return { pos: vacio, neg: R, cero: vacio };
    return { pos: vacio, neg: vacio, cero: R };
  }
  const afuera = a > 0 ? 'pos' : 'neg';
  const adentro = a > 0 ? 'neg' : 'pos';
  const r = { pos: vacio, neg: vacio, cero: vacio };
  if (raices.length === 0) {
    r[afuera] = R;
  } else if (raices.length === 1) {
    const [x] = raices;
    r[afuera] = `${intervalo(-Infinity, x)} ∪ ${intervalo(x, Infinity)}`;
    r.cero = `{${num(x)}}`;
  } else {
    const [x1, x2] = raices;
    r[afuera] = `${intervalo(-Infinity, x1)} ∪ ${intervalo(x2, Infinity)}`;
    r[adentro] = intervalo(x1, x2);
    r.cero = `{${numAprox(x1)}, ${numAprox(x2)}}`.replace(/≈ /g, '≈');
  }
  return r;
}

// --------------------------------------------------------------------------
// El interactivo
// --------------------------------------------------------------------------

export function iniciarCuadratica(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { a: 1, h: 1, k: -4 };
  const f = (x) => estado.a * (x - estado.h) ** 2 + estado.k;

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -6, xMax: 6, yCentro: 0 },
    descripcion: 'Gráfico de la parábola',
  });
  const col = plano.colores;
  let casillas = {};

  // --- Capa 1: zonas C⁺ y C⁻ (debajo de la curva) ---
  plano.agregarCapa((p) => {
    if (!casillas.signos) return;
    p.zonaSigno(f, +1, { color: col.positivo, alfa: 0.16 });
    p.zonaSigno(f, -1, { color: col.negativo, alfa: 0.14, rayado: true });
    dibujarBarrasDeSigno(p);
  });

  // --- Capa 2: rectas auxiliares (eje de simetría, máximo o mínimo) ---
  plano.agregarCapa((p) => {
    const { a, h, k } = estado;
    if (a === 0) return;
    if (casillas.eje) {
      p.lineaVertical(h, { color: col.vertice, guiones: [8, 7], ancho: 2, alfa: 0.9 });
      p.etiqueta(`x = ${num(h)}`, h, p.yMax, { color: col.vertice, dx: 8, dy: casillas.crece ? 62 : 22, tamano: 14 });
    }
    if (casillas.extremo) {
      // línea punteada del vértice al eje y (la etiqueta va junto al vértice, en la capa 5)
      p.segmento(0, k, h, k, { color: col.vertice, guiones: [2, 5], ancho: 2 });
    }
  });

  // --- Capas 3 y 4: la curva y la animación de puntos ---
  const tablaCaja = $('[data-tabla]');
  const animacion = new AnimacionPuntos(plano, { f, color: col.funcion, tabla: tablaCaja });

  // --- Capa 5: puntos notables y etiquetas ---
  plano.agregarCapa((p) => {
    const { a, h, k } = estado;
    const d = analizar(a, h, k);

    // raíces (C⁰)
    if (casillas.raices || casillas.signos) {
      const varias = d.raices.length > 1;
      d.raices.forEach((r, i) => {
        p.punto(r, 0, { color: col.raices, radio: 6.5 });
        if (casillas.raices) {
          const nombre = varias ? `x${i === 0 ? '₁' : '₂'}` : 'x';
          const izq = varias ? i === 0 : false;
          p.etiqueta(`${nombre} ${igual(r)}`, r, 0, {
            color: col.raices, dx: izq ? -8 : 8, dy: a > 0 ? -16 : 16, alinear: izq ? 'right' : 'left',
          });
        }
      });
      if (a === 0 && k === 0 && casillas.raices) {
        p.etiqueta('¡todos los x son raíces!', p.cx, 0, { color: col.raices, dy: -16, alinear: 'center' });
      }
    }

    // ordenada al origen
    if (casillas.ordenada) {
      const c = a * h * h + k;
      p.punto(0, c, { color: col.ordenada, forma: 'cuadrado', radio: 5.5 });
      const izq = h >= 0;
      p.etiqueta(`(0, ${numAprox(c)})`, 0, c, { color: col.ordenada, dx: izq ? -10 : 10, dy: 0, alinear: izq ? 'right' : 'left' });
    }

    // vértice
    if (a !== 0 && (casillas.vertice || casillas.extremo)) {
      p.punto(h, k, { color: col.vertice, forma: 'rombo', radio: 6 });
      const extremo = a > 0 ? 'mínimo' : 'máximo';
      let texto = '';
      if (casillas.vertice && casillas.extremo) texto = `V = (${num(h)}, ${num(k)}) · ${extremo}`;
      else if (casillas.vertice) texto = `V = (${num(h)}, ${num(k)})`;
      else texto = `${extremo}: y = ${num(k)}`;
      p.etiqueta(texto, h, k, { color: col.vertice, dx: 0, dy: a > 0 ? 24 : -24, alinear: 'center' });
    }

    // crece / decrece (franja al pie del gráfico)
    if (a !== 0 && casillas.crece) dibujarCrecimiento(p);
  });

  // Barras sobre el eje x que muestran C⁺ (lisa) y C⁻ (punteada)
  function dibujarBarrasDeSigno(p) {
    const { a, k } = estado;
    const d = analizar(estado.a, estado.h, estado.k);
    const cortes = [p.xMin, ...d.raices.filter((r) => r > p.xMin && r < p.xMax), p.xMax];
    const Y0 = p.py(0);
    if (Y0 < -10 || Y0 > p.alto + 10) return;
    for (let i = 0; i < cortes.length - 1; i++) {
      const x1 = cortes[i];
      const x2 = cortes[i + 1];
      const y = a === 0 ? k : f((x1 + x2) / 2);
      if (Math.abs(y) < EPS) continue;
      const positivo = y > 0;
      const ctx = p.ctx;
      ctx.save();
      ctx.strokeStyle = positivo ? col.positivo : col.negativo;
      ctx.lineWidth = 5;
      ctx.lineCap = 'butt';
      if (!positivo) ctx.setLineDash([9, 6]);
      ctx.beginPath();
      ctx.moveTo(p.px(x1) + 3, Y0);
      ctx.lineTo(p.px(x2) - 3, Y0);
      ctx.stroke();
      ctx.restore();
      if (p.px(x2) - p.px(x1) > 46) {
        // la etiqueta va adentro de la zona pintada, a media altura
        // (sin meterse debajo de los botones de zoom)
        const xm = (x1 + Math.min(x2, p.mx(p.ancho - 60))) / 2;
        const ym = Math.max(p.yMin, Math.min(p.yMax, y)) / 2;
        p.etiqueta(positivo ? 'C⁺' : 'C⁻', xm, ym, {
          color: positivo ? col.positivo : col.negativo,
          dx: 0, dy: 0, alinear: 'center', tamano: 18,
        });
      }
    }
  }

  // Franja arriba del gráfico (sin pisar los botones de zoom de la derecha)
  function dibujarCrecimiento(p) {
    const { a, h } = estado;
    const Y = 30;
    const derecha = p.ancho - 56;
    const Xh = Math.min(Math.max(p.px(h), 0), derecha);
    const tramo = (X1, X2, crece) => {
      if (X2 - X1 < 30) return;
      const color = crece ? col.crece : col.decrece;
      const m = 5; // inclinación de la flecha
      p.flechaPx(X1 + 8, crece ? Y + m : Y - m, X2 - 8, crece ? Y - m : Y + m, { color, ancho: 3 });
      const ctx = p.ctx;
      ctx.save();
      ctx.font = `700 14px ${p.fuente}`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      p._textoConHalo(crece ? 'crece' : 'decrece', (X1 + X2) / 2, Y - 9);
      ctx.restore();
    };
    tramo(0, Xh, a < 0);
    tramo(Xh, derecha, a > 0);
    if (Xh > 0 && Xh < derecha) {
      p.ctx.save();
      p.ctx.strokeStyle = col.vertice;
      p.ctx.lineWidth = 2;
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
    expresionEl.innerHTML = expresionEnVivo(estado.a, estado.h, estado.k);
    if (parametroActivo) {
      expresionEl.querySelector(`[data-p="${parametroActivo}"]`)?.classList.add('activo');
    }
  }

  function item(color, titulo, cuerpo, clase = '') {
    return `<li class="${clase}"><span class="info-marca" style="--color:${color}"></span><div><strong>${titulo}</strong> ${cuerpo}</div></li>`;
  }

  function actualizarInfo() {
    const { a, h, k } = estado;
    const d = analizar(a, h, k);
    avisoA0.hidden = a !== 0;
    const partes = [];

    if (a !== 0) {
      if (casillas.vertice) partes.push(item(col.vertice, 'Vértice:', `V = (${num(h)}, ${num(k)})`));
      if (casillas.eje) partes.push(item(col.vertice, 'Eje de simetría:', `la recta x = ${num(h)}`));
    }

    if (casillas.raices && a !== 0) {
      const resolvente = plantillaResolvente.innerHTML;
      let resultado;
      if (d.raices.length === 2) {
        resultado = `<p class="info-resultado">Dos raíces: <b>x₁ ${igual(d.raices[0])}</b> y <b>x₂ ${igual(d.raices[1])}</b></p>`;
      } else if (d.raices.length === 1) {
        resultado = `<p class="info-resultado">Una sola raíz (doble): <b>x = ${num(d.raices[0])}</b>. La parábola toca el eje x justo en el vértice.</p>`;
      } else {
        resultado = `<p class="cartel-aviso"><b>No hay raíces reales.</b> b² − 4ac ${igual(d.delta)} es negativo, y no existe la raíz cuadrada de un número negativo: la parábola no toca el eje x.</p>`;
      }
      partes.push(item(col.raices, 'Raíces', `(donde la parábola corta al eje x)
        <p>Desarrollando: <i>f</i>(<i>x</i>) = ${polinomio(a, d.b, d.c)}, o sea
        a ${igual(a)}, b ${igual(d.b)}, c ${igual(d.c)}.</p>
        <p>Con la resolvente:</p>${resolvente}
        <p>b² − 4ac ${igual(d.delta)}</p>${resultado}`, 'info-larga'));
    }

    if (casillas.ordenada) {
      const c = a * h * h + k;
      partes.push(item(col.ordenada, 'Ordenada al origen:', `(0, ${numAprox(c)}). Es f(0): donde la curva corta al eje y.`));
    }

    if (casillas.signos) {
      const s = conjuntos(d);
      partes.push(item(col.positivo, 'C⁺ =', `${s.pos} <span class="texto-suave">(donde f(x) > 0)</span>`));
      partes.push(item(col.negativo, 'C⁻ =', `${s.neg} <span class="texto-suave">(donde f(x) < 0)</span>`));
      partes.push(item(col.raices, 'C⁰ =', `${s.cero} <span class="texto-suave">(donde f(x) = 0)</span>`));
    }

    if (casillas.crece && a !== 0) {
      const izq = intervalo(-Infinity, h);
      const der = intervalo(h, Infinity);
      partes.push(item(col.crece, 'Crece en', a > 0 ? der : izq));
      partes.push(item(col.decrece, 'Decrece en', a > 0 ? izq : der));
    }

    if (casillas.extremo && a !== 0) {
      partes.push(item(col.vertice, a > 0 ? 'Mínimo:' : 'Máximo:',
        `y = ${num(k)}, en x = ${num(h)}. ${a > 0 ? 'La parábola abre para arriba (a > 0): el vértice es el punto más bajo.' : 'La parábola abre para abajo (a < 0): el vértice es el punto más alto.'}`));
    }

    infoEl.innerHTML = partes.length
      ? `<ul class="info-lista">${partes.join('')}</ul>`
      : '<p class="texto-suave chico">Prendé alguna de las opciones de arriba para ver los puntos importantes de la parábola.</p>';
  }

  // --------------------------------------------------------------- controles

  const alCambiarParametro = () => {
    animacion.funcionCambio();
    plano.pedirDibujo();
    actualizarExpresion();
    actualizarInfo();
  };

  for (const nombre of ['a', 'h', 'k']) {
    const el = raiz.querySelector(`.deslizador[data-param="${nombre}"]`);
    const control = conectarDeslizador(el, (v) => { estado[nombre] = v; alCambiarParametro(); }, {
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
