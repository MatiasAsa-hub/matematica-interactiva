// ==========================================================================
// INTERACTIVO: la división "con la galera", paso a paso.
//
//   670 | 10
//  −60  ‾‾‾‾
//   ‾‾   67
//    70
//   −70
//    ‾‾
//     0
//
// Cada "Siguiente paso" muestra una sola cosa: qué número tomo, cuántas veces
// entra el divisor, la resta, y bajar la cifra que sigue.
// El HTML está en src/components/interactivos/Galera.astro.
// ==========================================================================

/**
 * Arma todos los "cuadros" de la división, de a un paso.
 * Cada cuadro: { filas, cociente, resaltar, usadas, tabla, texto, final }
 *   filas: [{ texto, col, tipo }]  texto alineado para que su última cifra caiga en la columna col
 *   resaltar: { fila, desde, hasta } (columnas) o null
 *   usadas: cuántas cifras del dividendo ya se usaron (para marcarlas)
 *   tabla: el producto que se está mirando en la tabla del divisor (o null)
 */
export function cuadrosDeDivision(dividendo, divisor) {
  const cifras = String(dividendo).split('').map(Number);
  const n = cifras.length;
  const cuadros = [];
  const filas = [{ texto: String(dividendo), col: n - 1, tipo: 'dividendo' }];
  let cociente = '';
  const foto = (extra) => cuadros.push({
    filas: filas.map((f) => ({ ...f })),
    cociente,
    resaltar: null,
    usadas: 0,
    tabla: null,
    final: false,
    ...extra,
  });

  foto({ texto: `Vamos a dividir <b>${dividendo}</b> por <b>${divisor}</b>. El ${dividendo} es el <b>dividendo</b> y el ${divisor} es el <b>divisor</b>.` });

  // Si el dividendo es más chico que el divisor: cociente 0 y resto el dividendo.
  if (dividendo < divisor) {
    cociente = '0';
    foto({
      resaltar: { fila: 0, desde: 0, hasta: n - 1 },
      texto: `${divisor} no entra ninguna vez en ${dividendo} (${dividendo} es más chico). El cociente es <b>0</b> y el resto es <b>${dividendo}</b>.`,
      usadas: n,
      final: true,
    });
    return { cuadros, cociente: 0, resto: dividendo };
  }

  // 1) Primer pedazo: las primeras cifras que alcancen para el divisor
  let col = 0;
  let parcial = cifras[0];
  while (parcial < divisor) { col++; parcial = parcial * 10 + cifras[col]; }
  let filaActual = 0; // en qué fila está el número que estoy dividiendo
  let desde = 0;      // columna donde empieza ese número

  foto({
    resaltar: { fila: 0, desde: 0, hasta: col },
    usadas: col + 1,
    texto: col === 0
      ? `Empiezo por la primera cifra: <b>${parcial}</b>.`
      : `Con ${String(dividendo).slice(0, col)} no alcanza para ${divisor}, así que tomo <b>${parcial}</b>.`,
  });

  for (;;) {
    // 2) ¿Cuántas veces entra?
    const q = Math.floor(parcial / divisor);
    const producto = q * divisor;
    const resto = parcial - producto;
    cociente += String(q);

    if (q === 0) {
      foto({
        resaltar: { fila: filaActual, desde, hasta: col },
        usadas: col + 1,
        tabla: null,
        texto: `¿Cuántas veces entra ${divisor} en ${parcial}? <b>Ninguna</b>: ${parcial} es más chico. <b>Pongo un 0 en el cociente</b> (¡no hay que olvidarlo!).`,
      });
    } else {
      foto({
        resaltar: { fila: filaActual, desde, hasta: col },
        usadas: col + 1,
        tabla: q,
        texto: `¿Cuántas veces entra ${divisor} en ${parcial}? <b>${q} ${q === 1 ? 'vez' : 'veces'}</b>, porque ${q} · ${divisor} = ${producto}`
          + (q < 9 ? ` (y ${q + 1} · ${divisor} = ${(q + 1) * divisor} ya se pasa).` : '.')
          + ` Escribo <b>${q}</b> en el cociente y <b>${producto}</b> abajo, para restar.`,
      });
      // el producto
      filas.push({ texto: `−${producto}`, col, tipo: 'producto' });
      cuadros[cuadros.length - 1].filas = filas.map((f) => ({ ...f }));
      // 3) la resta
      filas.push({ texto: String(resto), col, tipo: 'resto' });
      filaActual = filas.length - 1;
      foto({
        resaltar: { fila: filaActual, desde: col - String(resto).length + 1, hasta: col },
        usadas: col + 1,
        texto: `Resto: ${parcial} − ${producto} = <b>${resto}</b>.`,
      });
    }

    // 4) ¿Quedan cifras para bajar?
    if (col === n - 1) {
      const restoFinal = q === 0 ? parcial : resto;
      const coc = Number(cociente);
      foto({
        resaltar: { fila: filaActual, desde: col - String(restoFinal).length + 1, hasta: col },
        usadas: n,
        final: true,
        texto: `No quedan cifras para bajar: terminé. El <b>cociente</b> es <b>${coc}</b> y el <b>resto</b> es <b>${restoFinal}</b>.`
          + `<br>Comprobación: ${divisor} · ${coc} + ${restoFinal} = ${divisor * coc + restoFinal}.`,
      });
      return { cuadros, cociente: coc, resto: restoFinal };
    }
    const anterior = q === 0 ? parcial : resto;
    col++;
    parcial = anterior * 10 + cifras[col];
    // la cifra bajada se agrega al número de la fila actual
    if (filaActual === 0) {
      // (no pasa: el primer pedazo siempre entra al menos una vez)
    }
    filas[filaActual] = { ...filas[filaActual], texto: String(parcial), col };
    desde = col - String(parcial).length + 1;
    foto({
      resaltar: { fila: filaActual, desde, hasta: col },
      usadas: col + 1,
      texto: `<b>Bajo el ${cifras[col]}</b>: queda <b>${parcial}</b>.`,
    });
  }
}

