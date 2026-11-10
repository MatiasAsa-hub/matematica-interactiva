// ==========================================================================
// ANIMACIÓN DE PUNTOS (base común de todos los gráficos de funciones)
//
// 1. Aparecen ~20 puntos (p, f(p)) equiespaciados, uno tras otro, de
//    izquierda a derecha.
// 2. Después se dibuja la curva continua, también de izquierda a derecha.
// 3. Los puntos se desvanecen y queda la curva.
//
// Opcional: una tabla x | f(x) que se va llenando a la par de los puntos.
// Esta clase también dibuja la curva cuando la animación está apagada.
// ==========================================================================

import { animar, sinMovimiento, suave } from './animacion.js';
import { pasoRedondo } from './plano.js';
import { num } from '../numeros.js';

const MS_POR_PUNTO = 110;
const MS_CURVA = 1300;
const MS_DESVANECER = 600;

export class AnimacionPuntos {
  /**
   * @param {Plano} plano
   * @param {object} op
   *   f: (x) => y   la función (puede cambiar: se lee cada vez)
   *   color: color de la curva y los puntos
   *   tabla: elemento donde va la tabla x | f(x) (opcional)
   */
  constructor(plano, { f, color, tabla = null }) {
    this.plano = plano;
    this.f = f;
    this.color = color ?? plano.colores.funcion;
    this.tabla = tabla;
    this.xs = [];
    this.visibles = Infinity;   // cuántos puntos se ven (puede tener decimales: "aparecer")
    this.hastaX = Infinity;     // hasta dónde llega la curva
    this.alfaPuntos = 0;        // opacidad de los puntos
    this.activa = true;         // ¿está prendida la animación?
    this.animando = false;
    this._anim = null;
    this.calcularXs();

    plano.agregarCapa(() => this._dibujarCurva());
    plano.agregarCapa(() => this._dibujarPuntos());
  }

