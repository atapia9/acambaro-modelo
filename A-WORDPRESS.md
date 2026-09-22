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
| `data/directorio.json` → cada ficha | **CPT `anunciante`** (Custom Post Type) | `ficticio` (true/false), `giro` (texto), `categoria` (taxonomía `categoria-negocio`), `descripcion` (texto), `direccion` (texto), `telefono` (texto), `whatsapp` (texto, solo dígitos), `horario` (texto), `espacio_portada` (número, opcional), `fecha_alta` → se mapea al **`post_date`** de la entrada (se usa para "Últimos negocios agregados") |
| `data/categorias.json` | **Taxonomía propia `categoria-negocio`** (jerárquica, registrada por código en el tema hijo o un plugin), ligada al CPT `anunciante` | `nombre` → nombre del término; `slug` → slug del término; `descripcion_corta` → descripción del término (o term meta `descripcion_corta`); `icono` → term meta `icono` (URL de SVG local en la biblioteca de medios, o vacío); `orden` → `term_order` / term meta `orden` (para ordenar la rejilla); `activa` → term meta `activa` (un término inactivo no se pinta, además de la regla "sin fichas no se muestra") |
| Rejilla de categorías de la portada | **Bloque dinámico a medida** `sdda/rejilla-categorias` (o patrón + Query Loop de términos) | Recorre los términos de `categoria-negocio` con `activa != false` y `count > 0`, ordenados por `orden`; cada tarjeta enlaza a `/categoria-negocio/<slug>/` y muestra `count`. |
| Conteo por categoría | `get_term()->count` nativo de WordPress | No hay que calcularlo: WordPress lo mantiene. |
| `data/espacios.json` → `total_portada` | **Opción del sitio** `sdda_total_portada` (Ajustes → o campo de opciones ACF) | número entero |
| `data/espacios.json` → cada posición | **Meta del CPT `anunciante`**: `posicion_portada`, `estado_espacio` (activo/libre), `vigencia_fin` (fecha) | — |
| `data/tarifas.json` → cada renglón | **CPT `tarifa`** o repetidor ACF en la página Anunciar | `nivel`, `nombre`, `periodo`, `precio` (número o vacío), `estado` (supuesto/firme/por-definir) |
| Registro de clic (`console.log` hoy) | **Tabla propia** `wp_sdda_clics` vía plugin a medida | `posicion`, `anunciante_id`, `fecha`, `tipo` (ficha / whatsapp) |

---

## 2. Portal — `index.html`

Orden de la portada tras la Actualización 01 (la rejilla de categorías es el contenido
principal; la banda de anunciantes ya no abre la página):

| Sección HTML (`id`) | Bloque Kadence / WordPress | Notas de traducción |
|---|---|---|
| `<header class="cabecera">` | Kadence **Header** (Encabezado) global del portal | Logo de texto "acambaro.com.mx" + navegación. |
| `#portada-intro` (a + b) | Bloque **Título** (H1) + **Párrafo** en un **Row Layout** de 1 columna | H1 "qué encuentro aquí" + línea de apoyo "para quién es". Sin imagen. Encabezado corto a propósito (ver `docs/verificacion-fold.md`). |
| `#buscador-sec` (c) | **Search** de Kadence (por nombre) + un **selector de términos** de `categoria-negocio` | En el modelo es JS en la misma página; en WP: buscador nativo filtrando el CPT `anunciante` y un `<select>` que navega al archivo de la taxonomía. |
| `#categorias-sec` → `#rejilla-categorias` (d) | **Bloque dinámico** `sdda/rejilla-categorias` (ver tabla 1) | Contenido principal. Términos con `activa != false` y `count > 0`, ordenados por `orden`, con conteo por tarjeta. |
| `#destacados-sec` → `#rejilla-espacios` (e) | **Bloque dinámico** `sdda/espacios-portada` que consulta `anunciante` con `estado_espacio=activo` y `vigencia_fin>=hoy`, ordenado por `posicion_portada` | La lógica de `espacios.js` (no dibujar huecos; tarjeta-resumen "Quedan N de 12"; tira si <6; vencido = libre; **en móvil 6 + "ver los demás", en escritorio todos**) pasa a PHP. `total_portada` se lee de la opción del sitio. El encabezado de la sección declara que es espacio de anunciante. |
| Tarjeta-resumen "Quedan N de 12" | Parte del mismo bloque dinámico | Enlace a la página **Anunciar**. |
| `#ultimos-sec` → `#ultimos-negocios` (f) | **Kadence Posts / Query Loop** sobre `anunciante`, orden por fecha (`post_date`) descendente, límite 5 | Lista compacta (nombre, giro, categoría, etiqueta "Negocio de ejemplo" si `ficticio`). |
| `#franja-anunciar` (g) | **Párrafo** con enlace (discreto, sin fondo) | Enlace a Anunciar. |
| `<footer>` | Kadence **Footer** global | Enlace a Aviso de privacidad. |

