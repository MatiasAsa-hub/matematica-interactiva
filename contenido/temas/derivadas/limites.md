---
titulo: Límites
subseccion: Límites
resumen: A qué número se acerca una función cuando x se acerca a un valor. Huecos, saltos y asíntotas.
orden: 5
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [funciones-partidas, funcion-homografica, distributiva-y-factor-comun, operaciones-con-fracciones]
interactivo: limite
# Los ejemplos del interactivo (se pasa de uno a otro con las flechitas ‹ ›).
# f es la función y a es el número al que se acerca x.
# Se puede usar una partida: { f: "x + 1 si x < 1 ; x - 2 si x >= 1", a: 1 }
limites:
  - { f: "(x^2 - 1) : (x - 1)", a: 1 }
  - { f: "x^2", a: 2 }
  - { f: "x + 1 si x < 1 ; x - 2 si x >= 1", a: 1 }
  - { f: "1 : (x - 2)^2", a: 2 }
  - { f: "1 : x", a: 0 }
---

## Intuición

Tocá **Acercarse a a** y mirá los dos puntos: uno viene por la izquierda y el otro por la derecha.

- ¿Qué números aparecen en la tablita? ¿A cuál se acercan los dos lados?
- En el primer ejemplo, prendé **Qué pasa justo en a**. ¿Se puede calcular $f(1)$? ¿Y el límite?
- Pasá al ejemplo 3 con ‹ ›. ¿Los dos lados se acercan al mismo número?
- En los ejemplos 4 y 5, ¿qué pasa con $f(x)$ cerca del 2 y del 0?

## Explicación

- El **límite** responde una pregunta: cuando $x$ se acerca a un número $a$, **¿a qué se acerca $f(x)$?**
- Se escribe así, y se lee "límite de $f(x)$ cuando $x$ tiende a $a$":

$$
\lim_{x \to a} f(x) = L
$$

- $x$ se acerca a $a$ todo lo que queramos, pero **nunca llega**. El límite mira lo que pasa **cerca** de $a$, no **en** $a$.

### Por los dos lados

- Se puede llegar a $a$ por la **izquierda** (con números más chicos) o por la **derecha** (con números más grandes):
  - $\lim_{x \to a^-} f(x)$: por izquierda.
  - $\lim_{x \to a^+} f(x)$: por derecha.
- El límite **existe** solo si los dos lados se acercan al **mismo número**. Si no, no existe: en el gráfico se ve un **salto**.

### Cómo se calcula

- **Primero, se prueba reemplazando.** Si da un número, ese es el límite. Por ejemplo: $\lim_{x \to 2} x^2 = 2^2 = 4$. Cuando pasa esto, la función es **continua** en $a$: se dibuja sin levantar el lápiz.
- **Si da $0 : 0$**, no quiere decir que el límite no exista. Hay un **hueco** en el gráfico, y hay que trabajar la cuenta:
  - Se factoriza (por ejemplo, con [factor común](tema:distributiva-y-factor-comun)) y se simplifica lo que se repite arriba y abajo.
  - Después se vuelve a reemplazar.
  - Ejemplo: $\dfrac{x^2 - 2x}{x - 2} = \dfrac{x\,(x - 2)}{x - 2} = x$. Cuando $x \to 2$, se acerca a $2$.
- **Si da un número dividido 0** (por ejemplo, $1 : 0$), la función crece sin parar: el límite es $+\infty$ o $-\infty$. Ahí hay una **asíntota vertical**, como en la [función homográfica](tema:funcion-homografica).
- **Si no sabés qué hacer, armá una tabla** con números cada vez más cerca de $a$, de los dos lados. Es lo mismo que hace el interactivo.

### ¿Y si x se va a infinito?

- También se puede preguntar qué pasa cuando $x$ se hace **cada vez más grande**: $\lim_{x \to +\infty} f(x)$.
- Por ejemplo, $\dfrac{1}{x}$ se acerca a $0$: $\dfrac{1}{10} = 0.1$, $\dfrac{1}{1000} = 0.001$… Ahí hay una **asíntota horizontal** en $y = 0$.

### Para qué sirve

- La **derivada** es un límite que siempre da $0 : 0$ si se reemplaza de una: el cociente incremental cuando $h \to 0$. Por eso primero se simplifica la $h$. Lo vas a ver en [¿Qué es la derivada?](tema:que-es-la-derivada).

## Para recordar

- $\lim_{x \to a} f(x)$: a qué se acerca $f(x)$ cuando $x$ se acerca a $a$.
- **Existe** si por izquierda y por derecha da lo mismo.
- **Primero reemplazá.** Si da un número, listo.
- **$0 : 0$**: factorizá, simplificá y volvé a reemplazar.
- **Número $: 0$**: da $+\infty$ o $-\infty$ (asíntota vertical).

