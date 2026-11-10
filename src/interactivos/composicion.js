// ==========================================================================
// INTERACTIVO: composición de funciones, f ∘ g
//
// Dos máquinas en cadena: entra x, la primera (g) hace su cuenta, lo que
// sale entra en la segunda (f), y sale f(g(x)).
//   2 → [x + 1] → 3 → [x²] → 9
// Con "Dar vuelta el orden" se ve g ∘ f: casi siempre da otra cosa.
// Abajo, el gráfico de la compuesta (y, si se quiere, f y g en gris).
// Los ejemplos vienen del tema (campo "composiciones:" del .md).
// El HTML está en src/components/interactivos/Composicion.astro.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador, conectarCasillas } from '../lib/grafico/controles.js';
import { leerFormula } from '../lib/formula.js';
import { itemInfo } from '../lib/analisisFuncion.js';
import { num, numAprox } from '../lib/numeros.js';

const X = '<i>x</i>';
const valor = (v) => (Number.isFinite(v) ? numAprox(v).replace('≈ ', '≈') : 'no existe');

/** Reemplaza la x de "afuera" por toda la fórmula de "adentro": f(g(x)). */
export function componerTexto(afuera, adentro) {
  const g = adentro.trim();
  if (/^(x|\d+(\.\d+)?)$/.test(g)) return afuera.replace(/x/g, g);
  // ¿tiene un + o un − "suelto" (fuera de paréntesis, sin contar el signo del principio)?
  let nivel = 0;
  let conSuma = false;
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '(') nivel++;
    else if (c === ')') nivel--;
    else if ((c === '+' || c === '-' || c === '−') && nivel === 0 && g.slice(0, i).trim() !== '') conSuma = true;
  }
  const empiezaConMenos = /^[-−]/.test(g);
  // los paréntesis hacen falta según lo que rodea a cada x de afuera
  return afuera.replace(/x/g, (x, i) => {
    const antes = afuera.slice(0, i).trimEnd().slice(-1);
    const despues = afuera.slice(i + 1).trimStart()[0] ?? '';
    const libreAntes = antes === '' || antes === '+' || antes === '(';
    const libreDespues = despues === '' || despues === '+' || despues === '-' || despues === '−' || despues === ')';
    let hace = false;
    if (despues === '^') hace = true; // (x + 1)², (2x)²
    else if (antes === ':' || antes === '-' || antes === '−') hace = conSuma || empiezaConMenos || antes === ':';
    else if (conSuma || empiezaConMenos) hace = !(libreAntes && libreDespues);
    if (/[\d)]/.test(antes) && /^\d/.test(g)) hace = true; // 3x con 2x: 3(2x), no "32x"
    return hace ? `(${g})` : g;
  });
}

