// ==========================================================================
// MÓDULO DE GRÁFICOS 3D (planos, rectas y puntos en el espacio)
//
// Usa Three.js. Lo comparten los interactivos de álgebra.
//   - una "caja" de −L a L en x, y, z, con los ejes y un piso cuadriculado;
//   - el eje z va hacia arriba (como en la escuela);
//   - se gira con un dedo (o el mouse) y se acerca con dos dedos (o la rueda);
//   - botón para volver a la vista inicial;
//   - solo se dibuja cuando algo cambia (para no gastar batería).
//
// Uso:
//   const e = new Espacio(elemento, { limite: 5 });
//   const p = e.plano({ color: '#58c4dd', etiqueta: '1' });
//   p.poner([1, 1, 1, 6]);      // el plano x + y + z = 6
//   e.pedirDibujo();
// ==========================================================================

import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshBasicMaterial,
  BufferGeometry, Float32BufferAttribute, DoubleSide, Vector3, Color,
  SphereGeometry, ConeGeometry, Quaternion,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

// desde dónde mira la cámara al empezar (en x, y, z): la vista de los libros,
// con el eje x hacia uno, el y hacia la derecha y el z para arriba
const VISTA = [1, 0.72, 0.6];

const ARISTAS = [
  [0, 1], [2, 3], [4, 5], [6, 7], // en x
  [0, 2], [1, 3], [4, 6], [5, 7], // en y
  [0, 4], [1, 5], [2, 6], [3, 7], // en z
];

/** Los 8 vértices de la caja. */
function vertices(L) {
  const v = [];
  for (const z of [-L, L]) for (const y of [-L, L]) for (const x of [-L, L]) v.push([x, y, z]);
  return v;
}

const punto3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const largo = (a) => Math.hypot(a[0], a[1], a[2]);

/**
 * El pedazo del plano a·x + b·y + c·z = d que queda dentro de la caja:
 * una lista de vértices en orden (o null si no la toca).
 */
export function recortarPlano([a, b, c, d], L) {
  const n = [a, b, c];
  if (largo(n) < 1e-9) return null;
  const vs = vertices(L);
  const pts = [];
  for (const [i, j] of ARISTAS) {
    const p = vs[i];
    const q = vs[j];
    const sp = punto3(n, p) - d;
    const sq = punto3(n, q) - d;
    if ((sp > 0 && sq > 0) || (sp < 0 && sq < 0)) continue;
    if (Math.abs(sp - sq) < 1e-12) continue;
    const t = sp / (sp - sq);
    const r = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
    if (!pts.some((s) => Math.hypot(s[0] - r[0], s[1] - r[1], s[2] - r[2]) < 1e-6)) pts.push(r);
  }
  if (pts.length < 3) return null;
  // se ordenan dando la vuelta alrededor del centro
  const centro = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length], [0, 0, 0]);
  const u0 = [pts[0][0] - centro[0], pts[0][1] - centro[1], pts[0][2] - centro[2]];
  const u = u0.map((x) => x / largo(u0));
  const w = cruz(n, u);
  const lw = largo(w);
  const v = w.map((x) => x / lw);
  pts.sort((p, q) => {
    const dp = [p[0] - centro[0], p[1] - centro[1], p[2] - centro[2]];
    const dq = [q[0] - centro[0], q[1] - centro[1], q[2] - centro[2]];
    return Math.atan2(punto3(dp, v), punto3(dp, u)) - Math.atan2(punto3(dq, v), punto3(dq, u));
  });
  return pts;
}

/** El pedazo de la recta (punto + t·dirección) que queda dentro de la caja: [p1, p2] o null. */
export function recortarRecta(p, dir, L) {
  let t0 = -Infinity;
  let t1 = Infinity;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(dir[i]) < 1e-12) {
      if (Math.abs(p[i]) > L) return null;
      continue;
    }
    let a = (-L - p[i]) / dir[i];
    let b = (L - p[i]) / dir[i];
    if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a);
    t1 = Math.min(t1, b);
  }
  if (t0 >= t1) return null;
  return [0, 1].map((k) => {
    const t = k ? t1 : t0;
    return [p[0] + dir[0] * t, p[1] + dir[1] * t, p[2] + dir[2] * t];
  });
}

