# Estado del proyecto

_Última actualización: 13/11/2026 — sesión 9 (guías para imprimir y mapa de correlativas, partes 2 y 3 de 3)_

**Página publicada:** https://matiasasa-hub.github.io/matematica-interactiva/
**Repositorio:** https://github.com/MatiasAsa-hub/matematica-interactiva

## Rediseño y dos funciones nuevas, en 3 partes (pedido de Mati, 12/11/2026)

| Parte | Qué es | Estado |
|---|---|---|
| **1 — Rediseño** | Diseño claro: Lexend, gris cálido con tarjetas blancas, acento azul, dos columnas, grillas de tarjetas, íconos, interactivos rediseñados | ✅ Publicada. Mati dio el OK para seguir (13/11/2026). |
| **2 — Guías para imprimir (PDF)** | Botón "Imprimir guía" en cada tema y en cada unidad | ✅ Publicada. Mati dio el OK para seguir (13/11/2026). |
| **3 — Mapa de correlativas** | Página "Mapa" con los temas como nodos y flechas de requisito | ✅ Publicada. Mati aprobó la lista de correlativas (13/11/2026). |

El pedido completo de las partes 2 y 3 (lo que escribió Mati):
- **Parte 2:** un botón "Imprimir guía" en cada tema y otro en cada unidad (junta todos sus temas). CSS de impresión → "Guardar como PDF". Contenido, en orden: Para recordar, Ejemplo resuelto (con sus pasos desplegados) y Ejercicios. **Solo los ejercicios de respuesta numérica** (los de opción múltiple quedan afuera). Al final, "Respuestas": solo el resultado, sin resolución. Solo texto, en blanco y negro, sin logo, sin QR, sin encabezados decorativos y sin espacio para escribir; lo más compacto posible. Las fórmulas se tienen que imprimir bien.
- **Parte 3:** página propia "Mapa" en el menú. Los temas son los nodos (todos), agrupados por unidad como un plan de estudios, con flechas de requisito. Al tocar un tema se resalta todo su camino hacia atrás (requisitos directos e indirectos) y el resto se atenúa; cada nodo tiene un link al tema. Sin progreso guardado. En el celular, el mismo grafo con zoom y arrastre con dos dedos y botón de vista inicial. Las correlativas salen del apartado "Antes tiene que saber" de cada tema y van en un archivo fácil de editar (por ejemplo, un campo `necesita:` en el frontmatter); sumar a `COMO-EDITAR.md` cómo cambiarlas. Al terminar, pasarle a Mati la lista de correlativas para revisar.

### Parte 3 — Mapa de correlativas ✅ (publicada el 13/11/2026)
- Página `mapa/`, en el menú entre Temas e Interactivos (arriba en la compu y abajo en el celular, que ahora tiene 6 botones). El texto de arriba está en `contenido/paginas/mapa.md`.
- Dibujo en SVG, armado al construir el sitio (`src/lib/mapa.js`): una columna por unidad (agrupadas por etapa, como un plan de estudios) y los temas en el orden del recorrido. Las flechas van del tema que se necesita al que lo necesita; dentro de una misma columna, por el costado izquierdo.
- Tocar un tema: se marcan él (azul lleno), todos sus requisitos directos e indirectos (azul claro) y las flechas entre ellos; el resto se apaga. Abajo aparece una tarjeta con el tema, "Ir al tema" y la lista de todo lo que hay que saber antes (★ = directo). Tocar de nuevo el mismo tema lo abre (cada nodo es un link). Tocar afuera o Escape borra la marca.
- Mover y acercar: como los gráficos. Celular: dos dedos (con uno se mueve la página; si se arrastra de costado, avisa). Compu: arrastrar con el mouse y Ctrl + rueda. Botones +, − y vista inicial (abajo a la izquierda). En la compu entra todo a lo ancho; en el celular arranca con letra legible y se recorre.
- **Datos:** campo `necesita:` en cada tema (solo los requisitos directos). Se armó a partir de "Antes tiene que saber" de las notas para tutores. El armado revisa que los nombres existan y que no haya vueltas (A necesita B y B necesita A). Explicado en `COMO-EDITAR.md`.
- Dos links de "Antes tiene que saber" quedaron **afuera** a propósito, porque el texto los marca como opcionales (Mati aprobó la lista así, sin estas dos): "¿Qué es la integral?" → "¿Qué es la derivada?" ("ayuda haber visto") y "Orden de las operaciones" → "Potencias y raíces" ("para las cuentas con potencias"; además iría hacia atrás, de la unidad 1 a la 2).
- **Mati aprobó las correlativas tal como están (13/11/2026).** Queda abierto, si Mati quiere más adelante: si el mapa en el celular se entiende bien y si quiere que el mapa quite las flechas "redundantes" (por ejemplo, si A → B → C y también A → C).

### Parte 2 — Guías para imprimir ✅ (publicada el 13/11/2026)
- Páginas nuevas: `guia/<tema>/` (una por tema; no hay guía si el tema no tiene nada para imprimir) y `guia/unidad/<unidad>/` (las 9 unidades). Se arman solas desde el .md de cada tema.
- Contenido, en orden: Para recordar, Ejemplo resuelto (todos los pasos a la vista) y Ejercicios (**solo los de respuesta numérica**, numerados de nuevo desde 1). Al final, **Respuestas**: solo el resultado, tal como está escrito en `respuesta:`. En la de unidad, las respuestas van agrupadas por tema.
- Formato: solo texto, todo en negro, sin logo ni encabezados decorativos. A4, letra de 10 pt, ejercicios en dos columnas. Las fórmulas salen con KaTeX y se imprimen bien (probado generando los PDF de varias unidades).
- Botones: "Imprimir guía" arriba de cada tema (también en las notas de tutores: "Imprimir la guía del alumno") y "Imprimir la guía de la unidad" adentro de cada unidad, en Temas y en Tutores. El botón abre la guía y la ventana de impresión sola; ahí se elige "Guardar como PDF". La guía también se ve en la pantalla, con un botón para imprimir y otro para volver.
- Piezas nuevas: `src/lib/guia.js`, `src/components/GuiaTema.astro`, `src/components/BotonGuia.astro`, `src/layouts/Guia.astro`, `src/styles/guia.css`. Cada ejercicio ahora guarda `respuestaTexto` (la respuesta como está escrita).
- Para revisar con Mati: el tamaño de letra (¿más grande?), si quiere que cada tema empiece en hoja nueva en la guía de unidad, y si las respuestas van bien así (en renglón corrido).

