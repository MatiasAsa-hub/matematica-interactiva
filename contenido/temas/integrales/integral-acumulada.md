---
titulo: La integral acumulada
subseccion: Integrales
resumen: "F(x), el área que se va juntando desde a. Su derivada es f: la integral es la inversa de la derivada."
orden: 20
interactivo: acumulada
# Las funciones del interactivo. Se puede agregar "; desde 1" para que el área
# arranque en otro lugar (si no, arranca en 0).
integrales:
  - "2"
  - "x"
  - "x^2 - 1"
  - "cos(x)"
---

## Intuición

Arrastrá el punto azul (o tocá **Recorrer solo**) y mirá qué se dibuja abajo.

- Con $f(x) = 2$, ¿cuánta área se junta por cada paso hacia la derecha? ¿Qué forma tiene $F$?
- Con $f(x) = x$, ¿por qué $F$ sube cada vez más rápido?
- Con $x^2 - 1$, ¿qué hace $F$ mientras el área es roja? ¿Dónde tiene $F$ un mínimo?
- Prendé **Pendiente de F**. ¿Qué número tiene la pendiente? Compará con la altura de $f$ arriba.

## Explicación

- Fijamos un punto de arranque $a$ y nos preguntamos: ¿cuánta área se juntó desde $a$ hasta $x$? Eso es una función nueva, la **integral acumulada**:

$$
F(x) = \int_a^x f(t)\, dt
$$

- (Se escribe $t$ adentro para no confundirla con la $x$ de arriba, que es hasta dónde se junta.)
- Cómo se leen juntas:
  - Donde $f$ es **positiva**, se suma área: $F$ **crece**.
  - Donde $f$ es **negativa**, se resta: $F$ **decrece**.
  - Donde $f$ cambia de signo, $F$ tiene un **máximo o un mínimo**.
- La pendiente de $F$ en cada punto es justo $f(x)$: **$F' = f$**. Es el espejo de [la gráfica de f'(x)](tema:grafica-de-la-derivada).
- Por eso se dice que la **integral es la inversa de la derivada**: si derivo lo que integré, vuelvo a $f$.

## Para recordar

- $F(x)$: el área (con signo) desde $a$ hasta $x$.
- $f > 0$: $F$ crece. $f < 0$: $F$ decrece.
- $F' = f$. Integrar y derivar son operaciones inversas.

## Ejemplo resuelto

Para $f(x) = x$, desde $a = 0$: calculá $F(2)$ y $F(4)$, y encontrá la fórmula de $F$.

### Paso 1: F(2)

El área bajo $y = x$ de 0 a 2 es un triángulo de base 2 y altura 2: $F(2) = 2 \cdot 2 : 2 = 2$.

### Paso 2: F(4)

Triángulo de base 4 y altura 4: $F(4) = 4 \cdot 4 : 2 = 8$.

### Paso 3: la fórmula

Para cualquier $x$: triángulo de base $x$ y altura $x$, así que $F(x) = \dfrac{x^2}{2}$.

### Paso 4: comprobar F' = f

Derivando: $F'(x) = \dfrac{2x}{2} = x = f(x)$.

## Ejercicios

### Nivel: Para arrancar

### Una constante

Para $f(x) = 2$, desde $a = 0$, ¿cuánto vale $F(3)$?

respuesta: 6

pista: Es un rectángulo.

### Un triángulo

Para $f(x) = x$, desde $a = 0$, ¿cuánto vale $F(6)$?

respuesta: 18

### Si f es positiva

Si $f$ es positiva en $(1, 4)$, ¿qué hace $F$ ahí?

- [x] Crece
- [ ] Decrece
- [ ] Se queda quieta

### La pendiente de F

Para $f(x) = x^2 - 1$, ¿cuánto vale $F'(2)$?

respuesta: 3

pista: $F' = f$.

#### Resolución

$F'(2) = f(2) = 2^2 - 1 = 3$.

### Nivel: Para animarse

### ¿Máximo o mínimo?

$f$ es negativa en $(0, 1)$ y positiva en $(1, +\infty)$. ¿Qué tiene $F$ en $x = 1$?

- [x] Un mínimo
- [ ] Un máximo
- [ ] Nada especial

pista: Antes de 1 se resta área y después se suma.

### Se compensa

Para $f(x) = x - 2$, desde $a = 0$, ¿cuánto vale $F(4)$?

respuesta: 0

#### Resolución

De 0 a 2 hay un triángulo abajo del eje, de área $2 \cdot 2 : 2 = 2$ (resta). De 2 a 4, uno igual arriba (suma). $F(4) = -2 + 2 = 0$.

### De la fórmula

Si $F(x) = x^3 - 3x$, ¿cuál es la función $f$ que se integró? Calculá $f(2)$.

respuesta: 9

pista: $f = F'$.

#### Resolución

$f(x) = F'(x) = 3x^2 - 3$, así que $f(2) = 12 - 3 = 9$.

## Para tutores

### Objetivo

- Ver la integral como una función que acumula área, y que su derivada es $f$.

### Antes tiene que saber

- [¿Qué es la integral?](tema:que-es-la-integral) y [la gráfica de f'(x)](tema:grafica-de-la-derivada).

### Errores típicos

- Confundir "$f$ es negativa" con "$F$ es negativa" ($F$ puede ser positiva y estar bajando).
- Pensar que $F$ arranca en cualquier lado: en $x = a$ siempre vale 0.

### Cómo destrabarlo

- $F(x)$ no es la altura de $f$: es cuánta área se juntó hasta $x$.
- Donde $f$ es positiva, $F$ sube; donde $f$ es negativa, $F$ baja (aunque $F$ todavía sea positiva); donde $f$ vale 0, $F$ tiene un máximo o un mínimo.
- En el punto de partida todavía no se juntó nada: por eso $F(a) = 0$.
- Es el espejo de [la gráfica de la derivada](tema:grafica-de-la-derivada): allá se pasaba de una función a su pendiente; acá, al revés.

### En el pizarrón

- Dibujar $f$ arriba y un eje abajo con las mismas marcas en $x$.
- Ir moviendo un dedo (o una regla vertical) de izquierda a derecha y anotar abajo cuánta área se juntó.
- Empezar con una $f$ constante, $f(x) = 2$: el área crece parejo y $F$ es una recta de pendiente 2.

### Preguntas para el alumno

- Si $f$ es constante, ¿qué forma tiene $F$? ¿Por qué?
- ¿Dónde tiene $F$ sus máximos y mínimos?
- Si $F$ sube cada vez más rápido, ¿cómo es $f$?
