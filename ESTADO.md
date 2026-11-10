# Estado del proyecto

_Última actualización: 10/11/2026 — sesión 4 (Laboratorio y Etapa 5: exponencial, logarítmica, trigonométricas, módulo, raíz y homográfica)_

**Página publicada:** https://matiasasa-hub.github.io/matematica-interactiva/
**Repositorio:** https://github.com/MatiasAsa-hub/matematica-interactiva

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

### Etapa 5 — Otras funciones 🚧 (en curso)
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
- Pieza nueva: `src/lib/analisisFuncion.js`, con los textos de raíces, C⁺/C⁻, asíntotas, dominio, etc. que antes estaban solo en el Laboratorio. Ahora la usan el Laboratorio y los tres temas nuevos.
- Piezas compartidas: el `Plano` acepta números propios en el eje x (`ejeX`, para 90° o π/2) y el deslizador acepta un `formato` para mostrar su valor.
- Links nuevos en los textos: `[Laboratorio](pagina:laboratorio)` apunta a una página suelta (anotado en `COMO-EDITAR.md`).

## Falta
- Que Mati revise las Etapas 1 a 5 y dé su devolución.
- **Próximo:** seguir la Etapa 5: funciones partidas. **Al final**, inversa y composición (pedido de Mati). El Laboratorio ya sabe dibujar casi todas.
- Posible más adelante: ecuaciones con paréntesis (2(x + 1) = 8) o con fracciones. Por ahora la balanza solo entiende números enteros, *x*, + y −.
- Etapas 5 a 8, según la hoja de ruta de `CLAUDE.md`.
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
- Los detalles de la animación de la integral (7.a).
- Si se incluyen espacios vectoriales.

## Notas técnicas
- Node.js y GitHub CLI están instalados. En la terminal: `npm run dev` y abrir http://localhost:4321/matematica-interactiva/.
- Interactivos: lógica en `src/interactivos/`, HTML en `src/components/interactivos/`. Para registrar uno nuevo, se agrega en `src/components/Interactivo.astro`.
- Los temas se leen en `src/lib/contenido.js`. Si un ejercicio está mal escrito, el armado falla con un mensaje claro y la página publicada no se toca.