/** La recta donde se cortan dos planos: { punto, dir } o null si son paralelos. */
export function corteDePlanos(p1, p2) {
  const n1 = p1.slice(0, 3);
  const n2 = p2.slice(0, 3);
  const dir = cruz(n1, n2);
  const l2 = punto3(dir, dir);
  if (l2 < 1e-10 * Math.max(1, punto3(n1, n1) * punto3(n2, n2))) return null;
  // punto = ((d1·n2 − d2·n1) × dir) / |dir|²
  const a = cruz(n2, dir).map((x) => x * p1[3]);
  const b = cruz(dir, n1).map((x) => x * p2[3]);
  const punto = [0, 1, 2].map((i) => (a[i] + b[i]) / l2);
  return { punto, dir };
}

export class Espacio {
  /**
   * @param {HTMLElement} contenedor
   * @param {object} opciones  limite: hasta dónde llega la caja (L); descripcion
   */
  constructor(contenedor, opciones = {}) {
    this.contenedor = contenedor;
    this.L = opciones.limite ?? 5;
    const css = getComputedStyle(document.documentElement);
    this.css = (n) => css.getPropertyValue(n).trim();
    contenedor.classList.add('espacio');

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(new Color(this.css('--fondo-grafico')));
    const lienzo = this.renderer.domElement;
    lienzo.className = 'espacio-lienzo';
    lienzo.setAttribute('role', 'img');
    lienzo.setAttribute('aria-label', opciones.descripcion ?? 'Gráfico en 3D');
    contenedor.appendChild(lienzo);

    // capa para los textos (etiquetas en HTML, encima del dibujo)
    this.capaTextos = document.createElement('div');
    this.capaTextos.className = 'espacio-textos';
    contenedor.appendChild(this.capaTextos);

    this.escena = new Scene();
    // "mundo" con z hacia arriba: (x, y, z) de la matemática → (x, z, −y) de Three.js
    this.mundo = new Group();
    this.mundo.rotation.x = -Math.PI / 2;
    this.escena.add(this.mundo);

    this.camara = new PerspectiveCamera(32, 1, 0.1, 500);
    this.controles = new OrbitControls(this.camara, lienzo);
    this.controles.enablePan = false;
    this.controles.enableDamping = false;
    this.controles.rotateSpeed = 0.8;
    this.controles.minDistance = this.L * 1.6;
    this.controles.maxDistance = this.L * 9;
    this.controles.addEventListener('change', () => this.pedirDibujo());

    this.lineas = []; // materiales de línea (necesitan saber el tamaño de la pantalla)
    this.etiquetas = [];
    this._armarCaja();
    this._crearBotones();
    this._crearAviso();

    this.ancho = 0;
    this.alto = 0;
    this._medir();
    new ResizeObserver(() => this._medir()).observe(contenedor);
    this.vistaInicial();
  }

  // ------------------------------------------------------------ dibujo

  pedirDibujo() {
    if (this._pedido) return;
    this._pedido = true;
    requestAnimationFrame(() => {
      this._pedido = false;
      this.renderer.render(this.escena, this.camara);
      this._ubicarEtiquetas();
    });
  }

  _medir() {
    const r = this.contenedor.getBoundingClientRect();
    const ancho = Math.max(1, Math.round(r.width));
    const alto = Math.max(1, Math.round(r.height));
    if (ancho === this.ancho && alto === this.alto) return;
    this.ancho = ancho;
    this.alto = alto;
    this.renderer.setSize(ancho, alto, false);
    this.renderer.domElement.style.width = ancho + 'px';
    this.renderer.domElement.style.height = alto + 'px';
    this.camara.aspect = ancho / alto;
    this.camara.updateProjectionMatrix();
    for (const m of this.lineas) m.resolution.set(ancho, alto);
    this.pedirDibujo();
  }

