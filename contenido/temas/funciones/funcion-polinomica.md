---
titulo: Funciones polinómicas
subseccion: Funciones
resumen: Polinomios de cualquier grado, escritos con sus raíces. La lineal y la cuadrática son casos particulares.
orden: 40
interactivo: polinomica
---

## Intuición

Arrastrá las raíces (los puntos amarillos) sobre el eje $x$ y mirá cómo se mueve la curva.

- Juntá dos raíces en el mismo lugar: ¿qué hace la curva ahí?
- Cambiá el **grado**. ¿Qué pasa con grado 1 y grado 2?
- Probá $a$ negativo.

## Explicación

- Una **función polinómica** es un polinomio: $f(x) = x^3 - 2x^2 - 5x + 6$, por ejemplo.
- El **grado** es el exponente más grande de la $x$. Grado 1 es una **lineal** (recta) y grado 2 una **cuadrática** (parábola): son casos particulares.
- Si se conocen las **raíces**, el polinomio se puede escribir así (**forma factorizada**):

$$
f(x) = a\,(x - r_1)(x - r_2)(x - r_3)
$$

- Las raíces se leen directo: cada paréntesis da 0 cuando $x$ vale su raíz, y **cualquier cosa por 0 da 0**.
- Un polinomio de grado $n$ tiene **como mucho $n$ raíces**.
- **Raíz doble:** si una raíz se repite, la curva toca el eje y **rebota**, sin cruzarlo.
- **Las puntas:** con $a > 0$, por la derecha la curva se va para arriba. Si el grado es par, por la izquierda también; si es impar, por la izquierda viene de abajo.
- **C⁺ y C⁻:** la curva solo puede cambiar de signo en una raíz. Alcanza con mirar un número en cada tramo entre raíces.
- **Máximos, mínimos y puntos de inflexión:** donde la curva deja de subir y empieza a bajar (o al revés), y donde cambia de forma. Se calculan con derivadas (más adelante).

## Para recordar

- Grado = la potencia más grande de $x$.
- $a(x - r_1)(x - r_2)\ldots$: las raíces se leen directo.
- Raíz doble: toca y rebota.
- Grado $n$: como mucho $n$ raíces.

## Ejemplo resuelto

Para $f(x) = 2(x + 1)(x - 3)$, encontrá las raíces, la ordenada al origen y el C⁺.

### Paso 1: las raíces

$x + 1 = 0 \Rightarrow x = -1$. $\;x - 3 = 0 \Rightarrow x = 3$.

### Paso 2: la ordenada al origen

$f(0) = 2 \cdot (0 + 1) \cdot (0 - 3) = 2 \cdot 1 \cdot (-3) = -6$.

### Paso 3: C⁺

Las raíces cortan la recta en tres tramos. Pruebo un número en cada uno:

- $x = -2$: $2 \cdot (-1) \cdot (-5) = 10$, positivo.
- $x = 0$: $-6$, negativo.
- $x = 4$: $2 \cdot 5 \cdot 1 = 10$, positivo.

C⁺ $= (-\infty, -1) \cup (3, +\infty)$.

## Ejercicios

### Nivel: Para arrancar

### El grado

¿De qué grado es $f(x) = 4x^3 - x^5 + 2$?

respuesta: 5

pista: Fijate el exponente más grande, no el primero.

### Leer las raíces

¿Cuál de estos números **no** es raíz de $f(x) = (x - 2)(x + 4)(x - 1)$?

- [ ] $2$
- [x] $4$
- [ ] $1$
- [ ] $-4$

#### Resolución

$(x + 4)$ da 0 cuando $x = -4$, no cuando $x = 4$.

### ¿Cuántas como mucho?

¿Cuántas raíces puede tener **como mucho** un polinomio de grado 4?

respuesta: 4

### Nivel: Para animarse

### Ordenada al origen

¿Cuánto vale la ordenada al origen de $f(x) = 3(x - 1)(x + 2)$?

respuesta: -6

#### Resolución

$f(0) = 3 \cdot (0 - 1) \cdot (0 + 2) = 3 \cdot (-1) \cdot 2 = -6$.

### Raíz doble

En $f(x) = (x - 2)^2 (x + 1)$, ¿qué hace la curva en $x = 2$?

- [ ] Cruza el eje $x$
- [x] Toca el eje $x$ y rebota
- [ ] No toca el eje $x$

### Las puntas

$f(x) = -x^3 + 4x$. Por la derecha (cuando $x$ es muy grande), la curva…

- [ ] …se va para arriba
- [x] …se va para abajo

pista: Pensá en $x = 10$: ¿quién manda, $-x^3$ o $4x$?

#### Resolución

Con $x = 10$: $-1000 + 40 = -960$. Manda el término de mayor grado, que es negativo.

### Un valor

Si $f(x) = x(x - 1)(x + 2)$, ¿cuánto vale $f(2)$?

respuesta: 8

#### Resolución

$f(2) = 2 \cdot (2 - 1) \cdot (2 + 2) = 2 \cdot 1 \cdot 4 = 8$.

## Para tutores

### Objetivo

- Reconocer el grado y leer las raíces de la forma factorizada.
- Ver que la lineal y la cuadrática son polinomios de grado 1 y 2.

### Antes tiene que saber

- [Función lineal](tema:funcion-lineal) y [función cuadrática](tema:funcion-cuadratica).
- [Distributiva](tema:distributiva-y-factor-comun), para desarrollar los paréntesis.

### Errores típicos

- Leer la raíz de $(x + 4)$ como $4$.
- Creer que el grado es el exponente del primer término.
- Pensar que siempre hay tantas raíces como el grado.

### Cómo destrabarlo

- Para cada paréntesis, preguntar "¿qué $x$ hace que esto dé 0?": en $(x - 3)$ es 3 y en $(x + 4)$ es $-4$.
- El grado es el exponente más grande, esté donde esté. En la forma con raíces, se cuentan los paréntesis.
- Puede haber menos raíces que el grado: $x^2 + 1$ no tiene ninguna.
- Para el signo en cada tramo, probar un número fácil y mirar solo el signo de cada factor.

### En el pizarrón

- Marcar las raíces en el eje, probar un número en cada tramo y dibujar la curva pasando por arriba o por abajo.
- Escribir el producto, por ejemplo $(x + 2)(x - 1)(x - 3)$, y debajo de cada factor su raíz.
- Hacer una tira con los tramos y el signo de $f$ en cada uno.
- Mirar las puntas: con $a$ positivo y grado impar, viene de abajo y se va para arriba.

### Preguntas para el alumno

- ¿Por qué $x = 3$ es raíz de $(x - 3)(x + 1)$?
- ¿Cuántas raíces puede tener, como mucho, un polinomio de grado 4?
- ¿Qué le pasa al gráfico si dos raíces se juntan?
- ¿Por qué la lineal y la cuadrática también son polinomios?
