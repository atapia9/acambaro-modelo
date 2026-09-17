# Integración con el MCP de clasificación SCIAN — estado y contrato propuesto

**Fecha:** 17 de septiembre de 2026.
**Estado: NO conectado.** Lo que hay en el prototipo es un sustituto local (stub), no
una llamada real al MCP.

---

## 1. Qué se pidió

Conectar el formulario de alta de negocio (`anunciar.html`, sección "Levantamiento y
autorización") a un **MCP propio, que se está armando aparte**, para:

1. Sugerir la **clasificación SCIAN** (INEGI) del negocio a partir de su nombre,
   categoría y una descripción breve del giro.
2. Apoyar el **levantamiento y la autorización** de un representante del negocio antes
   de publicar su ficha en el directorio.

## 2. Por qué no se conectó ya

Tres razones, no una sola:

1. **El MCP mismo todavía no tiene URL, contrato ni autenticación definidos** — se está
   construyendo en otro lugar. No hay nada real a lo que apuntar todavía.
2. **MCP (Model Context Protocol) no es una API REST que un navegador llame con
   `fetch()`.** Está diseñado para que lo hable un cliente/agente (Claude Desktop,
   Claude Code, u otro host MCP) por stdio o por una conexión de servidor a servidor,
   no una página web estática. Para que `acambaro.com.mx` (o su GitHub Pages) lo use,
   hace falta un **backend intermedio** que hable MCP de un lado y HTTP normal del otro.
3. **La política de seguridad de este sitio lo bloquearía de todas formas.** Todas las
   páginas llevan `Content-Security-Policy: connect-src 'self'` (ver `<meta
   http-equiv="Content-Security-Policy">` en cada `.html`), que impide que el
   JavaScript de la página llame a cualquier dominio que no sea el propio. Aunque el
   MCP ya tuviera un backend HTTP, primero hay que decidir cómo y desde dónde se le
   llama, y ajustar esa política a propósito.

## 3. Qué hay hoy en el prototipo (sustituto local)

- `data/scian-sectores.json`: catálogo SCIAN México 2018, **nivel sector (2 dígitos,
  20 renglones)** — no el catálogo completo (que baja hasta "clase", más de 1,000
  códigos). Incluye un mapeo de muestra `sugerencia_por_categoria` que relaciona cada
  categoría del directorio (`data/categorias.json`) con un sector por default.
- `assets/js/levantamiento.js`, función `sugerirClasificacionScian()`: mira la
  categoría elegida en el formulario, busca su sector por default en el mapeo de
  arriba, y lo propone. **No manda nada a ningún servidor.** Registra la sugerencia en
  la consola del navegador (`console.log("[mcp-clasificacion-stub]", ...)`), igual que
  el registro de clics de los espacios de anunciante.
- El resultado siempre queda en un `<select>` editable: quien llena el formulario
  puede corregirlo a mano. La sugerencia es un punto de partida, no una verdad.
- El botón de enviar el formulario está desactivado a propósito (mismo patrón que
  `sdda/diagnostico.html`): registra en consola lo que se habría mandado y muestra un
  aviso en pantalla, pero no persiste nada.

## 4. Dos caminos para conectarlo de verdad

**A. Backend propio con endpoint HTTP (recomendado).** El servicio que hoy habla MCP
internamente expone además una ruta REST normal, por ejemplo:

```
POST https://api.sdda.mx/clasificar-scian
```

con CORS habilitado para el origen del sitio (`https://atapia9.github.io` hoy,
`https://acambaro.com.mx` cuando exista el dominio propio). El sitio estático le hace
`fetch()` a esa ruta — igual que hoy hace `fetch()` a los `data/*.json` locales, solo
que a otro origen. Esto es lo que exige ajustar `connect-src` en la CSP.

**B. Verificación en otro proceso, sin llamada en vivo.** El formulario solo junta los
datos (nombre, giro, categoría, representante) y los manda a algún lado —correo, hoja
de cálculo, webhook— sin clasificar en el momento. La clasificación SCIAN y la revisión
de la autorización las hace una persona después, con el MCP corriendo del lado de
quien opera SDDA (por ejemplo, dentro de una sesión de Claude Code con ese MCP
conectado), y el código SCIAN se agrega a mano a la ficha. Más lento, pero no requiere
exponer nada públicamente ni tocar la CSP.

## 5. Contrato propuesto (borrador, sin confirmar)

Para cuando exista el endpoint de la opción A. **Ninguno de estos campos está
confirmado**; es la forma más razonable de pedirlo y recibirlo, a falta de la
especificación real del MCP.

**Solicitud:**

```json
{
  "nombre": "Tortilleria La Molienda",
  "giro": "Tortilla de maiz hecha el mismo dia. Venta por kilo y mayoreo para fondas.",
  "categoria_directorio": "comida-y-abarrotes"
}
```

**Respuesta (borrador):**

```json
{
  "scian_codigo": "46",
  "scian_nombre": "Comercio al por menor",
  "confianza": "media",
  "alternativas": [
    { "codigo": "31-33", "nombre": "Industrias manufactureras" }
  ],
  "version_modelo": "por-definir"
}
```

## 6. Qué cambiar en el repo cuando el endpoint exista

1. En `assets/js/levantamiento.js`, sustituir el cuerpo de `sugerirClasificacionScian()`
   por un `fetch()` a la URL real, manteniendo la misma firma de función para no tocar
   el resto del formulario.
2. Agregar ese origen a `connect-src` en el `<meta http-equiv="Content-Security-Policy">`
   de `anunciar.html` (y de cualquier otra página que termine usando el mismo formulario).
3. Revisar el `aviso-de-privacidad.html`: hay que decir explícitamente que el giro
   escrito por el representante se envía a un servicio de clasificación, aunque no
   incluya datos personales del cliente final.
4. Anotar la fecha de conexión y la URL en `docs/retroalimentacion.md`.

## 7. Nota de privacidad del levantamiento

El formulario pide nombre y cargo de quien autoriza — son datos de una persona, no del
negocio. Mientras el formulario no envíe nada de verdad (estado actual), no hay
tratamiento de datos que declarar más allá de lo que ya dice `aviso-de-privacidad.html`.
En cuanto se conecte cualquiera de los dos caminos de la §4, ese aviso debe actualizarse
antes de recibir el primer levantamiento real.
