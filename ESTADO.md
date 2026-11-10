# Estado del proyecto

_Última actualización: 10/11/2026 — sesión 2 (Etapa 1 completa)_

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

## Falta
- Que Mati revise la Etapa 1 completa y dé su devolución.
- **Próximo:** Etapa 2, ecuaciones e inecuaciones (propuesta: interactivo tipo balanza para despejar).
- Etapas 3 a 8, según la hoja de ruta de `CLAUDE.md`.
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
- La forma de los parámetros de los polinomios de grado ≥ 3.
- Los detalles de la animación de la integral (7.a).
- Si se incluyen espacios vectoriales.

## Notas técnicas
- Node.js y GitHub CLI están instalados. En la terminal: `npm run dev` y abrir http://localhost:4321/matematica-interactiva/.
- Interactivos: lógica en `src/interactivos/`, HTML en `src/components/interactivos/`. Para registrar uno nuevo, se agrega en `src/components/Interactivo.astro`.
- Los temas se leen en `src/lib/contenido.js`. Si un ejercicio está mal escrito, el armado falla con un mensaje claro y la página publicada no se toca.
