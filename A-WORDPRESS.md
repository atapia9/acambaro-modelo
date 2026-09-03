# A-WORDPRESS.md — Puente a WordPress + Kadence

Cómo se traduce cada archivo y cada sección del modelo HTML a WordPress con el tema
Kadence. Este documento se escribe **mientras se construye el modelo**, no al final, y
es el insumo para el Doc 05.

Regla general: cada `<section>` del HTML está pensada para volverse **un bloque**
(patrón de Kadence o bloque nativo). Nada depende de un framework, así que el paso a
WordPress es copiar contenido a bloques, no reprogramar.

---

## 1. Tipos de contenido y campos (lo primero que hay que crear)

| Elemento del modelo | En WordPress se vuelve | Campos (ACF o meta) |
|---|---|---|
| `data/directorio.json` → cada ficha | **CPT `anunciante`** (Custom Post Type) | `ficticio` (true/false), `giro` (texto), `categoria` (taxonomía), `descripcion` (texto), `direccion` (texto), `telefono` (texto), `whatsapp` (texto, solo dígitos), `horario` (texto), `espacio_portada` (número, opcional) |
| `data/categorias.json` | **Taxonomía `categoria-negocio`** ligada al CPT `anunciante` | `nombre`, `slug` |
| `data/espacios.json` → `total_portada` | **Opción del sitio** `sdda_total_portada` (Ajustes → o campo de opciones ACF) | número entero |
| `data/espacios.json` → cada posición | **Meta del CPT `anunciante`**: `posicion_portada`, `estado_espacio` (activo/libre), `vigencia_fin` (fecha) | — |
| `data/tarifas.json` → cada renglón | **CPT `tarifa`** o repetidor ACF en la página Anunciar | `nivel`, `nombre`, `periodo`, `precio` (número o vacío), `estado` (supuesto/firme/por-definir) |
| Registro de clic (`console.log` hoy) | **Tabla propia** `wp_sdda_clics` vía plugin a medida | `posicion`, `anunciante_id`, `fecha`, `tipo` (ficha / whatsapp) |

---

## 2. Portal — `index.html`

| Sección HTML (`id`) | Bloque Kadence / WordPress | Notas de traducción |
|---|---|---|
| `<header class="cabecera">` | Kadence **Header** (Encabezado) global del portal | Logo de texto "acambaro.com.mx" + navegación. |
| `#portada-intro` | Bloque **Párrafo** + **Título** dentro de un **Row Layout** de 1 columna | Una frase: qué es el portal y qué hacer. Sin imagen. |
| `#rejilla-espacios` | **Bloque dinámico a medida** `sdda/espacios-portada` (patrón + shortcode/plugin) que consulta el CPT `anunciante` filtrando `estado_espacio=activo` y `vigencia_fin>=hoy`, ordenado por `posicion_portada` | La lógica del `espacios.js` (no dibujar huecos, tarjeta-resumen "Quedan N de 12", tira si <6, vencido = libre) pasa a PHP en el render del bloque. `total_portada` se lee de la opción del sitio. |
| Tarjeta-resumen "Quedan N de 12" | Parte del mismo bloque dinámico | Enlace a la página **Anunciar**. |
| `#lista-directorio` | **Kadence Posts / Query Loop** sobre el CPT `anunciante` | Lista compacta, plantilla de entrada mínima (nombre, giro, categoría, etiqueta "Negocio de ejemplo" si `ficticio`). |
| `#llamada-anunciar` | **Row Layout** de 1 columna con **Botón** de Kadence | Fondo ámbar. Enlace a Anunciar. |
| `<footer>` | Kadence **Footer** global | Enlace a Aviso de privacidad. |

---

## 3. Portal — `categoria.html` (plantilla de categoría)

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `<header>` | Header global | — |
| `#cat-encabezado` | **Título de archivo** (plantilla de taxonomía en Kadence Elements) | Toma el nombre de la taxonomía `categoria-negocio`. |
| `#cat-espacios` | Bloque dinámico `sdda/espacios-categoria` (hasta 12 por categoría) | Misma lógica de rejilla que portada, acotada a la categoría. |
| `#cat-directorio` | **Query Loop** filtrado por el término de taxonomía actual | Fichas básicas (gratuitas, sin límite). |
| `<footer>` | Footer global | — |

Se implementa como **Kadence Element → Template → Category/Taxonomy Archive** para `categoria-negocio`.

---

