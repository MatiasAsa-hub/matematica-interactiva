# Brief del proyecto — Página interactiva de matemática

## 1. Qué es esto y para quién

Una página web interactiva de matemática, gratuita y de acceso libre, para un **espacio comunitario de apoyo escolar en Argentina**. Ahí, chicos que ya terminaron la secundaria (los **tutores**) les dan clases a otros chicos (los **alumnos**), sobre todo de matemática.

- **Alumnos:** secundaria, de 1.º a 5.º año, todas las edades. Muchos no manejan bien las operaciones básicas (signos, fracciones, distributiva), y eso les traba todo lo demás. Son de pocos recursos: entran **desde el celular** con datos móviles. Casi ninguno tiene computadora.
- **Tutores:** tienen la secundaria terminada pero no estudiaron matemática en profundidad. Usan la página **antes de la clase para repasar** el tema y ver cómo explicarlo. En el espacio no hay proyector: solo un pizarrón chico.
- **Uso típico:** el tutor repasa antes de la clase; el alumno entra cuando quiere, por su cuenta.
- **El dueño del proyecto es Mati**, que da clases ahí y sabe matemática, pero **no programa**. Vos hacés todo el código; él aporta las ideas, revisa y decide.

**Filosofía:** a diferencia de simuladores como PhET (que le gustan a Mati, pero donde casi siempre tenés que saber lo que hacés para poder interactuar), acá **el interactivo guía**. Cada uno tiene una consigna corta ("Mové el deslizador *a* y fijate qué pasa con la parábola"), pocos controles a la vista y valores iniciales que ya muestran algo interesante.

## 2. Cómo trabajar con Mati

- Explicá las decisiones técnicas en palabras simples, sin jerga innecesaria.
- **Trabajá por etapas** (ver sección 9). Al terminar cada etapa: publicá, decile cómo verla (el link) y qué revisar, y esperá su devolución antes de seguir.
- Preguntale antes de tomar decisiones grandes o difíciles de deshacer (cambiar de tecnología, reestructurar el contenido). Las decisiones chicas tomalas vos y contale qué elegiste.
- No agregues funcionalidades que no pidió. Si se te ocurre algo bueno, proponelo en una línea.
- Mati tiene el plan Pro de Claude: las sesiones tienen que ser enfocadas, una etapa (o parte de una) por sesión.
- Mantené un archivo `ESTADO.md` con qué está hecho, qué falta y las decisiones pendientes. Actualizalo al final de cada sesión.
- Hacé commits chicos y con mensajes claros en español.
- Mati usa Windows. Su usuario de GitHub es `MatiasAsa-hub`.
- **Textos (alumnos y tutores): por ahora genéricos y cortos**, con ítems más que párrafos. No gastar mucho esfuerzo en redactarlos: Mati los va a escribir más adelante, con ayuda de Claude. El esfuerzo va a los interactivos y a los ejercicios.

## 3. Requisitos técnicos

- **Sitio estático**: sin servidor, sin base de datos, sin registro de usuarios y sin guardar progreso. Acceso libre con el link.
- **Publicación gratuita en GitHub Pages**, con despliegue automático (GitHub Actions) cada vez que se sube un cambio. La dirección gratuita `*.github.io` alcanza por ahora.
- **Mobile-first:** pensado primero para celular (pantalla vertical, uso táctil: arrastrar puntos, deslizadores cómodos para el dedo, zoom con dos dedos en los gráficos), pero que también se vea bien en computadora.
- **Liviano y fluido** en un celular de gama media. Evitá dependencias pesadas que no hagan falta. No es requisito que ande perfecto en el celular más viejo, ni que funcione sin conexión (por ahora).
- **El contenido va separado del código.** Los textos (explicaciones, ejercicios, notas para tutores) tienen que vivir en archivos de texto simples (Markdown o similar) que Mati pueda abrir y corregir sin tocar código, ni siquiera desde la web de GitHub. Escribí un `COMO-EDITAR.md` con instrucciones paso a paso para principiantes.
- **Stack sugerido** (podés proponer otro, justificándolo en términos simples):
  - **Astro** (genera el sitio estático a partir del contenido en Markdown, con componentes interactivos en JavaScript solo donde hacen falta).
  - **KaTeX** para las fórmulas.
  - **Un módulo propio de graficado 2D** (Canvas o SVG) compartido por todos los interactivos, para que todos se vean y se comporten igual: ejes, grilla, deslizadores, puntos arrastrables, animaciones.
  - **Three.js** para lo 3D (planos y sistemas).
