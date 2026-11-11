---
titulo: Método de Gauss
subseccion: Sistemas de ecuaciones
resumen: Se ordena el sistema en una matriz y se combinan las filas hasta que quede escalonado. Las rectas o planos se mueven, pero la solución no.
orden: 40
interactivo: sistema
modo: gauss
# Cada sistema puede traer sus pasos escritos (si no, la página los elige sola):
#   - sistema: "x + y = 3 ; 2x - y = 0"
#     pasos: ["F2 - 2F1 -> F2", "F2 : (-3) -> F2", "F1 - F2 -> F1"]
sistemas:
  - "x + y = 3 ; 2x - y = 0"
  - "x + y + z = 6 ; 2x + y - z = 1 ; x - y + 2z = 5"
  - "x + y + z = 3 ; x + 2y + 3z = 6 ; 2x + 3y + 4z = 9"
  - "x + y + z = 1 ; x + y + z = 2 ; x - y = 0"
---

## Intuición

Tocá **Siguiente paso** y mirá la recta (o el plano) que cambia.

- ¿Se mueve la solución (el punto amarillo) en algún paso?
- En el primer sistema, ¿cómo quedan las rectas al final? ¿Qué dice cada ecuación?
- En el sistema 2 (con planos), girá el dibujo después de cada paso. ¿Cómo quedan los planos al final?
- En los sistemas 3 y 4, ¿qué fila rara aparece? ¿Qué dice el cartel?

## Explicación

- Se escribe el sistema como una **matriz ampliada**: solo los números, en filas, con una raya antes de los resultados.

$$
\begin{cases} x + y = 3 \\ 2x - y = 0 \end{cases} \quad \longrightarrow \quad \left(\begin{array}{cc|c} 1 & 1 & 3 \\ 2 & -1 & 0 \end{array}\right)
$$

- Se pueden hacer tres cosas con las filas sin cambiar la solución:
  - **Sumarle (o restarle) a una fila otra multiplicada por un número:** $F_2 - 2 \cdot F_1 \to F_2$.
  - **Multiplicar o dividir una fila por un número** (que no sea 0): $F_2 : 3 \to F_2$.
  - **Cambiar dos filas de lugar:** $F_1 \leftrightarrow F_2$.
- El objetivo es que quede **escalonada**: abajo de cada primer número, ceros. Después se despeja de abajo hacia arriba.
- Por qué funciona: cada paso cambia una ecuación por otra que tiene **las mismas soluciones**. La recta o el plano gira, pero **sigue pasando por la solución**.
- Al final se ve la clasificación:
  - Una fila $0 = 0$: **compatible indeterminado**.
  - Una fila $0 = 5$ (o cualquier número que no sea 0): **incompatible**.
  - Si no pasa nada de eso: **compatible determinado**.

## Para recordar

- Matriz ampliada → escalonada → despejar de abajo hacia arriba.
- Cada paso: $F_2 - 2 \cdot F_1 \to F_2$ (la cuenta y a dónde va).
- $0 = 0$: infinitas soluciones. $0 = 5$: ninguna.

## Ejemplo resuelto

Resolvé con Gauss: $x + y + z = 6$, $2x + y - z = 1$, $x - y + 2z = 5$.

### Paso 1: la matriz ampliada

$\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 2 & 1 & -1 & 1 \\ 1 & -1 & 2 & 5 \end{array}\right)$

### Paso 2: ceros en la primera columna

$F_2 - 2 \cdot F_1 \to F_2$ y $F_3 - F_1 \to F_3$:

$\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & -3 & -11 \\ 0 & -2 & 1 & -1 \end{array}\right)$

### Paso 3: cero en la segunda columna

$F_3 - 2 \cdot F_2 \to F_3$:

$\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & -3 & -11 \\ 0 & 0 & 7 & 21 \end{array}\right)$

¡Quedó escalonada!

### Paso 4: despejar de abajo hacia arriba