### Parte 1 — Rediseño ✅ (publicada el 12/11/2026)
Reemplaza al diseño "Carpeta" (Fraunces + pizarrones oscuros). Las decisiones están en `CLAUDE.md`, sección 4.
- **Tipografía:** Lexend para todo (pesos 400, 500, 600 y 700). Se sacaron Fraunces, Atkinson y Nunito.
- **Colores:** todo en `src/styles/global.css`. Fondo gris cálido, tarjetas blancas, acento azul. Ya no hay "dos mundos" (hoja y pizarrón): hay un solo juego de colores. Los colores por concepto conservan nombre y significado, en tonos más sobrios. Variables nuevas para los gráficos: `--grafico-grilla`, `--grafico-grilla-fina`, `--grafico-eje`, `--grafico-numeros`.
- **Layout:** la página usa el ancho (`--ancho-pagina`). En un tema (y en las notas de tutores), en la compu: texto a la izquierda y el interactivo fijo a la derecha (`.tema-cuerpo`, `.tema-interactivo-fijo` en `contenido.css`). Si el interactivo es más alto que la pantalla, se mueve por dentro. En el celular, una columna, como antes.
- **Los interactivos se acomodan según el lugar que tienen**, no según la pantalla: el "marco" (`.marco-interactivo`) mide el ancho y, si hay 700 px o más, el interactivo va en dos columnas (gráfico | controles).
- **Listas en tarjetas:** Inicio (9 tarjetas de unidad y los números grandes: unidades, temas y ejercicios, que se cuentan solos), Temas y Tutores (cada unidad es una tarjeta que se abre y muestra sus temas en una grilla; **en la compu arrancan todas abiertas**, en el celular cerradas), Interactivos (tarjetas de unidad). Notación: una tarjeta por sección, en dos columnas.
- **Íconos:** `src/components/IconoUnidad.astro`, uno por unidad, elegido por el `id` de la unidad.
- **Interactivos:** tarjeta clara, grilla y ejes finos, deslizadores azules, casillas como chips, selectores segmentados. **No se tocó la lógica**: mismos controles, mismas casillas y mismos valores por defecto. Revisados los 35 (más el Laboratorio y los 3D) a 375 px y en compu: sin errores y sin nada que se salga de la pantalla.
- **Textos que cambiaron por el fondo claro:** los puntos que antes eran blancos ahora son negros, así que donde decía "punto blanco" o "flecha blanca" ahora dice "negro/negra" (recta de signos, inecuaciones, intervalos, integral, secante, vectores y el tema "¿Qué es la derivada?").
- **Arreglo de paso:** los exponentes y subíndices de las fórmulas (x², x₁,₂) salían del mismo tamaño que la letra, porque los estilos de KaTeX eran de una versión y las fórmulas de otra. Quedó una sola versión de KaTeX (0.16).
- Para revisar con Mati: el tono del azul, el tamaño de la letra, si en la compu prefiere las unidades de Temas cerradas, y los 9 íconos.

## Revisión general (sesión 6, 11/11/2026) — parte 1 publicada, falta la devolución de Mati

_(Lo que acá dice del diseño "Carpeta", las tipografías y los pizarrones quedó reemplazado por el rediseño de arriba. Lo demás sigue igual.)_

Decisiones de Mati: diseño **"Carpeta"** (hoja color hueso para leer + interactivos como pizarrones oscuros), nombre **"Matemática para todos"** con logo **∀ con un punto amarillo**, **9 unidades** en vez de Básico / Análisis / Álgebra, y sección **Interactivos** con todos los de una unidad en la misma página.

Hecho y publicado:
- **9 unidades** (carpetas nuevas en `contenido/temas/`, definidas en `contenido/sitio.md` junto con las 3 etapas: Para arrancar, Funciones, Para 4.º y 5.º año). Los links de los temas no cambiaron.
- **Lista de Temas nueva**: etapas → unidades que se abren con un toque (`ArbolDeTemas.astro`). `alumnos/#unidad` abre esa unidad.
- **Botón de volver** arriba de cada tema (`Volver.astro`) y **siguiente / anterior** al final (`AnteriorSiguiente.astro`), también en las notas de tutores.
- **Diseño Carpeta**: colores en `global.css` (la hoja en `:root`, el pizarrón en `.interactivo, .pizarron`), tipografías Fraunces (títulos) y Atkinson Hyperlegible (texto). Los gráficos leen los colores del pizarrón donde están.
- **Inicio nuevo** (`index.astro`, textos en `contenido/paginas/inicio.md`), **logo** (`Logo.astro`, `public/favicon.svg`).
- **Sección Interactivos** (`src/pages/interactivos/`, texto en `contenido/paginas/interactivos.md`). El Laboratorio vive ahí adentro; la barra queda Inicio · Temas · Interactivos · Tutores · Notación.
- **Notación** rehecha: índice arriba, fichas "símbolo | qué quiere decir" y leyenda de colores (`contenido/paginas/notacion.md`). En el .md, un renglón de lista que empieza con **negrita** se vuelve ficha.
- A los alumnos, la parte "Intuición" se les muestra como **"Para probar"** (el .md sigue diciendo `## Intuición`).

Falta de esta revisión:
- La devolución de Mati sobre lo publicado.
- **Sección de tutores completa (publicada):** los 43 temas tienen los seis apartados (Objetivo, Antes tiene que saber, Errores típicos, **Cómo destrabarlo** —nuevo—, En el pizarrón, Preguntas para el alumno), sin ningún "(para completar)". "Cómo usar esta página en una clase" (`contenido/paginas/como-usar.md`) quedó ampliada. Falta que Mati lea las notas y las corrija a su gusto.
- Revisar con calma cada interactivo en el celular con el diseño nuevo (se probaron cuadrática, lineal, balanza, sistemas 3×3 y la galería de la unidad 9, sin errores).
- Ideas propuestas, sin hacer: índice dentro del tema, botón "compartir por WhatsApp", buscador de temas, gráfico pegajoso, glosario al tocar.