- Todo el texto que ve el usuario va en español rioplatense. Los comentarios del código, en español.

## 4. Estética

- Inspiración: **3Blue1Brown**. Sobrio, claro, animaciones suaves que explican y no decoran.
- **Fondo ni blanco ni negro** (por ejemplo, un gris azulado tipo pizarra o un tono hueso). La estética final se discute con Mati cuando haya un prototipo. Hasta entonces, elegí vos.
- Colores sencillos pero atractivos, con **códigos de color fijos para los conceptos** en toda la página (por ejemplo: la función siempre del mismo color, la derivada de otro, C⁺ y C⁻ siempre con los mismos). Que el significado no dependa solo del color: sumá etiquetas o estilos de línea.
- Poca información a la vez: la suficiente para entender el tema, nunca abrumadora. Lo opcional va con casillas para prender y apagar.
- Tipografía legible en el celular.

## 5. Tono y enfoque pedagógico

- Lenguaje **cercano e informal, con voseo** ("fijate", "probá", "¿qué pasa si…?"). Sin superrigor matemático.
- **Primero la intuición y después la explicación.** No importa "spoilear" resultados: primero se ve y se juega, después se explica. Algunos temas pueden ser solo explicación, según convenga.
- Cuando tiene sentido, mostrar **primero con números y después con letras** (con *x*).
- Remarcar las conexiones entre temas (por ejemplo: **la lineal y la cuadrática son casos particulares de la polinómica**; la integral es la inversa de la derivada).

## 6. Estructura de cada tema

1. **Intuición:** el interactivo, con una consigna corta.
2. **Explicación:** breve, cercana.
3. **Ejemplo resuelto:** con resolución **paso a paso desplegable** cuando lo importante es el desarrollo. Cuando lo importante es el concepto, alcanza con el resultado comentado.
4. **Ejercicios autocorregibles:** escritos a mano (**nada de ejercicios al azar**: los números tienen que ser "lindos"). Primero un ejercicio de ejemplo resuelto y después los autocorregibles. Tipos: respuesta numérica (con tolerancia), opción múltiple, y más adelante, si se puede, intervalos o expresiones. Cada uno con pista opcional y resolución desplegable.
5. **Para tutores:** un recuadro o pestaña aparte por tema (ver sección 7).

**Guía imprimible:** por tema o por sección, una vista de impresión (CSS de impresión → "Guardar como PDF" desde el navegador) que junte los ejercicios con las **respuestas al final**.

## 7. Sección para tutores

Tiene que estar separada de la de alumnos, pero **los interactivos son los mismos para los dos**. Por tema:
- Qué tiene que llevarse el alumno (objetivo en una línea).
- Qué tiene que saber antes (prerrequisitos, con link al tema).
- Errores típicos de los alumnos y cómo destrabarlos.
- Cómo explicarlo **en un pizarrón chico**, sin proyector (qué dibujar, en qué orden).
- Preguntas para hacerle al alumno y ver si entendió.

Además, una página general "Cómo usar esta página en una clase".

## 8. Contenido

### Notación y convenciones (página propia)

Una página de referencia con todas las convenciones, que va creciendo. Las convenciones fijas:
- **Punto decimal** (2.5, no 2,5).
- **C⁺, C⁻ y C⁰** para los conjuntos de positividad, negatividad y ceros.
- **"Resolvente"** (no "Bhaskara").
- **f'(x)** para la derivada.
- **Intervalos:** corchete = cerrado, paréntesis = abierto. Ejemplo: [2, 5).
- **ℝ** para "todos los reales" y **∅** para "vacío" (por ejemplo, C⁻ = ∅). Confirmado por Mati.
- Los **intervalos de crecimiento y decrecimiento** van **abiertos** en el vértice: "crece en (1, +∞)". Confirmado.
- Los resultados **no exactos** se muestran redondeados a 2 decimales con **≈** (x₁ ≈ 1.27). Confirmado.
- Las convenciones nuevas que surjan, preguntáselas a Mati y sumalas.

### BÁSICO — Cómo operar

Primero con números y después con *x*:
- Suma, resta, multiplicación, división. Regla de los signos. Orden de las operaciones.
- Fracciones (operaciones, simplificación).
- Potencias y sus propiedades. Raíces.
- Propiedad distributiva, factor común.
- Ideas de interactivos (propuestas, para confirmar con Mati): recta numérica para sumar y restar con signo; modelo de área (un rectángulo) para la distributiva; barras para fracciones.

### ANÁLISIS

