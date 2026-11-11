---
titulo: "Sistemas 2×2: dos rectas"
subseccion: Sistemas de ecuaciones
resumen: Dos ecuaciones con x e y. Cada una es una recta, y la solución es donde se cruzan.
orden: 10
interactivo: sistema
modo: explorar
# Cada sistema: las ecuaciones separadas por ";"
sistemas:
  - "x + y = 5 ; x - y = 1"
  - "2x + y = 4 ; x - y = -1"
  - "x + 2y = 4 ; 3x - y = 5"
---

## Intuición

Mirá las dos rectas y el punto amarillo.

- ¿Qué coordenadas tiene el punto donde se cruzan? Probá esos números en las dos ecuaciones: ¿se cumplen?
- Arrastrá los puntitos huecos de una recta. ¿Qué cambia en el sistema? ¿Y en el punto de cruce?
- Prendé **Despejar y**. ¿Qué tiene que ver esto con la [función lineal](tema:funcion-lineal)?

## Explicación

- Un **sistema 2×2** son dos ecuaciones con dos incógnitas, $x$ e $y$. Se escribe con una llave:

$$
\begin{cases} x + y = 5 \\ x - y = 1 \end{cases}
$$

- **Resolverlo** es encontrar los números $x$ e $y$ que cumplen **las dos a la vez**.
- Cada ecuación es una **recta** (si despejás $y$, te queda una función lineal). La solución es el **punto donde se cruzan**.
- Hay cuatro formas de hacer las cuentas. Todas llegan a lo mismo; elegí la que te resulte más cómoda:
  - **Sustitución:** despejás una letra en una ecuación y la reemplazás en la otra.
  - **Igualación:** despejás la misma letra en las dos y las igualás.
  - **Reducción:** sumás o restás las ecuaciones (multiplicadas por algún número) para que se vaya una letra. Es la idea del [método de Gauss](tema:metodo-de-gauss).
  - **Determinantes:** con una fórmula (está en el ejemplo resuelto).

## Para recordar

- Solución del sistema = punto donde se cruzan las dos rectas.
- Siempre se puede **comprobar**: reemplazás $x$ e $y$ en las dos ecuaciones y se tienen que cumplir.

## Ejemplo resuelto

Resolvé el sistema $x + y = 5$, $x - y = 1$ de las cuatro formas.

### Sustitución

De la primera: $y = 5 - x$. Reemplazo en la segunda: $x - (5 - x) = 1 \Rightarrow 2x - 5 = 1 \Rightarrow x = 3$. Y $y = 5 - 3 = 2$.

### Igualación

Despejo $y$ en las dos: $y = 5 - x$ y $y = x - 1$. Igualo: $5 - x = x - 1 \Rightarrow 6 = 2x \Rightarrow x = 3$. Y $y = 2$.

### Reducción

Sumo las dos ecuaciones y la $y$ se va: $(x + y) + (x - y) = 5 + 1 \Rightarrow 2x = 6 \Rightarrow x = 3$. Reemplazo: $3 + y = 5 \Rightarrow y = 2$.

### Determinantes

El determinante de los números de adelante: $\begin{vmatrix} 1 & 1 \\ 1 & -1 \end{vmatrix} = 1 \cdot (-1) - 1 \cdot 1 = -2$.

Para $x$, cambio la columna de la $x$ por los resultados: $\begin{vmatrix} 5 & 1 \\ 1 & -1 \end{vmatrix} = -5 - 1 = -6$, así que $x = -6 : (-2) = 3$.

Para $y$, cambio la columna de la $y$: $\begin{vmatrix} 1 & 5 \\ 1 & 1 \end{vmatrix} = 1 - 5 = -4$, así que $y = -4 : (-2) = 2$.

### Comprobar

$3 + 2 = 5$ ✓ y $3 - 2 = 1$ ✓. La solución es $x = 3$, $y = 2$: el punto $(3, 2)$.

## Ejercicios

### Nivel: Para arrancar

### ¿Es solución?

¿El punto $(2, 1)$ es solución del sistema $x + y = 3$, $x - y = 1$?

- [x] Sí, cumple las dos
- [ ] No, cumple solo la primera
- [ ] No, no cumple ninguna

pista: Reemplazá $x = 2$ e $y = 1$ en cada ecuación.

### Sumando

En el sistema $x + y = 7$, $x - y = 3$, ¿cuánto vale $x$?

respuesta: 5

pista: Sumá las dos ecuaciones: la $y$ se va.

### Y ahora la y

En el mismo sistema ($x + y = 7$, $x - y = 3$), ¿cuánto vale $y$?

respuesta: 2

### Nivel: Para animarse

### Por sustitución

En el sistema $y = 2x$, $x + y = 9$, ¿cuánto vale $x$?

respuesta: 3

#### Resolución

Reemplazo $y = 2x$ en la segunda: $x + 2x = 9 \Rightarrow 3x = 9 \Rightarrow x = 3$ (y $y = 6$).

### Por igualación

En el sistema $y = 3x - 1$, $y = x + 5$, ¿cuánto vale $y$?

respuesta: 8

#### Resolución

$3x - 1 = x + 5 \Rightarrow 2x = 6 \Rightarrow x = 3$. Entonces $y = 3 + 5 = 8$.

### Con determinantes

En el sistema $2x + y = 7$, $x - y = 2$, ¿cuánto vale el determinante $\begin{vmatrix} 2 & 1 \\ 1 & -1 \end{vmatrix}$?

respuesta: -3

#### Resolución

$2 \cdot (-1) - 1 \cdot 1 = -2 - 1 = -3$. (Y con eso sale $x = 3$, $y = 1$.)

## Para tutores

### Objetivo

- Entender que resolver un sistema es encontrar el punto que está en las dos rectas, y saber hacerlo con al menos un método.

### Antes tiene que saber

- [Resolver ecuaciones](tema:resolver-ecuaciones) y la [función lineal](tema:funcion-lineal).

### Errores típicos

- Encontrar $x$ y olvidarse de calcular $y$.
- Errores de signo al reemplazar: $x - (5 - x)$ no es $x - 5 - x$.
- No comprobar al final.

### Cómo destrabarlo

- La solución es un par $(x, y)$ que cumple **las dos** ecuaciones: el punto tiene dos coordenadas, así que faltan las dos.
- En sustitución, reemplazar con paréntesis: $x - (5 - x)$.
- En reducción, escribir la resta en columna y cuidar el signo de **todos** los términos.
- Verificar siempre en las dos ecuaciones.

### En el pizarrón

- Dibujar las dos rectas con una tablita de 2 o 3 puntos cada una y marcar el cruce.
- Resolver con un solo método primero; los otros, después.
- Escribir las dos ecuaciones con una llave y numerarlas (1) y (2).
- Cerrar con la verificación en las dos.

### Preguntas para el alumno

- ¿Cómo sabés si un punto es solución?
- ¿Qué método te resulta más cómodo? ¿Por qué?
- En el dibujo, ¿qué quiere decir resolver el sistema?
- Si un punto cumple solo una de las ecuaciones, ¿dónde está?