## Ejemplo resuelto

Calculá $\displaystyle \lim_{x \to 3} \frac{x^2 - 3x}{x - 3}$.

### Paso 1: reemplazar

- Arriba: $3^2 - 3 \cdot 3 = 9 - 9 = 0$.
- Abajo: $3 - 3 = 0$.
- Da $0 : 0$: hay un hueco. Hay que trabajar la cuenta.

### Paso 2: factorizar y simplificar

- Arriba se saca factor común $x$: $x^2 - 3x = x\,(x - 3)$.
- Queda $\dfrac{x\,(x - 3)}{x - 3}$. El $(x - 3)$ se repite arriba y abajo: se simplifica.
- Se puede simplificar porque $x$ **nunca llega** a 3: $(x - 3)$ no es 0.
- Queda solo $x$.

### Paso 3: volver a reemplazar

- $\lim_{x \to 3} x = 3$.
- **Resultado:** $\displaystyle \lim_{x \to 3} \frac{x^2 - 3x}{x - 3} = 3$.
- Comprobación con números: con $x = 2.99$ da $2.99$ y con $x = 3.01$ da $3.01$. Los dos se acercan a 3.

## Ejercicios

Calculá los límites. Si hay que poner $+\infty$ o "no existe", es de opción múltiple.

### Nivel: Para arrancar

Se resuelven reemplazando o mirando una tabla.

### Reemplazar

$\displaystyle \lim_{x \to 2} (x^2 + 1)$

respuesta: 5
pista: Reemplazá $x$ por 2.

#### Resolución

Se reemplaza: $2^2 + 1 = 4 + 1 = 5$.

### Con un negativo

$\displaystyle \lim_{x \to -1} (3x - 4)$

respuesta: -7
pista: Reemplazá con paréntesis: $3 \cdot (-1) - 4$.

#### Resolución

$3 \cdot (-1) - 4 = -3 - 4 = -7$.

### Mirando la tabla

Para una función $f$ se calculó esta tabla:

| $x$ | 1.9 | 1.99 | 1.999 | 2.001 | 2.01 | 2.1 |
|---|---|---|---|---|---|---|
| $f(x)$ | 3.9 | 3.99 | 3.999 | 4.001 | 4.01 | 4.1 |

¿Cuánto vale $\displaystyle \lim_{x \to 2} f(x)$?

respuesta: 4
pista: Mirá a qué número se acercan los de abajo cuando los de arriba se acercan a 2.

#### Resolución

Por izquierda (1.9, 1.99, 1.999) $f(x)$ se acerca a 4, y por derecha (2.1, 2.01, 2.001) también. El límite es 4.

### Un salto

Para $f(x) = \begin{cases} x + 1 & \text{si } x < 1 \\ x - 2 & \text{si } x \geq 1 \end{cases}$, ¿cuánto vale $\displaystyle \lim_{x \to 1} f(x)$?

- [ ] 2
- [ ] −1
- [ ] 0
- [x] No existe

pista: Calculá por separado el límite por izquierda (con $x + 1$) y por derecha (con $x - 2$).

#### Resolución

- Por izquierda se usa $x + 1$: se acerca a $1 + 1 = 2$.
- Por derecha se usa $x - 2$: se acerca a $1 - 2 = -1$.
- Como $2 \neq -1$, el límite **no existe**: hay un salto.

### Nivel: Para animarse

Al reemplazar da $0 : 0$ o un número dividido 0.

### Factor común

$\displaystyle \lim_{x \to 2} \frac{x^2 - 2x}{x - 2}$

respuesta: 2
pista: Sacá factor común $x$ arriba.

#### Resolución

- Reemplazando da $0 : 0$.
- $\dfrac{x^2 - 2x}{x - 2} = \dfrac{x\,(x - 2)}{x - 2} = x$.
- Cuando $x \to 2$, da $2$.

### Otra con factor común

$\displaystyle \lim_{x \to 0} \frac{x^2 + 5x}{x}$

respuesta: 5
pista: Arriba se puede sacar factor común $x$.

#### Resolución

- Reemplazando da $0 : 0$.
- $\dfrac{x^2 + 5x}{x} = \dfrac{x\,(x + 5)}{x} = x + 5$.
- Cuando $x \to 0$, da $0 + 5 = 5$.

### El del interactivo

$\displaystyle \lim_{x \to 1} \frac{x^2 - 1}{x - 1}$