  /** Vuelve la cámara a como estaba al principio. */
  vistaInicial() {
    const dist = this.L * 5.8 * Math.max(1, 1 / Math.max(this.camara.aspect, 0.01));
    const largoV = Math.hypot(...VISTA);
    const [x, y, z] = VISTA.map((v) => (v / largoV) * dist);
    // de la matemática a Three.js: (x, y, z) → (x, z, −y)
    this.camara.position.set(x, z, -y);
    this.controles.target.set(0, 0, 0);
    this.controles.update();
    this.pedirDibujo();
  }

  /** Material de línea con un grosor en píxeles. */
  _material(color, ancho = 2, { alfa = 1, guiones = false } = {}) {
    const m = new LineMaterial({
      color: new Color(color), linewidth: ancho, transparent: alfa < 1, opacity: alfa,
      dashed: guiones, dashSize: 0.35, gapSize: 0.25, depthWrite: alfa >= 1,
    });
    m.resolution.set(this.ancho || 300, this.alto || 300);
    this.lineas.push(m);
    return m;
  }

  /** Un grupo de segmentos [[p, q], ...] como una sola línea gruesa. */
  _segmentos(lista, material) {
    const geo = new LineSegmentsGeometry();
    geo.setPositions(lista.flatMap(([p, q]) => [...p, ...q]));
    const l = new LineSegments2(geo, material);
    if (material.dashed) l.computeLineDistances();
    return l;
  }

  _armarCaja() {
    const L = this.L;
    const suave = this.css('--texto-tenue');
    // piso cuadriculado (z = 0), muy tenue
    const piso = [];
    for (let i = -L; i <= L; i++) {
      if (i === 0) continue;
      piso.push([[i, -L, 0], [i, L, 0]], [[-L, i, 0], [L, i, 0]]);
    }
    this.mundo.add(this._segmentos(piso, this._material(suave, 1, { alfa: 0.18 })));
    // aristas de la caja
    const vs = vertices(L);
    this.mundo.add(this._segmentos(ARISTAS.map(([i, j]) => [vs[i], vs[j]]), this._material(suave, 1, { alfa: 0.35 })));
    // ejes
    const ejes = this._segmentos([
      [[-L, 0, 0], [L, 0, 0]], [[0, -L, 0], [0, L, 0]], [[0, 0, -L], [0, 0, L]],
    ], this._material(this.css('--texto-suave'), 1.6));
    this.mundo.add(ejes);
    // marquitas en los números enteros
    const marcas = [];
    const m = 0.12;
    for (let i = -L + 1; i < L; i++) {
      if (i === 0) continue;
      marcas.push([[i, -m, 0], [i, m, 0]], [[-m, i, 0], [m, i, 0]], [[-m, 0, i], [m, 0, i]]);
    }
    this.mundo.add(this._segmentos(marcas, this._material(this.css('--texto-suave'), 1.4)));
    for (const [txt, p] of [['x', [L + 0.5, 0, 0]], ['y', [0, L + 0.5, 0]], ['z', [0, 0, L + 0.5]]]) {
      this.etiqueta(txt, p, { clase: 'espacio-eje' });
    }
    // algunos números en los ejes, para ubicarse
    for (let i = 2; i < L; i += 2) {
      this.etiqueta(String(i), [i, -0.45, 0], { clase: 'espacio-numero' });
      this.etiqueta(String(i), [-0.45, i, 0], { clase: 'espacio-numero' });
      this.etiqueta(String(i), [-0.4, 0, i], { clase: 'espacio-numero' });
    }
  }

  // ------------------------------------------------------------ objetos

  /**
   * Un plano. Devuelve { poner([a, b, c, d]), visible, fantasma([a,b,c,d] | null) }.
   * Se dibuja relleno transparente con el borde del mismo color.
   */
  plano({ color, etiqueta = '', haciaEtiqueta = [0.3, 0, 1] }) {
    const relleno = new Mesh(
      new BufferGeometry(),
      new MeshBasicMaterial({ color: new Color(color), transparent: true, opacity: 0.26, side: DoubleSide, depthWrite: false }),
    );
    relleno.renderOrder = 1;
    const matBorde = this._material(color, 2.2);
    let borde = null;
    let sombra = null;
    const matSombra = this._material(this.css('--c-fantasma'), 1.5, { alfa: 0.7, guiones: true });
    const texto = etiqueta ? this.etiqueta(etiqueta, [0, 0, 0], { color, clase: `espacio-etiqueta-plano plano-${etiqueta}` }) : null;
    this.mundo.add(relleno);
    const L = this.L;
    const yo = this;
    const contorno = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);

