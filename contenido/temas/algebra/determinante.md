---
titulo: Determinante
subseccion: Matrices
resumen: Un número que sale de una matriz cuadrada. En 2×2 es el área de un paralelogramo; si da 0, el sistema no tiene una sola solución.
orden: 22
interactivo: determinante
# Un segundo interactivo, al final de la explicación: las cuentas paso a paso
interactivo2: matrices
cuentas:
  - "det(3 1 ; 1 2)"
  - "det(2 1 3 ; 0 -1 2 ; 1 4 1)"
  - "det(1 2 3 ; 4 5 6 ; 7 8 9)"
---

## Intuición

Cada fila de la matriz es una flecha: la fila 1 la azul y la fila 2 la naranja. Arrastrá las puntas.

- Contá los cuadraditos del paralelogramo. ¿Coincide con el determinante?
- ¿Qué pasa con el determinante si ponés las dos flechas sobre la misma recta?
- Cruzá la flecha naranja al otro lado de la azul. ¿Qué cambia?

## Explicación

- El **determinante** es un número que se calcula con una matriz **cuadrada** (2×2, 3×3…). Se escribe $\det(A)$ o con rayitas: $\begin{vmatrix} a & b \\ c & d \end{vmatrix}$.
- **2×2:** la diagonal que baja menos la que sube.

$$
\begin{vmatrix} a & b \\ c & d \end{vmatrix} = a \cdot d - b \cdot c
$$

- Qué quiere decir: es el **área del paralelogramo** que forman las filas (con signo: negativo si las flechas quedan "al revés").
- **Si da 0**, las filas están sobre la misma recta. Para un sistema, eso quiere decir que **no tiene una sola solución** (es indeterminado o incompatible). Por eso funciona el método de los determinantes de [sistemas 2×2](tema:sistemas-2x2).
- **3×3**, hay dos formas (dan lo mismo). Probalas en el interactivo de abajo:
  - **Regla de Sarrus:** se repiten las dos primeras columnas al costado. Las tres diagonales que bajan suman y las tres que suben restan.
  - **Por la primera fila:** cada número de la fila 1 se multiplica por el determinante 2×2 que queda al tachar su fila y su columna, con signos $+$, $-$, $+$.

## Para recordar

- $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = a \cdot d - b \cdot c$
- 2×2: área del paralelogramo.
- $\det = 0$ → el sistema no tiene una sola solución.

## Ejemplo resuelto

Calculá $\begin{vmatrix} 2 & 1 & 3 \\ 0 & -1 & 2 \\ 1 & 4 & 1 \end{vmatrix}$ de las dos formas.

### Sarrus: las que bajan

$2 \cdot (-1) \cdot 1 + 1 \cdot 2 \cdot 1 + 3 \cdot 0 \cdot 4 = -2 + 2 + 0 = 0$

### Sarrus: las que suben

$3 \cdot (-1) \cdot 1 + 2 \cdot 2 \cdot 4 + 1 \cdot 0 \cdot 1 = -3 + 16 + 0 = 13$. Determinante: $0 - 13 = -13$.

### Por la primera fila

$2 \cdot \begin{vmatrix} -1 & 2 \\ 4 & 1 \end{vmatrix} - 1 \cdot \begin{vmatrix} 0 & 2 \\ 1 & 1 \end{vmatrix} + 3 \cdot \begin{vmatrix} 0 & -1 \\ 1 & 4 \end{vmatrix} = 2 \cdot (-9) - 1 \cdot (-2) + 3 \cdot 1 = -13$. ¡Lo mismo!

## Ejercicios

### Nivel: Para arrancar

### Un 2×2

¿Cuánto vale $\begin{vmatrix} 4 & 1 \\ 2 & 3 \end{vmatrix}$?

respuesta: 10

pista: $4 \cdot 3 - 1 \cdot 2$.

### Con negativos

¿Cuánto vale $\begin{vmatrix} 2 & -3 \\ 1 & 5 \end{vmatrix}$?

respuesta: 13

#### Resolución

$2 \cdot 5 - (-3) \cdot 1 = 10 + 3 = 13$.

### Si da cero

El determinante de los números de adelante de un sistema 2×2 da 0. El sistema...

- [x] No tiene una sola solución (es CI o I)
- [ ] Tiene una sola solución
- [ ] Siempre es incompatible

### Nivel: Para animarse

### Área

¿Cuál es el área del paralelogramo que forman los vectores $(3, 1)$ y $(1, 4)$?

respuesta: 11

pista: Es el determinante con esas dos filas.

### Un 3×3

¿Cuánto vale $\begin{vmatrix} 1 & 0 & 2 \\ 3 & 1 & 0 \\ 0 & 2 & 1 \end{vmatrix}$?

respuesta: 13

#### Resolución

Sarrus: las que bajan, $1 \cdot 1 \cdot 1 + 0 \cdot 0 \cdot 0 + 2 \cdot 3 \cdot 2 = 13$; las que suben, $2 \cdot 1 \cdot 0 + 1 \cdot 0 \cdot 2 + 0 \cdot 3 \cdot 1 = 0$. Determinante: $13 - 0 = 13$.

## Para tutores

### Objetivo

- Calcular determinantes 2×2 y 3×3, y saber que si da 0 el sistema no tiene una sola solución.

### Antes tiene que saber

- [Matrices y sus operaciones](tema:matrices) y [sistemas 2×2](tema:sistemas-2x2).

### Errores típicos

- Sumar las dos diagonales en vez de restarlas.
- En Sarrus, olvidarse de que las diagonales que suben **restan**.
- En "por la primera fila", olvidarse del signo menos del medio.

### En el pizarrón

- 2×2: dibujar las dos flechas en una cuadrícula y contar los cuadraditos del paralelogramo.
- Sarrus: copiar las dos primeras columnas al costado y marcar las diagonales con dos colores (o con línea llena y punteada).
- _(para completar)_

### Preguntas para el alumno

- ¿Qué quiere decir que el determinante dé 0?
- ¿Por qué dan lo mismo Sarrus y "por la primera fila"?
- _(para completar)_
