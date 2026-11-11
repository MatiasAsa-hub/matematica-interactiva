---
titulo: ¿Qué es la integral?
subseccion: Integrales
resumen: El área bajo la curva, con tiras que se van afinando. Σ f(x) · dx se convierte en ∫ f(x) dx.
orden: 70
interactivo: integral
# Los ejemplos del interactivo (se pasa de uno a otro con las flechitas ‹ ›).
# Cada uno: "función ; de a a b" (a y b, números enteros).
integrales:
  - "x^2 ; de 0 a 3"
  - "2x + 1 ; de 0 a 2"
  - "x^2 - 1 ; de 0 a 3"
---

## Intuición

Tocá **Achicar dx** y mirá qué pasa con las tiras.

- ¿Qué números van apareciendo en la tablita? ¿A cuál se acercan?
- Al principio, ¿las tiras tapan de más o de menos? ¿Y si elegís **Derecha**?
- Probá **Medio**. ¿Llega al mismo número?
- Arrastrá *a* y *b* (los rombos violetas) y achicá de nuevo.
- En el tercer ejemplo, ¿por qué hay tiras rojas? ¿La suma crece o baja con ellas?

## Explicación

- Queremos el **área** entre la curva y el eje *x*, desde $a$ hasta $b$. Como la curva no es recta, no hay una fórmula de geometría.
- La idea: llenarla con **tiras** (rectángulos) de ancho $dx$. Cada tira mide $f(x)$ de alto, así que su área es $f(x) \cdot dx$.
- Sumando todas se tiene una aproximación: $\Sigma\, f(x) \cdot dx$ (la $\Sigma$ quiere decir "suma").
- Si $dx$ se achica, las tiras son más finas y tapan mejor. Cuando $dx$ se achica todo lo que queramos, la suma se convierte en la **integral**:

$$
\int_a^b f(x)\, dx
$$

- La $\int$ es una S estirada (de "suma"), y $dx$ es "un pedacito muy chico de $x$".
- Da lo mismo tomar la altura a la izquierda, al medio o a la derecha: al achicar $dx$ todas llegan al mismo número.
- Lo que está **debajo del eje** cuenta **negativo** (las tiras rojas restan). Por eso a la integral se le dice "área con signo".
- Es la misma idea que la [derivada](tema:que-es-la-derivada): achicar algo ($h$ o $dx$) y mirar a qué número se acerca.

## Para recordar

- Cada tira: $f(x) \cdot dx$. Todas juntas: $\Sigma\, f(x) \cdot dx$.
- Achicando $dx$, la suma se convierte en $\int_a^b f(x)\, dx$.
- Arriba del eje suma; abajo, resta.

## Ejemplo resuelto

Para $f(x) = x^2$ entre 0 y 3, sumá las tiras con $dx = 1$ (altura a la izquierda). Después compará con la integral, que vale 9.

### Paso 1: las tiras

Con $dx = 1$ hay 3 tiras, que empiezan en $x = 0$, $x = 1$ y $x = 2$.

### Paso 2: las alturas

$f(0) = 0$, $f(1) = 1$ y $f(2) = 4$.

### Paso 3: la suma

$0 \cdot 1 + 1 \cdot 1 + 4 \cdot 1 = 5$

### Paso 4: comparar

5 es bastante menos que 9: las tiras tapan de menos, porque la curva sube y la altura se toma a la izquierda. Con $dx$ más chico la suma da 6.88, 7.91, 8.45… y se acerca a 9.

## Ejercicios

### Nivel: Para arrancar

### Tiras a la derecha

Para $f(x) = x^2$ entre 0 y 3, con $dx = 1$ y la altura a la **derecha**, ¿cuánto da la suma de las tiras?

respuesta: 14

pista: Las alturas son $f(1)$, $f(2)$ y $f(3)$.

#### Resolución

$1 \cdot 1 + 4 \cdot 1 + 9 \cdot 1 = 14$. Tapa de más: la integral vale 9.

### Una constante

¿Cuánto vale $\int_1^5 3\, dx$? (El área bajo $f(x) = 3$, entre 1 y 5.)

respuesta: 12

pista: Es un rectángulo.

#### Resolución

Un rectángulo de base $5 - 1 = 4$ y altura 3: $4 \cdot 3 = 12$.

### ¿A qué se acerca?

Las sumas de las tiras dan 8.5, 8.9, 8.99 y 8.999 cuando $dx$ se achica. ¿Cuánto vale la integral?

respuesta: 9

### Debajo del eje

Si $f$ es negativa en todo el intervalo $[a, b]$, ¿cómo da la integral?

- [x] Negativa
- [ ] Positiva
- [ ] 0

### Nivel: Para animarse

### Una recta

¿Cuánto vale $\int_0^2 (2x + 1)\, dx$?

respuesta: 6

pista: El área es un trapecio: las alturas son $f(0) = 1$ y $f(2) = 5$.

#### Resolución

Trapecio: $(1 + 5) \cdot 2 : 2 = 6$. También se puede partir en un rectángulo ($2 \cdot 1$) y un triángulo ($2 \cdot 4 : 2$): $2 + 4 = 6$.

### Se cancela

¿Cuánto vale $\int_{-2}^{2} x\, dx$?

respuesta: 0

pista: Dibujá $y = x$ entre −2 y 2. ¿Cuánto hay arriba del eje y cuánto abajo?

#### Resolución

Hay un triángulo de área 2 abajo del eje (resta) y otro de área 2 arriba (suma): $-2 + 2 = 0$.

### Tiras de una recta

Para $f(x) = x$ entre 0 y 4, con $dx = 1$ y la altura a la izquierda, ¿cuánto da la suma?

respuesta: 6

#### Resolución

$0 + 1 + 2 + 3 = 6$. La integral (un triángulo de base 4 y altura 4) vale 8.

## Para tutores

### Objetivo

- Entender la integral como el área (con signo) bajo la curva, que sale de sumar tiras cada vez más finas.

### Antes tiene que saber

- Área de rectángulos y triángulos, y [qué es una función](tema:que-es-una-funcion). Ayuda haber visto [qué es la derivada](tema:que-es-la-derivada).

### Errores típicos

- Pensar que la integral es "siempre positiva" (lo de abajo del eje resta).
- Confundir $dx$ con un número fijo: es el ancho de las tiras, y se achica.
- Sumar las alturas sin multiplicar por $dx$.

### En el pizarrón

- Dibujar la curva y 3 o 4 tiras grandes; sumar sus áreas.
- Redibujar con el doble de tiras (otro color) y comparar: cada vez tapa mejor.
- _(para completar)_

### Preguntas para el alumno

- ¿Por qué las tiras más finas tapan mejor?
- ¿Qué pasa con la suma si la curva está debajo del eje?
- _(para completar)_