respuesta: 2
pista: Fijate que $(x - 1)(x + 1) = x^2 - 1$ (hacé la distributiva para comprobarlo).

#### Resolución

- Reemplazando da $0 : 0$.
- $x^2 - 1 = (x - 1)(x + 1)$, así que $\dfrac{(x - 1)(x + 1)}{x - 1} = x + 1$.
- Cuando $x \to 1$, da $1 + 1 = 2$. Es el hueco del primer ejemplo del interactivo.

### Diferencia de cuadrados

$\displaystyle \lim_{x \to 3} \frac{x^2 - 9}{x - 3}$

respuesta: 6
pista: $x^2 - 9 = (x - 3)(x + 3)$.

#### Resolución

- Reemplazando da $0 : 0$.
- $\dfrac{(x - 3)(x + 3)}{x - 3} = x + 3$.
- Cuando $x \to 3$, da $3 + 3 = 6$.

### Dividido 0

¿Cuánto vale $\displaystyle \lim_{x \to 2} \frac{1}{(x - 2)^2}$?

- [ ] 0
- [ ] 1
- [x] $+\infty$
- [ ] $-\infty$

pista: Probá con $x = 2.1$ y con $x = 1.9$. ¿El de abajo puede ser negativo?

#### Resolución

- Reemplazando da $1 : 0$: el límite es infinito.
- $(x - 2)^2$ es un número chiquito y **siempre positivo** (está al cuadrado). Por ejemplo, con $x = 2.1$: $1 : 0.01 = 100$.
- Por los dos lados crece sin parar: el límite es $+\infty$. Hay una asíntota vertical en $x = 2$.

### Hacia infinito

¿A qué se acerca $\dfrac{1}{x}$ cuando $x$ se hace cada vez más grande ($x \to +\infty$)?

respuesta: 0
pista: Probá con $x = 10$, $x = 100$ y $x = 1000$.

#### Resolución

$\dfrac{1}{10} = 0.1$, $\dfrac{1}{100} = 0.01$, $\dfrac{1}{1000} = 0.001$: se acerca a $0$. Hay una asíntota horizontal en $y = 0$.

## Para tutores

### Objetivo

- Entender el límite como "a qué se acerca $f(x)$ cuando $x$ se acerca a $a$", sin que $x$ llegue nunca.
- Calcular límites reemplazando y, si da $0 : 0$, factorizando y simplificando.

### Antes tiene que saber

- [Funciones partidas](tema:funciones-partidas) (para los saltos) y la [función homográfica](tema:funcion-homografica) (para las asíntotas).
- [Distributiva y factor común](tema:distributiva-y-factor-comun) y [operaciones con fracciones](tema:operaciones-con-fracciones).

### Errores típicos

- Creer que si $f(a)$ no existe, el límite tampoco.
- Pensar que $0 : 0 = 0$, o que $0 : 0 = 1$.
- Simplificar términos sueltos que no multiplican: $\dfrac{x^2 - 2x}{x - 2} = \dfrac{x^2}{x}$.
- Mirar un solo lado y no comprobar el otro.
- Creer que $1 : 0 = 0$.

### Cómo destrabarlo

- Volver siempre a la tabla: dos o tres números de cada lado, cada vez más cerca. Es la definición "a mano".
- $0 : 0$ no es un resultado: es una señal de que la cuenta "esconde" algo y hay que trabajarla.
- Solo se simplifica lo que está **multiplicando** arriba y abajo. Por eso primero se factoriza.
- Para el $1 : 0$: hacer $1 : 0.1$, $1 : 0.01$, $1 : 0.001$ en la calculadora. Los resultados crecen sin parar.

### En el pizarrón

- Dibujar la recta $y = x + 1$ con un punto hueco en $(1, 2)$: es el gráfico de $\dfrac{x^2 - 1}{x - 1}$.
- Debajo, la tabla con $x$ = 0.9, 0.99, 0.999 | 1 | 1.001, 1.01, 1.1. En el casillero del medio, un signo de pregunta.
- Al lado, un salto (una partida) y una asíntota vertical, para mostrar los casos en que el límite no existe o es infinito.
- Cerrar con la receta: reemplazar → si da $0 : 0$, factorizar → simplificar → reemplazar.

### Preguntas para el alumno

- ¿Puede existir el límite en un punto donde la función no existe? Dibujá un ejemplo.
- ¿Por qué se puede simplificar $(x - 3)$ si cuando $x = 3$ vale 0?
- ¿Cómo te das cuenta mirando un gráfico de que un límite no existe?
- Si reemplazás y da $5 : 0$, ¿qué podés decir del límite?
