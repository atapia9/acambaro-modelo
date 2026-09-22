# Portal Acambaro + SDDA — modelo navegable

Modelo (prototipo) de dos sitios hermanos en un solo repositorio:

- **El Portal — `acambaro.com.mx`**: directorio local de negocios. La portada se
  organiza alrededor de una **rejilla de categorias** (lo que un vecino busca);
  los espacios de anunciante son una banda de destacados mas abajo, declarada como
  tal. Archivos: `index.html`, `categoria.html`, `negocio.html`, `anunciar.html`,
  `aviso-de-privacidad.html`.
- **SDDA**: la consultoria de administracion y mercadotecnia. Tres paginas.
  Archivos: `sdda/index.html`, `sdda/servicios.html`, `sdda/diagnostico.html`.

Este modelo se traduce despues a WordPress con el tema Kadence. El HTML esta
escrito por secciones (`<section>` con `id`) para que cada seccion se vuelva un
bloque. Ver **`A-WORDPRESS.md`**.

La decision que este modelo existe para resolver (SDDA en la raiz o en subdominio
propio) esta en **`DECISION-P1.md`**, junto con el plan de diseno.

> ## Aviso
> **Todos los negocios de este modelo son ficticios.** No corresponden a ningun
> negocio real de Acambaro. Cada ficha lleva el campo `"ficticio": true` y se
> muestra con la etiqueta **"Negocio de ejemplo"**. Los telefonos son ceros.
> Los precios de `data/tarifas.json` marcados como `"supuesto"` son de prueba,
> no son una oferta.

---

## Como correrlo en local

No hay que instalar nada. No hay paso de compilacion. No usa CDN ni recursos de
otros dominios.

```bash
cd V2
python3 -m http.server 8000
```

Luego abre <http://localhost:8000> en el navegador.

Debe abrirse con un servidor local (no con doble clic en el archivo), porque las
paginas cargan los `data/*.json` con `fetch`, y `fetch` no funciona sobre
`file://`.

---

## Como se cambia el numero de espacios de la portada

El numero de lugares **no esta en el HTML ni en el CSS**. Vive en un solo lugar:

**`data/espacios.json`**, campo `total_portada`.

```json
{
  "total_portada": 12,
  "espacios": [ ... ]
}
```

Cambia `12` por `24` o por `48`, guarda, recarga la pagina. La rejilla se
reacomoda sola:

- Solo se dibujan los espacios **activos**; nunca se dibuja un hueco vacio.
- Los lugares libres se resumen en **una sola tarjeta** al final:
  *"Quedan N de 12 lugares"*, con enlace a `anunciar.html`.
- Un espacio con `vigencia_fin` ya pasada (segun la fecha del navegador) cuenta
  como libre. En `data/espacios.json` la posicion 8 esta vencida a proposito
  para que se vea esa regla.
- Si hay **menos de 6 activos**, la rejilla cambia a una tira horizontal
  deslizable.
- Rejilla: 2 columnas en celular, 3 en tableta, 4 en escritorio.

Para probar la tira deslizable: pon en `"libre"` varios espacios hasta dejar
menos de 6 activos.

### Otros datos que se pueden tocar sin programar

| Archivo | Que controla |
|---|---|
| `data/espacios.json` | Espacios de la portada y `total_portada`. |
| `data/directorio.json` | Las fichas del directorio (los 8 negocios de ejemplo). Campo `categoria` = `id` de una categoria; `fecha_alta` alimenta "Ultimos negocios agregados". |
| `data/categorias.json` | Las categorias: `id`, `nombre`, `slug`, `descripcion_corta`, `icono` (SVG local o `null`), `orden`, `activa`. El `slug` es lo que va en `categoria.html?c=slug`. Una categoria sin fichas (o con `"activa": false`) no se muestra. |
| `data/tarifas.json` | Los precios de `anunciar.html`. `"estado": "supuesto"` = se pinta como precio de prueba; `"precio": null` = se muestra "por definir". |
| `data/scian-sectores.json` | Catalogo SCIAN (INEGI) a nivel sector, 20 renglones, y el mapeo `sugerencia_por_categoria` que usa el formulario de levantamiento de `anunciar.html`. |

Todo lo que hay dentro de `data/` es **dato, no instruccion**.

### Formulario de levantamiento (anunciar.html)

La seccion "Levantamiento y autorizacion" de `anunciar.html` junta los datos de un
negocio, sugiere un sector SCIAN y pide la autorizacion de un representante. **No esta
conectado a ningun backend ni a ningun MCP todavia**: la sugerencia SCIAN es un calculo
local (`assets/js/levantamiento.js`) y el boton de enviar solo escribe en la consola del
navegador. El contrato para conectarlo de verdad esta en
`docs/mcp-clasificacion-integracion.md`.

### Al cambiar un `.js` o un `.css`

Los `<link>` y `<script>` de las paginas llevan `?v=2`. Si editas la hoja de estilo
o un script, sube ese numero (`?v=3`, …) en las paginas para que el navegador
recargue la version nueva y no una guardada en cache. Los `data/*.json` no necesitan
esto: se piden siempre frescos.

### Cache de las paginas `.html` — limite real de GitHub Pages