### Tema nuevo: Límites (sesión 7, 12/11/2026) — publicado, falta la revisión de Mati
- Pedido de Mati: un tema de límites antes de derivadas. Va primero en la unidad 7, que pasó a llamarse **"Límites y derivadas"** (`contenido/temas/derivadas/limites.md`).
- Interactivo nuevo `limite`: dos puntos (lila por izquierda, rosa por derecha) que se acercan a *a* con **Acercarse a a** (d = 1, 0.1, 0.01, 0.001, animado). Tablita x | f(x) con *a* en el medio, que se llena desde las puntas. Dice si el límite existe y por qué: **hueco** (0 : 0), **continua**, **salto** o **infinito** (asíntota vertical). Casilla "Qué pasa justo en a".
- Ejemplos en el campo `limites:` del tema, como `{ f: "(x^2 - 1) : (x - 1)", a: 1 }` (también partidas).
- 10 ejercicios en dos niveles (reemplazar, tabla, salto; 0 : 0 con factor común y diferencia de cuadrados; infinito; x → ∞). Notas para tutores completas.
- "¿Qué es la derivada?" ahora enlaza a límites. Notación: sumados lím y los límites laterales.
- Pieza nueva: `src/lib/limites.js`.

## Hecho

### Etapa 0 — Base y prototipo ✅ (aprobada por Mati)
- Proyecto Astro, contenido en `contenido/` (Markdown), publicación automática en GitHub Pages.
- Diseño aprobado: pizarra gris azulada, Nunito, colores fijos por concepto (ver `src/styles/global.css`), navegación abajo en el celular.
- Módulo de graficado 2D (`src/lib/grafico/`): plano, zoom con dos dedos, animación de puntos, deslizadores, casillas y puntos arrastrables. Ahora también tiene un **modo recta numérica** (`soloEjeX`) y `mostrarRango()` para que la vista siga lo que se está mostrando.
- **Cuadrática** (después de la devolución de Mati):
  - Botón **Polinómica / Canónica**. Arranca en la polinómica, ax² + bx + c. Al cambiar de forma, la parábola queda igual y cambian los deslizadores.
  - Casillas prendidas por defecto: raíces, vértice y animación. El resto arranca apagado.
  - Con a = 0 en la forma polinómica, avisa que queda una función lineal.
  - Texto más corto y en ítems. 6 ejercicios, casi todos en forma polinómica. Notas para tutores genéricas.

### Etapa 1 — Básico ✅ (completa; falta la revisión de Mati)
- **Distributiva y factor común** (`distributiva-y-factor-comun.md`): interactivo `distributiva`, con el **modelo de área**.
  - Un rectángulo que con el botón **Separar / Juntar** se separa en pedazos o se vuelve a juntar (animado). Separar es distribuir y juntar es sacar factor común: el mismo dibujo, en los dos sentidos.
  - Tres modos: con números, con *x* (multiplica un número o *x*, con *x* · *x* = *x*²) y dos paréntesis (*x* + a)(*x* + b), que da 4 pedazos.
  - Con a = b avisa que (*x* + a)² **no** es *x*² + a².
  - 8 ejercicios. Subsección nueva: "Operaciones con letras".
- **Revisión del Básico** (pedido de Mati):
  - **Recuadro "Para recordar"** en todos los temas: se escribe con `## Para recordar` y se muestra como un recuadro amarillo, sin número, después de la explicación.
  - **Ejercicios en dos niveles**, "Para arrancar" y "Para animarse": se escribe con `### Nivel: Para arrancar` antes de los ejercicios de ese nivel.
  - Tema nuevo **"Múltiplos y divisores: mcm y mcd"** (interactivo `mcm-mcd`). En el mcm se salta de a *a* por arriba y de a *b* por abajo, y se ve dónde caen los dos. En el mcd están las listas de divisores, con los comunes marcados. Va antes de fracciones.
  - Tema nuevo **"Términos semejantes"** (interactivo `terminos`): con fichas de álgebra (barrita = *x*, cuadradito = 1, negativas rojas). "Agrupar" las hace viajar a su grupo y un positivo con un negativo se anulan. Es el puente a ecuaciones.
- `COMO-EDITAR.md`: se agregó el aviso de poner entre comillas los textos del encabezado que tengan ": ".
- **Sumar y restar con signos** (`contenido/temas/basico/sumar-y-restar-con-signos.md`): interactivo de **recta numérica** (`recta-signos`).
  - Se arranca en *a* y se dan saltitos de a uno: verdes a la derecha y rojos punteados a la izquierda.
  - Botón Sumar / Restar. Al restar se muestra que es sumar el opuesto: 8 − (−9) = 8 + 9 = 17.
  - Los dos puntos se pueden arrastrar con el dedo.
  - 8 ejercicios, 2 de ellos con *x* (reemplazar *x* por un negativo).
- **Multiplicar y dividir con signos** (`multiplicar-y-dividir-con-signos.md`): interactivo `recta-multiplicacion`.
  - **Multiplicar** a · b: desde el 0 se hacen |a| saltos de tamaño b. Si a es negativo, todo se **da vuelta como en un espejo en el 0**, con animación y los saltos de antes en "fantasma". Así se ve por qué menos por menos da más.
  - **Dividir** a : b: ¿cuántos saltos de b hacen falta para llegar a a? Si hay que saltar al revés, la cantidad es negativa. Avisa que no se puede dividir por 0.
  - Debajo hay una tablita con la regla de los signos que marca el caso que se está usando.
  - 9 ejercicios, 2 con *x*.
- Los saltos de la recta ahora son una pieza compartida: `src/lib/grafico/saltos.js`.
- **Orden de las operaciones** (`orden-de-las-operaciones.md`): interactivo `orden-operaciones`.
  - Se resuelve una cuenta de a un paso, renglón por renglón como en el pizarrón. En cada paso se marca la operación que toca y la regla que se usa.
  - Casilla **Separar en términos**: encierra cada término en una cajita.
  - **Las cuentas se eligen en el archivo del tema** (campo `cuentas:`), así que Mati puede agregar o cambiar las suyas.
  - El motor que lee y resuelve las cuentas (`src/lib/expresiones.js`) sirve para temas futuros, por ejemplo la distributiva.
  - 9 ejercicios.
- Convención confirmada: **·** para multiplicar y **:** para dividir. Ya está en la página de Notación.
- **División: cociente y resto** (`division-cociente-y-resto.md`, pedido de Mati): interactivo `galera`.
  - La división con la galera, paso a paso: qué número tomo, cuántas veces entra el divisor, el producto que se resta, el resto y la cifra que se baja. Avisa del **0 en el cociente** cuando no alcanza.
  - Un puntito marca las cifras del dividendo que ya se usaron. Al final hace la comprobación: divisor · cociente + resto.
  - Casilla **Tabla del divisor**: marca el producto elegido y tacha el siguiente, que "se pasa".
  - Ejemplos elegibles (campo `divisiones:` del tema) y un formulario para probar una división propia.
  - 7 ejercicios. Va antes de fracciones.
