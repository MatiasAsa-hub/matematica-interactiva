---
titulo: Orden de las operaciones
subseccion: Operaciones
resumen: Qué se hace primero en una cuenta larga. Separar en términos.
orden: 40
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [multiplicar-y-dividir-con-signos]
interactivo: orden-operaciones
# Las cuentas del interactivo. Se escriben con · para multiplicar, : para dividir
# y ^ para las potencias (2^2 es 2²). Se pueden agregar o cambiar.
cuentas:
  - "2 + 3 · 4"
  - "20 − 12 : 4 · 2"
  - "(5 − 8) · 2 + 10"
  - "3 · 2^2 − (7 − 1) : 3"
  - "−4 + 2 · (−3)^2 − 5"
  - "(2 + 3)^2 − 4 · (−2)"
  - "18 : (−3) − (−2) · 5"
---

## Intuición

Tocá **Siguiente paso** y mirá qué operación se hace primero en cada renglón. ¿Por qué no se hace siempre de izquierda a derecha?

Probá también **Separar en términos**.

## Explicación

El orden es:

1. Lo que está **entre paréntesis**.
2. **Potencias** (y raíces).
3. **Multiplicaciones y divisiones**, de izquierda a derecha.
4. **Sumas y restas**, de izquierda a derecha.

- **Separar en términos:** los $+$ y $-$ que están **afuera** de los paréntesis cortan la cuenta en pedazos (términos). Cada término se resuelve por separado, y al final se suman o restan.
- Ejemplo: $2 + 3 \cdot 4$ tiene dos términos, $2$ y $3 \cdot 4$. Da $2 + 12 = 14$ (no $20$).

## Para recordar

1. Paréntesis. 2. Potencias y raíces. 3. Multiplicaciones y divisiones. 4. Sumas y restas.
- **Separá en términos:** los $+$ y $-$ de afuera de los paréntesis.

## Ejemplo resuelto

Resolvé $3 \cdot 2^2 - (7 - 1) : 3$.

### Paso 1: separar en términos

Hay dos términos: $3 \cdot 2^2$ y $(7 - 1) : 3$.

### Paso 2: cada término

$$
3 \cdot 2^2 = 3 \cdot 4 = 12 \qquad (7 - 1) : 3 = 6 : 3 = 2
$$

### Paso 3: juntar

$$
12 - 2 = 10
$$

## Ejercicios

### Nivel: Para arrancar

### Primero la multiplicación

¿Cuánto da $5 + 2 \cdot 3$?

respuesta: 11
pista: Son dos términos: $5$ y $2 \cdot 3$.

### Con paréntesis

¿Cuánto da $(5 + 2) \cdot 3$?

respuesta: 21
pista: Ahora el paréntesis va primero.

### División

¿Cuánto da $18 - 6 : 2$?

respuesta: 15

### Potencia

¿Cuánto da $2 \cdot 3^2$?

respuesta: 18
pista: Primero la potencia: $3^2 = 9$.

### Nivel: Para animarse

### Con negativos

¿Cuánto da $(-2)^2 - 3 \cdot (-1)$?

respuesta: 7
pista: $(-2)^2 = 4$ y $3 \cdot (-1) = -3$.

#### Resolución

$4 - (-3) = 4 + 3 = 7$.

### Paréntesis con negativos

¿Cuánto da $4 - 3 \cdot (2 - 5)$?

respuesta: 13
pista: $(2 - 5) = -3$.

#### Resolución

$4 - 3 \cdot (-3) = 4 - (-9) = 4 + 9 = 13$.

### ¿Qué va primero?

En $10 - 4 : 2$, ¿qué se hace primero?

- [ ] La resta
- [x] La división
- [ ] Da lo mismo

### Términos

¿Cuántos términos tiene $3 \cdot 4 - 2 + 6 : (1 + 2)$?

respuesta: 3
pista: Contá los $+$ y $-$ que están afuera de los paréntesis.

### Con x

Si $x = 3$, ¿cuánto vale $2x^2 - x$?

respuesta: 15
pista: $2x^2 = 2 \cdot 3^2$. La potencia va antes que la multiplicación.

#### Resolución

$2 \cdot 3^2 - 3 = 2 \cdot 9 - 3 = 18 - 3 = 15$.

## Para tutores

### Objetivo

- Resolver cuentas combinadas en el orden correcto.
- Separar en términos.

### Antes tiene que saber

- [Multiplicar y dividir con signos](tema:multiplicar-y-dividir-con-signos). Para las cuentas con potencias, [potencias y raíces](tema:potencias-y-raices).

### Errores típicos

- Resolver de izquierda a derecha sin mirar el orden: $2 + 3 \cdot 4 = 20$.
- En $2x^2$, multiplicar antes de elevar.
- Separar en términos con un $-$ que está adentro de un paréntesis.

### Cómo destrabarlo

- Antes de calcular, separar en términos: una rayita en cada $+$ y $-$ que esté fuera de los paréntesis.
- Resolver cada término por separado y recién al final sumar y restar.
- Un solo paso por renglón, copiando todo lo que todavía no se tocó.

### En el pizarrón

- Escribir $2 + 3 \cdot 4$ y preguntar cuánto da. Anotar las dos respuestas (20 y 14) y discutir cuál es.
- Marcar los términos con arquitos por arriba.
- Resolver una cuenta larga renglón por renglón, subrayando lo que se hace en cada paso.
- Dejar el orden escrito en un rincón: paréntesis, potencias, · y :, + y −.

### Preguntas para el alumno

- ¿Cuántos términos tiene $5 - 2 \cdot 3 + 8 : 4$?
- ¿Dónde hay que poner paréntesis para que $2 + 3 \cdot 4$ dé 20?
- En $2 \cdot 3^2$, ¿qué se hace primero?
