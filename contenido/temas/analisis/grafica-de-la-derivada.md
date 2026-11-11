---
titulo: La gráfica de f'(x)
subseccion: Derivadas
resumen: Recorrer la curva y dibujar la pendiente en cada punto. Crece, decrece y extremos.
orden: 64
interactivo: recorrer
# Las funciones del interactivo (se pasa de una a otra con las flechitas ‹ ›).
funciones:
  - "x^3 - 3x"
  - "x^2 - 4"
  - "sen(x)"
  - "2x + 1"
---

## Intuición

Arrastrá el punto azul por la curva (o tocá **Recorrer solo**) y mirá qué se va dibujando abajo.

- ¿De qué color es la flechita cuando la curva sube? ¿Y cuando baja?
- Cuando la flechita está acostada (lila), ¿dónde está el punto naranja de abajo?
- Antes de recorrer la segunda función, adiviná: ¿qué forma va a tener $f'$? Después comprobalo con la casilla **f' entera**.
- En la recta $2x + 1$, ¿por qué abajo queda una recta horizontal?

## Explicación

- En cada punto de la curva hay una pendiente: la de la tangente. Si la anotamos para cada $x$, armamos **otra función**: la derivada, $f'(x)$.
- Cómo leer una en la otra:
  - Donde $f$ **crece**, $f'$ está **arriba** del eje ($f' > 0$).
  - Donde $f$ **decrece**, $f'$ está **abajo** del eje ($f' < 0$).
  - En los **máximos y mínimos** de $f$, la tangente está acostada: $f' = 0$. Ahí $f'$ corta el eje.
- Cuanto más empinada es $f$, más lejos del eje está $f'$.
- Así, los intervalos de crecimiento de la [cuadrática](tema:funcion-cuadratica) o de las [polinómicas](tema:funcion-polinomica) se pueden encontrar con la derivada: se mira dónde $f'$ es positiva y dónde negativa.

## Para recordar

- $f' > 0$: $f$ crece. $f' < 0$: $f$ decrece.
- En un máximo o un mínimo, $f' = 0$.
- La gráfica de $f'$ muestra la pendiente de $f$ en cada punto.

## Ejemplo resuelto

Para $f(x) = x^3 - 3x$, la derivada es $f'(x) = 3x^2 - 3$. ¿Dónde crece $f$, dónde decrece, y dónde tiene un máximo y un mínimo?

### Paso 1: dónde f' = 0

$3x^2 - 3 = 0 \Rightarrow x^2 = 1 \Rightarrow x = -1$ o $x = 1$.

### Paso 2: el signo de f'

$f'$ es una parábola que abre para arriba, con raíces $-1$ y $1$: es positiva afuera y negativa entre las raíces.

### Paso 3: qué hace f

- Crece en $(-\infty, -1)$ y en $(1, +\infty)$.
- Decrece en $(-1, 1)$.
- En $x = -1$ pasa de subir a bajar: **máximo**. En $x = 1$ pasa de bajar a subir: **mínimo**.

## Ejercicios

### Nivel: Para arrancar

### Si crece

Si $f$ crece en el intervalo $(2, 5)$, ¿cómo es $f'$ ahí?

- [x] Positiva
- [ ] Negativa
- [ ] Cero

### En un mínimo

¿Cuánto vale la derivada en el mínimo de una parábola?

respuesta: 0

pista: ¿Cómo está la tangente en el vértice?

### Una recta

Si $f(x) = 2x + 1$, ¿cómo es la gráfica de $f'$?

- [x] Una recta horizontal, a la altura 2
- [ ] La misma recta
- [ ] Una parábola
- [ ] Una recta horizontal, a la altura 1

pista: La pendiente de una recta, ¿cambia de un punto a otro?

### Dónde se acuesta

Si $f'(x) = 2x - 4$, ¿en qué $x$ la tangente a $f$ está acostada?

respuesta: 2

#### Resolución

$2x - 4 = 0 \Rightarrow 2x = 4 \Rightarrow x = 2$.

### Nivel: Para animarse

### ¿Máximo o mínimo?

La derivada de $f$ es negativa en $(-\infty, 3)$ y positiva en $(3, +\infty)$. ¿Qué tiene $f$ en $x = 3$?

- [x] Un mínimo
- [ ] Un máximo
- [ ] Nada especial

pista: Antes de 3 baja y después sube.

### El mínimo de la cúbica

Si $f'(x) = 3x^2 - 3$, ¿en qué $x$ positivo tiene $f$ un mínimo?

respuesta: 1

### Cuántos extremos

Si la gráfica de $f'$ es una parábola que corta el eje $x$ en dos puntos, ¿cuántos máximos y mínimos tiene $f$ (en total)?

respuesta: 2

#### Resolución

En cada corte $f'$ cambia de signo, así que $f$ pasa de subir a bajar o al revés: hay un extremo en cada uno. En total, 2.

## Para tutores

### Objetivo

- Leer la gráfica de $f'$ a partir de la de $f$: arriba del eje donde crece, abajo donde decrece, cero en los extremos.

### Antes tiene que saber

- [¿Qué es la derivada?](tema:que-es-la-derivada) y crecimiento y decrecimiento ([cuadrática](tema:funcion-cuadratica)).

### Errores típicos

- Confundir "$f$ es positiva" con "$f$ crece". Una curva puede estar arriba del eje y bajar.
- Pensar que $f'$ tiene que tener la misma forma que $f$.
- Buscar los extremos donde $f = 0$ en vez de donde $f' = 0$.

### En el pizarrón

- Dibujar $f$ arriba y un eje abajo, con las mismas marcas en $x$.
- Marcar primero los puntos donde la tangente está acostada (ahí $f' = 0$), después poner + o − en cada tramo, y recién ahí dibujar $f'$.
- _(para completar)_

### Preguntas para el alumno

- Si $f$ sube cada vez más empinada, ¿qué hace $f'$?
- ¿Puede $f$ ser negativa y $f'$ positiva en el mismo punto? Dibujá un ejemplo.
- _(para completar)_
