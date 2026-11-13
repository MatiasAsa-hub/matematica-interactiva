---
titulo: Matrices y sus operaciones
subseccion: Matrices
resumen: Una tabla de números. Cómo se suman, cómo se multiplican por un número y cómo se multiplican entre sí (fila por columna).
orden: 60
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [metodo-de-gauss, multiplicar-y-dividir-con-signos]
interactivo: matrices
# Cada cuenta: las matrices entre paréntesis, con las filas separadas por ";"
cuentas:
  - "(1 2 ; 3 4) + (5 0 ; -1 2)"
  - "(4 1 ; 0 -2) - (1 3 ; 2 -1)"
  - "3 · (1 -2 ; 0 4)"
  - "(1 2 ; 3 4) · (2 0 ; 1 -1)"
  - "(1 0 2 ; -1 3 1) · (3 1 ; 2 1 ; 1 0)"
---

## Intuición

Tocá **Siguiente** y mirá qué números se usan para cada casillero del resultado. Pasá de cuenta con las flechitas.

- En la suma, ¿qué números se suman para cada casillero?
- En el producto de matrices, ¿qué fila y qué columna se usan para el número de arriba a la derecha?
- En la última cuenta, una matriz de 2×3 por una de 3×2: ¿de qué tamaño queda el resultado?

## Explicación

- Una **matriz** es una tabla de números, ordenados en filas y columnas. Una matriz de **2×3** tiene 2 filas y 3 columnas.
- Ya la usamos: la **matriz ampliada** del [método de Gauss](tema:metodo-de-gauss).
- **Suma y resta:** casillero por casillero. Solo se puede si las dos son del mismo tamaño.
- **Por un número:** se multiplica cada casillero por ese número.
- **Producto de matrices (fila por columna):** el número de la fila $i$, columna $j$ del resultado sale de la **fila $i$ de la primera** por la **columna $j$ de la segunda**: se multiplican de a pares y se suman.

$$
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \cdot \begin{pmatrix} 2 & 0 \\ 1 & -1 \end{pmatrix} = \begin{pmatrix} 1 \cdot 2 + 2 \cdot 1 & \ldots \\ \ldots & \ldots \end{pmatrix}
$$

- Para poder multiplicar, **las columnas de la primera tienen que ser tantas como las filas de la segunda**. Una 2×**3** por una **3**×2 da una 2×2.
- ¡Ojo! El orden importa: $A \cdot B$ casi nunca da lo mismo que $B \cdot A$.

## Para recordar

- Suma: casillero por casillero (mismo tamaño).
- Producto: fila por columna. (2×**3**) · (**3**×2) → 2×2.
- $A \cdot B \neq B \cdot A$ (casi siempre).

## Ejemplo resuelto

Calculá $\begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix} \cdot \begin{pmatrix} 1 & 4 \\ 2 & -1 \end{pmatrix}$.

### Fila 1, columna 1

$2 \cdot 1 + 1 \cdot 2 = 4$

### Fila 1, columna 2

$2 \cdot 4 + 1 \cdot (-1) = 7$

### Fila 2, columna 1

$0 \cdot 1 + 3 \cdot 2 = 6$

### Fila 2, columna 2

$0 \cdot 4 + 3 \cdot (-1) = -3$. El resultado es $\begin{pmatrix} 4 & 7 \\ 6 & -3 \end{pmatrix}$.

## Ejercicios

### Nivel: Para arrancar

### Un casillero de la suma

En $\begin{pmatrix} 3 & -1 \\ 2 & 5 \end{pmatrix} + \begin{pmatrix} 4 & 2 \\ -6 & 1 \end{pmatrix}$, ¿qué número queda en la fila 2, columna 1?

respuesta: -4

### Por un número

En $2 \cdot \begin{pmatrix} 1 & -3 \\ 4 & 0 \end{pmatrix}$, ¿qué número queda en la fila 1, columna 2?

respuesta: -6

### El tamaño

Una matriz de 3×2 por una de 2×4, ¿de qué tamaño da?

- [x] 3×4
- [ ] 2×2
- [ ] No se puede multiplicar

pista: Las del medio tienen que coincidir; las de afuera dan el tamaño.

### Nivel: Para animarse

### Fila por columna

En $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \cdot \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}$, ¿qué número queda en la fila 1, columna 1?

respuesta: 19

#### Resolución

Fila 1 de la primera por columna 1 de la segunda: $1 \cdot 5 + 2 \cdot 7 = 5 + 14 = 19$.

### Con negativos

En $\begin{pmatrix} 2 & -1 \\ 0 & 3 \end{pmatrix} \cdot \begin{pmatrix} 4 & 1 \\ 5 & -2 \end{pmatrix}$, ¿qué número queda en la fila 2, columna 2?

respuesta: -6

#### Resolución

Fila 2 por columna 2: $0 \cdot 1 + 3 \cdot (-2) = -6$.

### ¿Se puede?

¿Se puede multiplicar una matriz de 2×3 por otra de 2×3?

- [x] No
- [ ] Sí, y da 2×3
- [ ] Sí, y da 3×3

pista: Las columnas de la primera (3) tienen que ser tantas como las filas de la segunda (2).

## Para tutores

### Objetivo

- Operar con matrices: suma, producto por un número y producto fila por columna (y saber cuándo se puede).

### Antes tiene que saber

- [Método de Gauss](tema:metodo-de-gauss) (ya vio una matriz) y [operar con signos](tema:multiplicar-y-dividir-con-signos).

### Errores típicos

- Multiplicar casillero por casillero (como en la suma) en vez de fila por columna.
- Pensar que $A \cdot B = B \cdot A$.
- Errores de signo en los productos.

### Cómo destrabarlo

- El tamaño se dice "filas por columnas", y las filas son las acostadas.
- Sumar: casillero con casillero, y solo si tienen el mismo tamaño.
- El producto es fila por columna: recorrer la fila con un dedo y la columna con el otro.
- El orden importa: hacer $A \cdot B$ y $B \cdot A$ con dos matrices chicas y comparar.
- Con negativos, cada producto entre paréntesis.

### En el pizarrón

- Para el producto: marcar con una flecha horizontal la fila de la primera y con una vertical la columna de la segunda, y escribir la cuenta al costado.
- Escribir los tamaños debajo de cada matriz ($2 \times 3$ y $3 \times 2$) y unir con un arquito los números del medio: tienen que ser iguales.
- Hacer un producto de $2 \times 2$ completo, un casillero por vez.

### Preguntas para el alumno

- ¿Cuándo se pueden sumar dos matrices? ¿Y multiplicar?
- ¿De qué tamaño queda el resultado?
- ¿Se puede multiplicar una matriz de $2 \times 3$ por otra de $2 \times 3$?
