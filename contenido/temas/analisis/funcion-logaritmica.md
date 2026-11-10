---
titulo: Función logarítmica
subseccion: Funciones
resumen: f(x) = logₖ(x). La exponencial al revés. Dominio, raíz y asíntota.
orden: 42
interactivo: logaritmica
---

## Intuición

Arrastrá el punto azul sobre la curva y leé arriba lo que dice.

- ¿A qué número hay que elevar 2 para llegar a 8? ¿Y a 4?
- Mirá los saltos: cuando $x$ se multiplica por 2, ¿cuánto sube la curva?
- Prendé **Espejo con la exponencial**: ¿qué tienen que ver las dos curvas?

## Explicación

- $\log_k(x)$ responde una pregunta: **¿a qué número hay que elevar $k$ para llegar a $x$?**
  - $\log_2(8) = 3$, porque $2^3 = 8$.
  - $\log_{10}(100) = 2$, porque $10^2 = 100$.
- Es la [exponencial](tema:funcion-exponencial) **al revés**:
  - En la exponencial, sumar 1 en $x$ **multiplica** el resultado por $k$.
  - En el logaritmo, multiplicar $x$ por $k$ **suma 1** al resultado.
  - El gráfico es el de $k^x$ **espejado en la recta $y = x$**: se cambian $x$ por $y$.
- **Raíz:** siempre en $x = 1$, porque $k^0 = 1$, así que $\log_k(1) = 0$.
- **Dominio:** solo los **positivos**, $(0, +\infty)$. $k$ elevado a cualquier cosa da positivo: no hay forma de llegar a 0 ni a un negativo.
- **Asíntota:** el eje $y$ ($x = 0$). Cerca del 0 la curva se hunde sin tocarlo.
- Entre 0 y 1 el logaritmo da **negativo**: $\log_2(0.5) = -1$, porque $2^{-1} = 0.5$.
- **$k > 1$**: crece. **$0 < k < 1$**: decrece.
- El logaritmo de base $e \approx 2.72$ se llama **logaritmo natural** y se escribe $\ln x$. Está en el [Laboratorio](pagina:laboratorio).

## Para recordar

- $\log_k(x) = y$ quiere decir $k^y = x$.
- Raíz en $x = 1$. Asíntota $x = 0$.
- Dominio $(0, +\infty)$: no hay logaritmo de 0 ni de negativos.

## Ejemplo resuelto

Calculá $\log_3(81)$.

### Paso 1: la pregunta

¿A qué número hay que elevar 3 para llegar a 81?

### Paso 2: probar con las potencias de 3

$3^1 = 3$, $3^2 = 9$, $3^3 = 27$, $3^4 = 81$. ✓

### Paso 3: la respuesta

$\log_3(81) = 4$, porque $3^4 = 81$.

## Ejercicios

### Nivel: Para arrancar

### Base 2

¿Cuánto vale $\log_2(8)$?

respuesta: 3

### Base 3

¿Cuánto vale $\log_3(9)$?

respuesta: 2

### Base 10

¿Cuánto vale $\log_{10}(1000)$?

respuesta: 3

pista: ¿Cuántas veces hay que multiplicar 10 para llegar a 1000?

### El logaritmo de 1

¿Cuánto vale $\log_5(1)$?

respuesta: 0

pista: ¿A qué hay que elevar 5 para que dé 1?

### Nivel: Para animarse

### Menor que 1

¿Cuánto vale $\log_2(0.5)$?

respuesta: -1

#### Resolución

$2^{-1} = \frac{1}{2} = 0.5$. Entonces $\log_2(0.5) = -1$.

### Al revés

Si $\log_2(x) = 4$, ¿cuánto vale $x$?

respuesta: 16

#### Resolución

$\log_2(x) = 4$ quiere decir $2^4 = x$. Entonces $x = 16$.

### Una raíz escondida

¿Cuánto vale $\log_4(2)$?

respuesta: 0.5

pista: ¿Qué potencia de 4 da 2? Acordate de que $\sqrt{4} = 2$.

#### Resolución

$4^{0.5} = \sqrt{4} = 2$. Entonces $\log_4(2) = 0.5$.

### El dominio

¿Cuál es el dominio de $f(x) = \log_3(x)$?

- [x] $(0, +\infty)$
- [ ] $\mathbb{R}$
- [ ] $[0, +\infty)$

### ¿Se puede?

¿Cuánto vale $\log_2(-4)$?

- [x] No se puede calcular
- [ ] $-2$
- [ ] $2$

pista: ¿Hay algún exponente que haga que $2$ elevado a él dé negativo?

#### Resolución

$2$ elevado a cualquier número da positivo. Ningún exponente da $-4$: el $-4$ no está en el dominio.

## Para tutores

### Objetivo

- Entender $\log_k(x)$ como la pregunta "¿a qué elevo $k$ para llegar a $x$?".
- Saber que es la exponencial al revés, y por qué el dominio son los positivos.

### Antes tiene que saber

- [Potencias y raíces](tema:potencias-y-raices) (exponentes negativos) y la [función exponencial](tema:funcion-exponencial).

### Errores típicos

- Creer que $\log_2(8) = 4$ (dividir $8 : 2$ en vez de buscar el exponente).
- Pensar que $\log(0) = 0$.
- Confundir la raíz ($x = 1$) con la ordenada al origen (que no existe: $x = 0$ no está en el dominio).

### En el pizarrón

- Arriba, una tabla de $2^x$: $x$ = 0, 1, 2, 3 y $2^x$ = 1, 2, 4, 8. Abajo, la misma tabla dada vuelta: esa es $\log_2$.
- Dibujar las dos curvas y la recta $y = x$ en el medio.
- _(para completar)_

### Preguntas para el alumno

- ¿Cuánto vale $\log_2(16)$? ¿Y $\log_2(1)$?
- ¿Por qué no existe $\log_2(0)$?
- _(para completar)_
