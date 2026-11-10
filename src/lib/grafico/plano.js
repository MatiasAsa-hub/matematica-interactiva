// ==========================================================================
// MÓDULO DE GRAFICADO 2D (compartido por todos los interactivos)
//
// Un "Plano" es un gráfico cartesiano dibujado en un <canvas>:
//   - ejes, grilla y números en los ejes;
//   - zoom y desplazamiento: dos dedos en el celular (con un dedo se sigue
//     moviendo la página), arrastrar con el mouse y Ctrl + rueda en la compu;
//   - botones +, − y "vista inicial";
//   - herramientas para dibujar curvas, zonas pintadas, puntos, rectas y
//     etiquetas, todas en coordenadas matemáticas (x, y);
//   - puntos arrastrables (con el dedo o el mouse).
//
// Uso básico:
//   const plano = new Plano(elemento, { vista: { xMin: -6, xMax: 6, yCentro: 0 } });
//   plano.agregarCapa((p) => p.curva((x) => x * x, { color: p.colores.funcion }));
// ==========================================================================

const ESCALA_MIN = 4;     // píxeles por unidad (lo más alejado)
const ESCALA_MAX = 3000;  // píxeles por unidad (lo más cerca)

/** Lee los colores definidos en global.css para que gráficos y textos coincidan. */
export function leerColores() {
  const css = getComputedStyle(document.documentElement);
  const v = (n) => css.getPropertyValue(n).trim();
  return {
    fondo: v('--fondo-grafico'),
    texto: v('--texto'),
    textoSuave: v('--texto-suave'),
    funcion: v('--c-funcion'),
    derivada: v('--c-derivada'),
    integral: v('--c-integral'),
    positivo: v('--c-positivo'),
    negativo: v('--c-negativo'),
    raices: v('--c-raices'),
    vertice: v('--c-vertice'),
    ordenada: v('--c-ordenada'),
    crece: v('--c-crece'),
    decrece: v('--c-decrece'),
    fantasma: v('--c-fantasma'),
  };
}

/** Un paso "redondo" (1, 2, 5, 10, 20, 50...) cercano al valor pedido. */
export function pasoRedondo(bruto) {
  const e = 10 ** Math.floor(Math.log10(bruto));
  const f = bruto / e;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * e;
}

function textoNumeroEje(v, paso) {
  const dec = Math.max(0, -Math.floor(Math.log10(paso) + 1e-9));
  const s = Math.abs(v).toFixed(dec);
  return (v < 0 ? '−' : '') + s;
}

export class Plano {
  /**
   * @param {HTMLElement} contenedor  elemento donde se dibuja (su tamaño lo decide el CSS)
   * @param {object} opciones
   *   vista: { xMin, xMax, yCentro }  lo que se ve al principio
   */
  constructor(contenedor, opciones = {}) {
    this.contenedor = contenedor;
    this.vista = { xMin: -6, xMax: 6, yCentro: 0, ...(opciones.vista ?? {}) };
    // soloEjeX: modo "recta numérica" (sin grilla ni eje y; el eje x queda fijo a esa altura, de 0 a 1)
    this.soloEjeX = opciones.soloEjeX ?? false;
    this.alturaEje = opciones.alturaEje ?? 0.68;
    // separación mínima (en píxeles) entre los números de los ejes
    this.separacionNumeros = opciones.separacionNumeros ?? 58;
    this.capas = [];
    this.arrastrables = [];
    this.colores = leerColores();
    this.fuente = getComputedStyle(document.body).fontFamily;
    this.alCambiarVista = [];
    this._tocado = false; // ¿la persona ya movió la vista?

    contenedor.classList.add('plano');
    if (this.soloEjeX) contenedor.classList.add('plano-recta');
    this.lienzo = document.createElement('canvas');
    this.lienzo.className = 'plano-lienzo';
    this.lienzo.setAttribute('role', 'img');
    this.lienzo.setAttribute('aria-label', opciones.descripcion ?? 'Gráfico');
    this.ctx = this.lienzo.getContext('2d');
    contenedor.appendChild(this.lienzo);

    this._crearBotones();
    this._crearAviso();
    this._escucharEventos();

    this.ancho = 0;
    this.alto = 0;
    this._medir();
    new ResizeObserver(() => this._medir()).observe(contenedor);
    document.fonts?.ready.then(() => this.pedirDibujo());
  }