export function iniciarComposicion(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const ejemplos = JSON.parse(raiz.dataset.ejemplos);
  const estado = { indice: 0, x: 2, alReves: false };
  let f;
  let g;
  // primera = la que se aplica primero (la de adentro)
  let primera;
  let segunda;
  let nombres; // ['g', 'f'] o ['f', 'g']
  let compuesta;

  function armar() {
    const e = ejemplos[estado.indice];
    f = leerFormula(e.f);
    g = leerFormula(e.g);
    const textos = estado.alReves ? [e.f, e.g] : [e.g, e.f];
    primera = estado.alReves ? f : g;
    segunda = estado.alReves ? g : f;
    nombres = estado.alReves ? ['f', 'g'] : ['g', 'f'];
    compuesta = leerFormula(componerTexto(textos[1], textos[0]));
  }
  const H = (x) => segunda.f(primera.f(x));

  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -5, xMax: 5, yCentro: 2 },
    descripcion: 'Gráfico de la función compuesta',
  });
  const col = plano.colores;
  let casillas = {};

  plano.agregarCapa((p) => {
    if (casillas.separadas) {
      p.curva(g.f, { color: col.fantasma, ancho: 2.5, guiones: [8, 6] });
      p.curva(f.f, { color: col.fantasma, ancho: 2.5, guiones: [2, 5] });
      // etiquetas cerca del borde derecho
      for (const [fn, nombre] of [[g.f, 'g'], [f.f, 'f']]) {
        const xe = p.mx(p.ancho - 70);
        const ye = fn(xe);
        if (Number.isFinite(ye) && ye > p.yMin && ye < p.yMax) p.etiqueta(nombre, xe, ye, { color: col.fantasma, dx: 0, dy: -14, alinear: 'center', tamano: 15 });
      }
    }
    p.curva(H, { color: col.funcion, ancho: 3.5 });
    const x = estado.x;
    const y = H(x);
    if (Number.isFinite(y)) {
      p.segmento(x, 0, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
      p.segmento(0, y, x, y, { color: col.funcion, ancho: 1.5, guiones: [3, 4], alfa: 0.8 });
      p.punto(x, y, { color: col.funcion, radio: 8 });
      p.etiqueta(`(${num(x)}, ${valor(y)})`, x, y, { color: col.funcion, dx: 12, dy: -14, alinear: 'left', tamano: 14 });
    }
  });

  // --------------------------------------------------------------- textos

  const definicionesEl = $('[data-definiciones]');
  const formulaEl = $('[data-formula]');
  const cadenaEl = $('[data-cadena]');
  const cuentasEl = $('[data-cuentas]');
  const infoEl = $('[data-info]');
  const contadorEl = $('[data-contador]');

  function actualizar() {
    const [n1, n2] = nombres;
    const x = estado.x;
    const medio = primera.f(x);
    const fin = segunda.f(medio);

    definicionesEl.innerHTML = `<i>f</i>(${X}) = ${f.html()} <span class="texto-suave">y</span> <i>g</i>(${X}) = ${g.html()}`;
    formulaEl.innerHTML = `(<i>${n2}</i> ∘ <i>${n1}</i>)(${X}) = <i>${n2}</i>(<i>${n1}</i>(${X})) = ${compuesta.html()}`;

    const caja = (nombre, formula) => `<span class="maquina-caja"><span class="maquina-nombre">${nombre}</span> ${formula.html()}</span>`;
    const flecha = '<span class="maquina-flecha" aria-hidden="true">→</span>';
    cadenaEl.innerHTML =
      `<div class="maquina">` +
        `<span class="maquina-entra">${num(x)}</span>${flecha}${caja(n1, primera)}${flecha}` +
        `<span class="maquina-sale maquina-medio">${valor(medio)}</span>` +
      `</div>` +
      `<div class="maquina">` +
        `<span class="maquina-entra maquina-medio">${valor(medio)}</span>${flecha}${caja(n2, segunda)}${flecha}` +
        `<span class="maquina-sale${Number.isFinite(fin) ? '' : ' error'}">${valor(fin)}</span>` +
      `</div>`;

    const renglones = [`<i>${n1}</i>(${num(x)}) = ${primera.cuenta(x)} = ${valor(medio)}`];
    if (Number.isFinite(medio)) renglones.push(`<i>${n2}</i>(${valor(medio)}) = ${segunda.cuenta(medio)} = ${valor(fin)}`);
    cuentasEl.innerHTML = renglones.join('<br>');

    const partes = [];
    partes.push(itemInfo(col.funcion, 'Primero la de adentro:', `(<i>${n2}</i> ∘ <i>${n1}</i>)(${X}) se lee "<i>${n2}</i> de <i>${n1}</i> de ${X}". Se hace <b>primero <i>${n1}</i></b> y lo que sale entra en <i>${n2}</i>.`));
    partes.push(itemInfo(col.funcion, 'La fórmula:', `en la fórmula de <i>${n2}</i>, donde dice ${X} se pone <b>toda</b> la fórmula de <i>${n1}</i>: ${compuesta.html()}.`));
    if (casillas.orden) {
      const otra = estado.alReves ? (v) => f.f(g.f(v)) : (v) => g.f(f.f(v));
      const otroNombre = estado.alReves ? '(<i>f</i> ∘ <i>g</i>)' : '(<i>g</i> ∘ <i>f</i>)';
      const igualOrden = [-2, -1, 0, 1, 2, 3].every((v) => Math.abs(otra(v) - H(v)) < 1e-9);
      partes.push(itemInfo(col.vertice, '¿Y al revés?', igualOrden
        ? `${otroNombre}(${num(x)}) = ${valor(otra(x))}: con estas dos funciones da lo mismo en cualquier orden. ¡Es raro! Casi siempre cambia.`
        : `${otroNombre}(${num(x)}) = ${valor(otra(x))}, que ${Math.abs(otra(x) - fin) < 1e-9 ? 'justo da igual con este número, pero con otros no' : 'no es lo mismo'}. <b>El orden importa.</b>`));
    }
    infoEl.innerHTML = `<ul class="info-lista">${partes.join('')}</ul>`;
    plano.pedirDibujo();
  }

  // --------------------------------------------------------------- controles

  const control = conectarDeslizador($('.deslizador[data-param="x"]'), (v) => { estado.x = v; actualizar(); });
  estado.x = control.valor;

  $('[data-dar-vuelta]').addEventListener('click', () => {
    estado.alReves = !estado.alReves;
    armar();
    actualizar();
  });

  function elegir(i) {
    estado.indice = (i + ejemplos.length) % ejemplos.length;
    estado.alReves = false;
    contadorEl.textContent = `Ejemplo ${estado.indice + 1} de ${ejemplos.length}`;
    armar();
    actualizar();
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));

  casillas = conectarCasillas($('[data-casillas]'), () => actualizar());
  plano.alCambiarVista.push(() => plano.pedirDibujo());
  elegir(0);
}
