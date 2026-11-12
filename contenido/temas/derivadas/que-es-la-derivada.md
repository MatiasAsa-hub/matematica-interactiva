---
titulo: ¿Qué es la derivada?
subseccion: Derivadas
resumen: De la secante a la tangente, y la cuenta por definición con x y x + h.
orden: 10
interactivo: secante
# Las funciones del interactivo (se pasa de una a otra con las flechitas ‹ ›).
# Se puede escribir: x^2, x^3 - 3x, 2x + 1, sen(x), cos(x), e^x
funciones:
  - "x^2"
  - "x^3 - 3x"
  - "2x + 1"
  - "sen(x)"
---

## Intuición

Tocá **Achicar h** y mirá qué pasa con el punto negro y con la recta.

- ¿Qué números van apareciendo en la tablita? ¿A cuál se acercan?
- Cuando *h* es muy chico, ¿la recta corta la curva o apenas la toca?
- Poné *h* negativo (el punto negro a la izquierda) y achicalo de nuevo. ¿Se llega al mismo número?
- Prendé **Con h en la cuenta**. Para $x^2$ en $x = 1$ dice $2 + h$: ¿qué le pasa cuando *h* se achica? Mové el punto azul a $x = 2$, $x = 3$… ¿Ves un patrón?
- Pasá a $2x + 1$ con ‹ ›. ¿Por qué la cuenta no tiene *h*?

## Explicación

- La **secante** es la recta que pasa por dos puntos de la curva: $(x, f(x))$ y $(x + h, f(x + h))$.
- Su pendiente es lo que sube dividido lo que avanza. Esa cuenta se llama **cociente incremental**:

$$
\frac{f(x + h) - f(x)}{h}
$$

- Si $h$ se achica, el segundo punto se acerca al primero y la secante se va apoyando en la curva. Al final queda la **recta tangente**: la que "toca" la curva en ese punto.
- La pendiente de la tangente es la **derivada** de $f$ en $x$. Se escribe $f'(x)$.
- Qué dice la derivada:
  - $f'(x) > 0$: la curva **sube** ahí (crece).
  - $f'(x) < 0$: la curva **baja** ahí (decrece).
  - $f'(x) = 0$: la curva está **acostada** (puede ser un máximo o un mínimo).
- Es la misma idea que la pendiente de la [función lineal](tema:funcion-lineal), pero en una curva la pendiente cambia de punto a punto.

### Por definición

- $h$ nunca llega a 0 (quedaría $0 : 0$): se achica todo lo que queramos y se mira **a qué número se acerca** la cuenta. Eso se escribe con un **[límite](tema:limites)**:

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
$$

- **El truco:** primero se hace la cuenta con letras y se simplifica la $h$ de abajo. Recién después se achica $h$.
- Primero con números. Para $f(x) = x^2$ en $x = 3$:
  - $f(3 + h) - f(3) = (3 + h)^2 - 9$
  - Hago la cuenta: $9 + 6h + h^2 - 9 = 6h + h^2$
  - Divido por $h$: $(6h + h^2) : h = 6 + h$
  - Achico $h$: queda $6$. Entonces $f'(3) = 6$.
- Después con $x$, y sale para todos los puntos de una (ver el ejemplo resuelto). Con esto se puede llegar a **cualquier** derivada.
- Para el cuadrado de una suma se usa la [distributiva](tema:distributiva-y-factor-comun): $(x + h)^2 = x^2 + 2xh + h^2$.

## Para recordar

- Pendiente de la secante: $(f(x + h) - f(x)) : h$.
- Achicando $h$, la secante se convierte en la tangente. Su pendiente es la derivada $f'(x)$.
- Positiva: crece. Negativa: decrece. Cero: acostada.
- Por definición: primero simplificar la $h$ de abajo, después achicar $h$.
- $(x^2)' = 2x$.

## Ejemplo resuelto

Para $f(x) = x^2$: primero calculá $f'(1)$ con números, achicando $h$. Después calculá $f'(x)$ por definición.

### Paso 1: con números, h = 1 y h = 0.1

- $h = 1$: $\big(f(2) - f(1)\big) : 1 = (4 - 1) : 1 = 3$
- $h = 0.1$: $\big(f(1.1) - f(1)\big) : 0.1 = (1.21 - 1) : 0.1 = 2.1$

### Paso 2: con números, h = 0.01

$\big(f(1.01) - f(1)\big) : 0.01 = (1.0201 - 1) : 0.01 = 2.01$

3, 2.1, 2.01… se acerca a **2**. Entonces $f'(1) = 2$.

### Paso 3: con letras, f(x + h) − f(x)

$(x + h)^2 - x^2 = x^2 + 2xh + h^2 - x^2 = 2xh + h^2$