  // ---------------------------------------------------------------- vista

  _medir() {
    const r = this.contenedor.getBoundingClientRect();
    const ancho = Math.max(1, Math.round(r.width));
    const alto = Math.max(1, Math.round(r.height));
    if (ancho === this.ancho && alto === this.alto) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.ancho = ancho;
    this.alto = alto;
    this.dpr = dpr;
    this.lienzo.width = Math.round(ancho * dpr);
    this.lienzo.height = Math.round(alto * dpr);
    this.lienzo.style.width = ancho + 'px';
    this.lienzo.style.height = alto + 'px';
    if (!this._tocado) this._aplicarVistaInicial();
    this._fijarEje();
    this.pedirDibujo();
  }

  /** En modo recta numérica, el eje x no se mueve de altura. */
  _fijarEje() {
    if (this.soloEjeX) this.cy = (this.alto * this.alturaEje - this.alto / 2) / this.escala;
  }

  /**
   * Se asegura de que el tramo [x1, x2] se vea: si no entra, mueve la vista
   * (y la aleja si hace falta).
   */
  mostrarRango(x1, x2, margen = 1) {
    const a = Math.min(x1, x2) - margen;
    const b = Math.max(x1, x2) + margen;
    if (a >= this.xMin && b <= this.xMax) return;
    this.escala = Math.max(ESCALA_MIN, Math.min(this.escala, this.ancho / (b - a)));
    const mitad = this.ancho / 2 / this.escala;
    if (a < this.xMin) this.cx = a + mitad;
    if (b > this.xMax) this.cx = b - mitad;
    this._tocado = true;
    this._vistaCambio();
  }

  _aplicarVistaInicial() {
    const { xMin, xMax, yCentro } = this.vista;
    this.escala = this.ancho / (xMax - xMin);
    this.cx = (xMin + xMax) / 2;
    this.cy = yCentro;
  }

  /** Vuelve a la vista del principio (botón ⟲). */
  vistaInicial() {
    this._tocado = false;
    this._aplicarVistaInicial();
    this._vistaCambio();
  }

  _vistaCambio() {
    this._fijarEje();
    this.pedirDibujo();
    for (const fn of this.alCambiarVista) fn(this);
  }

  get xMin() { return this.cx - this.ancho / 2 / this.escala; }
  get xMax() { return this.cx + this.ancho / 2 / this.escala; }
  get yMin() { return this.cy - this.alto / 2 / this.escala; }
  get yMax() { return this.cy + this.alto / 2 / this.escala; }

  /** Coordenada x matemática → píxel horizontal */
  px(x) { return this.ancho / 2 + (x - this.cx) * this.escala; }
  /** Coordenada y matemática → píxel vertical */
  py(y) { return this.alto / 2 - (y - this.cy) * this.escala; }
  /** Píxel horizontal → x matemática */
  mx(px) { return this.cx + (px - this.ancho / 2) / this.escala; }
  /** Píxel vertical → y matemática */
  my(py) { return this.cy + (this.alto / 2 - py) / this.escala; }