- **Qué es una fracción** (`que-es-una-fraccion.md`): interactivo `fraccion`.
  - Muestra a/b con barras (cada barra es 1 entero) y en la recta numérica, y siempre recalca que **la fracción ES una división**: a/b = a : b = decimal.
  - Si a > b, lo conecta con la galera (cociente = enteros, resto = lo que sobra).
  - Casilla **Simplificar**: las líneas de corte se afinan y quedan las gruesas cada g pedazos.
  - 6 ejercicios.
- **Operaciones con fracciones** (`operaciones-con-fracciones.md`): interactivo `fracciones-operaciones`, paso a paso.
  - **Sumar y restar:** las barras se "recortan" hasta tener pedazos del mismo tamaño (mcm) y después se juntan o se tachan. Si la resta da negativo, lo muestra.
  - **Multiplicar:** "la parte de una parte", en un cuadrado cortado en columnas y filas; el cruce da a·c de b·d. Solo dibuja cuando las fracciones son menores que 1.
  - **Dividir:** la segunda fracción **se da vuelta como una carta** (animación 3D) y el ":" se convierte en "·", con el porqué: la fracción es una división.
  - Siempre termina simplificando y dando el decimal. 8 ejercicios (las respuestas se pueden escribir como fracción o como decimal).
- **Potencias y raíces** (`potencias-y-raices.md`): interactivo `potencias`, con tres modos.
  - **Qué es:** aⁿ con fichas que aparecen de a una. Para n = 2 dibuja el cuadrado (de ahí "al cuadrado") y para n = 3 el cubo (de ahí "al cubo"). Con base negativa explica par/impar, y la casilla "¿Y sin paréntesis?" muestra la trampa −2⁴ ≠ (−2)⁴. Para 0⁰ avisa que no está definido.
  - **Propiedades:** con fichas *a*. Al multiplicar se juntan (los exponentes se suman); al dividir se tachan de a pares, y de ahí salen **a⁰ = 1** y los **exponentes negativos**; la potencia de potencia se ve como grupos.
  - **Raíces:** la raíz cuadrada es el lado de un cuadrado de área dada, sobre una cuadrícula. Si no da justo, dice entre qué números está.
  - 11 ejercicios.
- Básico ahora tiene tres subsecciones (Operaciones, Fracciones, Potencias y raíces), así que en la lista de Temas aparecen como subcarpetas.
- Arreglado: la "Tabla del divisor" (y el botón "Repetir" de la cuadrática) no se ocultaban al apagarlos.
- **Listas de Temas y de Tutores en carpetas desplegables** (pedido de Mati): sección → subsección → temas. Las subsecciones se vuelven carpetas cuando una sección tiene más de una. En Tutores, "Cómo usar esta página en una clase" también va en una carpeta.

### Etapa 2 — Ecuaciones e inecuaciones ✅ (completa; falta la revisión de Mati)
Mati eligió: 4 temas, balanza con paso a paso automático, y recta numérica para las inecuaciones. Van en Análisis, subsección "Ecuaciones e inecuaciones" (antes de Funciones).
- **¿Qué es una ecuación?** (`que-es-una-ecuacion.md`): interactivo `balanza` en modo `probar`.
  - Fichas como en Términos semejantes (barrita = *x*, cuadradito = 1). Con un deslizador se elige cuánto vale *x* (cada barrita muestra su peso) y la balanza se inclina hacia el lado que pesa más.
  - Cuando se equilibra, avisa que ese valor es la solución. Si no, dice si conviene probar un número más grande o más chico. Abajo quedan los valores probados (✓ / ✗).
  - 6 ejercicios (verificar soluciones).
- **Resolver ecuaciones** (`resolver-ecuaciones.md`): la misma `balanza` en modo `resolver`, paso a paso con **Siguiente paso**.
  - Orden: juntar las *x* (del lado que tiene más), sacar el número de ese lado y repartir en grupos (dividir). Si la *x* queda a la derecha, al final se da vuelta.
  - "Sacar" se ve como fichas negativas que llegan y se anulan con las positivas; "dividir" se ve como grupos iguales, de los que queda uno.
  - Al costado de cada renglón se anota lo que se hizo ("+ 3 de los dos lados").
  - Casos raros: sin solución (la balanza se desequilibra, 1 = 3) y solución no entera (x = 5/2 = 2.5).
  - Las ecuaciones se eligen en el archivo del tema (campo `ecuaciones:`). Máximo 20 fichas por lado; si no, el armado avisa.
  - 7 ejercicios.
- **Desigualdades e intervalos** (`desigualdades-e-intervalos.md`): interactivo `intervalos`.
  - "Una punta" (x > a, ≥, <, ≤) o "Entre dos números" (a < x ≤ b, etc.). Se pinta en la recta y se escribe como intervalo.
  - Punto relleno + corchete = está; punto hueco + paréntesis = no está. Las puntas se arrastran con el dedo.
  - Casilla **Probar un número**: un punto que dice si el número está o no.
  - 7 ejercicios.
- **Resolver inecuaciones** (`resolver-inecuaciones.md`): interactivo `inecuacion`.
  - Primero se prueban números (deslizador o arrastrando): cada uno queda marcado con punto verde (cumple) o cruz roja (no cumple).
  - **Resolver paso a paso**: igual que una ecuación, y cuando se divide por un negativo **el signo gira** (animado y resaltado). Al final se pinta la solución en la recta.
  - Casos ℝ y ∅. Las inecuaciones se eligen en el tema (campo `inecuaciones:`).
  - 7 ejercicios.
- **Color nuevo de uso:** "cumple / es solución" va en **verde** (el mismo de C⁺) y "no cumple" en **rojo** con cruz. Tiene sentido: más adelante, C⁺ es justamente la solución de f(x) > 0.
- Piezas nuevas compartidas: `src/lib/lineal.js` (lee ecuaciones e inecuaciones y arma los pasos), `src/lib/flip.js` (animación de fichas que viajan) y `src/lib/grafico/intervalo.js` (pintar intervalos en la recta).

