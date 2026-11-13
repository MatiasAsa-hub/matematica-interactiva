---
titulo: Función raíz cuadrada
subseccion: Funciones
resumen: f(x) = a√(x − h) + k. Media parábola acostada. Dominio.
orden: 50
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [potencias-y-raices, desigualdades-e-intervalos, funcion-cuadratica]
interactivo: familia
familia: raiz
---

## Intuición

Arrastrá el punto azul hacia la izquierda, hasta que se termine la curva. ¿Qué dice la cuenta de arriba?

- Prendé **Parábola acostada**: ¿qué tiene que ver la raíz con $x^2$?
- Mové **h**: ¿dónde arranca la curva?

## Explicación

- $\sqrt{x}$ responde: **¿qué número (positivo) al cuadrado da $x$?** Por ejemplo, $\sqrt{9} = 3$ porque $3^2 = 9$.
- No hay raíz cuadrada de un **negativo**: ningún número al cuadrado da negativo. Por eso la curva **arranca** en un punto y sigue solo para un lado.
- El gráfico es **media parábola acostada**: la raíz es la operación inversa de elevar al cuadrado. Queda solo la mitad de arriba, porque $\sqrt{\ }$ da siempre positivo.
- $f(x) = a\sqrt{x - h} + k$:
  - **Arranca** en $(h, k)$: ahí lo de adentro vale 0.
  - **Dominio:** los $x$ que hacen que lo de adentro no sea negativo: $x - h \geq 0$, o sea $[h, +\infty)$.
  - $a$ la estira; si es negativo, la da vuelta (para abajo).

## Para recordar

- $\sqrt{x}$: el número positivo que al cuadrado da $x$.
- Lo de adentro no puede ser negativo: $x - h \geq 0$.
- $a\sqrt{x - h} + k$ arranca en $(h, k)$.

## Ejemplo resuelto

Encontrá el dominio y la raíz de $f(x) = \sqrt{x + 2} - 1$.

### Paso 1: el dominio

Lo de adentro no puede ser negativo: $x + 2 \geq 0 \Rightarrow x \geq -2$. Dominio: $[-2, +\infty)$.

### Paso 2: la raíz

$\sqrt{x + 2} - 1 = 0 \Rightarrow \sqrt{x + 2} = 1$. Elevo al cuadrado los dos lados: $x + 2 = 1 \Rightarrow x = -1$.

### Paso 3: comprobar

$f(-1) = \sqrt{1} - 1 = 0$ ✓

## Ejercicios

### Nivel: Para arrancar

### Una raíz

¿Cuánto vale $\sqrt{25}$?

respuesta: 5

### Un valor

Si $f(x) = \sqrt{x - 3}$, ¿cuánto vale $f(7)$?

respuesta: 2

#### Resolución

$f(7) = \sqrt{7 - 3} = \sqrt{4} = 2$.

### Dónde arranca

¿En qué punto arranca $f(x) = \sqrt{x - 1} + 2$?

- [x] $(1, 2)$
- [ ] $(-1, 2)$
- [ ] $(2, 1)$

### Nivel: Para animarse

### El dominio

¿Cuál es el dominio de $f(x) = \sqrt{x + 4}$?

- [x] $[-4, +\infty)$
- [ ] $[4, +\infty)$
- [ ] $\mathbb{R}$

pista: Lo de adentro tiene que ser 0 o más: $x + 4 \geq 0$.

### La raíz

¿Cuál es la raíz de $f(x) = \sqrt{x} - 3$?

respuesta: 9

#### Resolución

$\sqrt{x} = 3 \Rightarrow x = 3^2 = 9$.

### ¿Existe?

Si $f(x) = \sqrt{x - 5}$, ¿cuánto vale $f(1)$?

- [x] No existe
- [ ] $2$
- [ ] $-2$

#### Resolución

$f(1) = \sqrt{1 - 5} = \sqrt{-4}$, y no hay raíz cuadrada de un negativo: 1 no está en el dominio.

### La imagen

¿Cuál es la imagen de $f(x) = \sqrt{x} + 1$?

- [x] $[1, +\infty)$
- [ ] $[0, +\infty)$
- [ ] $\mathbb{R}$

## Para tutores

### Objetivo

- Entender la raíz como la inversa de elevar al cuadrado, y por qué no hay raíz de negativos.
- Encontrar el dominio y el punto de arranque en $a\sqrt{x - h} + k$.

### Antes tiene que saber

- [Potencias y raíces](tema:potencias-y-raices), [desigualdades e intervalos](tema:desigualdades-e-intervalos) y la [cuadrática](tema:funcion-cuadratica).

### Errores típicos

- Creer que $\sqrt{-4} = -2$.
- Para el dominio de $\sqrt{x + 4}$, poner $x \geq 4$ (el signo al revés).
- Olvidarse de comprobar la solución después de elevar al cuadrado.

### Cómo destrabarlo

- $\sqrt{-4}$ no existe: ningún número al cuadrado da negativo ($(-2)^2 = 4$).
- El dominio sale de una inecuación: lo de adentro de la raíz tiene que ser $\geq 0$. Resolverla en vez de adivinar el signo.
- $\sqrt{9}$ es solo 3, no "más o menos 3".
- Después de elevar al cuadrado, reemplazar la solución en la ecuación del principio: a veces aparece una de más.

### En el pizarrón

- Tabla con $x$ = 0, 1, 4, 9 y $\sqrt{x}$ = 0, 1, 2, 3 (números "lindos").
- Dibujar la parábola $y = x^2$ acostada y borrar la mitad de abajo.
- Marcar el punto de arranque y rayar la zona donde no hay gráfico.

### Preguntas para el alumno

- ¿Por qué no existe $\sqrt{-9}$?
- ¿Dónde arranca $\sqrt{x - 3}$?
- ¿Cuál es el dominio de $\sqrt{x + 4}$?
- ¿Cuánto hay que avanzar en $x$ para que $\sqrt{x}$ suba de 3 a 4? ¿Crece rápido o despacio?
