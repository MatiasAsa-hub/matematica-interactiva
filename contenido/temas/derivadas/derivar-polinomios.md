---
titulo: Derivar polinomios y tabla de derivadas
subseccion: Derivadas
resumen: La regla para derivar xⁿ, término a término, y las derivadas de tabla.
orden: 30
interactivo: recorrer
# formula: true deja prendida la casilla "Fórmula de f'"
formula: true
funciones:
  - "x^2"
  - "x^3 - 3x"
  - "-x^2 + 4x"
  - "2x + 1"
  - "3"
---

## Intuición

Pasá por las funciones con ‹ › y mirá la fórmula de $f'$ que aparece debajo de cada una.

- $x^2$ da $2x$. ¿Qué pasó con el exponente? ¿Y con el 2?
- En $x^3 - 3x$, ¿cómo se derivó cada término?
- ¿Qué derivada tiene la constante 3? Mirá la gráfica de abajo: ¿por qué da eso?

## Explicación

- **La regla:** para derivar $x^n$, el exponente **baja multiplicando** y se le **resta 1**:

$$
(x^n)' = n \cdot x^{n - 1}
$$

  - $(x^2)' = 2x$, $(x^3)' = 3x^2$, $(x^5)' = 5x^4$.
- **Un número que multiplica se queda:** $(4x^3)' = 4 \cdot 3x^2 = 12x^2$.
- **Casos que conviene saber de memoria:**
  - $(k \cdot x)' = k$: la pendiente de una recta. Por ejemplo, $(2x)' = 2$.
  - $(k)' = 0$: una constante no sube ni baja.
- **Una suma se deriva término a término:**
  - $(x^3 - 3x + 5)' = 3x^2 - 3 + 0 = 3x^2 - 3$.
- Todo esto sale de la [derivada por definición](tema:que-es-la-derivada). Para no hacer la cuenta larga cada vez, se usa la regla.
- **Tabla de derivadas** (otras funciones que ya vimos):

| $f(x)$ | $f'(x)$ |
|---|---|
| $k$ (un número) | $0$ |
| $x^n$ | $n \cdot x^{n-1}$ |
| $\text{sen}(x)$ | $\cos(x)$ |
| $\cos(x)$ | $-\text{sen}(x)$ |
| $e^x$ | $e^x$ |
| $\ln(x)$ | $\dfrac{1}{x}$ |

## Para recordar

- $(x^n)' = n \cdot x^{n-1}$: el exponente baja y se le resta 1.
- El número que multiplica se queda. La constante sola da 0.
- Se deriva término a término.

## Ejemplo resuelto

Derivá $f(x) = 2x^3 - 5x^2 + 4x - 7$ y calculá $f'(1)$.

### Paso 1: término a término

- $(2x^3)' = 2 \cdot 3x^2 = 6x^2$
- $(-5x^2)' = -5 \cdot 2x = -10x$
- $(4x)' = 4$
- $(-7)' = 0$

### Paso 2: juntar

$f'(x) = 6x^2 - 10x + 4$

### Paso 3: f'(1)

$f'(1) = 6 \cdot 1 - 10 \cdot 1 + 4 = 0$. En $x = 1$ la tangente está acostada.

## Ejercicios

### Nivel: Para arrancar

### Una potencia

Si $f(x) = x^4$, ¿cuánto vale $f'(2)$?

respuesta: 32

pista: $f'(x) = 4x^3$.

#### Resolución

$f'(x) = 4x^3$, así que $f'(2) = 4 \cdot 2^3 = 4 \cdot 8 = 32$.

### Con un número adelante

Si $f(x) = 3x^2$, ¿cuánto vale $f'(4)$?

respuesta: 24

### Una constante

Si $f(x) = 7$, ¿cuánto vale $f'(x)$?

respuesta: 0

### Elegí la derivada

¿Cuál es la derivada de $x^3 + 2x$?

- [x] $3x^2 + 2$
- [ ] $3x^2 + 2x$
- [ ] $x^2 + 2$
- [ ] $3x^3 + 2$

### Nivel: Para animarse

### La cúbica

Si $f(x) = x^3 - 3x$, ¿cuánto vale $f'(2)$?

respuesta: 9

#### Resolución

$f'(x) = 3x^2 - 3$, así que $f'(2) = 3 \cdot 4 - 3 = 9$.

### El vértice con la derivada

Para $f(x) = -x^2 + 4x$, ¿en qué $x$ está el vértice? Usá que ahí $f'(x) = 0$.

respuesta: 2

pista: $f'(x) = -2x + 4$.

#### Resolución

$f'(x) = -2x + 4 = 0 \Rightarrow x = 2$. Es el mismo vértice que da la fórmula de la [cuadrática](tema:funcion-cuadratica): $x_v = -b : (2a) = -4 : (-2) = 2$.

### Dónde se acuesta

Si $f(x) = 2x^3 - 6x + 1$, ¿en qué $x$ positivo la tangente está acostada?

respuesta: 1

#### Resolución

$f'(x) = 6x^2 - 6 = 0 \Rightarrow x^2 = 1 \Rightarrow x = 1$ (o $-1$).

### De la tabla

Si $f(x) = \text{sen}(x)$, ¿cuánto vale $f'(0)$?

respuesta: 1

pista: Mirá la tabla: la derivada del seno es el coseno.

## Para tutores

### Objetivo

- Derivar polinomios con la regla, término a término, y usar la tabla para las demás.

### Antes tiene que saber

- [Potencias](tema:potencias-y-raices) y [derivada por definición](tema:que-es-la-derivada) (para saber de dónde sale la regla).

### Errores típicos

- Bajar el exponente pero no restarle 1: $(x^3)' = 3x^3$.
- Pensar que la derivada de una constante es la misma constante.
- $(2x)' = 2x$ en vez de $2$.

### En el pizarrón

- Escribir la regla grande arriba y derivar un polinomio con una flechita debajo de cada término.
- Comprobar una vez con la definición, para que vean que no es magia.
- _(para completar)_

### Preguntas para el alumno

- ¿Qué grado tiene la derivada de un polinomio de grado 3?
- ¿Por qué la derivada de una recta es un número?
- _(para completar)_
