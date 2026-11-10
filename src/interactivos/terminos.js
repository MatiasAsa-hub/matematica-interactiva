// ==========================================================================
// INTERACTIVO: términos semejantes, con fichas.
// Una barrita es una x; un cuadradito es un 1. Las negativas son rojas y punteadas.
// "Agrupar" junta las x con las x y los números con los números
// (las fichas viajan a su lugar), y un positivo con un negativo se anulan.
// El HTML está en src/components/interactivos/Terminos.astro.
// ==========================================================================

import { conectarDeslizador } from '../lib/grafico/controles.js';
import { num } from '../lib/numeros.js';
import { sinMovimiento } from '../lib/grafico/animacion.js';

const X = '<i>x</i>';
const par = (n) => (n < 0 ? `(${num(n)})` : num(n));

/** "3x", "−x", "+ 2", etc. para armar la expresión */
function terminoTexto(coef, conX, primero) {
  if (coef === 0) return '';
  const signo = coef < 0 ? '−' : '+';
  const abs = Math.abs(coef);
  const cuerpo = conX ? (abs === 1 ? X : `${abs}${X}`) : String(abs);
  if (primero) return (coef < 0 ? '−' : '') + cuerpo;
  return ` ${signo} ${cuerpo}`;
}

function expresion(terminos) {
  const partes = [];
  for (const t of terminos) {
    if (t.coef === 0) continue;
    partes.push(terminoTexto(t.coef, t.x, partes.length === 0));
  }
  return partes.join('') || '0';
}

export function iniciarTerminos(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const estado = { a: 3, b: 2, c: 2, d: -1, agrupado: false };
  const mesaEl = $('[data-mesa]');
  const expresionEl = $('[data-expresion]');
  const textoEl = $('[data-texto]');
  const boton = $('[data-agrupar]');

  // Las fichas, cada una con un id fijo (para poder animar el viaje)
  function fichas() {
    const lista = [];
    const agregar = (cuantas, conX, grupo) => {
      for (let i = 0; i < Math.abs(cuantas); i++) {
        lista.push({ id: `${grupo}-${i}`, x: conX, negativa: cuantas < 0, grupo });
      }
    };
    agregar(estado.a, true, 'a');
    agregar(estado.b, false, 'b');
    agregar(estado.c, true, 'c');
    agregar(estado.d, false, 'd');
    return lista;
  }

  const htmlFicha = (f, anulada = false) => `<span class="ficha-algebra ${f.x ? 'equis' : 'uno'}${f.negativa ? ' negativa' : ''}${anulada ? ' anulada' : ''}" data-id="${f.id}">${f.negativa ? '−' : ''}${f.x ? X : '1'}</span>`;

  function armarMesa() {
    const lista = fichas();
    if (!estado.agrupado) {
      mesaEl.classList.remove('agrupado');
      mesaEl.innerHTML = ['a', 'b', 'c', 'd']
        .map((g) => lista.filter((f) => f.grupo === g))
        .filter((l) => l.length)
        .map((l) => `<span class="fila-fichas">${l.map((f) => htmlFicha(f)).join('')}</span>`)
        .join('<span class="ficha-op">+</span>');
      return;
    }
    mesaEl.classList.add('agrupado');
    const fila = (conX) => {
      const pos = lista.filter((f) => f.x === conX && !f.negativa);
      const neg = lista.filter((f) => f.x === conX && f.negativa);
      const pares = Math.min(pos.length, neg.length); // un positivo y un negativo se anulan
      const orden = [...pos.map((f, i) => [f, i < pares]), ...neg.map((f, i) => [f, i < pares])];
      return `<span class="fila-fichas">${orden.map(([f, anula]) => htmlFicha(f, anula)).join('') || '<span class="texto-suave chico">(nada)</span>'}</span>`;
    };
    mesaEl.innerHTML = fila(true) + fila(false);
  }

  // Animación "FLIP": se mide dónde estaba cada ficha, se cambia el orden y se la hace viajar
  function cambiarConAnimacion(cambio) {
    const antes = new Map([...mesaEl.querySelectorAll('[data-id]')].map((el) => [el.dataset.id, el.getBoundingClientRect()]));
    cambio();
    if (sinMovimiento()) return;
    for (const el of mesaEl.querySelectorAll('[data-id]')) {
      const r0 = antes.get(el.dataset.id);
      if (!r0) continue;
      const r1 = el.getBoundingClientRect();
      el.animate(
        [{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px)` }, { transform: 'none' }],
        { duration: 700, easing: 'cubic-bezier(.5,-0.2,.3,1.3)' },
      );
    }
  }

  function textos() {
    const { a, b, c, d, agrupado } = estado;
    const original = expresion([{ coef: a, x: true }, { coef: b, x: false }, { coef: c, x: true }, { coef: d, x: false }]);
    const agrupada = expresion([{ coef: a, x: true }, { coef: c, x: true }, { coef: b, x: false }, { coef: d, x: false }]);
    const resultado = expresion([{ coef: a + c, x: true }, { coef: b + d, x: false }]);
    expresionEl.innerHTML = agrupado
      ? `<span class="tenue">${original} =</span> ${agrupada} = <b class="resultado">${resultado}</b>`
      : `${original}`;
    boton.textContent = agrupado ? 'Desordenar' : 'Agrupar';
    let t = `Una barrita es una ${X} y un cuadradito es un 1. `;
    if (agrupado) {
      t += `Se juntan <b>las ${X} con las ${X}</b> (${num(a)} + ${par(c)} = ${num(a + c)}) y <b>los números con los números</b> (${num(b)} + ${par(d)} = ${num(b + d)}). `;
      if ((a > 0 && c < 0) || (a < 0 && c > 0) || (b > 0 && d < 0) || (b < 0 && d > 0)) t += 'Una ficha positiva y una negativa del mismo tipo <b>se anulan</b> (dan 0). ';
      t += `Queda <b>${resultado}</b>, y eso ya no se puede juntar más: ${X} y números no son semejantes.`;
    } else {
      t += `Tocá <b>Agrupar</b>: ¿qué fichas se pueden juntar?`;
    }
    textoEl.innerHTML = t;
  }

  function dibujar(animar = false) {
    if (animar) cambiarConAnimacion(armarMesa); else armarMesa();
    textos();
  }

  boton.addEventListener('click', () => { estado.agrupado = !estado.agrupado; dibujar(true); });
  for (const n of ['a', 'b', 'c', 'd']) conectarDeslizador($(`.deslizador[data-param="${n}"]`), (v) => { estado[n] = v; dibujar(); });
  dibujar();
}