**Ecuaciones e inecuaciones**
- Qué quiere decir una igualdad. Despejar y operar (propuesta: interactivo tipo balanza).
- Desigualdades: qué significan, cómo se resuelven, la solución en la recta numérica y en intervalos.

**Funciones**
- Qué es una función (tabla, regla, gráfico). Dominio e imagen.
- Función lineal, cuadrática y polinómica. Grado de un polinomio. Ceros o raíces (qué significan), resolvente, C⁺, C⁻ y C⁰, cómo graficar.
- Funciones en general: trigonométricas, exponencial, logarítmica, valor absoluto, raíz, homográfica, partidas, inversa y composición.

**Derivadas**
- Demostración gráfica e intuitiva con *x* y *x+h*, con *h* chico.
- Derivada por definición ("con esto podemos llegar a cualquier derivada").
- Cómo derivar un polinomio y algunas derivadas de tabla.

**Integrales**
- La integral como límite cuando *dx* se achica (ver interactivo 7.a).
- La integral como función acumulada y su relación con la derivada.
- Regla de Barrow y tabla de primitivas básicas.
- Área entre dos curvas.

### ÁLGEBRA (para 4.º y 5.º año, a nivel introductorio)

- Sistemas de ecuaciones lineales: 2×2 (dos rectas en el plano) y 3×3 (tres planos en el espacio). Clasificación: compatible determinado, compatible indeterminado e incompatible.
- Método de Gauss.
- Matrices: suma, producto, determinante.
- Vectores en el plano y en el espacio. Planos.
- Espacios vectoriales y subespacios: opcional, más adelante. El objetivo principal es llegar a ver sistemas y matrices en el espacio, y "hasta ahí".

## 9. Interactivos (especificación)

Todos se arman sobre el módulo de graficado compartido. Valen para **alumnos y tutores**.

### 1. Base común a todos los gráficos de funciones
- **Expresión en vivo:** la fórmula escrita con los valores actuales de los deslizadores (por ejemplo, al mover los deslizadores se lee "f(x) = 2(x − 1)² − 3"). El alumno no escribe funciones: mueve deslizadores.
- **Animación de puntos (se puede prender y apagar):** antes de dibujar la curva, aparecen **~20 puntos (p, f(p)) equiespaciados, uno tras otro de izquierda a derecha**. Después se dibuja la **curva continua, también animada de izquierda a derecha**. Botón para repetir.
  - Opcional, también con casilla: una tabla x | f(x) que se va llenando a la par de los puntos.
- Zoom y desplazamiento táctiles, y botón para volver a la vista inicial.

### 2. Función lineal (interactivo propio)
- f(x) = m·x + b, con deslizadores para *m* y *b*.
- Casillas para prender y apagar: ordenada al origen, raíz, pendiente (triángulo "avanzo 1, subo m"), C⁺/C⁻ pintados, creciente o decreciente.

### 3. Función cuadrática (interactivo propio)
- **Dos formas, con un botón para cambiar** (y cambian los deslizadores): **forma polinómica** f(x) = ax² + bx + c (**la que aparece primero, por defecto**) y **forma canónica** f(x) = a(x − h)² + k. Al cambiar de forma, la parábola queda igual. Los ejercicios del tema van **principalmente en forma polinómica**.
- **Casillas prendidas por defecto:** raíces, vértice y animación de puntos. El resto, apagado hasta que el usuario lo prenda (vale como criterio general para los demás interactivos).
- Casillas: vértice, eje de simetría, raíces (con la resolvente; avisar claramente cuando no hay raíces reales), ordenada al origen, C⁺/C⁻/C⁰ pintados, intervalos de crecimiento y decrecimiento, máximo o mínimo.

### 4. Polinomios de grado 3 en adelante (interactivo propio)
- Se elige el grado (3, 4, 5…) y aparecen los deslizadores de los parámetros.
- Forma de los parámetros: **decisión pendiente con Mati** (la forma canónica es propia de la cuadrática). Por defecto, coeficientes aₙ…a₀.
- Casillas: raíces, ordenada al origen, máximos y mínimos, puntos de inflexión, C⁺/C⁻, crecimiento y decrecimiento (calculados numéricamente).

### 5. Laboratorio de funciones (el "supergraficador")
Aparte de los gráficos simples y guiados que están dentro de cada explicación.
- Se elige una función base: lineal, cuadrática, polinomio, |x|, √x, 1/x, sen, cos, tan, eˣ, aˣ, ln, logₐ…
- Transformaciones con 4 deslizadores: **a·f(b(x − c)) + d**, con la expresión en vivo.
- La función base original queda dibujada "fantasma" para comparar.
- Las mismas casillas de puntos notables y la animación de puntos.