  /** Elige los x de los puntos según lo que se ve en el gráfico. */
  calcularXs() {
    const p = this.plano;
    const margen = (p.yMax - p.yMin) * 0.04;
    const seVe = (x) => {
      const y = this.f(x);
      return Number.isFinite(y) && y >= p.yMin - margen && y <= p.yMax + margen;
    };
    // 1) ¿En qué tramo de x la curva se ve en pantalla?
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i <= 240; i++) {
      const x = p.xMin + ((p.xMax - p.xMin) * i) / 240;
      if (seVe(x)) { lo = Math.min(lo, x); hi = Math.max(hi, x); }
    }
    if (lo >= hi) { lo = p.xMin; hi = p.xMax; }
    // 2) Un paso "redondo" (0.5, 1, 2...) para que haya entre 10 y 25 puntos, con x lindos
    const paso = pasoRedondo((hi - lo) / 14);
    const xs = [];
    const borde = (p.xMax - p.xMin) * 0.02;
    for (let x = Math.ceil(lo / paso) * paso; x <= hi + 1e-9; x += paso) {
      const xr = Math.round(x / paso) * paso;
      if (xr > p.xMin + borde && xr < p.xMax - borde && seVe(xr)) xs.push(xr);
    }
    this.xs = xs;
    this._armarTabla();
  }

  /** Arranca (o repite) la animación. */
  reproducir() {
    this._anim?.cancelar();
    this.calcularXs();
    if (sinMovimiento()) { this.terminar(); return; }
    this.animando = true;
    this.visibles = 0;
    this.hastaX = -Infinity;
    this.alfaPuntos = 1;
    const n = this.xs.length;
    const p = this.plano;
    // 1) puntos
    this._anim = animar(n * MS_POR_PUNTO, (t) => {
      this.visibles = t * n;
      this._actualizarTabla();
      p.pedirDibujo();
    }, () => {
      // 2) curva
      const x0 = p.xMin;
      const x1 = p.xMax;
      this._anim = animar(MS_CURVA, (t) => {
        this.hastaX = x0 + (x1 - x0) * suave(t);
        p.pedirDibujo();
      }, () => {
        this.hastaX = Infinity;
        // 3) se desvanecen los puntos
        this._anim = animar(MS_DESVANECER, (t) => {
          this.alfaPuntos = 1 - t;
          p.pedirDibujo();
        }, () => { this.animando = false; this.alfaPuntos = 0; });
      });
    });
  }

  /** Salta al final: curva completa, sin puntos. */
  terminar() {
    this._anim?.cancelar();
    this._anim = null;
    this.animando = false;
    this.visibles = Infinity;
    this.hastaX = Infinity;
    this.alfaPuntos = 0;
    this._actualizarTabla();
    this.plano.pedirDibujo();
  }

  /** Avisar que cambió la función (por ejemplo, se movió un deslizador). */
  funcionCambio() {
    if (this.animando) this.terminar();
    this._actualizarTabla();
  }

  _dibujarCurva() {
    this.plano.curva(this.f, { color: this.color, ancho: 3.5, hasta: this.hastaX });
  }

  _dibujarPuntos() {
    if (this.alfaPuntos <= 0) return;
    const p = this.plano;
    this.xs.forEach((x, i) => {
      const aparicion = Math.min(1, Math.max(0, this.visibles - i)); // 0 → 1
      if (aparicion <= 0) return;
      const y = this.f(x);
      if (!Number.isFinite(y)) return;
      // línea punteada desde el eje x hasta el punto, que se apaga enseguida
      if (aparicion < 1 || this.visibles - i < 2) {
        const alfaLinea = (1 - Math.min(1, (this.visibles - i) / 2)) * 0.8;
        p.segmento(x, 0, x, y, { color: this.color, ancho: 1.5, guiones: [3, 4], alfa: alfaLinea * this.alfaPuntos });
      }
      const radio = 5 * (1 + 0.7 * (1 - aparicion));
      p.punto(x, y, { color: this.color, radio, alfa: aparicion * this.alfaPuntos });
    });
  }

  // ---------------------------------------------------------------- tabla

  _armarTabla() {
    if (!this.tabla) return;
    const filaX = this.xs.map((x, i) => `<td data-i="${i}">${num(x)}</td>`).join('');
    const filaY = this.xs.map((x, i) => `<td data-i="${i}"></td>`).join('');
    this.tabla.innerHTML =
      `<table class="tabla-valores"><tbody>` +
      `<tr><th scope="row"><i>x</i></th>${filaX}</tr>` +
      `<tr><th scope="row"><i>f</i>(<i>x</i>)</th>${filaY}</tr>` +
      `</tbody></table>`;
    this._celdasX = [...this.tabla.querySelectorAll('tr:first-child td')];
    this._celdasY = [...this.tabla.querySelectorAll('tr:last-child td')];
    this._ultimaVisible = -1;
    this._actualizarTabla();
  }

  _actualizarTabla() {
    if (!this.tabla || !this._celdasY) return;
    const visibles = Math.floor(this.visibles + 0.001);
    this.xs.forEach((x, i) => {
      const ve = i < visibles;
      const y = this.f(x);
      this._celdasY[i].textContent = Number.isFinite(y) ? num(y) : '—';
      this._celdasX[i].classList.toggle('oculta', !ve);
      this._celdasY[i].classList.toggle('oculta', !ve);
      const nueva = this.animando && i === visibles - 1;
      this._celdasX[i].classList.toggle('nueva', nueva);
      this._celdasY[i].classList.toggle('nueva', nueva);
    });
    // que la última celda nueva quede a la vista
    const ultima = Math.min(visibles, this.xs.length) - 1;
    if (this.animando && ultima !== this._ultimaVisible && ultima >= 0) {
      const celda = this._celdasY[ultima];
      const caja = this.tabla;
      caja.scrollLeft = Math.max(0, celda.offsetLeft - caja.clientWidth + celda.offsetWidth + 16);
    }
    this._ultimaVisible = ultima;
  }
}
