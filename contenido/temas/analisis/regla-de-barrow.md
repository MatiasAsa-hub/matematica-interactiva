---
titulo: Regla de Barrow y primitivas
subseccion: Integrales
resumen: Calcular una integral sin tiras, con una primitiva. Tabla de primitivas.
orden: 74
interactivo: integral
# barrow: true prende la casilla "Regla de Barrow" (la cuenta con la primitiva)
barrow: true
integrales:
  - "x^2 ; de 0 a 3"
  - "3x^2 ; de 0 a 2"
  - "2x + 1 ; de 1 a 3"
  - "cos(x) ; de 0 a 1"
---

## Intuición

Mirá la cuenta de **Regla de Barrow** y después tocá **Achicar dx**.

- ¿El número que da Barrow es el mismo al que se acercan las tiras?
- En $x^2$, la primitiva es $\frac{x^3}{3}$. Derivala: ¿qué da?
- Arrastrá *b*. ¿La cuenta de Barrow cambia al toque? ¿Y las tiras?

## Explicación

- Achicar tiras funciona, pero es largo. Como la integral es la [inversa de la derivada](tema:integral-acumulada), hay un atajo.
- Una **primitiva** de $f$ es una función $F$ cuya derivada es $f$: $F' = f$.
  - Por ejemplo, una primitiva de $x^2$ es $\frac{x^3}{3}$, porque $\left(\frac{x^3}{3}\right)' = x^2$.
  - Si le sumo un número también sirve ($\frac{x^3}{3} + 5$). Por eso a veces se escribe $+ C$.
- **Regla de Barrow:** para calcular la integral, se busca una primitiva y se resta:

$$
\int_a^b f(x)\, dx = F(b) - F(a)
$$

  - El $+ C$ no importa: se cancela al restar.
- **Tabla de primitivas** (es la [tabla de derivadas](tema:derivar-polinomios) leída al revés):

| $f(x)$ | una primitiva $F(x)$ |
|---|---|
| $k$ (un número) | $k \cdot x$ |
| $x^n$ | $\dfrac{x^{n+1}}{n+1}$ |
| $\cos(x)$ | $\text{sen}(x)$ |
| $\text{sen}(x)$ | $-\cos(x)$ |
| $e^x$ | $e^x$ |
| $\dfrac{1}{x}$ | $\ln(x)$ (para $x > 0$) |

- Se integra **término a término** y el número que multiplica se queda: una primitiva de $3x^2 + 2$ es $x^3 + 2x$.

## Para recordar

- Primitiva: $F' = f$.
- Barrow: $\int_a^b f(x)\, dx = F(b) - F(a)$.
- $x^n$: se le suma 1 al exponente y se divide por el exponente nuevo.

## Ejemplo resuelto

Calculá $\int_1^3 (2x + 1)\, dx$ con la regla de Barrow.

### Paso 1: la primitiva

Término a término: una primitiva de $2x$ es $x^2$, y una de $1$ es $x$. Entonces $F(x) = x^2 + x$.

### Paso 2: comprobar

$F'(x) = 2x + 1$. ✓

### Paso 3: F(b) y F(a)

$F(3) = 9 + 3 = 12$ y $F(1) = 1 + 1 = 2$.

### Paso 4: restar

$\int_1^3 (2x + 1)\, dx = 12 - 2 = 10$.

## Ejercicios

### Nivel: Para arrancar

### Elegí la primitiva

¿Cuál es una primitiva de $x^3$?

- [x] $\frac{x^4}{4}$
- [ ] $3x^2$
- [ ] $x^4$
- [ ] $\frac{x^3}{3}$

pista: Derivá cada opción: ¿cuál da $x^3$?

### Con Barrow

¿Cuánto vale $\int_0^2 3x^2\, dx$?

respuesta: 8

pista: Una primitiva de $3x^2$ es $x^3$.

#### Resolución

$F(x) = x^3$. $F(2) - F(0) = 8 - 0 = 8$.

### Otra

¿Cuánto vale $\int_1^3 2x\, dx$?

respuesta: 8

#### Resolución

$F(x) = x^2$. $F(3) - F(1) = 9 - 1 = 8$.

### La de las tiras

¿Cuánto vale $\int_0^3 x^2\, dx$?

respuesta: 9

#### Resolución

$F(x) = \frac{x^3}{3}$. $F(3) - F(0) = \frac{27}{3} - 0 = 9$. Es el número al que se acercaban las tiras en [¿Qué es la integral?](tema:que-es-la-integral).

### Nivel: Para animarse

### Con fracciones

¿Cuánto vale $\int_0^1 (x^2 + x)\, dx$? (Podés escribirlo como fracción o decimal.)

respuesta: 5/6

pista: $F(x) = \frac{x^3}{3} + \frac{x^2}{2}$.

#### Resolución

$F(1) - F(0) = \frac{1}{3} + \frac{1}{2} - 0 = \frac{5}{6} \approx 0.83$.

### Se cancela

¿Cuánto vale $\int_{-1}^{1} x^3\, dx$?

respuesta: 0

#### Resolución

$F(x) = \frac{x^4}{4}$. $F(1) - F(-1) = \frac{1}{4} - \frac{1}{4} = 0$. Lo de abajo del eje compensa lo de arriba.

### Con el coseno

¿Cuánto vale $\int_0^{\pi/2} \cos(x)\, dx$?

respuesta: 1

pista: Una primitiva de $\cos(x)$ es $\text{sen}(x)$.

#### Resolución

$\text{sen}(\pi/2) - \text{sen}(0) = 1 - 0 = 1$.

## Para tutores

### Objetivo

- Calcular integrales con la regla de Barrow, buscando la primitiva con la tabla.

### Antes tiene que saber

- [Derivar polinomios](tema:derivar-polinomios) y [la integral acumulada](tema:integral-acumulada).

### Errores típicos

- Derivar en vez de buscar la primitiva ($x^3 \to 3x^2$).
- Olvidarse de dividir por el exponente nuevo.
- Restar al revés: $F(a) - F(b)$.
- Con un $F(a)$ negativo, olvidar el paréntesis al restar.

### En el pizarrón

- Escribir la tabla de derivadas y, al lado, la misma tabla con las flechas al revés.
- Resolver en tres renglones: primitiva, $F(b)$ y $F(a)$, resta.
- _(para completar)_

### Preguntas para el alumno

- ¿Cómo comprobás que una primitiva está bien?
- ¿Por qué no importa el $+ C$ en Barrow?
- _(para completar)_
