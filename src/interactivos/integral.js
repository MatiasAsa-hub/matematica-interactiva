// ==========================================================================
// INTERACTIVO 7.a: la integral, achicando dx
//
// - Entre a y b, el área bajo la curva se llena con tiras (rectángulos) de
//   base dx y altura f(x). Arriba se lee la suma: Σ f(x) · dx.
// - "Achicar dx": cada tira se parte en dos (animado): dx = 1, 0.5, 0.25…
//   hasta 1/32. Al final las tiras se funden en el área: ∫ f(x) dx.
// - La altura de cada tira se toma a la izquierda, al medio o a la derecha
//   (con los tres se llega al mismo número).
// - Las tiras de arriba del eje van en verde y suman; las de abajo, en rojo
//   y restan.
// - Con "abajo: g" en el ejemplo, las tiras van de g a f: el área entre dos
//   curvas. Con barrow: true se muestra la cuenta con la primitiva.
// - a y b se arrastran sobre el eje x (de a 1).
// Los ejemplos vienen del tema (campo "integrales:" del .md).
// El HTML está en src/components/interactivos/Integral.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarCasillas } from '../lib/grafico/controles.js';
import { animar, sinMovimiento, suave } from '../lib/grafico/animacion.js';
import { leerIntegral, primitivaDe, integral, integralHtml, fraccionHtml } from '../lib/integrales.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox, igual, esExacto } from '../lib/numeros.js';

const X = '<i>x</i>';
const DX = '<i>dx</i>';
const NIVELES = 6;   // dx = 1, 1/2, 1/4, 1/8, 1/16, 1/32
const ANCHO_MAX = 8; // b − a, como mucho

/** "= 9" o "= 32/3 ≈ 10.67" */
function resultadoHtml(v) {
  const fr = fraccionHtml(v);
  if (esExacto(v)) return `= ${num(v)}`;
  return fr.includes('class="fr"') ? `= ${fr} ≈ ${num(v)}` : `≈ ${num(v)}`;
}

