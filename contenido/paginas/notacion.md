---
titulo: Notación
bajada: Cómo escribimos las cosas en esta página y qué quiere decir cada símbolo.

# Los colores de los gráficos. "color" es el nombre de la variable de
# src/styles/global.css (sin los dos guiones).
colores:
  - { color: c-funcion, nombre: "La función" }
  - { color: c-raices, nombre: "Raíces y C⁰" }
  - { color: c-positivo, nombre: "C⁺ · cumple" }
  - { color: c-negativo, nombre: "C⁻ · no cumple" }
  - { color: c-vertice, nombre: "Vértice, máximos y mínimos" }
  - { color: c-ordenada, nombre: "Ordenada al origen · inversa" }
  - { color: c-crece, nombre: "Crece" }
  - { color: c-decrece, nombre: "Decrece" }
  - { color: c-derivada, nombre: "La derivada" }
  - { color: c-integral, nombre: "Áreas e integrales" }
---

Puede que en tu escuela escriban algo de otra forma. No pasa nada: lo importante es entender qué quiere decir.

## Números y cuentas

- **$2.5$** — Punto decimal: dos y medio (no escribimos 2,5).
- **$3 \cdot 4$** — Multiplicar va con un punto.
- **$12 : 4$** — Dividir va con dos puntos.
- **$3 \cdot (-2)$** — Un número negativo que va después de una operación lleva paréntesis. También $5 - (-1)$.
- **$\approx$** — "Más o menos igual". Si un resultado no da justo, lo redondeamos a 2 decimales: $x_1 \approx 1.27$.

## Intervalos y conjuntos

- **$[2, 5]$** — Corchete: el extremo **está** incluido. Son los números del 2 al 5, con el 2 y el 5.
- **$(2, 5)$** — Paréntesis: el extremo **no está** incluido. Del 2 al 5, sin el 2 y sin el 5.
- **$[2, 5)$** — Se pueden mezclar: con el 2, sin el 5.
- **$(3, +\infty)$** — Todos los números mayores que 3. Con infinito siempre va paréntesis.
- **$\mathbb{R}$** — Todos los números reales.
- **$\varnothing$** — El conjunto vacío: no hay ningún número.
- **$\cup$** — Unión. $(-\infty, 1) \cup (5, +\infty)$ son los menores que 1 y también los mayores que 5.
- **$\forall$** — "Para todo". Es el símbolo del logo: matemática $\forall$ todos.

## Funciones

- **$f(x)$** — "f de x": lo que da la función cuando entra $x$.
- **C⁺** — Conjunto de positividad: los $x$ donde $f(x) > 0$. El gráfico está **arriba** del eje $x$.
- **C⁻** — Conjunto de negatividad: los $x$ donde $f(x) < 0$. El gráfico está **abajo** del eje $x$.
- **C⁰** — Conjunto de ceros: los $x$ donde $f(x) = 0$. Son las **raíces**: donde el gráfico toca el eje $x$.
- **Crece, decrece** — Los intervalos van abiertos: "crece en $(1, +\infty)$".
- **Resolvente** — La fórmula para las raíces de $ax^2 + bx + c$: $\;x_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- **$|x|$** — Módulo de $x$: el número sin el signo.
- **$f \circ g$** — Composición: primero se hace $g$ y después $f$.
- **$f^{-1}$** — La función inversa: deshace lo que hizo $f$.

## Ángulos

- **$90°$** — Grados. Una vuelta entera son $360°$.
- **$\frac{\pi}{2}$** — Radianes. Una vuelta entera son $2\pi$; media vuelta, $\pi = 180°$. En los interactivos hay un botón para pasar de grados a radianes.
- **sen, cos, tan** — Seno, coseno y tangente (en algunas escuelas, tg).

## Límites, derivadas e integrales

- **$\lim_{x \to a} f(x)$** — Límite: a qué número se acerca $f(x)$ cuando $x$ se acerca a $a$ (sin llegar nunca).
- **$x \to a^-$, $x \to a^+$** — Acercarse a $a$ por la izquierda (con números más chicos) o por la derecha (con números más grandes).
- **$f'(x)$** — La derivada de $f$: la pendiente del gráfico en cada punto.
- **$h$** — Un pasito en $x$. Para la derivada lo hacemos cada vez más chico.
- **$\int_a^b f(x)\,dx$** — La integral: el área entre el gráfico y el eje $x$, desde $a$ hasta $b$. Lo que queda abajo del eje resta.
- **$dx$** — El ancho de cada tira cuando se parte el área en tiras finas.
- **$F(x)$** — Una primitiva de $f$: una función cuya derivada es $f$.

## Sistemas y matrices

- **1, 2, 3** — Cada ecuación del sistema tiene un número y un color: la 1 azul, la 2 naranja y la 3 rosa. En el gráfico es su recta o su plano.
- **CD** — Compatible determinado: una sola solución.
- **CI** — Compatible indeterminado: infinitas soluciones.
- **I** — Incompatible: no tiene solución.
- **$F_1, F_2, F_3$** — Las filas de la matriz.
- **$F_2 - 2 \cdot F_1 \to F_2$** — Operación de filas: primero la cuenta y después a dónde va. "A la fila 2 le resto 2 veces la fila 1, y eso queda en la fila 2".
- **$F_1 \leftrightarrow F_2$** — Cambiar de lugar las filas 1 y 2.
