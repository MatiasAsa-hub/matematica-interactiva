---
titulo: Funciones trigonométricas
subseccion: Funciones
resumen: Seno, coseno y tangente, con un punto que gira en una circunferencia.
orden: 30
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [que-es-una-funcion]
interactivo: trigonometrica
---

## Intuición

Tocá **Dar una vuelta** y mirá: mientras el punto gira, a la derecha se va dibujando su **altura**.

- Arrastrá el punto azul (en la circunferencia o en la curva). ¿Dónde es más alto? ¿Dónde vale 0?
- Cambiá a **Coseno** y después a **Tangente**. ¿Qué mide cada una?
- Prendé **Período**: ¿qué pasa después de una vuelta?

## Explicación

- Imaginá un punto que gira en una **circunferencia de radio 1**. El ángulo $x$ se mide desde la derecha, girando para arriba.
- **Seno:** $\text{sen}\,x$ es la **altura** del punto.
  - Arriba del centro es positivo; abajo, negativo. Va de $-1$ a $1$.
- **Coseno:** $\cos x$ es cuánto se corre el punto **a la derecha** del centro (negativo a la izquierda). También va de $-1$ a $1$.
- **Tangente:** $\tan x = \text{sen}\,x : \cos x$. Es la altura donde el radio, alargado, corta la recta vertical de la derecha.
  - En $90°$ y $270°$ **no existe**: el radio queda parado y no corta nunca esa recta. Ahí hay **asíntotas**.
- Después de una vuelta el punto vuelve al mismo lugar: las curvas **se repiten**. Eso se llama **período**: $360°$ para el seno y el coseno, $180°$ para la tangente.
- **Grados y radianes:** una vuelta entera son $360°$, o $2\pi$ radianes. Entonces $180° = \pi$ y $90° = \frac{\pi}{2}$. En los gráficos de funciones se suelen usar los radianes.
- Para correr, estirar o achicar estas curvas: $a \cdot \text{sen}\big(b(x - c)\big) + d$ en el [Laboratorio](pagina:laboratorio).

## Para recordar

- sen = altura, cos = cuánto a la derecha, tan = sen : cos.
- sen y cos van de $-1$ a $1$ y se repiten cada $360°$ ($2\pi$).
- $180° = \pi$ radianes.

## Ejemplo resuelto

¿Cuánto valen $\text{sen}(90°)$ y $\cos(90°)$?

### Paso 1: dónde está el punto

Con $90°$ el punto giró un cuarto de vuelta: está **arriba de todo**, justo encima del centro.

### Paso 2: la altura y el corrimiento

Su altura es el radio entero: $\text{sen}(90°) = 1$. No está ni a la derecha ni a la izquierda: $\cos(90°) = 0$.

## Ejercicios

### Nivel: Para arrancar

### Arriba de todo

¿Cuánto vale $\text{sen}(90°)$?

respuesta: 1

### A la derecha

¿Cuánto vale $\cos(0°)$?

respuesta: 1

pista: Con $0°$ el punto está a la derecha de todo.

### Media vuelta

¿Cuánto vale $\cos(180°)$?

respuesta: -1

#### Resolución

Con $180°$ el punto está a la izquierda de todo: se corrió 1 para la izquierda. $\cos(180°) = -1$.

### Abajo de todo

¿Cuánto vale $\text{sen}(270°)$?

respuesta: -1

### Nivel: Para animarse

### Treinta grados

¿Cuánto vale $\text{sen}(30°)$? Probalo con el interactivo.

respuesta: 0.5

### La tangente de 45°

¿Cuánto vale $\tan(45°)$?

respuesta: 1

pista: En $45°$ el seno y el coseno valen lo mismo.

#### Resolución

$\tan(45°) = \text{sen}(45°) : \cos(45°)$, y los dos valen lo mismo ($\approx 0.71$). Un número dividido por sí mismo da 1.

### El período

¿Cada cuánto se repite el gráfico de $\text{sen}\,x$?

- [x] $360°$ (o sea, $2\pi$)
- [ ] $180°$
- [ ] $90°$

### La imagen

¿Cuál es la imagen de $f(x) = \cos x$?

- [x] $[-1, 1]$
- [ ] $\mathbb{R}$
- [ ] $[0, 1]$

pista: ¿Puede el punto correrse más de 1 a la derecha, si el radio mide 1?

### En radianes

¿Cuántos radianes son $180°$?

- [x] $\pi$
- [ ] $2\pi$
- [ ] $\frac{\pi}{2}$

#### Resolución

Una vuelta entera, $360°$, son $2\pi$. Media vuelta, $180°$, es la mitad: $\pi$.

### ¿Existe?

¿Cuánto vale $\tan(90°)$?

- [x] No existe
- [ ] $0$
- [ ] $1$

#### Resolución

$\tan(90°) = \text{sen}(90°) : \cos(90°) = 1 : 0$, y no se puede dividir por 0. En el dibujo: el radio queda parado y no corta nunca la recta.

## Para tutores

### Objetivo

- Ver el seno como la altura de un punto que gira, y el coseno como cuánto se corre a la derecha.
- Entender de dónde salen la forma de onda, el período y la imagen $[-1, 1]$.

### Antes tiene que saber

- [Qué es una función](tema:que-es-una-funcion). Ángulos en grados.

### Errores típicos

- Creer que $\text{sen}\,x$ puede dar más que 1.
- Confundir seno con coseno (cuál es la altura).
- Usar la calculadora en radianes cuando el ángulo está en grados (o al revés).

### Cómo destrabarlo

- Seno = altura del punto; coseno = cuánto está a la derecha. Repetirlo con el dedo sobre la circunferencia.
- El radio mide 1, así que el punto nunca puede estar a más de 1 de altura.
- Grados y radianes: anotar solo cuatro equivalencias ($90° = \frac{\pi}{2}$, $180° = \pi$, $270° = \frac{3\pi}{2}$, $360° = 2\pi$) y sacar el resto de ahí.
- Con la calculadora: probar $\text{sen}(90)$. Si no da 1, está en radianes.

### En el pizarrón

- Dibujar una circunferencia chica a la izquierda y los ejes de la onda a la derecha, a la misma altura.
- Marcar 0°, 90°, 180°, 270° y 360° en los dos dibujos y pasar las alturas con líneas horizontales.
- Para el coseno, repetir mirando la distancia horizontal en vez de la altura.
- Marcar el período en la onda: de 0° a 360°, y vuelve a empezar.

### Preguntas para el alumno

- ¿En qué ángulos el seno vale 0? ¿Y el coseno?
- ¿Por qué el seno nunca da 2?
- ¿Cuánto vale el seno de 450°? ¿Por qué no hace falta calculadora?
- ¿En qué cuadrantes el seno es negativo?