export function iniciarIntegral(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const textos = JSON.parse(raiz.dataset.integrales);
  const estado = { indice: 0, datos: null, a: 0, b: 3, nivel: 0, trans: 1, fundido: 0, altura: 'izq' };

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -1.5, xMax: 4.5, yCentro: 3 },
    descripcion: 'Gráfico de la función con las tiras que forman el área',
  });
  const col = plano.colores;
  let casillas = {};

  const f = (x) => estado.datos.f.f(x);
  const g = (x) => (estado.datos.g ? estado.datos.g.f(x) : 0);
  const n0 = () => estado.b - estado.a;
  const nDe = (nivel) => n0() * 2 ** nivel;
  const dxDe = (nivel) => 1 / 2 ** nivel;

  /** El x donde se toma la altura de la tira i (de n tiras). */
  function xAltura(i, n) {
    const dx = (estado.b - estado.a) / n;
    const x0 = estado.a + i * dx;
    return estado.altura === 'izq' ? x0 : estado.altura === 'der' ? x0 + dx : x0 + dx / 2;
  }
  /** La suma de las tiras para un nivel. */
  function suma(nivel) {
    const n = nDe(nivel);
    const dx = dxDe(nivel);
    let s = 0;
    for (let i = 0; i < n; i++) { const x = xAltura(i, n); s += (f(x) - g(x)) * dx; }
    return s;
  }
  const exacto = () => integral(estado.datos.h, estado.a, estado.b);

  // --- Capa 1: las tiras (o el área ya fundida) ---
  plano.agregarCapa((p) => {
    const { a, b, nivel } = estado;
    const ctx = p.ctx;
    const fade = 1 - estado.fundido;
    if (fade > 0) {
      const n = nDe(nivel);
      const dx = dxDe(nivel);
      const t = nivel > 0 ? suave(estado.trans) : 1;
      const conBorde = dx * p.escala >= 5;
      for (let i = 0; i < n; i++) {
        const x = xAltura(i, n);
        let abajo = g(x);
        let arriba = f(x);
        if (t < 1) {
          // mientras se parte, la altura viaja desde la de la tira "madre"
          const xm = xAltura(Math.floor(i / 2), n / 2);
          abajo = g(xm) + (abajo - g(xm)) * t;
          arriba = f(xm) + (arriba - f(xm)) * t;
        }
        const color = arriba >= abajo ? col.positivo : col.negativo;
        const X1 = p.px(a + i * dx);
        const X2 = p.px(a + (i + 1) * dx);
        const Y1 = p.py(Math.max(abajo, arriba));
        const Y2 = p.py(Math.min(abajo, arriba));
        ctx.save();
        ctx.globalAlpha = 0.32 * fade;
        ctx.fillStyle = color;
        ctx.fillRect(X1, Y1, X2 - X1, Y2 - Y1);
        if (conBorde) {
          ctx.globalAlpha = 0.85 * fade;
          ctx.strokeStyle = color;
          ctx.lineWidth = p.grosor(1.5);
          ctx.strokeRect(X1, Y1, X2 - X1, Y2 - Y1);
        }
        ctx.restore();
      }
    }
    if (estado.fundido > 0) {
      // el área suave: columnitas de 1 píxel entre g y f
      ctx.save();
      ctx.globalAlpha = 0.38 * estado.fundido;
      for (let X = Math.floor(p.px(a)); X < p.px(b); X++) {
        const x = p.mx(X + 0.5);
        const y1 = g(x);
        const y2 = f(x);
        ctx.fillStyle = y2 >= y1 ? col.positivo : col.negativo;
        ctx.fillRect(X, p.py(Math.max(y1, y2)), 1, Math.abs(p.py(y1) - p.py(y2)));
      }
      ctx.restore();
    }
  });

  // --- Capa 2: las curvas ---
  plano.agregarCapa((p) => {
    if (estado.datos.g) p.curva(g, { color: col.ordenada, ancho: 3.5 });
    p.curva(f, { color: col.funcion, ancho: 3.5 });
  });

  // --- Capa 3: dónde se toma la altura, y los extremos a y b ---
  plano.agregarCapa((p) => {
    const { a, b, nivel } = estado;
    if (casillas.puntos && estado.fundido === 0) {
      const n = nDe(nivel);
      if (dxDe(nivel) * p.escala >= 10) {
        for (let i = 0; i < n; i++) {
          const x = xAltura(i, n);
          p.punto(x, f(x), { color: col.texto, radio: 4 });
          if (estado.datos.g) p.punto(x, g(x), { color: col.texto, radio: 4 });
        }
      }
    }
    for (const [x, nombre] of [[a, 'a'], [b, 'b']]) {
      p.segmento(x, g(x), x, f(x), { color: col.texto, ancho: 1.5, guiones: [4, 4], alfa: 0.7 });
      p.punto(x, 0, { color: col.integral, radio: 7.5, forma: 'rombo' });
      p.etiqueta(`${nombre} = ${num(x)}`, x, 0, { color: col.integral, dx: 0, dy: 32, alinear: 'center', tamano: 13 });
    }
  });

  // a y b se arrastran sobre el eje (de a 1)
  const cambiarExtremos = (a, b) => {
    detener();
    estado.a = a;
    estado.b = b;
    reiniciar();
  };
  plano.agregarArrastrable({
    posicion: () => [estado.a, 0],
    mover: (x) => {
      const a = Math.max(estado.b - ANCHO_MAX, Math.min(estado.b - 1, Math.round(x)));
      if (a !== estado.a) cambiarExtremos(a, estado.b);
    },
  });
  plano.agregarArrastrable({
    posicion: () => [estado.b, 0],
    mover: (x) => {
      const b = Math.min(estado.a + ANCHO_MAX, Math.max(estado.a + 1, Math.round(x)));
      if (b !== estado.b) cambiarExtremos(estado.a, b);
    },
  });

  // --------------------------------------------------------------- textos

  const expresionEl = $('[data-expresion]');
  const lecturaEl = $('[data-lectura]');
  const tablaEl = $('[data-tabla]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  /** "f(x)" o "(f(x) − g(x))", lo que mide cada tira de alto */
  const alto = () => (estado.datos.g ? `(<i>f</i>(${X}) − <i>g</i>(${X}))` : `<i>f</i>(${X})`);

  function actualizarLectura() {
    const { a, b, nivel } = estado;
    const d = estado.datos;
    expresionEl.innerHTML = `<i>f</i>(${X}) = ${d.f.html}` +
      (d.g ? `<span class="expresion-g"><i>g</i>(${X}) = ${d.g.html}</span>` : '');
    if (estado.fundido >= 1) {
      lecturaEl.innerHTML = `<span class="lectura-titulo">las tiras se fundieron en el área</span>` +
        `<span>${integralHtml(a, b)} ${alto()} ${DX} <b>${resultadoHtml(exacto())}</b></span>`;
      return;
    }
    const n = nDe(nivel);
    lecturaEl.innerHTML = `<span class="lectura-titulo">${DX} = ${num(dxDe(nivel), 5)} → ${n} tiras</span>` +
      `<span>Σ ${alto()} · ${DX} <b>${igual(suma(nivel))}</b></span>`;
  }

  function actualizarTabla() {
    const celdas = Array.from({ length: NIVELES }, (_, k) => ({ dx: dxDe(k), s: suma(k), visto: k <= estado.nivel }));
    const fila1 = celdas.map((c) => `<td class="${c.visto ? '' : 'oculta'}">${num(c.dx, 5)}</td>`).join('');
    const fila2 = celdas.map((c) => `<td class="${c.visto ? '' : 'oculta'}">${numAprox(c.s).replace('≈ ', '')}</td>`).join('');
    const nota = estado.fundido >= 1
      ? `Se acerca a <b class="color-integral">${numAprox(exacto())}</b>: esa es la integral, ${integralHtml(estado.a, estado.b)} ${alto()} ${DX}.`
      : `Achicá ${DX} y fijate a qué número se acerca la suma.`;
    tablaEl.innerHTML = `<table class="tabla-valores"><tr><th>${DX}</th>${fila1}</tr><tr><th>suma</th>${fila2}</tr></table>` +
      `<p class="tabla-nota">${nota}</p>`;
  }

  function actualizarInfo() {
    const { a, b } = estado;
    const d = estado.datos;
    const partes = [];
    if (d.g) {
      partes.push(itemInfo(col.positivo, 'Cada tira:', `va de la curva de abajo (<i>g</i>, rosa) a la de arriba (<i>f</i>, azul). Mide ${DX} de ancho y <i>f</i>(${X}) − <i>g</i>(${X}) de alto.`));
    } else {
      partes.push(itemInfo(col.positivo, 'Cada tira:', `es un rectángulo de ${DX} de ancho y <i>f</i>(${X}) de alto. Su área es <i>f</i>(${X}) · ${DX}.`));
    }
    partes.push(itemInfo(col.integral, 'Achicando dx:', `la suma Σ de las tiras se parece cada vez más al área. Cuando ${DX} se achica todo lo que queramos, la suma se convierte en la <b>integral</b>: ${integralHtml(a, b)} ${alto()} ${DX}. La Σ se convierte en ∫ (una S estirada, de "suma").`));
    const hayNegativo = Array.from({ length: 200 }, (_, i) => a + ((b - a) * (i + 0.5)) / 200).some((x) => f(x) < g(x));
    if (hayNegativo) {
      partes.push(itemInfo(col.negativo, 'Las rojas:', d.g
        ? `ahí <i>g</i> queda arriba de <i>f</i>: la resta da negativa y esas tiras <b>restan</b>. Para el área entre las curvas, hay que separar en tramos y restar siempre "la de arriba menos la de abajo".`
        : `están debajo del eje: <i>f</i>(${X}) es negativo, así que esas tiras <b>restan</b>. La integral "descuenta" lo de abajo.`));
    }
    if (casillas.puntos) {
      partes.push(itemInfo(col.texto, 'La altura:', `cada tira toma la altura de la curva en un punto (los puntitos negros). Probá <b>Izquierda</b>, <b>Medio</b> y <b>Derecha</b>: al principio dan distinto, pero al achicar ${DX} llegan al mismo número.`));
    }
    if (casillas.barrow) {
      const p = primitivaDe(d.h);
      if (p) {
        const Fb = p.P(b);
        const Fa = p.P(a);
        const par = (v) => (v < 0 ? `(${fraccionHtml(v)})` : fraccionHtml(v));
        partes.push(itemInfo(col.integral, 'Regla de Barrow:', `una primitiva de ${d.g ? '<i>f</i> − <i>g</i>' : '<i>f</i>'} es <b><i>F</i>(${X}) = ${p.html}</b> (si la derivás, da ${d.g ? '<i>f</i> − <i>g</i>' : '<i>f</i>'}). ` +
          `Entonces ${integralHtml(a, b)} ${alto()} ${DX} = <i>F</i>(${num(b)}) − <i>F</i>(${num(a)}) = ${fraccionHtml(Fb)} − ${par(Fa)} <b>${resultadoHtml(Fb - Fa)}</b>.`));
      } else {
        partes.push(itemInfo(col.integral, 'Regla de Barrow:', 'para esta función todavía no tenemos la primitiva.'));
      }
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

  const botonAchicar = $('[data-achicar]');
  let anim = null;
  const duracion = (ms) => (sinMovimiento() ? 1 : ms);
  function detener() {
    if (anim) { anim.cancelar(); anim = null; actualizarBoton(); }
  }
  function actualizarBoton() {
    botonAchicar.innerHTML = anim ? 'Parar' : estado.fundido >= 1 ? `Volver a ${DX} = 1` : `Achicar ${DX}`;
  }
  function reiniciar() {
    estado.nivel = 0;
    estado.trans = 1;
    estado.fundido = 0;
    actualizar();
  }

  // Cada paso parte las tiras en dos (animado), espera un poquito y sigue.
  // Después del último, las tiras se funden en el área.
  function paso() {
    if (estado.nivel < NIVELES - 1 && estado.fundido === 0) {
      estado.nivel++;
      estado.trans = 0;
      actualizar();
      anim = animar(duracion(700), (t) => { estado.trans = t; plano.pedirDibujo(); },
        () => { anim = animar(duracion(500), () => {}, paso); });
    } else {
      anim = animar(duracion(1500), (t) => { estado.fundido = t; plano.pedirDibujo(); },
        () => { anim = null; estado.fundido = 1; actualizar(); });
    }
    actualizarBoton();
  }
  botonAchicar.addEventListener('click', () => {
    if (anim) { detener(); return; }
    if (estado.fundido >= 1) { reiniciar(); return; }
    if (estado.fundido > 0) estado.fundido = 0;
    estado.trans = 1;
    paso();
  });

  // Izquierda / Medio / Derecha
  const opcionesAltura = raiz.querySelectorAll('[data-altura]');
  for (const boton of opcionesAltura) {
    boton.addEventListener('click', () => {
      estado.altura = boton.dataset.altura;
      for (const o of opcionesAltura) o.setAttribute('aria-checked', String(o === boton));
      actualizar();
    });
  }

  casillas = conectarCasillas($('[data-casillas]'), () => { plano.pedirDibujo(); actualizarInfo(); });

  /** Centra la vista en [a, b] y en la altura de las curvas. */
  function ajustarVista() {
    const { a, b } = estado;
    const ys = [0];
    for (let i = 0; i <= 60; i++) {
      const x = a + ((b - a) * i) / 60;
      ys.push(f(x));
      if (estado.datos.g) ys.push(g(x));
    }
    const lo = Math.min(...ys.filter(Number.isFinite));
    const hi = Math.max(...ys.filter(Number.isFinite));
    // que entre todo a lo ancho (de a a b) y a lo alto (de lo a hi), con margen
    const proporcion = plano.ancho / Math.max(1, plano.alto);
    const ancho = Math.max(6, b - a + 3, (hi - lo + 2) * proporcion);
    plano.vista.xMin = (a + b) / 2 - ancho / 2;
    plano.vista.xMax = (a + b) / 2 + ancho / 2;
    plano.vista.yCentro = (lo + hi) / 2;
    plano.vistaInicial();
  }

  function elegir(i) {
    detener();
    estado.indice = (i + textos.length) % textos.length;
    estado.datos = leerIntegral(textos[estado.indice]);
    estado.a = estado.datos.a;
    estado.b = estado.datos.b;
    contadorEl.textContent = `Ejemplo ${estado.indice + 1} de ${textos.length}`;
    ajustarVista();
    reiniciar();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  elegir(0);
}
