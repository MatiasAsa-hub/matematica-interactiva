// ==========================================================================
// INTERACTIVO: resolver inecuaciones.
//
// 1) Se prueban números en la recta: cada uno queda marcado con un punto
//    verde (cumple) o una cruz roja (no cumple).
// 2) "Resolver paso a paso": se despeja como una ecuación, pero si se divide
//    por un negativo se da vuelta el signo. Al final se pinta la solución.
// El HTML está en src/components/interactivos/Inecuacion.astro.
// Las cuentas están en src/lib/lineal.js.
// ==========================================================================

import { Plano } from '../lib/grafico/plano.js';
import { conectarDeslizador } from '../lib/grafico/controles.js';
import { dibujarIntervalo, dibujarCruz } from '../lib/grafico/intervalo.js';
import { leerEcuacion, pasosInecuacion, ladoHtml, valorLado, cuentaHtml, cumple } from '../lib/lineal.js';
import { num } from '../lib/numeros.js';

const X = '<i>x</i>';

export function iniciarInecuacion(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const inecuaciones = JSON.parse(raiz.dataset.inecuaciones);
  const estado = { indice: 0, ec: null, pasos: [], paso: 0, x: 0 };
  const probados = new Map();

  const renglonesEl = $('[data-renglones]');
  const textoEl = $('[data-texto]');
  const pruebaEl = $('[data-prueba]');
  const expresionEl = $('[data-expresion]');
  const botonSiguiente = $('[data-siguiente]');
  const botonTodo = $('[data-todo]');

  const resuelta = () => estado.paso === estado.pasos.length - 1 && estado.paso > 0;
  const cumpleCon = (v) => cumple(valorLado(estado.ec.izq, v), estado.ec.signo, valorLado(estado.ec.der, v));

  // ------------------------------------------------------------------ recta
  const plano = new Plano($('[data-grafico]'), {
    vista: { xMin: -7.5, xMax: 7.5 },
    soloEjeX: true,
    separacionNumeros: 36,
    descripcion: 'Recta numérica con los números probados',
  });
  const col = plano.colores;

  plano.agregarCapa((p) => {
    // la solución (cuando ya se resolvió)
    if (resuelta()) {
      const s = estado.pasos[estado.paso].solucion;
      if (s.tipo === 'todos') dibujarIntervalo(p, { desde: -Infinity, hasta: Infinity, color: col.positivo });
      if (s.tipo === 'intervalo') {
        const mayor = s.signo === '>' || s.signo === '≥';
        const cerrado = s.signo === '≥' || s.signo === '≤';
        dibujarIntervalo(p, mayor
          ? { desde: s.valor, hasta: Infinity, cerradoDesde: cerrado, color: col.positivo }
          : { desde: -Infinity, hasta: s.valor, cerradoHasta: cerrado, color: col.positivo });
      }
    }
    // los números probados
    for (const [v, ok] of probados) {
      if (v === estado.x) continue;
      if (ok) p.punto(v, 0, { color: col.positivo, radio: 5 });
      else dibujarCruz(p, v, { color: col.negativo, tamano: 5 });
    }
    // el número que se está probando
    const ok = cumpleCon(estado.x);
    p.punto(estado.x, 0, { color: col.texto, radio: 9 });
    p.etiqueta(`${num(estado.x)} ${ok ? '✓' : '✗'}`, estado.x, 0, { color: ok ? col.positivo : col.negativo, dx: 0, dy: -50, alinear: 'center', tamano: 16 });
  });

  const desl = conectarDeslizador($('.deslizador[data-param="x"]'), (v) => probar(v));
  plano.agregarArrastrable({
    posicion: () => [estado.x, 0],
    mover: (x) => desl.poner(Math.max(-10, Math.min(10, Math.round(x * 2) / 2))),
  });

  function probar(v) {
    estado.x = v;
    probados.set(v, cumpleCon(v));
    plano.mostrarRango(v, v, 1.2);
    plano.pedirDibujo();
    textoPrueba();
  }

  function textoPrueba() {
    const { ec, x } = estado;
    const L = valorLado(ec.izq, x);
    const R = valorLado(ec.der, x);
    const ok = cumple(L, ec.signo, R);
    let t = `Con ${X} = <b>${num(x)}</b>: `;
    if (ec.der.x === 0) t += `${cuentaHtml(ec.izq, x)}. `;
    else t += `a la izquierda ${cuentaHtml(ec.izq, x)} y a la derecha ${cuentaHtml(ec.der, x)}. `;
    t += `¿${num(L)} ${ec.signo} ${num(R)}? ${ok ? '<b class="pos">Sí, cumple</b> ✓' : '<b class="neg">No cumple</b> ✗'}`;
    pruebaEl.innerHTML = t;
  }

  // ------------------------------------------------------------------ pasos
  function escribir(animar) {
    const { pasos, paso } = estado;
    const lineas = [];
    for (let j = 0; j <= paso; j++) {
      const p = pasos[j];
      const nota = j < paso ? pasos[j + 1].nota : '';
      const clases = ['renglon'];
      if (j === paso) clases.push('actual');
      if (p.solucion && j === paso) clases.push('final');
      if (p.dadoVuelta) clases.push('dado-vuelta');
      const signo = p.dadoVuelta ? `<span class="signo-girado">${p.signo}</span>` : p.signo;
      lineas.push(`<li class="${clases.join(' ')}${animar && j === paso && j > 0 ? ' nuevo' : ''}"><span class="renglon-cuenta">${ladoHtml(p.izq)} ${signo} ${ladoHtml(p.der)}</span>${nota ? `<span class="renglon-nota">${nota}</span>` : ''}</li>`);
    }
    renglonesEl.innerHTML = lineas.join('');

    const fin = paso === pasos.length - 1;
    textoEl.innerHTML = paso === 0
      ? `Probá números con el deslizador o arrastrando el punto negro: ¿cuáles cumplen? Después tocá <b>Resolver paso a paso</b>.`
      : `<span class="regla-num">Paso ${paso} de ${pasos.length - 1}</span> ${pasos[paso].regla}${fin ? ' Fijate si coincide con los números que probaste.' : ''}`;
    textoEl.classList.toggle('final', fin && paso > 0);
    botonSiguiente.textContent = paso === 0 ? 'Resolver paso a paso' : 'Siguiente paso';
    botonSiguiente.disabled = fin;
    botonTodo.disabled = fin;

    if (resuelta()) {
      const s = pasos[paso].solucion;
      if (s.tipo === 'intervalo') plano.mostrarRango(s.valor, s.valor, 2);
    }
    plano.pedirDibujo();
  }

  function irA(i, animar = false) { estado.paso = i; escribir(animar); }

  botonSiguiente.addEventListener('click', () => { if (estado.paso < estado.pasos.length - 1) irA(estado.paso + 1, true); });
  botonTodo.addEventListener('click', () => irA(estado.pasos.length - 1));
  $('[data-reiniciar]').addEventListener('click', () => irA(0));

  function elegir(i) {
    estado.indice = (i + inecuaciones.length) % inecuaciones.length;
    estado.ec = leerEcuacion(inecuaciones[estado.indice]);
    estado.pasos = pasosInecuacion(estado.ec);
    $('[data-contador]').textContent = `Inecuación ${estado.indice + 1} de ${inecuaciones.length}`;
    expresionEl.innerHTML = `${ladoHtml(estado.ec.izq)} ${estado.ec.signo} ${ladoHtml(estado.ec.der)}`;
    probados.clear();
    plano.vistaInicial();
    irA(0);
    desl.poner(0);
    probar(0);
  }
  $('[data-anterior]').addEventListener('click', () => elegir(estado.indice - 1));
  $('[data-proxima]').addEventListener('click', () => elegir(estado.indice + 1));
  elegir(0);
}
