---
titulo: Área entre dos curvas
subseccion: Integrales
resumen: El área entre f y g es la integral de "la de arriba menos la de abajo".
orden: 76
interactivo: integral
barrow: true
# Cada ejemplo: "la de arriba ; abajo: la de abajo ; de a a b"
integrales:
  - "x + 2 ; abajo: x^2 ; de -1 a 2"
  - "4 ; abajo: x^2 ; de -2 a 2"
  - "x ; abajo: x^2 ; de 0 a 1"
  - "x ; abajo: x^2 ; de 0 a 2"
---

## Intuición

Tocá **Achicar dx** y mirá cómo son las tiras ahora.

- ¿Desde dónde hasta dónde va cada tira? ¿Cuánto mide de alto?
- En el primer ejemplo, ¿por qué *a* = −1 y *b* = 2? Fijate dónde se cruzan las curvas.
- En el último ejemplo, ¿por qué aparecen tiras rojas? ¿Qué curva está arriba ahí?

## Explicación

- Ahora el área está **entre dos curvas**: $f$ (arriba, azul) y $g$ (abajo, rosa).
- Cada tira va de $g$ a $f$: mide $f(x) - g(x)$ de alto. Achicando $dx$ queda:

$$
\text{Área} = \int_a^b \big(f(x) - g(x)\big)\, dx
$$

- **Siempre "la de arriba menos la de abajo".** Si se cruzan, la resta da negativa (tiras rojas) y hay que separar en tramos.
- Cómo se hace:
  1. Buscar dónde se cruzan: igualar $f(x) = g(x)$. Esos son $a$ y $b$.
  2. Ver cuál está arriba (probando un número del medio).
  3. Integrar "arriba menos abajo" con la [regla de Barrow](tema:regla-de-barrow).
- Para igualar, muchas veces queda una [cuadrática](tema:funcion-cuadratica): se resuelve con la resolvente.

## Para recordar

- Área entre curvas: $\int_a^b (\text{arriba} - \text{abajo})\, dx$.
- $a$ y $b$: donde se cruzan ($f(x) = g(x)$).
- Si se cruzan en el medio, separar en tramos.

## Ejemplo resuelto

Calculá el área entre $f(x) = x + 2$ y $g(x) = x^2$.

### Paso 1: dónde se cruzan

$x^2 = x + 2 \Rightarrow x^2 - x - 2 = 0 \Rightarrow x = -1$ o $x = 2$.

### Paso 2: cuál está arriba

En $x = 0$: $f(0) = 2$ y $g(0) = 0$. Arriba está $f$.

### Paso 3: la resta

$f(x) - g(x) = -x^2 + x + 2$. Una primitiva: $F(x) = -\dfrac{x^3}{3} + \dfrac{x^2}{2} + 2x$.

### Paso 4: Barrow

$F(2) = -\frac{8}{3} + 2 + 4 = \frac{10}{3}$ y $F(-1) = \frac{1}{3} + \frac{1}{2} - 2 = -\frac{7}{6}$.

Área $= \frac{10}{3} - \left(-\frac{7}{6}\right) = \frac{9}{2} = 4.5$.

## Ejercicios

### Nivel: Para arrancar

### Un rectángulo

¿Cuál es el área entre $f(x) = 3$ y $g(x) = 1$, desde $x = 0$ hasta $x = 4$?

respuesta: 8

pista: La resta es $3 - 1 = 2$ en todos lados.

### Cuál va arriba

Entre $x = 0$ y $x = 1$, ¿cuál está arriba: $x$ o $x^2$?

- [x] $x$
- [ ] $x^2$
- [ ] Son iguales

pista: Probá con $x = 0.5$.

### Dónde se cruzan

¿En qué $x$ positivo se cruzan $f(x) = x + 2$ y $g(x) = x^2$?

respuesta: 2

### Nivel: Para animarse

### Entre x y x²

¿Cuánto vale el área entre $x$ y $x^2$, de 0 a 1? (Podés escribirla como fracción.)

respuesta: 1/6

#### Resolución

$\int_0^1 (x - x^2)\, dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0.17$.

### Debajo de una recta horizontal

¿Cuánto vale el área entre $f(x) = 4$ y $g(x) = x^2$? (Primero buscá dónde se cruzan.)

respuesta: 32/3

pista: Se cruzan en $x = -2$ y $x = 2$.

#### Resolución

$\int_{-2}^{2} (4 - x^2)\, dx$. Con $F(x) = 4x - \frac{x^3}{3}$: $F(2) - F(-2) = \frac{16}{3} - \left(-\frac{16}{3}\right) = \frac{32}{3} \approx 10.67$.

### Recta y parábola

¿Cuánto vale el área entre $f(x) = 2x$ y $g(x) = x^2$?

respuesta: 4/3

pista: Se cruzan en $x = 0$ y $x = 2$. Entre ellos, arriba está $2x$.

#### Resolución

$\int_0^2 (2x - x^2)\, dx = \left(4 - \frac{8}{3}\right) - 0 = \frac{4}{3} \approx 1.33$.

## Para tutores

### Objetivo

- Calcular el área entre dos curvas: buscar los cruces, ver cuál va arriba e integrar la resta.

### Antes tiene que saber

- [Regla de Barrow](tema:regla-de-barrow) y resolver cuadráticas ([función cuadrática](tema:funcion-cuadratica)).

### Errores típicos

- Restar al revés (abajo menos arriba) y obtener un área negativa.
- No buscar los cruces e integrar en cualquier intervalo.
- No separar en tramos cuando las curvas se cruzan en el medio.

### En el pizarrón

- Dibujar las dos curvas, marcar los cruces y rayar el área.
- Dibujar una tira y preguntar: ¿cuánto mide de alto? (arriba menos abajo).
- _(para completar)_

### Preguntas para el alumno

- ¿Cómo sabés cuál de las dos va arriba?
- ¿Qué pasa si las curvas se cruzan en el medio del intervalo?
- _(para completar)_