### Paso 4: dividir por h y achicar h

$(2xh + h^2) : h = 2x + h$ (se saca [factor común](tema:distributiva-y-factor-comun) $h$ y se simplifica).

Cuando $h \to 0$, queda $f'(x) = 2x$. Comprobación: $f'(1) = 2 \cdot 1 = 2$, lo mismo que con números.

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

### ¿Sube o baja?

Si $f'(-1) = -2$, ¿qué hace la curva en $x = -1$?

- [ ] Crece
- [x] Decrece
- [ ] Está acostada

pista: El signo de la derivada dice si sube o baja.

### Usando la fórmula

Ya sabemos que la derivada de $x^2$ es $2x$. ¿Cuánto vale $f'(5)$?

respuesta: 10

### Nivel: Para animarse

### Una recta

Para $f(x) = 2x + 1$, ¿cuánto da $(f(x + h) - f(x)) : h$?

respuesta: 2

pista: $f(x + h) = 2(x + h) + 1 = 2x + 2h + 1$.

#### Resolución

$f(x + h) - f(x) = 2x + 2h + 1 - (2x + 1) = 2h$. Dividido $h$ da $2$. La pendiente de una recta es la misma en todos lados.

### Una constante

Si $f(x) = 5$ (una recta horizontal), ¿cuánto vale $f'(x)$?

- [x] 0
- [ ] 5
- [ ] 1
- [ ] No tiene derivada

pista: $f(x + h) - f(x) = 5 - 5$.

### Con una suma

Para $f(x) = x^2 + x$, ¿cuánto vale $f'(3)$?

respuesta: 7

pista: Hacé la cuenta con letras: $(x + h)^2 + (x + h) - (x^2 + x)$.

#### Resolución

$(x + h)^2 + (x + h) - x^2 - x = 2xh + h^2 + h$. Dividido $h$: $2x + h + 1$. Achicando $h$: $f'(x) = 2x + 1$. En $x = 3$: $7$.

### El cubo

Usando que $(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$, ¿cuánto vale la derivada de $x^3$ en $x = 2$?

respuesta: 12

#### Resolución

$(x + h)^3 - x^3 = 3x^2h + 3xh^2 + h^3$. Dividido $h$: $3x^2 + 3xh + h^2$. Achicando $h$: $3x^2$. En $x = 2$: $3 \cdot 4 = 12$.

## Para tutores

### Objetivo

- Entender la derivada como la pendiente de la curva en un punto (la de la tangente), y que sale de achicar $h$.
- Hacer la cuenta por definición para funciones simples y ver que da una fórmula para todos los puntos.

### Antes tiene que saber

- [Función lineal](tema:funcion-lineal) (pendiente), [qué es una función](tema:que-es-una-funcion) (calcular $f$ de un número) y [distributiva y factor común](tema:distributiva-y-factor-comun).
- [Límites](tema:limites): qué quiere decir que algo "se acerca" y qué hacer con $0 : 0$.

### Errores típicos

- Poner $h = 0$ antes de simplificar: queda $0 : 0$.
- Confundir $f(x + h)$ con $f(x) + h$.
- $(x + h)^2 = x^2 + h^2$ (se olvida el $2xh$).
- No restar todo $f(x)$: olvidar el paréntesis en $-(2x + 1)$.

### Cómo destrabarlo

- Pendiente = "lo que sube dividido lo que avanza". Repasarlo con dos puntos de una recta antes de arrancar.
- $f(x + h)$ no es $f(x) + h$: calcularlo primero con números, por ejemplo $f(3.1)$, y después con letras.
- $(x + h)^2$: escribirlo como $(x + h)(x + h)$ y hacer las cuatro multiplicaciones.
- No se puede poner $h = 0$ de entrada, porque queda $0 : 0$. Primero se simplifica la $h$ y después se achica.
- Al restar $f(x)$, ponerla entre paréntesis.

### En el pizarrón

- Dibujar una parábola, marcar un punto y otro más a la derecha, y la secante que los une.
- Ir corriendo el segundo punto hacia el primero (con otro color cada vez) y anotar las pendientes en una tablita.
- Después, la fórmula del límite arriba y la cuenta en renglones: primero con $x = 3$ y después con $x$.
- Dejar a la vista el triángulo de la secante: la base mide $h$ y la altura, $f(x + h) - f(x)$.

### Preguntas para el alumno

- ¿Qué pasa con la secante cuando $h$ se achica?
- ¿Por qué hay que simplificar antes de achicar $h$?
- Con $f'(x) = 2x$, ¿cuánto vale la pendiente en $x = -1$? ¿Sube o baja?
- ¿Qué signo tiene la derivada donde la función baja?
