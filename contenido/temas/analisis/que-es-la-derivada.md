---
titulo: ¿Qué es la derivada?
subseccion: Derivadas
resumen: De la secante a la tangente. La derivada es la pendiente de la curva en un punto.
orden: 60
interactivo: secante
# Las funciones del interactivo (se pasa de una a otra con las flechitas ‹ ›).
# Se puede escribir: x^2, x^3 - 3x, 2x + 1, sen(x), cos(x), e^x
funciones:
  - "x^2"
  - "x^3 - 3x"
  - "sen(x)"
---

## Intuición

Tocá **Achicar h** y mirá qué pasa con el punto blanco y con la recta.

- ¿Qué números van apareciendo en la tablita? ¿A cuál se acercan?
- Cuando *h* es muy chico, ¿la recta corta la curva o apenas la toca?
- Poné *h* negativo (el punto blanco a la izquierda) y achicalo de nuevo. ¿Se llega al mismo número?
- Pasá a la segunda función con ‹ ›. En *x* = 1, ¿a qué número se acerca? ¿Cómo queda la recta?

## Explicación

- La **secante** es la recta que pasa por dos puntos de la curva: $(x, f(x))$ y $(x + h, f(x + h))$.
- Su pendiente es lo que sube dividido lo que avanza. Esa cuenta se llama **cociente incremental**:

$$
\frac{f(x + h) - f(x)}{h}
$$

- Si $h$ se achica, el segundo punto se acerca al primero y la secante se va apoyando en la curva. Al final queda la **recta tangente**: la que "toca" la curva en ese punto.
- La pendiente de la tangente es la **derivada** de $f$ en $x$. Se escribe $f'(x)$.
- $h$ nunca llega a 0 (quedaría $0 : 0$). Se achica tanto como queramos y se mira **a qué número se acerca** la cuenta.
- Qué dice la derivada:
  - $f'(x) > 0$: la curva **sube** ahí (crece).
  - $f'(x) < 0$: la curva **baja** ahí (decrece).
  - $f'(x) = 0$: la curva está **acostada** (puede ser un máximo o un mínimo).
- Es la misma idea que la pendiente de la [función lineal](tema:funcion-lineal), pero en una curva la pendiente cambia de punto a punto.

## Para recordar

- Pendiente de la secante: $(f(x + h) - f(x)) : h$.
- Achicando $h$, la secante se convierte en la tangente.
- La derivada $f'(x)$ es la pendiente de la tangente.
- Positiva: crece. Negativa: decrece. Cero: acostada.

## Ejemplo resuelto

Para $f(x) = x^2$ en $x = 1$, calculá la pendiente de la secante con $h = 1$, $h = 0.1$ y $h = 0.01$. ¿A qué número se acerca?

### Paso 1: h = 1

$\big(f(2) - f(1)\big) : 1 = (4 - 1) : 1 = 3$

### Paso 2: h = 0.1

$\big(f(1.1) - f(1)\big) : 0.1 = (1.21 - 1) : 0.1 = 2.1$

### Paso 3: h = 0.01

$\big(f(1.01) - f(1)\big) : 0.01 = (1.0201 - 1) : 0.01 = 2.01$

### Paso 4: a qué se acerca

3, 2.1, 2.01… se acerca a **2**. Entonces $f'(1) = 2$: en $x = 1$ la parábola sube, con pendiente 2.

## Ejercicios

### Nivel: Para arrancar

### Una secante

Para $f(x) = x^2$, ¿cuánto da la pendiente de la secante entre $x = 1$ y $x = 3$ (o sea, $h = 2$)?

respuesta: 4

pista: Calculá $f(3)$ y $f(1)$, restalos y dividí por 2.

#### Resolución

$\big(f(3) - f(1)\big) : 2 = (9 - 1) : 2 = 8 : 2 = 4$

### Con h más chico

Para $f(x) = x^2$ en $x = 2$, ¿cuánto da la pendiente de la secante con $h = 0.1$?

respuesta: 4.1

pista: $f(2.1) = 2.1 \cdot 2.1 = 4.41$.

#### Resolución

$\big(f(2.1) - f(2)\big) : 0.1 = (4.41 - 4) : 0.1 = 0.41 : 0.1 = 4.1$

### ¿A qué se acerca?

Para una función, las pendientes de las secantes dan 5, 4.1, 4.01 y 4.001 cuando $h$ se achica. ¿Cuánto vale la derivada en ese punto?

respuesta: 4

### Tangente acostada

Si $f'(3) = 0$, ¿cómo es la recta tangente en $x = 3$?

- [x] Horizontal (acostada)
- [ ] Sube
- [ ] Baja
- [ ] Vertical

### Nivel: Para animarse

### ¿Sube o baja?

Si $f'(-1) = -2$, ¿qué hace la curva en $x = -1$?

- [ ] Crece
- [x] Decrece
- [ ] Está acostada

pista: El signo de la derivada dice si sube o baja.

### Una cúbica

Para $f(x) = x^3 - 3x$, ¿cuánto da la pendiente de la secante entre $x = 1$ y $x = 2$?

respuesta: 4

pista: $f(2) = 8 - 6$ y $f(1) = 1 - 3$.

#### Resolución

$f(2) = 2$ y $f(1) = -2$. La pendiente es $\big(2 - (-2)\big) : 1 = 4$.

### La derivada de x²

Para $f(x) = x^2$ en $x = 3$, las secantes dan 7 ($h = 1$), 6.1 ($h = 0.1$) y 6.01 ($h = 0.01$). ¿Cuánto vale $f'(3)$?

respuesta: 6

## Para tutores

### Objetivo

- Entender la derivada como la pendiente de la curva en un punto (la de la tangente), y que sale de achicar $h$.

### Antes tiene que saber

- [Función lineal](tema:funcion-lineal) (pendiente) y [qué es una función](tema:que-es-una-funcion) (calcular $f$ de un número).

### Errores típicos

- Poner $h = 0$ directamente: queda $0 : 0$.
- Confundir $f(x + h)$ con $f(x) + h$.
- Pensar que la tangente "no puede cortar" la curva en otro lado (sí puede, lejos del punto).

### En el pizarrón

- Dibujar una parábola, marcar un punto y otro más a la derecha, y la secante que los une.
- Ir corriendo el segundo punto hacia el primero (con otro color cada vez) y anotar las pendientes en una tablita.
- _(para completar)_

### Preguntas para el alumno

- ¿Qué pasa con la secante cuando $h$ se achica?
- ¿Por qué no podemos poner $h = 0$ de una?
- _(para completar)_
