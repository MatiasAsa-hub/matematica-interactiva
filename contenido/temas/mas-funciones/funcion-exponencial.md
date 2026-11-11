---
titulo: Función exponencial
subseccion: Funciones
resumen: f(x) = a · kˣ. Multiplicar siempre por lo mismo. Asíntota y crecimiento.
orden: 10
interactivo: exponencial
---

## Intuición

Mirá los saltos lilas: cada vez que avanzás 1, ¿qué le pasa a la altura?

- Mové **k**: probá con 3 y después con 0.5. ¿Qué cambia?
- Prendé **Comparar con una lineal**: ¿cuál termina más arriba?
- ¿La curva llega a tocar el eje $x$ alguna vez?

## Explicación

- Una **función exponencial** es $f(x) = a \cdot k^x$: la $x$ está **en el exponente**.
- $k$ es la **base**: cada vez que $x$ avanza 1, $f(x)$ **se multiplica por $k$**.
  - Ejemplo: $2^x$ da $1, 2, 4, 8, 16\ldots$ (se duplica).
  - La **lineal suma** siempre lo mismo; la **exponencial multiplica** siempre por lo mismo. Por eso, a la larga, la exponencial le gana a cualquier lineal.
- $a$ es **donde arranca**: $f(0) = a \cdot k^0 = a \cdot 1 = a$.
- **$k > 1$**: crece. **$0 < k < 1$**: decrece (multiplicar por 0.5 es dividir por 2). **$k = 1$**: no cambia nunca.
- **Nunca toca el eje $x$**: multiplicar no te lleva nunca a 0. El eje $x$ es una **asíntota**: la curva se le acerca cada vez más, sin llegar.
  - Por eso **no tiene raíces**.
- Hay una base famosa, el número $e \approx 2.72$. En el [Laboratorio](pagina:laboratorio) está $e^x$ y se puede correr y estirar.

## Para recordar

- $f(x) = a \cdot k^x$: $a$ = donde arranca, $k$ = por cuánto se multiplica.
- $k > 1$ crece, $0 < k < 1$ decrece.
- Asíntota $y = 0$. Sin raíces. Dominio $\mathbb{R}$, imagen $(0, +\infty)$ si $a > 0$.

## Ejemplo resuelto

Una planta mide 3 cm y cada semana duplica su altura. ¿Cuánto mide a las 4 semanas?

### Paso 1: la fórmula

Arranca en 3 y se multiplica por 2 cada semana: $f(x) = 3 \cdot 2^x$, con $x$ en semanas.

### Paso 2: la cuenta

$f(4) = 3 \cdot 2^4 = 3 \cdot 16 = 48$. Mide **48 cm**.

### Paso 3: comprobar con los saltos

$3 \to 6 \to 12 \to 24 \to 48$: cuatro veces "por 2". ✓

## Ejercicios

### Nivel: Para arrancar

### Un valor

Si $f(x) = 2^x$, ¿cuánto vale $f(3)$?

respuesta: 8

### En el cero

Si $f(x) = 3^x$, ¿cuánto vale $f(0)$?

respuesta: 1

pista: Cualquier número (menos el 0) elevado a la 0 da 1.

### Dónde arranca

¿En qué valor de $y$ corta al eje $y$ la función $f(x) = 5 \cdot 2^x$?

respuesta: 5

### ¿Cuál crece?

¿Cuál de estas funciones **crece**?

- [ ] $f(x) = 0.5^x$
- [x] $f(x) = 3^x$
- [ ] $f(x) = 1^x$

### Nivel: Para animarse

### Para la izquierda

Si $f(x) = 2^x$, ¿cuánto vale $f(-1)$?

respuesta: 0.5

pista: Para la izquierda, en vez de multiplicar por 2, se divide por 2.

#### Resolución

$f(0) = 1$. Un paso a la izquierda se divide por 2: $f(-1) = 1 : 2 = 0.5$.

### Bacterias

En un frasco hay 100 bacterias y se duplican cada hora. ¿Cuántas hay a las 3 horas?

respuesta: 800

#### Resolución

$f(x) = 100 \cdot 2^x$. $f(3) = 100 \cdot 2^3 = 100 \cdot 8 = 800$.

### La imagen

¿Cuál es la imagen de $f(x) = 3^x$?

- [x] $(0, +\infty)$
- [ ] $\mathbb{R}$
- [ ] $[0, +\infty)$

pista: ¿Puede dar 0? ¿Puede dar negativo?

#### Resolución

$3^x$ siempre da positivo y nunca llega a 0 (el eje $x$ es asíntota). Imagen: $(0, +\infty)$.

### ¿Cuál es?

Una función cumple $f(0) = 4$, $f(1) = 12$ y $f(2) = 36$. ¿Cuál es?

- [x] $f(x) = 4 \cdot 3^x$
- [ ] $f(x) = 4 + 8x$
- [ ] $f(x) = 3 \cdot 4^x$

pista: ¿De 4 a 12 y de 12 a 36 se suma lo mismo o se multiplica por lo mismo?

#### Resolución

Arranca en 4 y cada paso se multiplica por 3 ($4 \cdot 3 = 12$, $12 \cdot 3 = 36$). Es $4 \cdot 3^x$. La lineal $4 + 8x$ da 12 en $x = 1$, pero 20 en $x = 2$.

## Para tutores

### Objetivo

- Entender que la exponencial **multiplica siempre por lo mismo** (y la lineal suma).
- Reconocer $a$ y $k$ en $a \cdot k^x$, y saber que nunca toca el eje $x$.

### Antes tiene que saber

- [Potencias y raíces](tema:potencias-y-raices) (sobre todo $k^0 = 1$ y los exponentes negativos) y la [función lineal](tema:funcion-lineal).

### Errores típicos

- Confundir $2^x$ con $2x$ (o con $x^2$).
- Creer que $2^{-1}$ es negativo.
- Pensar que la curva "termina tocando" el eje $x$.

### En el pizarrón

- Hacer una tabla $x$ | $2^x$ de $-2$ a $4$ y marcar "×2" entre cada fila.
- Marcar los puntos y unirlos. Al lado, la recta $1 + x$ para comparar.
- _(para completar)_

### Preguntas para el alumno

- Si cada día se duplica, ¿cuánto hay después de 10 días?
- ¿Puede $2^x$ dar 0? ¿Y negativo?
- _(para completar)_