### Etapa 3 — Funciones ✅ (completa; falta la revisión de Mati)
A Mati le gustó el orden de los temas de la Etapa 2. La cuadrática y la animación de puntos ya estaban de la Etapa 0; esta etapa sumó dos temas, en la subsección "Funciones" (antes de la cuadrática).
- **¿Qué es una función?** (`que-es-una-funcion.md`): interactivo `funcion`, "la máquina".
  - Entra un *x* (deslizador o arrastrando el punto), la regla hace la cuenta y sale *f*(*x*): se ve "f(1) = 2 · 1 + 1 = 3 → punto (1, 3)".
  - Cada número probado va a la tabla y queda como punto en el gráfico. **Probar todos** llena de −4 a 4. **Unir los puntos** dibuja la curva: "si probáramos con todos los números…".
  - Con 6 : *x* y *x* = 0: "no se puede, el 0 no está en el dominio", y la curva se corta en el 0.
  - Las funciones se eligen en el tema (campo `funciones:`), escritas como "2x + 1", "x^2", "6 : x".
  - 6 ejercicios. La explicación incluye dominio e imagen.
- **Función lineal** (`funcion-lineal.md`): interactivo `lineal`, f(x) = mx + b con deslizadores *m* y *b*.
  - Casillas: raíz (prendida), ordenada al origen, pendiente (triángulo "avanzo 1, subo m"), C⁺ y C⁻, crece o decrece. Animación de puntos (prendida) y tabla (apagada), igual que la cuadrática.
  - La raíz se muestra **despejando la ecuación** (2x − 4 = 0 → 2x = 4 → x = 2) y C⁺ como la inecuación f(x) > 0: conecta con la Etapa 2.
  - Con *m* = 0 avisa que es una función constante.
  - 7 ejercicios.
- Piezas nuevas compartidas: `src/lib/formula.js` (lee fórmulas con *x*, las escribe lindas y hace la cuenta reemplazando; sirve para el Laboratorio) y `src/lib/grafico/signos.js` (C⁺/C⁻ y crece/decrece, ahora compartido por la cuadrática y la lineal; sirve para los polinomios).
- Arreglados dos links viejos en la cuadrática (a "potencias" y "ecuaciones").

### Etapa 4 — Polinómicas y Laboratorio ✅ (completa; falta la revisión de Mati)
- **Funciones polinómicas** (`funcion-polinomica.md`): interactivo `polinomica`. Mati eligió la forma **con las raíces**: f(x) = a(x − r₁)(x − r₂)…
  - Se elige el **grado de 1 a 5**. Grado 1 avisa que es una lineal y grado 2 una cuadrática: son casos particulares.
  - Las raíces se **arrastran sobre el eje x** (de a 0.5, así es fácil juntar dos) o con deslizadores. Debajo de la fórmula aparece el polinomio desarrollado.
  - Si dos raíces coinciden: "raíz doble, toca y rebota".
  - Casillas: raíces (prendida), ordenada, máximos y mínimos, puntos de inflexión, C⁺ y C⁻, crece y decrece. Animación (prendida) y tabla (apagada). Los extremos y las inflexiones se calculan con números.
  - Los puntos de inflexión van en lila (como los extremos), pero con un círculo hueco en vez de rombo.
  - Dice cómo son las puntas: según el grado y el signo de *a*, de dónde viene y a dónde va la curva.
  - 7 ejercicios.
- Pieza nueva compartida: `src/lib/polinomios.js` (desarrollar, evaluar, derivar, buscar dónde cambia el signo).
- No hay botón para cambiar a "forma con coeficientes" (a₃x³ + a₂x² + …): queda para más adelante si Mati lo quiere.
- **Laboratorio de funciones** ✅ (página `laboratorio/`, texto en `contenido/paginas/laboratorio.md`): interactivo `laboratorio`.
  - 13 funciones base: *x*, x², x³, |x|, √x, 1/x, sen, cos, tan, eˣ, kˣ, ln, logₖ. La base de kˣ y logₖ se llama **k** (no *a*, porque *a* ya es un deslizador); tiene su propio deslizador.
  - Transformación a · f(b(x − c)) + d con 4 deslizadores. Arranca en (x − 2)² − 1 para que ya se vea algo.
  - La original queda en gris punteada (casilla "Original", prendida).
  - Debajo de la fórmula dice qué le pasó comparada con la original ("corrida 2 a la derecha y bajada 1").
  - Casillas: raíces (prendida), ordenada, máximos y mínimos, C⁺ y C⁻, crece y decrece, **asíntotas** y **dominio e imagen** (estas dos son nuevas, porque estas funciones las tienen).
  - En las que se repiten (sen, cos, tan) los intervalos se escriben con "… ∪ … ∪ …" y "se repiten cada …".
  - Botón "Volver a la original". Avisos para b = 0 y base 1.
  - La línea "(interactivo)" en el `.md` de una página marca dónde va el interactivo.
- Pieza nueva: `src/lib/funcionesBase.js` (cada función base con su dominio, imagen, asíntotas, raíces y extremos; las cuentas salen exactas usando la inversa).

### Etapa 5 — Otras funciones ✅ (completa; falta la revisión de Mati)
Mati pidió dejar **composición e inversa para el final** de la etapa; el resto, en el orden que convenga.
- **Función exponencial** (`funcion-exponencial.md`): interactivo `exponencial`, f(x) = a · kˣ con deslizadores *k* (la base) y *a* (donde arranca).
  - **Saltos ×k** (prendida): escalones lilas "avanzo 1, multiplico por k", como el triángulo de la pendiente de la lineal.
  - **Comparar con una lineal**: la recta que arranca igual y pasa por el mismo (1, f(1)), en gris punteado. La lineal suma, la exponencial multiplica.
  - Casillas: ordenada (prendida), asíntota, crece o decrece, dominio e imagen. Avisos para *k* = 1 y *a* = 0.
  - 8 ejercicios.
- **Función logarítmica** (`funcion-logaritmica.md`): interactivo `logaritmica`, f(x) = logₖ(x) con deslizador *k*.
  - **Un punto que se arrastra** sobre la curva y arriba se lee "log₂(8) = 3 porque 2³ = 8". Se "pega" a las potencias justas de *k*.
  - **Saltos** (prendida): ×k en *x* → +1 en *y* (la exponencial al revés).
  - **Espejo con la exponencial**: kˣ en gris, la recta y = x y el punto espejado.
  - Casillas: raíz (prendida), C⁺ y C⁻, asíntota, crece o decrece, dominio e imagen (raya la zona x ≤ 0: "acá no hay log"). Aviso para *k* = 1.
  - 9 ejercicios.