export function iniciarGalera(raiz) {
  const $ = (sel) => raiz.querySelector(sel);
  const ejemplos = JSON.parse(raiz.dataset.divisiones);
  const estado = { dividendo: 0, divisor: 1, paso: 0, cuadros: [], tabla: false };

  const izquierdaEl = $('[data-izquierda]');
  const divisorEl = $('[data-divisor]');
  const cocienteEl = $('[data-cociente]');
  const textoEl = $('[data-texto]');
  const tablaEl = $('[data-tabla]');
  const botonSiguiente = $('[data-siguiente]');
  const botonTodo = $('[data-todo]');
  const entradaDividendo = $('[data-entrada="dividendo"]');
  const entradaDivisor = $('[data-entrada="divisor"]');
  const avisoEl = $('[data-aviso]');

  function elegir(dividendo, divisor) {
    estado.dividendo = dividendo;
    estado.divisor = divisor;
    estado.paso = 0;
    estado.cuadros = cuadrosDeDivision(dividendo, divisor).cuadros;
    entradaDividendo.value = String(dividendo);
    entradaDivisor.value = String(divisor);
    for (const b of raiz.querySelectorAll('[data-ejemplo]')) {
      b.setAttribute('aria-pressed', String(b.dataset.ejemplo === `${dividendo}:${divisor}`));
    }
    dibujar();
  }

  function dibujar() {
    const c = estado.cuadros[estado.paso];
    const ancho = String(estado.dividendo).length + 1; // +1 para el signo menos
    // lado izquierdo: una grilla de cifras
    const filasHtml = c.filas.map((f, i) => {
      const celdas = Array(ancho).fill('');
      const texto = f.texto;
      const inicio = f.col + 1 - texto.length + 1; // +1 por la columna del signo
      for (let k = 0; k < texto.length; k++) celdas[inicio + k] = texto[k];
      const html = celdas.map((d, k) => {
        const colDigito = k - 1;
        const clases = ['celda'];
        if (c.resaltar && c.resaltar.fila === i && colDigito >= c.resaltar.desde && colDigito <= c.resaltar.hasta && d !== '') clases.push('resaltada');
        if (f.tipo === 'producto' && d !== '') clases.push('subrayada');
        if (i === 0 && colDigito >= 0 && colDigito < c.usadas) clases.push('usada');
        return `<span class="${clases.join(' ')}">${d}</span>`;
      }).join('');
      return `<div class="galera-fila galera-${f.tipo}" style="grid-template-columns: repeat(${ancho}, var(--ancho-cifra))">${html}</div>`;
    }).join('');
    izquierdaEl.innerHTML = filasHtml;
    divisorEl.textContent = String(estado.divisor);
    cocienteEl.textContent = c.cociente;
    textoEl.innerHTML = c.texto;
    textoEl.classList.toggle('final', c.final);

    // tabla del divisor
    if (estado.tabla) {
      const d = estado.divisor;
      tablaEl.innerHTML = Array.from({ length: 10 }, (_, k) => {
        const clase = c.tabla === k ? 'elegida' : c.tabla !== null && k === c.tabla + 1 ? 'se-pasa' : '';
        return `<li class="${clase}">${k} · ${d} = <b>${k * d}</b></li>`;
      }).join('');
    }
    tablaEl.hidden = !estado.tabla;

    const ultimo = estado.paso >= estado.cuadros.length - 1;
    botonSiguiente.disabled = ultimo;
    botonTodo.disabled = ultimo;
  }

  botonSiguiente.addEventListener('click', () => { estado.paso++; dibujar(); });
  botonTodo.addEventListener('click', () => { estado.paso = estado.cuadros.length - 1; dibujar(); });
  $('[data-reiniciar]').addEventListener('click', () => { estado.paso = 0; dibujar(); });

  for (const b of raiz.querySelectorAll('[data-ejemplo]')) {
    b.addEventListener('click', () => {
      const [a, d] = b.dataset.ejemplo.split(':').map(Number);
      avisoEl.textContent = '';
      elegir(a, d);
    });
  }

  $('[data-propia]').addEventListener('submit', (e) => {
    e.preventDefault();
    const a = Number(entradaDividendo.value);
    const d = Number(entradaDivisor.value);
    if (!Number.isInteger(a) || a < 1 || a > 99999) { avisoEl.textContent = 'El dividendo tiene que ser un número entero entre 1 y 99999.'; return; }
    if (!Number.isInteger(d) || d < 1 || d > 99) { avisoEl.textContent = 'El divisor tiene que ser un número entero entre 1 y 99 (y no puede ser 0).'; return; }
    avisoEl.textContent = '';
    elegir(a, d);
  });

  const casillaTabla = $('[data-casilla="tabla"]');
  casillaTabla.addEventListener('click', () => {
    estado.tabla = !estado.tabla;
    casillaTabla.setAttribute('aria-pressed', String(estado.tabla));
    dibujar();
  });

  const [a0, d0] = ejemplos[0].split(':').map((s) => Number(s.trim()));
  elegir(a0, d0);
}