---

## 3. Portal — `categoria.html` (plantilla de categoría)

En el modelo la URL es `/categoria.html?c=<slug>` (se acepta `?cat=` por compatibilidad).
En WordPress es el **archivo de la taxonomía**: `/categoria-negocio/<slug>/`.

| Sección HTML | Bloque Kadence / WordPress | Notas |
|---|---|---|
| `<header>` | Header global | — |
| `#cat-encabezado` → `#cat-nombre` | **Título de archivo** dinámico | Nombre del término actual de `categoria-negocio`. |
| `#cat-encabezado` → `#cat-desc` | Bloque **Descripción de archivo** (o term meta `descripcion_corta`) | Descripción corta del término. |
| `#filtro-categorias` | **Lista de términos** de `categoria-negocio` (solo con `count > 0`), término actual resaltado | — |
| `#cat-espacios` | Bloque dinámico `sdda/espacios-categoria` (hasta 12 por categoría) | Misma lógica de rejilla que la portada, acotada al término. Encabezado que lo declara como espacio de anunciante. |
| `#cat-directorio` | **Query Loop** filtrado por el término actual | Fichas básicas (gratuitas, sin límite). |
| `<footer>` | Footer global | — |

Se implementa como **Kadence Element → Template → Taxonomy Archive** para `categoria-negocio`.

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
| `#levantamiento` | **Kadence Blocks Form** de varios pasos + llamada a la API de clasificación | Formulario de alta: datos del negocio, sugerencia de sector SCIAN y autorización del representante. Ver §11 para el mapeo de campos y el MCP. |
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
| `#diag-formulario` | **Kadence Blocks Form** | En el modelo el botón junta el lead en un objeto con forma fija (`assets/js/diagnostico.js`) y solo lo registra en consola. En WP se conecta a correo / CRM. Campos: nombre, negocio, teléfono, número de empleados, qué duele hoy. Contrato de datos y caminos de conexión: `docs/crm-diagnostico-integracion.md`. |
| `#diag-datos` | **Párrafo** con enlace al Aviso de privacidad | Qué se hace con los datos del formulario. |

---

## 10. Assets

