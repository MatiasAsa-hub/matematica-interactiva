---
titulo: Función módulo
subseccion: Funciones
resumen: f(x) = a|x − h| + k. La V. El módulo da vuelta lo negativo.
orden: 46
interactivo: familia
familia: modulo
---

## Intuición

Arrastrá el punto azul y mirá la cuenta de arriba: ¿qué le hace el módulo al número de adentro?

- Prendé **Sin el módulo**: ¿qué parte de la recta "rebota"?
- Mové **h** y **k**: ¿a dónde va el vértice?
- Poné **a** negativo. ¿Qué pasa con la V?

## Explicación

- El **módulo** (o valor absoluto) de un número es ese número **sin el signo**: $|3| = 3$, $|-3| = 3$, $|0| = 0$.
  - También es la **distancia al 0** en la recta numérica.
- El gráfico de $|x|$ es una **V**: donde $x$ es negativo, el módulo lo da vuelta a positivo.
- $f(x) = a|x - h| + k$ funciona igual que la forma canónica de la [cuadrática](tema:funcion-cuadratica):
  - El **vértice** está en $(h, k)$.
  - $a$ abre o cierra la V. Si es negativo, la V queda dada vuelta.
- Es **simétrica**: lo que pasa a la izquierda del vértice es el espejo de lo que pasa a la derecha.
- Las **raíces** se buscan como en una ecuación: $|x - 2| = 1$ tiene **dos** soluciones, $x - 2 = 1$ o $x - 2 = -1$.

## Para recordar

- $|x|$ = el número sin el signo (la distancia al 0).
- $a|x - h| + k$: vértice en $(h, k)$.
- $|\text{algo}| = 3$ da dos casos: $\text{algo} = 3$ o $\text{algo} = -3$.

## Ejemplo resuelto

Encontrá el vértice y las raíces de $f(x) = |x - 2| - 1$.

### Paso 1: el vértice

$h = 2$ y $k = -1$: el vértice es $(2, -1)$.

### Paso 2: las raíces

$|x - 2| - 1 = 0 \Rightarrow |x - 2| = 1$. Hay dos casos:
- $x - 2 = 1 \Rightarrow x = 3$
- $x - 2 = -1 \Rightarrow x = 1$

### Paso 3: comprobar

$f(3) = |1| - 1 = 0$ ✓ y $f(1) = |-1| - 1 = 0$ ✓

## Ejercicios

### Nivel: Para arrancar

### Un módulo

¿Cuánto vale $|-7|$?

respuesta: 7

### Una cuenta adentro

¿Cuánto vale $|2 - 5|$?

respuesta: 3

pista: Primero hacé la cuenta de adentro.

### Un valor

Si $f(x) = |x + 1|$, ¿cuánto vale $f(-4)$?

respuesta: 3

#### Resolución

$f(-4) = |-4 + 1| = |-3| = 3$.

### El vértice

¿Cuál es el vértice de $f(x) = |x - 3| + 2$?

- [x] $(3, 2)$
- [ ] $(-3, 2)$
- [ ] $(2, 3)$

### Nivel: Para animarse

### Las raíces

$f(x) = |x - 1| - 4$ tiene dos raíces. ¿Cuál es la **mayor**?

respuesta: 5

#### Resolución

$|x - 1| = 4$: $x - 1 = 4 \Rightarrow x = 5$, o $x - 1 = -4 \Rightarrow x = -3$. La mayor es 5.

### La imagen

¿Cuál es la imagen de $f(x) = |x| - 2$?

- [x] $[-2, +\infty)$
- [ ] $\mathbb{R}$
- [ ] $[0, +\infty)$

pista: ¿Cuál es el valor más chico que da? ¿Dónde está el vértice?

### Sin raíces

¿Cuántas raíces tiene $f(x) = |x| + 3$?

respuesta: 0

#### Resolución

$|x|$ nunca es negativo, así que $|x| + 3$ es siempre 3 o más: nunca llega a 0.

## Para tutores

### Objetivo

- Entender el módulo como "el número sin el signo" (o la distancia al 0).
- Reconocer el vértice en $a|x - h| + k$ y encontrar las dos raíces.

### Antes tiene que saber

- [Sumar y restar con signos](tema:sumar-y-restar-con-signos) y la [función lineal](tema:funcion-lineal).

### Errores típicos

- Creer que $|x - 3| = x + 3$ ("el módulo cambia el signo de todo").
- Quedarse con una sola raíz.
- Confundir el signo de $h$: el vértice de $|x - 3|$ está en 3, no en −3.

### En el pizarrón

- Tabla de $x$ y $|x|$ de −3 a 3, marcar los puntos: aparece la V.
- Dibujar la recta $y = x$ y "doblar" la parte de abajo hacia arriba.
- _(para completar)_

### Preguntas para el alumno

- ¿Puede el módulo dar negativo?
- ¿Qué números están a distancia 2 del 5?
- _(para completar)_