## 4. Portal — `negocio.html` (ficha de anunciante)

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `<header>` | Header global | — |
| `#ficha-cabecera` | **Kadence Element → Single Post** para el CPT `anunciante`: bloques **Título dinámico** + **Meta dinámica** | Muestra `nombre`, `giro`, etiqueta "Negocio de ejemplo" si `ficticio=true`. |
| `#ficha-datos` | **Bloque de campos dinámicos** (Kadence Pro) o lista con ACF: dirección, horario, teléfono | — |
| `#ficha-whatsapp` | **Botón** de Kadence con enlace dinámico `https://wa.me/{whatsapp}` | El clic se registra en `wp_sdda_clics` vía el plugin. |
| `#ficha-volver` | Bloque **Botón**/enlace a la categoría | — |
| `<footer>` | Footer global | — |

---

## 5. Portal — `anunciar.html` (venta de los espacios)

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `<header>` | Header global | — |
| `#anunciar-intro` | **Título** + **Párrafo** | Qué se vende: 12 lugares en portada, escasos. |
| `#anunciar-niveles` | **Row Layout** de 3 columnas (portada / categoría / ficha básica) | Sin tarjetas con sombra; columnas separadas por filete. |
| `#tabla-tarifas` | **Bloque dinámico** `sdda/tarifas` que recorre el CPT `tarifa` (o repetidor ACF) | Si `estado=supuesto` pinta la marca "precio de prueba"; si `precio` vacío escribe "por definir". Misma regla que el JS del modelo. |
| `#anunciar-contacto` | **Formulario de Kadence** (Kadence Blocks Form) | En el modelo es un enlace a WhatsApp / correo; en WP pasa a formulario nativo. |
| `<footer>` | Footer global | — |

---

## 6. Portal — `aviso-de-privacidad.html`

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `<header>` / `<footer>` | Header / Footer globales | — |
| `#aviso-cuerpo` | **Página** normal con bloques **Título** + **Párrafo** + **Lista** | Contenido editable desde el editor. Enlazada desde ambos footers. |

---

## 7. SDDA — `sdda/index.html`

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `<header class="cabecera cabecera--sdda">` | **Segundo Header de Kadence** asignado por condición (solo páginas hijas de SDDA) | Distinto del header del portal. |
| `#sdda-intro` | **Título** + **Párrafo** en Row Layout de 1 columna | Qué hace SDDA, en una frase, hablando de usted. |
| `#sdda-servicios-resumen` | **Lista** o Row Layout de 1 columna con filetes | Cinco servicios con su precio. Sin tarjetas. |
| `#sdda-como-funciona` | Bloque **Lista numerada** | Pasos concretos, plazos. |
| `#sdda-cta` | **Botón** de Kadence → `sdda/diagnostico` | Único destino de todos los botones de SDDA. |
| `<footer class="pie--sdda">` | Footer de Kadence por condición | Enlace al Aviso de privacidad. |

---

## 8. SDDA — `sdda/servicios.html`

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `#servicios-intro` | **Título** + **Párrafo** | — |
| `#servicio-diagnostico` … `#servicio-acompanamiento` (una `<section>` por servicio) | Una **Lista de definiciones** o bloques **Título + Párrafo** separados por filete, uno por servicio | Cada uno: nombre, precio (monoespaciada), duración, qué entrega. "Pesos mexicanos más IVA". |
| `#servicios-cta` | **Botón** → `sdda/diagnostico` | — |

Cada `<section>` de servicio puede volverse un **patrón sincronizado** de Kadence si se
quiere reusar el mismo texto en la portada de SDDA.

---

## 9. SDDA — `sdda/diagnostico.html`

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `#diag-intro` | **Título** + **Párrafo** | Qué es el diagnóstico exprés: gratuito, 45 minutos. |
| `#diag-que-incluye` | **Lista** | Qué se revisa en la sesión. |
| `#diag-formulario` | **Kadence Blocks Form** | En el modelo es un formulario HTML sin acción de servidor (solo estructura). En WP se conecta a correo / CRM. Campos: nombre, negocio, teléfono, número de empleados, qué duele hoy. |
| `#diag-datos` | **Párrafo** con enlace al Aviso de privacidad | Qué se hace con los datos del formulario. |

---

## 10. Assets

| Archivo del modelo | En WordPress |
|---|---|
| `assets/css/estilo.css` | Se parte: variables `:root` y estilos base → **Kadence → Ajustes globales** (colores, tipografía) + CSS adicional del tema hijo. Estilos de la rejilla de espacios → CSS del plugin `sdda/espacios`. |
| `assets/js/espacios.js` | Lógica → render PHP del bloque dinámico. El registro de clic → endpoint AJAX/REST que escribe en `wp_sdda_clics`. |
| `assets/js/directorio.js` | Sustituido por **Query Loop** nativo de Kadence; no se migra el JS. |
| `data/*.json` | Datos semilla para poblar los CPT y las opciones al montar el sitio (script de importación de una sola vez). |