| Archivo del modelo | En WordPress |
|---|---|
| `assets/css/estilo.css` | Se parte: variables `:root` y estilos base → **Kadence → Ajustes globales** (colores, tipografía) + CSS adicional del tema hijo. Estilos de la rejilla de espacios → CSS del plugin `sdda/espacios`. |
| `assets/js/espacios.js` | Lógica → render PHP del bloque dinámico `sdda/espacios-*`. El registro de clic → endpoint AJAX/REST que escribe en `wp_sdda_clics`. El recorte "6 + ver los demás" en móvil → media query + `<details>` o un poco de JS del tema. |
| `assets/js/directorio.js` | Rejilla de categorías y "últimos" → bloques dinámicos / Query Loop de Kadence. Buscador → búsqueda nativa + selector de términos. No se migra el JS. |
| `assets/js/levantamiento.js` | Ver §11: el sustituto local de la clasificación SCIAN se sustituye por una llamada real, y el envío del formulario pasa a Kadence Forms + REST. |
| `?v=2`/`?v=3` en los `<link>`/`<script>` | En WordPress lo maneja `wp_enqueue_*` con su parámetro de versión; el `?v=` manual del modelo desaparece. |
| `data/*.json` | Datos semilla para poblar el CPT, la taxonomía y las opciones al montar el sitio (script de importación de una sola vez). |
| `assets/js/tema.js` | El toggle claro/oscuro se resuelve igual en WordPress: un pequeño script en el `<head>` del tema hijo, con la misma lógica de `localStorage` + `prefers-color-scheme`. Los tokens de color van a los ajustes globales de Kadence, no cambia el enfoque. |
| `assets/js/clima.js` | Único punto que llama a un dominio externo (Open-Meteo). En WordPress puede quedar igual (JS de cliente) o moverse a un pequeño *transient* cacheado en el servidor para no depender de que cada visitante tenga la API disponible. De cualquier forma, hay que declarar la excepción en la política de privacidad del sitio final. |

---

## 11. Levantamiento del negocio, clasificación SCIAN y el MCP

Detalle completo en `docs/mcp-clasificacion-integracion.md`. Resumen para WordPress.

**Decisión:** la ficha publicada y su autorización viven en WordPress, no en la base de prospección
(`docs/decision-dueno-de-la-ficha.md`). Por eso el formulario crea el post `anunciante` y guarda ahí la autorización.

| Elemento del modelo | En WordPress se vuelve | Notas |
|---|---|---|
| `data/scian-sectores.json` | **Taxonomía `scian`** (no jerárquica basta a nivel sector) o **campo de selección** en el CPT `anunciante` | Si más adelante se usa el catálogo completo (nivel clase), sí conviene taxonomía jerárquica sector → subsector → rama → clase. |
| Campo "giro" del formulario de levantamiento | Meta del CPT `anunciante`: `giro_descripcion` | Es el texto que se manda al clasificador (real o humano). |
| `sugerirClasificacionScian()` (stub) | **Llamada server-side** desde PHP (WordPress) al backend que expone el MCP (opción A de la §4 del doc de integración) | El navegador del visitante nunca debe hablar directo con el backend de clasificación: la petición sale del servidor de WordPress, no del cliente. Evita exponer credenciales y facilita el CORS (ya no aplica, es servidor a servidor). |
| Autorización del representante (`#levantamiento`) | Meta del CPT `anunciante`: `representante_nombre`, `representante_cargo`, `autorizacion_aceptada` (bool), `autorizacion_fecha` | Se guarda con el estado del post en `pending` hasta que alguien de SDDA lo revise y publique. |
| Campos de la ficha del formulario (descripción, dirección, horario, teléfono, WhatsApp) | Los meta de la §1: `descripcion`, `direccion`, `horario`, `telefono`, `whatsapp` | El teléfono y el WhatsApp solo se publican si se escriben: no se copian del DENUE ni del enriquecimiento. |
| Vínculo con la base de prospección | Meta del CPT `anunciante`: `id_denue` (texto) | Lo asigna quien revisa, buscando el negocio por nombre y dirección. Sirve para marcar en `acambaro-db` que el negocio ya está dado de alta. |
| Medio de la autorización | Meta del CPT `anunciante`: `autorizacion_medio` | `formulario` para lo que llega por el sitio; `en persona`, `whatsapp` o `correo` para lo que capture alguien de SDDA. |
| Envío del formulario | **Kadence Blocks Form** → webhook o Action Scheduler que crea el post `anunciante` en `pending` y dispara la clasificación | Reemplaza el `console.log` del modelo. |

**Por qué server-side y no en el navegador:** un MCP se piensa para que lo hable un
proceso de servidor (o un agente), no JavaScript de cliente. Migrar a WordPress no
resuelve por sí solo el problema de exponer el MCP al público — sigue haciendo falta el
backend intermedio de la opción A, ahora llamado desde PHP en vez de desde `fetch()`
del navegador, lo cual además es más seguro.