### 6. Derivadas
- **6.a — De la secante a la tangente:** curva con el punto (x, f(x)) y el punto (x+h, f(x+h)), y la recta secante que los une. Un deslizador de *h* que se achica hacia 0; se muestra el valor del cociente incremental y la secante se convierte en la tangente.
- **6.b — Recorrer la curva:** el usuario **arrastra un punto sobre la curva**. En ese punto se dibuja un **vector unitario en la dirección de la tangente**, **coloreado según el signo de la derivada** (crece, decrece, cero).
  - **Al costado** (en el celular, abajo, con el mismo eje x alineado) se va **dibujando f'(x)**.
  - Cuando el punto avanza hacia la derecha, la gráfica de f' se dibuja hasta el x actual. Cuando retrocede hacia la izquierda, **se va borrando de forma continua** (siempre muestra f' desde el borde izquierdo hasta el x actual).
  - Botón para que el punto recorra solo.

### 7. Integrales
- **7.a — dx que se achica (idea de Mati):** **no** un deslizador de "cantidad de rectángulos". Es una **animación continua donde *dx* se va achicando** y las tiras se afinan hasta fundirse en el área suave bajo la curva: "va quedando la integral". Visualmente, Σ f(x)·Δx pasa a ∫ f(x) dx. Confirmar los detalles con Mati antes de implementarla.
- **7.b — Integral acumulada:** se mueve un punto *b*, se pinta el área de *a* a *b* y al costado se dibuja F(b). Espejo del interactivo 6.b: muestra que F' = f.
- **7.c — Barrow:** ejemplos con la regla de Barrow y una tabla de primitivas.
- **7.d — Área entre dos curvas.**

### 8. Álgebra en 3D
Tiene que aportar algo que GeoGebra no da hecho.
- **8.a — Gauss animado:** de un lado la matriz ampliada y del otro los planos en 3D. Cada operación de filas (con un botón "siguiente paso") **mueve los planos, pero la intersección (la solución) queda fija**: así se ve por qué el método funciona.
- **8.b — Sistema con parámetro k:** un deslizador para *k* dentro del sistema. Los planos se mueven y se ve cuándo el sistema pasa de **compatible determinado** a **compatible indeterminado** o a **incompatible**, con el cartel correspondiente.
- La versión 2×2 con rectas en el plano, como paso previo.
- Rotación táctil de la vista 3D.
- Propuesta para matrices: el determinante 2×2 como área del paralelogramo, interactivo.

## 10. Hoja de ruta (etapas)

0. **Base y prototipo:** repositorio, stack, publicación automática, diseño base, módulo de graficado, estructura de contenido y **el interactivo de la cuadrática como prototipo** para que Mati defina la estética.
1. **Básico** (operaciones, primero con números y después con *x*).
2. **Ecuaciones e inecuaciones.**
3. **Funciones:** qué es una función, lineal, cuadrática, animación de puntos.
4. **Polinómicas** y **Laboratorio de funciones.**
5. **Otras funciones** (trigonométricas, exponencial, logarítmica, etc.).
6. **Derivadas.**
7. **Integrales.**
8. **Álgebra** (sistemas, Gauss, matrices, vectores, planos, 3D).

Transversales, a lo largo de todas las etapas: la página de notación y la sección para tutores. **Las guías imprimibles quedan para el final de todo** (decisión de Mati).

## 11. Decisiones pendientes

- Nombre de la página: **neutro**, ni personal ni referido a ninguna organización. Mientras tanto, usá un nombre provisorio genérico.
- ~~La estética final~~ → **aprobada** con el prototipo (pizarra gris azulada, Nunito, colores por concepto).
- La forma de los parámetros para polinomios de grado ≥ 3.
- ~~La tabla x | f(x)~~ → **opcional, apagada por defecto**.
- Los detalles de la animación de integral 7.a.
- Las convenciones de notación nuevas que vayan apareciendo.
- Si se incluyen espacios vectoriales y subespacios.

## 12. Ideas anotadas (para más adelante)

- **Glosario al tocar una palabra** (idea de Mati): las palabras formales (C⁺, vértice, raíz, resolvente, intervalo…) se pueden tocar en el celular o señalar con el mouse, y aparece una descripción corta. Se puede armar a partir de la página de Notación.
- **En el celular, al mover los deslizadores no se ve el gráfico** (quedan uno debajo del otro). Mati dice que es un detalle menor. Posible solución: gráfico "pegajoso" arriba o deslizadores flotantes.