    const h = {
      ecuacion: null,
      visible: true,
      poner(ec) {
        h.ecuacion = ec;
        const pts = recortarPlano(ec, L);
        if (borde) { yo.mundo.remove(borde); borde.geometry.dispose(); borde = null; }
        if (!pts) {
          relleno.visible = false;
          if (texto) texto.visible = false;
          yo.pedirDibujo();
          return;
        }
        const pos = [];
        for (let i = 1; i < pts.length - 1; i++) pos.push(...pts[0], ...pts[i], ...pts[i + 1]);
        relleno.geometry.dispose();
        relleno.geometry = new BufferGeometry();
        relleno.geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
        relleno.visible = h.visible;
        borde = yo._segmentos(contorno(pts), matBorde);
        borde.visible = h.visible;
        yo.mundo.add(borde);
        if (texto) {
          // la etiqueta va cerca del borde, para el lado 'haciaEtiqueta' (lejos del centro, donde se amontona todo)
          const alto = pts.reduce((m, p) => (punto3(p, haciaEtiqueta) > punto3(m, haciaEtiqueta) ? p : m), pts[0]);
          const c = pts.reduce((s, p) => s.map((v, i) => v + p[i] / pts.length), [0, 0, 0]);
          texto.pos = c.map((v, i) => v + (alto[i] - v) * 0.78);
          texto.visible = h.visible;
        }
        yo.pedirDibujo();
      },
      mostrar(si) {
        h.visible = si;
        relleno.visible = si && !!borde;
        if (borde) borde.visible = si;
        if (texto) texto.visible = si && !!borde;
        if (!si && sombra) sombra.visible = false;
        yo.pedirDibujo();
      },
      /** Dónde estaba antes el plano (contorno gris punteado), o null para sacarlo. */
      fantasma(ec) {
        if (sombra) { yo.mundo.remove(sombra); sombra.geometry.dispose(); sombra = null; }
        const pts = ec && recortarPlano(ec, L);
        if (pts && h.visible) {
          sombra = yo._segmentos(contorno(pts), matSombra);
          sombra.computeLineDistances();
          yo.mundo.add(sombra);
        }
        yo.pedirDibujo();
      },
    };
    return h;
  }

  /** Una recta (o segmento). Devuelve { poner(punto, dir) | poner(null), mostrar }. */
  recta({ color, ancho = 2.5, guiones = false }) {
    const mat = this._material(color, ancho, { guiones });
    let linea = null;
    const yo = this;
    const h = {
      visible: true,
      poner(p, dir) {
        if (linea) { yo.mundo.remove(linea); linea.geometry.dispose(); linea = null; }
        const seg = p && recortarRecta(p, dir, yo.L);
        if (seg) {
          linea = yo._segmentos([seg], mat);
          linea.visible = h.visible;
          linea.renderOrder = 2;
          yo.mundo.add(linea);
        }
        yo.pedirDibujo();
      },
      mostrar(si) {
        h.visible = si;
        if (linea) linea.visible = si;
        yo.pedirDibujo();
      },
    };
    return h;
  }

  /** Una flecha (segmento con punta). Devuelve { poner(desde, hasta) | poner(null), mostrar }. */
  flecha({ color, ancho = 3.5, punta = 0.45 }) {
    const mat = this._material(color, ancho);
    const cono = new Mesh(new ConeGeometry(punta * 0.42, punta, 18), new MeshBasicMaterial({ color: new Color(color) }));
    cono.visible = false;
    cono.renderOrder = 3;
    this.mundo.add(cono);
    let linea = null;
    const yo = this;
    const h = {
      visible: true,
      poner(desde, hasta) {
        if (linea) { yo.mundo.remove(linea); linea.geometry.dispose(); linea = null; }
        cono.visible = false;
        if (desde && hasta) {
          const d = [hasta[0] - desde[0], hasta[1] - desde[1], hasta[2] - desde[2]];
          const L = largo(d);
          if (L > 1e-9) {
            const u = d.map((x) => x / L);
            // la línea termina donde empieza la punta
            const fin = hasta.map((x, i) => x - u[i] * punta * 0.9);
            linea = yo._segmentos([[desde, fin]], mat);
            linea.visible = h.visible;
            linea.renderOrder = 3;
            yo.mundo.add(linea);
            cono.position.set(hasta[0] - u[0] * punta / 2, hasta[1] - u[1] * punta / 2, hasta[2] - u[2] * punta / 2);
            cono.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(...u)));
            cono.visible = h.visible;
          }
        }
        yo.pedirDibujo();
      },
      mostrar(si) {
        h.visible = si;
        if (linea) linea.visible = si;
        cono.visible = si && !!linea;
        yo.pedirDibujo();
      },
    };
    return h;
  }

  /** Un punto (bolita). Devuelve { poner([x, y, z] | null), mostrar }. */
  punto({ color, radio = 0.16 }) {
    const bola = new Mesh(new SphereGeometry(radio, 20, 14), new MeshBasicMaterial({ color: new Color(color) }));
    bola.renderOrder = 3;
    bola.visible = false;
    this.mundo.add(bola);
    const yo = this;
    return {
      poner(p) {
        bola.visible = !!p;
        if (p) bola.position.set(p[0], p[1], p[2]);
        yo.pedirDibujo();
      },
      mostrar(si) {
        bola.visible = si && bola.visible;
        yo.pedirDibujo();
      },
    };
  }

  /** Un texto en un punto del espacio. Devuelve el objeto (se le puede cambiar .pos, .html, .visible). */
  etiqueta(html, pos, { color = '', clase = '' } = {}) {
    const el = document.createElement('div');
    el.className = `espacio-etiqueta ${clase}`;
    if (color) el.style.color = color;
    el.innerHTML = html;
    this.capaTextos.appendChild(el);
    const e = { el, pos, visible: true };
    Object.defineProperty(e, 'html', { set: (h) => { el.innerHTML = h; } });
    this.etiquetas.push(e);
    return e;
  }

  _ubicarEtiquetas() {
    const v = new Vector3();
    for (const e of this.etiquetas) {
      if (!e.visible) { e.el.style.display = 'none'; continue; }
      // de la matemática a Three.js: (x, y, z) → (x, z, −y)
      v.set(e.pos[0], e.pos[2], -e.pos[1]).project(this.camara);
      if (v.z > 1) { e.el.style.display = 'none'; continue; }
      e.el.style.display = '';
      const x = (v.x + 1) / 2 * this.ancho;
      const y = (1 - v.y) / 2 * this.alto;
      e.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  }

  // ------------------------------------------------------------ botones y avisos

  _crearBotones() {
    const caja = document.createElement('div');
    caja.className = 'plano-botones';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'plano-boton';
    b.title = 'Volver a la vista inicial';
    b.setAttribute('aria-label', 'Volver a la vista inicial');
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    b.addEventListener('click', () => this.vistaInicial());
    caja.appendChild(b);
    this.contenedor.appendChild(caja);
  }

  _crearAviso() {
    this.aviso = document.createElement('div');
    this.aviso.className = 'plano-aviso';
    this.aviso.setAttribute('aria-hidden', 'true');
    this.contenedor.appendChild(this.aviso);
  }

  /** Muestra un cartelito abajo del gráfico por unos segundos. */
  avisar(texto, ms = 2600) {
    this.aviso.innerHTML = texto;
    this.aviso.classList.add('visible');
    clearTimeout(this._tAviso);
    this._tAviso = setTimeout(() => this.aviso.classList.remove('visible'), ms);
  }
}