  /** Zoom manteniendo fijo el punto de la pantalla (px, py). */
  zoom(factor, px = this.ancho / 2, py = this.alto / 2) {
    const x = this.mx(px);
    const y = this.my(py);
    this.escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, this.escala * factor));
    this.cx = x - (px - this.ancho / 2) / this.escala;
    this.cy = y - (this.alto / 2 - py) / this.escala;
    this._tocado = true;
    this._vistaCambio();
  }

  // ---------------------------------------------------------------- dibujo

  /** Agrega una función que dibuja algo. Se llama en orden, cada vez que se redibuja. */
  agregarCapa(fn) {
    this.capas.push(fn);
    this.pedirDibujo();
    return fn;
  }

  /** Pide redibujar en el próximo cuadro (varias llamadas seguidas cuentan como una). */
  pedirDibujo() {
    if (this._pedido) return;
    this._pedido = true;
    requestAnimationFrame(() => {
      this._pedido = false;
      this._dibujar();
    });
  }

  _dibujar() {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = this.colores.fondo;
    ctx.fillRect(0, 0, this.ancho, this.alto);
    if (this.soloEjeX) {
      this.dibujarRectaNumerica();
    } else {
      this.dibujarGrilla();
      this.dibujarEjes();
    }
    for (const capa of this.capas) {
      ctx.save();
      capa(this);
      ctx.restore();
    }
  }

  /** Paso entre las líneas de la grilla, según el zoom. */
  get pasoGrilla() {
    return pasoRedondo(this.separacionNumeros / this.escala);
  }

  /** Recta numérica: el eje x con una marquita en cada entero y los números abajo. */
  dibujarRectaNumerica() {
    const { ctx } = this;
    const Y0 = Math.round(this.py(0)) + 0.5;
    ctx.strokeStyle = 'rgba(233,238,242,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, Y0); ctx.lineTo(this.ancho, Y0);
    // marquitas: una por entero (si entran), más largas donde va número
    const paso = this.pasoGrilla;
    const chico = this.escala >= 9 ? 1 : paso;
    for (let x = Math.ceil(this.xMin / chico) * chico; x <= this.xMax; x += chico) {
      const X = Math.round(this.px(x)) + 0.5;
      const largo = Math.abs(x / paso - Math.round(x / paso)) < 1e-6 ? 8 : 5;
      ctx.moveTo(X, Y0 - largo); ctx.lineTo(X, Y0 + largo);
    }
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let x = Math.ceil(this.xMin / paso) * paso; x <= this.xMax; x += paso) {
      const X = this.px(x);
      if (X < 8 || X > this.ancho - 8) continue;
      const cero = Math.abs(x) < paso / 2;
      ctx.font = `${cero ? '700 ' : ''}15px ${this.fuente}`;
      ctx.fillStyle = cero ? this.colores.texto : 'rgba(233,238,242,0.65)';
      this._textoConHalo(textoNumeroEje(cero ? 0 : x, paso), X, Y0 + 12);
    }
  }

  dibujarGrilla() {
    const { ctx } = this;
    const paso = this.pasoGrilla;
    const sub = paso / (String(paso).startsWith('2') ? 4 : 5);
    const dibujarLineas = (p, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(this.xMin / p) * p; x <= this.xMax; x += p) {
        const X = Math.round(this.px(x)) + 0.5;
        ctx.moveTo(X, 0); ctx.lineTo(X, this.alto);
      }
      for (let y = Math.ceil(this.yMin / p) * p; y <= this.yMax; y += p) {
        const Y = Math.round(this.py(y)) + 0.5;
        ctx.moveTo(0, Y); ctx.lineTo(this.ancho, Y);
      }
      ctx.stroke();
    };
    if (sub * this.escala > 9) dibujarLineas(sub, 'rgba(255,255,255,0.025)');
    dibujarLineas(paso, 'rgba(255,255,255,0.07)');
  }

  dibujarEjes() {
    const { ctx } = this;
    const paso = this.pasoGrilla;
    const X0 = Math.round(this.px(0)) + 0.5;
    const Y0 = Math.round(this.py(0)) + 0.5;
    ctx.strokeStyle = 'rgba(233,238,242,0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (X0 >= 0 && X0 <= this.ancho) { ctx.moveTo(X0, 0); ctx.lineTo(X0, this.alto); }
    if (Y0 >= 0 && Y0 <= this.alto) { ctx.moveTo(0, Y0); ctx.lineTo(this.ancho, Y0); }
    ctx.stroke();

    // Números de los ejes (si el eje no se ve, quedan pegados al borde)
    ctx.font = `13px ${this.fuente}`;
    ctx.fillStyle = 'rgba(233,238,242,0.6)';
    const yTexto = Math.min(Math.max(Y0 + 5, 4), this.alto - 18);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let x = Math.ceil(this.xMin / paso) * paso; x <= this.xMax; x += paso) {
      if (Math.abs(x) < paso / 2) continue;
      const X = this.px(x);
      if (X < 10 || X > this.ancho - 10) continue;
      this._textoConHalo(textoNumeroEje(x, paso), X, yTexto);
    }
    ctx.textBaseline = 'middle';
    const pegadoIzq = X0 < 30;
    const xTexto = Math.min(Math.max(X0 - 6, 30), this.ancho - 4);
    ctx.textAlign = pegadoIzq ? 'left' : 'right';
    for (let y = Math.ceil(this.yMin / paso) * paso; y <= this.yMax; y += paso) {
      if (Math.abs(y) < paso / 2) continue;
      const Y = this.py(y);
      if (Y < 10 || Y > this.alto - 10) continue;
      this._textoConHalo(textoNumeroEje(y, paso), pegadoIzq ? 4 : xTexto, Y);
    }
    // nombres de los ejes
    ctx.font = `italic 15px ${this.fuente}`;
    ctx.fillStyle = 'rgba(233,238,242,0.75)';
    if (Y0 >= 0 && Y0 <= this.alto) {
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      this._textoConHalo('x', this.ancho - 6, Y0 - 4);
    }
    if (X0 >= 0 && X0 <= this.ancho) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      this._textoConHalo('y', X0 + 6, 6);
    }
  }

  _textoConHalo(texto, x, y) {
    const { ctx } = this;
    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.colores.fondo;
    ctx.strokeText(texto, x, y);
    ctx.restore();
    ctx.fillText(texto, x, y);
  }

  /**
   * Dibuja la curva y = f(x).
   * opciones: color, ancho, guiones (ej. [6, 6]), alfa, desde, hasta
   * "desde" y "hasta" sirven para dibujar solo un tramo (y para animar).
   */
  curva(f, { color = this.colores.funcion, ancho = 3, guiones = null, alfa = 1, desde = -Infinity, hasta = Infinity } = {}) {
    const { ctx } = this;
    const a = Math.max(this.xMin, desde);
    const b = Math.min(this.xMax, hasta);
    if (b <= a) return;
    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.strokeStyle = color;
    ctx.lineWidth = ancho;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (guiones) ctx.setLineDash(guiones);
    ctx.beginPath();
    const pasos = Math.max(2, Math.ceil(((b - a) * this.escala) / 2));
    const limite = this.alto * 4;
    let anterior = null;
    for (let i = 0; i <= pasos; i++) {
      const x = a + ((b - a) * i) / pasos;
      const y = f(x);
      if (!Number.isFinite(y)) { anterior = null; continue; }
      const X = this.px(x);
      const Y = Math.max(-limite, Math.min(limite, this.py(y)));
      // si hay un salto enorme (asíntota), se corta el trazo
      if (anterior === null || Math.abs(Y - anterior) > this.alto * 1.5) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
      anterior = Y;
    }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Pinta la zona entre la curva y el eje x donde f es positiva (signo = +1)
   * o negativa (signo = −1). Con rayado: true se agregan rayas diagonales,
   * para que no dependa solo del color.
   */
  zonaSigno(f, signo, { color, alfa = 0.18, rayado = false } = {}) {
    const { ctx } = this;
    const a = this.xMin;
    const b = this.xMax;
    const pasos = Math.ceil(this.ancho / 2);
    const Y0 = this.py(0);
    const limite = this.alto * 4;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.px(a), Y0);
    for (let i = 0; i <= pasos; i++) {
      const x = a + ((b - a) * i) / pasos;
      let y = f(x);
      if (!Number.isFinite(y)) y = 0;
      y = signo > 0 ? Math.max(y, 0) : Math.min(y, 0);
      ctx.lineTo(this.px(x), Math.max(-limite, Math.min(limite, this.py(y))));
    }
    ctx.lineTo(this.px(b), Y0);
    ctx.closePath();
    ctx.globalAlpha = alfa;
    ctx.fillStyle = color;
    ctx.fill();
    if (rayado) {
      ctx.clip();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let d = -this.alto; d < this.ancho; d += 12) {
        ctx.moveTo(d, this.alto); ctx.lineTo(d + this.alto, 0);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /** Un punto. forma: 'circulo' | 'rombo' | 'cuadrado'. hueco: true para solo el borde. */
  punto(x, y, { color = this.colores.texto, radio = 6, forma = 'circulo', hueco = false, alfa = 1 } = {}) {
    const { ctx } = this;
    const X = this.px(x);
    const Y = this.py(y);
    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.beginPath();
    if (forma === 'rombo') {
      const r = radio * 1.3;
      ctx.moveTo(X, Y - r); ctx.lineTo(X + r, Y); ctx.lineTo(X, Y + r); ctx.lineTo(X - r, Y); ctx.closePath();
    } else if (forma === 'cuadrado') {
      ctx.rect(X - radio, Y - radio, radio * 2, radio * 2);
    } else {
      ctx.arc(X, Y, radio, 0, Math.PI * 2);
    }
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = hueco ? color : this.colores.fondo;
    if (!hueco) { ctx.fillStyle = color; ctx.fill(); }
    else { ctx.fillStyle = this.colores.fondo; ctx.fill(); }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Texto en coordenadas matemáticas. dx, dy: corrimiento en píxeles.
   * Si el texto se saldría del gráfico, se lo acomoda adentro.
   */
  etiqueta(texto, x, y, { color = this.colores.texto, dx = 10, dy = -10, alinear = 'left', tamano = 15, negrita = true } = {}) {
    const { ctx } = this;
    ctx.save();
    ctx.font = `${negrita ? '700 ' : ''}${tamano}px ${this.fuente}`;
    const ancho = ctx.measureText(texto).width;
    let X = this.px(x) + dx;
    let Y = this.py(y) + dy;
    if (alinear === 'center') X -= ancho / 2;
    else if (alinear === 'right') X -= ancho;
    X = Math.min(Math.max(X, 4), this.ancho - ancho - 4);
    Y = Math.min(Math.max(Y, tamano / 2 + 4), this.alto - tamano / 2 - 4);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    this._textoConHalo(texto, X, Y);
    ctx.restore();
  }

  /** Recta vertical x = valor */
  lineaVertical(x, { color = this.colores.texto, ancho = 2, guiones = [7, 6], alfa = 1 } = {}) {
    this.segmento(x, this.yMin, x, this.yMax, { color, ancho, guiones, alfa });
  }

  /** Recta horizontal y = valor */
  lineaHorizontal(y, { color = this.colores.texto, ancho = 2, guiones = [7, 6], alfa = 1 } = {}) {
    this.segmento(this.xMin, y, this.xMax, y, { color, ancho, guiones, alfa });
  }

  segmento(x1, y1, x2, y2, { color = this.colores.texto, ancho = 2, guiones = null, alfa = 1 } = {}) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.strokeStyle = color;
    ctx.lineWidth = ancho;
    ctx.lineCap = 'round';
    if (guiones) ctx.setLineDash(guiones);
    ctx.beginPath();
    ctx.moveTo(this.px(x1), this.py(y1));
    ctx.lineTo(this.px(x2), this.py(y2));
    ctx.stroke();
    ctx.restore();
  }

  /** Flecha entre dos píxeles (útil para marcas al borde del gráfico). */
  flechaPx(X1, Y1, X2, Y2, { color = this.colores.texto, ancho = 3, punta = 9 } = {}) {
    const { ctx } = this;
    const ang = Math.atan2(Y2 - Y1, X2 - X1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = ancho;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(X1, Y1);
    ctx.lineTo(X2 - Math.cos(ang) * punta * 0.6, Y2 - Math.sin(ang) * punta * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X2, Y2);
    ctx.lineTo(X2 - Math.cos(ang - 0.45) * punta, Y2 - Math.sin(ang - 0.45) * punta);
    ctx.lineTo(X2 - Math.cos(ang + 0.45) * punta, Y2 - Math.sin(ang + 0.45) * punta);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ---------------------------------------------------------------- arrastrables

  /**
   * Agrega un punto que se puede arrastrar.
   *   posicion(): devuelve [x, y] actuales
   *   mover(x, y): se llama al arrastrar (ahí se actualiza el estado y se redibuja)
   */
  agregarArrastrable({ posicion, mover, radio = 24 }) {
    const a = { posicion, mover, radio };
    this.arrastrables.push(a);
    return a;
  }

  _arrastrableEn(X, Y) {
    let mejor = null;
    let dMejor = Infinity;
    for (const a of this.arrastrables) {
      const [x, y] = a.posicion();
      const d = Math.hypot(this.px(x) - X, this.py(y) - Y);
      if (d <= a.radio && d < dMejor) { mejor = a; dMejor = d; }
    }
    return mejor;
  }

  // ---------------------------------------------------------------- controles

  _crearBotones() {
    const caja = document.createElement('div');
    caja.className = 'plano-botones';
    const boton = (texto, titulo, accion) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'plano-boton';
      b.innerHTML = texto;
      b.title = titulo;
      b.setAttribute('aria-label', titulo);
      b.addEventListener('click', accion);
      caja.appendChild(b);
    };
    boton('+', 'Acercar', () => this.zoom(1.5));
    boton('−', 'Alejar', () => this.zoom(1 / 1.5));
    boton(
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'Volver a la vista inicial',
      () => this.vistaInicial(),
    );
    this.contenedor.appendChild(caja);
  }

  _crearAviso() {
    this.aviso = document.createElement('div');
    this.aviso.className = 'plano-aviso';
    this.aviso.setAttribute('aria-hidden', 'true');
    this.contenedor.appendChild(this.aviso);
  }

  _mostrarAviso(texto) {
    this.aviso.textContent = texto;
    this.aviso.classList.add('visible');
    clearTimeout(this._timerAviso);
    this._timerAviso = setTimeout(() => this.aviso.classList.remove('visible'), 1600);
  }

  // ---------------------------------------------------------------- eventos

  _posicionLocal(clienteX, clienteY) {
    const r = this.lienzo.getBoundingClientRect();
    return [clienteX - r.left, clienteY - r.top];
  }

  _escucharEventos() {
    const lienzo = this.lienzo;

    // --- Mouse (compu) ---
    let arrastre = null;
    lienzo.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      const [X, Y] = this._posicionLocal(e.clientX, e.clientY);
      const a = this._arrastrableEn(X, Y);
      arrastre = a ? { tipo: 'punto', a } : { tipo: 'vista', X, Y };
      lienzo.setPointerCapture(e.pointerId);
      lienzo.classList.add('arrastrando');
    });
    lienzo.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const [X, Y] = this._posicionLocal(e.clientX, e.clientY);
      if (!arrastre) {
        lienzo.style.cursor = this._arrastrableEn(X, Y) ? 'grab' : '';
        return;
      }
      if (arrastre.tipo === 'punto') {
        arrastre.a.mover(this.mx(X), this.my(Y));
      } else {
        this.cx -= (X - arrastre.X) / this.escala;
        this.cy += (Y - arrastre.Y) / this.escala;
        arrastre.X = X; arrastre.Y = Y;
        this._tocado = true;
        this._vistaCambio();
      }
    });
    const soltar = () => { arrastre = null; lienzo.classList.remove('arrastrando'); };
    lienzo.addEventListener('pointerup', soltar);
    lienzo.addEventListener('pointercancel', soltar);

    lienzo.addEventListener('wheel', (e) => {
      // Ctrl + rueda (o "pellizcar" en el touchpad) hace zoom.
      // La rueda sola sigue moviendo la página, para no quedar "atrapado".
      if (!e.ctrlKey) {
        // el aviso se muestra una sola vez, para no molestar al bajar por la página
        if (!this._avisoRuedaMostrado) {
          this._avisoRuedaMostrado = true;
          this._mostrarAviso('Para hacer zoom: Ctrl + rueda, o los botones + y −');
        }
        return;
      }
      e.preventDefault();
      const [X, Y] = this._posicionLocal(e.clientX, e.clientY);
      this.zoom(Math.exp(-e.deltaY * 0.01), X, Y);
    }, { passive: false });

    // --- Dedos (celular) ---
    // Un dedo: mueve la página (salvo que toque un punto arrastrable).
    // Dos dedos: mueven y hacen zoom en el gráfico.
    let toque = null;
    const datosDosDedos = (t) => {
      const [X1, Y1] = this._posicionLocal(t[0].clientX, t[0].clientY);
      const [X2, Y2] = this._posicionLocal(t[1].clientX, t[1].clientY);
      return { d: Math.hypot(X2 - X1, Y2 - Y1), X: (X1 + X2) / 2, Y: (Y1 + Y2) / 2 };
    };
    lienzo.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const [X, Y] = this._posicionLocal(e.touches[0].clientX, e.touches[0].clientY);
        const a = this._arrastrableEn(X, Y);
        if (a) {
          e.preventDefault();
          toque = { tipo: 'punto', a };
        } else {
          toque = { tipo: 'un-dedo', X, Y };
        }
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dd = datosDosDedos(e.touches);
        toque = {
          tipo: 'dos-dedos',
          d0: Math.max(dd.d, 1),
          escala0: this.escala,
          x: this.mx(dd.X),
          y: this.my(dd.Y),
        };
      }
    }, { passive: false });

    lienzo.addEventListener('touchmove', (e) => {
      if (!toque) return;
      if (toque.tipo === 'punto') {
        e.preventDefault();
        const [X, Y] = this._posicionLocal(e.touches[0].clientX, e.touches[0].clientY);
        toque.a.mover(this.mx(X), this.my(Y));
      } else if (toque.tipo === 'dos-dedos' && e.touches.length >= 2) {
        e.preventDefault();
        const dd = datosDosDedos(e.touches);
        this.escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, toque.escala0 * (dd.d / toque.d0)));
        this.cx = toque.x - (dd.X - this.ancho / 2) / this.escala;
        this.cy = toque.y - (this.alto / 2 - dd.Y) / this.escala;
        this._tocado = true;
        this._vistaCambio();
      } else if (toque.tipo === 'un-dedo') {
        const [X, Y] = this._posicionLocal(e.touches[0].clientX, e.touches[0].clientY);
        // Si el gesto es más horizontal que vertical, seguramente quería mover el gráfico.
        if (Math.abs(X - toque.X) > 25 && Math.abs(X - toque.X) > Math.abs(Y - toque.Y) * 1.5) {
          this._mostrarAviso('Usá dos dedos para mover el gráfico o hacer zoom');
          toque.tipo = 'avisado';
        }
      }
    }, { passive: false });

    const fin = (e) => { if (e.touches.length === 0) toque = null; };
    lienzo.addEventListener('touchend', fin);
    lienzo.addEventListener('touchcancel', fin);
  }
}