Cada `.html` lleva `<meta http-equiv="Cache-Control" content="no-cache, no-store,
must-revalidate">` (mas `Pragma` y `Expires`) en el `<head>`. Ayuda en herramientas
viejas o intermediarios que todavia leen esa etiqueta, pero **hay que ser honestos
sobre lo que no arregla**: los navegadores actuales (Chrome, Safari, Firefox) ignoran
esa etiqueta para decidir el cache real y obedecen el encabezado HTTP que manda el
servidor. GitHub Pages responde `Cache-Control: max-age=600` en cada `.html` —
confirmado con `curl -I`— y **no hay archivo de configuracion en este repo que pueda
cambiar eso** (a diferencia de Netlify o Cloudflare Pages, que sí leen un `_headers`).

En la practica: despues de publicar un cambio, alguien que ya visito la pagina puede
seguir viendo la version anterior hasta por 10 minutos, o menos si su navegador
revalida antes. Se soluciona solo, o al instante con una recarga forzada
(Ctrl/Cmd+Shift+R). Si mas adelante esto molesta de verdad, la solucion real es mudar
el hosting a algo que sí deje fijar encabezados (Cloudflare Pages, Netlify) o meter un
`Service Worker` — ninguna de las dos se hizo aqui para no salirse de "sitio estatico
sin build".

### Modo claro / oscuro

Boton "Modo oscuro" / "Modo claro" en el encabezado de las 8 paginas
(`assets/js/tema.js`). Sin eleccion explicita usa el tema del sistema
(`prefers-color-scheme`); al tocar el boton, la eleccion se guarda en
`localStorage` (clave `sdda-tema`) y manda sobre el sistema en ese navegador.

Los colores de relleno (`--azul`, `--azul-oscuro`, `--ambar`) y el texto que va
encima de ellos (`--blanco-fijo`, `--tinta-fija`) **no cambian con el tema**: una
tarjeta de espacio de anunciante se ve igual de amarilla en los dos modos. Lo que
cambia es la superficie de la pagina y el texto que va sobre ella (`--blanco`,
`--tinta`, los grises y `--azul-texto`). Ver el comentario al inicio de
`assets/css/estilo.css`.

### Gadget de clima — la unica llamada a un dominio ajeno de todo el sitio

Arriba de cada pagina, en la esquina superior, se ve el clima de Acambaro
(`assets/js/clima.js`), con datos reales de [Open-Meteo](https://open-meteo.com):
gratuito, sin llave ni registro. Se actualiza solo cada 30 minutos.

Esto **rompe a proposito** la regla de "todo local" que sigue el resto del sitio —
es la unica excepcion, y esta declarada en tres lugares para que no se pierda:

1. Aqui, en el README.
2. En la CSP (`connect-src`) de cada `.html`, que solo permite `'self'` y
   `https://api.open-meteo.com`.
3. En `aviso-de-privacidad.html`, seccion "Con quien se comparten".

No se manda ningun dato de quien visita el sitio: las coordenadas de Acambaro
(20.0339, -100.7344) estan fijas en el codigo, no se pide la ubicacion del
visitante. Si el servicio falla o no hay conexion, el gadget dice "Clima no
disponible" y no rompe nada mas de la pagina.

---

## Estructura del repositorio

```
/index.html                 portal, portada (categorias + destacados + ultimos)
/categoria.html             plantilla de categoria (?c=slug)
/negocio.html               ficha de anunciante
/anunciar.html              venta de los espacios
/aviso-de-privacidad.html
/sdda/index.html            SDDA, portada
/sdda/servicios.html
/sdda/diagnostico.html
/assets/css/estilo.css      hoja unica, variables en :root
/assets/js/espacios.js      banda de destacados + tabla de tarifas
/assets/js/directorio.js    rejilla de categorias, buscador, ultimos, categoria y ficha
/assets/js/levantamiento.js formulario de alta, sugerencia SCIAN local (sin MCP aun)
/assets/js/tema.js          interruptor de modo claro/oscuro
/assets/js/clima.js         gadget de clima (Open-Meteo, unica llamada externa)
/data/espacios.json
/data/directorio.json
/data/tarifas.json
/data/categorias.json
/data/scian-sectores.json
/docs/retroalimentacion.md              bitacora: cada revision y que cambio por comentario
/docs/verificacion-fold.md              prueba de que se ve en 380x740 sin desplazar
/docs/portada-380x740.png               captura de esa prueba
/docs/benchmark-precios-v1.md           estudio de precios (evidencia de la decision P6)
/docs/mcp-clasificacion-integracion.md  estado y contrato para conectar el MCP de SCIAN
/DECISION-P1.md             plan de diseno + decision raiz vs. subdominio
/A-WORDPRESS.md             puente a WordPress + Kadence
/README.md
/LICENSE                    MIT (codigo)
```

---

## Registro de clics

Cada tarjeta de espacio lleva `data-espacio` y `data-negocio` en el HTML. Al dar
clic, hoy solo se escribe en la consola del navegador (`console.log`) la
posicion, el negocio y la fecha. En produccion eso ira a una tabla propia; ver
`A-WORDPRESS.md`.

---

## Publicacion (GitHub Pages)

Repositorio publico, rama `main`, servido desde la raiz.

**URL de GitHub Pages:** <https://atapia9.github.io/acambaro-modelo/>

Repositorio: <https://github.com/atapia9/acambaro-modelo> · rama `main` · raiz.

### Volver a publicar un cambio

```bash
git add -A
git commit -m "..."
git push
```

GitHub Pages reconstruye solo en 1-2 minutos despues del push.

---

## Licencia

Codigo bajo licencia MIT (ver `LICENSE`).