- Fila 3: $7z = 21 \Rightarrow z = 3$.
- Fila 2: $-y - 3 \cdot 3 = -11 \Rightarrow -y = -2 \Rightarrow y = 2$.
- Fila 1: $x + 2 + 3 = 6 \Rightarrow x = 1$.

La solución es $(1, 2, 3)$.

## Ejercicios

### Nivel: Para arrancar

### Qué cuenta va

En la matriz $\left(\begin{array}{cc|c} 1 & 2 & 5 \\ 3 & 1 & 5 \end{array}\right)$, ¿qué paso deja un 0 abajo del 1?

- [x] $F_2 - 3 \cdot F_1 \to F_2$
- [ ] $F_2 - F_1 \to F_2$
- [ ] $F_1 - 3 \cdot F_2 \to F_1$

### Escalonada

Si la matriz escalonada termina en la fila $(0 \;\; 0 \;\; 4 \mid 8)$, ¿cuánto vale $z$?

respuesta: 2

pista: Esa fila dice $4z = 8$.

### Nivel: Para animarse

### De abajo hacia arriba

La matriz escalonada es $\left(\begin{array}{ccc|c} 1 & 1 & 1 & 4 \\ 0 & 1 & 2 & 5 \\ 0 & 0 & 1 & 2 \end{array}\right)$. ¿Cuánto vale $x$?

respuesta: 1

#### Resolución

$z = 2$. Fila 2: $y + 4 = 5 \Rightarrow y = 1$. Fila 1: $x + 1 + 2 = 4 \Rightarrow x = 1$.

### Una fila rara

Haciendo Gauss te quedó la fila $(0 \;\; 0 \;\; 0 \mid 3)$. El sistema es...

- [x] Incompatible
- [ ] Compatible indeterminado
- [ ] Compatible determinado

pista: Esa fila dice $0 = 3$.

### Resolver un 2×2

Resolvé con Gauss $x + 2y = 7$, $2x - y = 4$. ¿Cuánto vale $y$?

respuesta: 2

#### Resolución

$F_2 - 2 \cdot F_1 \to F_2$ da $(0 \;\; -5 \mid -10)$, o sea $-5y = -10 \Rightarrow y = 2$. Y $x = 7 - 4 = 3$.

## Para tutores

### Objetivo

- Resolver sistemas con Gauss y entender por qué funciona: cada paso no cambia la solución.

### Antes tiene que saber

- [Sistemas 2×2: dos rectas](tema:sistemas-2x2) (sobre todo el método de reducción) y [sistemas 3×3](tema:sistemas-3x3).

### Errores típicos

- Hacer la cuenta solo en algunas columnas y olvidarse de los resultados (lo que está después de la raya).
- Errores de signo al restar filas: conviene escribir la fila que se resta abajo, como una cuenta de restar.
- Multiplicar una fila por 0.

### Cómo destrabarlo

- Una fila es una ecuación completa: la cuenta se hace con **todos** sus números, también con el que está después de la raya.
- Cada paso busca "fabricar un 0" debajo de la diagonal. Decir cuál 0 se busca antes de hacer la cuenta.
- Solo cambia la fila que está después de la flecha; las otras se copian igual.
- Al final se despeja de abajo hacia arriba.

### En el pizarrón

- Escribir la matriz grande y, al lado de cada flecha, la operación ($F_2 - 2 \cdot F_1 \to F_2$).
- Hacer la resta fila por fila, como una cuenta en columna.
- Marcar con un círculo los lugares donde tienen que quedar los 0 (el triángulo de abajo a la izquierda).
- Al terminar, volver a escribir las ecuaciones y despejar $z$, después $y$ y después $x$.

### Preguntas para el alumno

- ¿Por qué se puede restar una ecuación a otra sin cambiar la solución?
- ¿Cómo te das cuenta de que ya está escalonada?
- ¿Qué fila cambia con $F_3 - 2 \cdot F_1 \to F_3$?
- Si una fila queda con todos 0 y un 5 después de la raya, ¿qué quiere decir?