- **Funciones trigonométricas** (`funciones-trigonometricas.md`): interactivo `trigonometrica`. Mati eligió **un solo tema** con botón Seno / Coseno / Tangente, y un **botón Grados / Radianes** (arranca en grados).
  - A la izquierda, una circunferencia de radio 1 con un punto que gira. A la derecha, la onda, que se va dibujando: lo recorrido fuerte y lo que falta suave.
  - Seno = la altura del punto (línea punteada horizontal hasta la onda). Coseno = cuánto se corre a la derecha. Tangente = dónde el radio alargado corta la recta vertical de la derecha; en 90° y 270° dice "no existe".
  - El ángulo se mueve arrastrando el punto (en la circunferencia o en la onda), con el deslizador, o con **Dar una vuelta** (animación de 7 segundos). Se pega a los ángulos lindos (30°, 45°, 60°, 90°…).
  - Arriba se lee "x = 30° → sen(30°) = 0.5" (o con π/6 en radianes).
  - Casillas: ceros (prendida), máximos y mínimos, C⁺ y C⁻ (en una vuelta), período (aleja la vista para ver dos vueltas), asíntotas (solo en la tangente), dominio e imagen.
  - La onda está "apretada" a lo ancho (el ángulo se dibuja a la mitad de su tamaño en radianes) para que la circunferencia y la onda entren en el celular.
  - 10 ejercicios. No tiene animación de puntos ni tabla: la vuelta del punto cumple ese papel.
  - Página de Notación: sección nueva "Ángulos" (grados y radianes, sen / cos / tan).
- **Módulo, raíz y homográfica**: tres temas (`funcion-modulo.md`, `funcion-raiz.md`, `funcion-homografica.md`) con **un interactivo común**, `familia`. Cada tema elige el suyo con el campo `familia:` (modulo, raiz u homografica).
  - Forma a · f(x − h) + k, con deslizadores *a*, *h* y *k*, como la forma canónica de la cuadrática: |x − h|, √(x − h) y a / (x − h).
  - **Un punto que se arrastra** sobre la curva y arriba muestra la cuenta: "|−1 − 2| = |−3| = 3", "√(2 + 2) = √4 = 2", "2 : (1.2 − 1) = 10". Avisa cuando no existe (raíz de un negativo, dividir por 0).
  - Lo propio de cada una:
    - Módulo: casilla **Sin el módulo** (la recta, con flechas que muestran cómo "rebota") y el vértice prendido.
    - Raíz: **Punto de arranque** (prendido), **Parábola acostada** (la otra mitad en gris) y la zona sin raíz rayada.
    - Homográfica: asíntotas prendidas, la forma "(x + 1) / (x − 1)" debajo de la fórmula, y una explicación de por qué aparecen las asíntotas.
  - Casillas comunes: raíces, ordenada, C⁺ y C⁻, crece y decrece, dominio e imagen. Animación (prendida) y tabla.
  - 7, 7 y 7 ejercicios.
- **Funciones partidas** (`funciones-partidas.md`): interactivo `partida`.
  - Los ejemplos se escriben en el tema (campo `partidas:`) casi como en el pizarrón: `"x + 2 si x < 1 ; 3 si x >= 1"`. Se pueden usar 2 o 3 tramos (o más), con condiciones como x < 1, x >= 1 o -2 <= x < 2. Si uno está mal escrito, el armado avisa. Las flechitas ‹ › pasan de un ejemplo a otro.
  - La fórmula se muestra con la **llave**, y se resalta el renglón que se está usando.
  - **Un punto que se arrastra** y arriba dice: "x = −2: como −2 < 1, uso x + 2 → f(−2) = −2 + 2 = 0".
  - En los cortes: punto **lleno** si el extremo está incluido, **hueco** si no (como corchete y paréntesis).
  - Con dos tramos: un deslizador **mueve el corte** ("¿dónde tiene que estar para que no salte?") y un botón **cambia de qué lado va el punto del corte** (≤ / <).
  - Casillas: **saltos** (prendida: "salta 2" o "se pega"), fórmulas enteras (cada fórmula completa en gris), dominio. Animación (prendida) y tabla.
  - 4 ejemplos (uno es el módulo escrito como partida) y 7 ejercicios.
  - Pieza nueva: `src/lib/partidas.js` (lee las funciones partidas).
- **Composición de funciones** (`composicion-de-funciones.md`): interactivo `composicion`.
  - Dos **máquinas en cadena**, una debajo de la otra: 2 → [g: x + 1] → 3 y 3 → [f: x²] → 9, con las cuentas debajo.
  - La fórmula de la compuesta se arma sola, reemplazando la x de f por toda g, con paréntesis solo donde hacen falta: (x + 1)², 2(x − 3), x² + 5.
  - Botón **Dar vuelta el orden** (f ∘ g ↔ g ∘ f). Casilla **¿Y al revés?** (prendida): muestra que casi siempre da otra cosa. Casilla f y g por separado (en gris).
  - Los ejemplos van en el tema (campo `composiciones:`, cada uno con f y g). 4 ejemplos y 6 ejercicios.
- **Función inversa** (`funcion-inversa.md`): interactivo `inversa`.
  - Un punto que se arrastra sobre f y su **espejo** sobre f⁻¹ (en rosa), unidos por una línea que cruza la recta y = x. Arriba: "f(1) = 3 → f⁻¹(3) = 1".
  - Si f es lineal: **el despeje paso a paso** (y = 2x + 1 → y − 1 = 2x → x = (y − 1) : 2) y la fórmula de f⁻¹. Con −x + 4 avisa que es su propia inversa.
  - Si f no es inyectiva (x²): el espejo sale rojo punteado, con los dos puntos, y "¿f⁻¹(4) es 2 o −2? No se sabe". La casilla **Quedarse con una mitad** lo arregla.
  - Los ejemplos van en el tema (campo `inversas:`): 2x + 1, −x + 4, x³, 2ˣ (su inversa es el log₂) y x². 7 ejercicios.
  - Color nuevo de uso: **la inversa va en rosa** (el color de la ordenada), con la etiqueta f⁻¹.
- Pieza nueva: `src/lib/analisisFuncion.js`, con los textos de raíces, C⁺/C⁻, asíntotas, dominio, etc. que antes estaban solo en el Laboratorio. Ahora la usan el Laboratorio y los tres temas nuevos.
- Piezas compartidas: el `Plano` acepta números propios en el eje x (`ejeX`, para 90° o π/2) y el deslizador acepta un `formato` para mostrar su valor.
- Links nuevos en los textos: `[Laboratorio](pagina:laboratorio)` apunta a una página suelta (anotado en `COMO-EDITAR.md`).

