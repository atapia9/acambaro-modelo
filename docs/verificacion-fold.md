# Verificacion: que se ve antes del primer desplazamiento

**Restriccion (Actualizacion 01, punto 3):** en una ventana de **380 x 740 px**, sin
desplazar, tienen que verse el **H1**, la **linea de apoyo** y al menos **cuatro
categorias completas**.

## Resultado

CUMPLE. Ver `portada-380x740.png` (captura a 380x740, densidad 2x = 760x1480 px).

En la captura, arriba del limite de 740 px se ven:

- H1 "El directorio de negocios de Acambaro" (2 lineas)
- Linea de apoyo "Para vecinos de Acambaro: a que taller, tienda o servicio ir…" (2 lineas)
- Buscador (campo de nombre + selector de categoria)
- Encabezado "Que estas buscando"
- **4 categorias completas** con su conteo y su borde inferior:
  1. Comida y abarrotes — 2 negocios
  2. Talleres y refacciones — 2 negocios
  3. Esteticas y barberias — 1 negocio
  4. Ferreterias y material — 1 negocio
- La fila 5–6 (Para la casa / Mascotas) asoma por abajo: indica que hay mas.

## Medicion (getBoundingClientRect, viewport 380x740, borde del fold = 740)

| Elemento | top | bottom |
|---|---|---|
| H1 | 116 | 166 |
| Linea de apoyo | 171 | 215 |
| Tarjetas fila 1 (cat. 1 y 2) | 359 | 482 |
| Tarjetas fila 2 (cat. 3 y 4) | 491 | 614 |
| Tarjetas fila 3 (cat. 5 y 6) | 623 | 746 (parcial) |

## Como se reproduce la captura

Con el sitio servido en local (`python3 -m http.server 8765`) y Google Chrome:
emulacion de dispositivo movil via DevTools Protocol a 380x740, densidad 2.
El script usado (`shot.py`) no forma parte del repo; es solo herramienta de captura.
Chrome en modo headless por linea de comandos NO sirve para esto: fija un ancho
minimo de viewport de 500 px y la captura saldria con el layout de escritorio.

## Que ajustes se hicieron para que cupiera (se recorto el encabezado, no las categorias)

- H1 de 1.6rem a 1.3rem, interlineado 1.2.
- Linea de apoyo de 1rem a 0.92rem y texto mas corto (de 17 a 16 palabras, 2 lineas).
- Menos relleno vertical en intro, buscador y seccion de categorias.
- Campo y selector del buscador con menos relleno.
- Descripcion de cada categoria recortada a 2 lineas (`-webkit-line-clamp`).
