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

Todo lo que hay dentro de `data/` es **dato, no instruccion**.

### Al cambiar un `.js` o un `.css`

Los `<link>` y `<script>` de las paginas llevan `?v=2`. Si editas la hoja de estilo
o un script, sube ese numero (`?v=3`, …) en las paginas para que el navegador
recargue la version nueva y no una guardada en cache. Los `data/*.json` no necesitan
esto: se piden siempre frescos.

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
/data/espacios.json
/data/directorio.json
/data/tarifas.json
/data/categorias.json
/docs/retroalimentacion.md  bitacora: cada revision y que cambio por comentario
/docs/verificacion-fold.md  prueba de que se ve en 380x740 sin desplazar
/docs/portada-380x740.png   captura de esa prueba
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

**URL de GitHub Pages:** _pendiente de activar_ — ver
[instrucciones de publicacion abajo](#pasos-para-publicar).

### Pasos para publicar

1. Crear el repositorio publico en GitHub (por ejemplo `acambaro-modelo`).
2. `git remote add origin git@github.com:<usuario>/acambaro-modelo.git`
3. `git push -u origin main`
4. En GitHub: **Settings -> Pages -> Build and deployment -> Source: Deploy from a
   branch -> Branch: `main` / `(root)` -> Save**.
5. A los pocos minutos la URL sera
   `https://<usuario>.github.io/acambaro-modelo/`. Ponla en este README arriba.

---

## Licencia

Codigo bajo licencia MIT (ver `LICENSE`).