### Devolución de las Etapas 1 a 5 (sesión 5)
- A Mati le pareció bien todo. Único pedido: **líneas y puntos más finos** en los gráficos, para que no se vean sobrecargados con muchas casillas prendidas.
  - Se hizo en el módulo de graficado (`factorGrosor` en `plano.js`): en los gráficos de funciones todo va al 65 % del grosor (los puntos, un poco menos achicados). La recta numérica de Básico y Ecuaciones queda igual.
- **Estética: más adelante la pareja de Mati va a armar un sistema de diseño en Figma** y se va a cambiar el diseño. Conviene seguir usando los colores de `global.css` (variables) para que el cambio sea fácil.

### Etapa 6 — Derivadas ✅ (completa; falta la revisión de Mati)
Mati aprobó todas las propuestas. Subsección nueva "Derivadas" en Análisis, con 3 temas. (Primero eran 4; Mati pidió **unir "¿Qué es la derivada?" con "Derivada por definición"**.)
- **¿Qué es la derivada?** (`que-es-la-derivada.md`): interactivo `secante` (6.a). Incluye la parte "Por definición" (el límite, primero con números y después con *x*).
  - Punto azul (x, f(x)) y punto blanco (x + h, f(x + h)), con la secante. Los dos se arrastran (el blanco cambia *h*). Deslizadores *x* y *h*; *h* puede ser negativo.
  - Arriba: "pendiente de la secante = (f(x + h) − f(x)) : h" con los números puestos.
  - Botón **Achicar h**: *h* va hacia 0 (10 veces más chico cada 2 segundos, hasta 0.001). Con *h* ≤ 0.01 la secante se pinta naranja: "¡ya casi es la tangente!".
  - Tablita h | pendiente (1, 0.5, 0.1, 0.01, 0.001) que se va llenando, y "Se acerca a 2: esa es la derivada".
  - Casillas: triángulo *h* y lo que sube (prendida), recta tangente, **Con h en la cuenta** (apagada: muestra la pendiente escrita con *h*, "2 + h", y qué queda al achicar *h*).
  - 10 ejercicios.
- **La gráfica de f'(x)** (`grafica-de-la-derivada.md`): interactivo `recorrer` (6.b).
  - Arriba la curva con un punto que se arrastra y una **flechita de largo 1** en la dirección de la tangente: turquesa si crece, terracota si decrece, lila si está acostada (se "pega" en los puntos con f' = 0).
  - Abajo, con el mismo eje x, se dibuja f' **desde el borde izquierdo hasta el punto** (si el punto vuelve, se borra). Los dos gráficos se mueven y hacen zoom juntos.
  - Botón **Recorrer solo**. Casillas: fórmula de f' (apagada), recta tangente, f' entera "para comprobar".
  - Si f' no entra, el eje y de abajo se achica y lo avisa.
  - 7 ejercicios.
- **Derivar polinomios y tabla de derivadas** (`derivar-polinomios.md`): el mismo `recorrer` con `formula: true`. Regla de xⁿ, término a término, y tabla (sen, cos, eˣ, ln). 8 ejercicios.
- Las funciones de los interactivos se eligen en el tema (campo `funciones:`): polinomios como "x^3 - 3x", y también "sen(x)", "cos(x)" y "e^x". La fórmula de f' sale sola (para los polinomios, se averiguan los coeficientes probando números).
- Color: **la derivada va en naranja** (ya estaba reservado en `global.css`).
- Piezas nuevas: `src/lib/derivadas.js`; el `Plano` acepta `relacionY` (eje y con otra escala) y `factorGrosor`.

### Etapa 7 — Integrales ✅ (completa; falta la revisión de Mati)
Mati eligió: altura de las tiras a la izquierda con botón para cambiar, dx que se achica **a la mitad, animado**, tiras de abajo del eje **rojas y que restan**, y 4 temas. Subsección nueva "Integrales" en Análisis.
- **¿Qué es la integral?** (`que-es-la-integral.md`): interactivo `integral` (7.a).
  - Tiras entre *a* y *b* (rombos violetas que se arrastran, de a 1). Arriba: "dx = 0.25 → 12 tiras" y "Σ f(x) · dx = 7.91".
  - **Achicar dx**: cada tira se parte en dos (animado), dx = 1, 0.5, 0.25… hasta 1/32, y al final las tiras **se funden** en el área: "∫₀³ f(x) dx = 9".
  - Botones **Izquierda / Medio / Derecha** para la altura de las tiras (puntitos blancos). Tablita dx | suma.
  - Verde arriba del eje (suma), rojo abajo (resta).
  - 7 ejercicios.
- **La integral acumulada** (`integral-acumulada.md`): interactivo `acumulada` (7.b), espejo de "La gráfica de f'(x)".
  - Arriba se pinta el área desde *a* hasta el punto; abajo se dibuja F(x) en violeta. Casillas: pendiente de F (muestra que F' = f), fórmula de F, F entera. Botón Recorrer solo.
  - 7 ejercicios.
- **Regla de Barrow y primitivas** (`regla-de-barrow.md`): el mismo `integral` con `barrow: true` (casilla con la cuenta F(b) − F(a), con fracciones apiladas). Tabla de primitivas. 7 ejercicios.
- **Área entre dos curvas** (`area-entre-curvas.md`): el mismo `integral`, con ejemplos "x + 2 ; abajo: x^2 ; de -1 a 2". Las tiras van de *g* (rosa) a *f* (azul); si se cruzan, las tiras rojas avisan. 6 ejercicios.
- Cómo se escriben los ejemplos (campo `integrales:`): `"x^2 ; de 0 a 3"`, `"x + 2 ; abajo: x^2 ; de -1 a 2"` o `"x^2 - 1 ; desde 0"` (para la acumulada). Los extremos, enteros.
- Color: **la integral va en violeta** (ya reservado en `global.css`).
- Pieza nueva: `src/lib/integrales.js` (leer ejemplos, primitivas, fracciones lindas, Simpson).

### Etapa 8, parte 1 — Sistemas de ecuaciones ✅ (completa; falta la revisión de Mati)
Mati aprobó las Etapas 6 y 7 ("muy bien") y eligió: los **4 métodos** para 2×2 (sustitución, igualación, reducción y determinantes), Gauss **hasta escalonada y después pasos opcionales hasta los planos "derechos"**, la notación **F₂ − 2·F₁ → F₂** (ya en la página de Notación) y **5 temas**. Subsección nueva "Sistemas de ecuaciones" en Álgebra.
- Un solo interactivo, `sistema`, con tres modos (campo `modo:` del tema). Los 2×2 se dibujan con rectas (gráfico 2D de siempre) y los 3×3 con planos en 3D.
  - `explorar`: rectas o planos, el punto solución (amarillo) y un cartel con la clasificación (CD verde, CI amarillo, I rojo, siempre con el nombre escrito). En los 2×2, las rectas se mueven arrastrando dos puntitos huecos (de a números enteros). Casillas: la solución, despejar *y* (2×2), rectas de corte y plano 1/2/3 (3×3).
  - `gauss` (8.a): matriz ampliada y botones Anterior / **Siguiente paso** / Empezar de nuevo. En cada paso la recta o el plano que cambia **gira** (queda la posición anterior en gris punteado) y la solución no se mueve. Avisa cuando queda escalonada, cuando aparece 0 = 0 o 0 = 5, y al final ("los planos quedaron derechos"). Los pasos los elige la página sola (sin fracciones: si hace falta, multiplica) o se escriben en el tema.
  - `parametro` (8.b): deslizador de *k* arriba del gráfico, con imán en los valores especiales (donde el determinante da 0). El cartel cambia solo.
- Temas: **Sistemas 2×2: dos rectas** (los 4 métodos en el ejemplo resuelto), **Clasificación de sistemas**, **Sistemas 3×3: tres planos**, **Método de Gauss**, **Sistemas con parámetro k**. Entre 4 y 6 ejercicios cada uno.
- Colores nuevos: **ecuación 1 azul, 2 naranja, 3 rosa** (`--c-ec1/2/3`), con su número al lado.
- Piezas nuevas: `src/lib/sistemas.js` (leer sistemas, fracciones exactas, pasos de Gauss, clasificación) y `src/lib/grafico/espacio.js` (gráficos 3D con **Three.js**: planos recortados en una caja, rectas, puntos, etiquetas; se gira con un dedo y se acerca con dos). Three.js pesa unos 130 KB y **solo se descarga en las páginas con 3×3**.

### Etapa 8, parte 2 — Matrices, vectores y planos ✅ (completa; falta la revisión de Mati)
Mati eligió: **4 temas**, **sin espacios vectoriales** (por ahora), determinante 3×3 **por Sarrus y por la primera fila**, y el producto **fila por columna, paso a paso**. Subsecciones nuevas en Álgebra: "Matrices" y "Vectores y planos".
- **Matrices y sus operaciones** (`matrices.md`): interactivo `matrices`. Cuentas paso a paso (Siguiente / Anterior / Todo junto): suma y resta casillero por casillero, producto por un número, y producto con la fila de A (azul) y la columna de B (naranja) resaltadas. Muestra los tamaños (2×3 · 3×2 → 2×2). 6 ejercicios.
- **Determinante** (`determinante.md`): dos interactivos.
  - Arriba, `determinante`: las filas son dos flechas que se arrastran y el paralelogramo es verde (det > 0) o rojo (det < 0); con det = 0 se aplasta. Casilla "Rectángulo menos triángulos".
  - Al final de la explicación, `matrices` con cuentas `det(...)`: 2×2 con las dos diagonales; 3×3 con un selector **Sarrus / Por la primera fila** (diagonales verdes que suman y rojas que restan; o el número, su fila y columna tachadas y el 2×2 que queda).
  - 5 ejercicios.
- **Vectores** (`vectores.md`): interactivo `vectores`. Dos flechas (u azul, v naranja) que se arrastran, con cuatro operaciones: suma (una a continuación de la otra), resta, por un número (deslizador k) y producto escalar (con el ángulo; si da 0, marca el ángulo recto). Casillas: componentes y módulo. El espacio (3 componentes) va en el texto. 6 ejercicios.
- **Ecuación del plano** (`ecuacion-del-plano.md`): interactivo `plano3d`. El plano en 3D con deslizadores a, b, c, d (enteros), el vector normal (lila) y la casilla "Cortes con los ejes". Ejemplos en el campo `planos:`. 5 ejercicios.
- Nuevo: un tema puede tener **un segundo interactivo** al final de la explicación (campo `interactivo2:` del tema). También se muestra en la página de tutores.
- Piezas nuevas: `src/lib/matrices.js` (leer cuentas y armar los pasos); `Espacio` ahora también dibuja flechas en 3D.

## Falta
- Que Mati revise la Etapa 8 (partes 1 y 2). **Con esto, la hoja de ruta de `CLAUDE.md` está completa.**
- Lo que queda anotado para después: revisar el orden, las secciones y los nombres de los temas; el glosario al tocar una palabra; el gráfico "pegajoso" en el celular; las guías imprimibles (al final de todo); y quizás espacios vectoriales.
- Posible más adelante: ecuaciones con paréntesis (2(x + 1) = 8) o con fracciones. Por ahora la balanza solo entiende números enteros, *x*, + y −.
- **Guía imprimible: al final de todo** (decisión de Mati).

## Decisiones tomadas en la sesión 2
- Convenciones confirmadas por Mati:
  - ℝ y ∅.
  - Intervalos de crecimiento abiertos en el vértice.
  - "≈" con 2 decimales para lo que no es exacto.
- La tabla x | f(x) queda opcional y apagada.
- Los textos de alumnos y tutores van cortos y genéricos. Mati los va a escribir después.

## Ideas anotadas (sin hacer)
- **Glosario al tocar una palabra** (idea de Mati): tocar o señalar con el mouse una palabra formal (C⁺, vértice, resolvente…) y que aparezca una descripción corta.
- **Celular:** al mover los deslizadores de la cuadrática no se ve el gráfico al mismo tiempo. Es un detalle menor; posible solución: gráfico "pegajoso" arriba.

## Decisiones pendientes
- ~~Si se incluyen espacios vectoriales~~ → **no, por ahora** (Mati, sesión de la Etapa 8).

## Notas técnicas
- Node.js y GitHub CLI están instalados. En la terminal: `npm run dev` y abrir http://localhost:4321/matematica-interactiva/.
- Interactivos: lógica en `src/interactivos/`, HTML en `src/components/interactivos/`. Para registrar uno nuevo, se agrega en `src/components/Interactivo.astro`.
- Los temas se leen en `src/lib/contenido.js`. Si un ejercicio está mal escrito, el armado falla con un mensaje claro y la página publicada no se toca.
