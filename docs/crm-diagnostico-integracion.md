# Recoleccion de leads del diagnostico Express — estado y propuesta de integracion a un CRM

**Fecha:** 17 de septiembre de 2026.
**Estado: NO conectado.** Lo que hay en el prototipo es un sustituto local (stub) que
arma el dato y lo registra en la consola del navegador; no se manda a ningun correo,
formulario de terceros ni CRM todavia.

Mismo patron que ya se uso para la clasificacion SCIAN de `anunciar.html` — ver
`docs/mcp-clasificacion-integracion.md` — aplicado ahora al formulario de
`sdda/diagnostico.html`.

---

## 1. Qué se pidió

Corregir "Expres" por "Express" en `sdda/diagnostico.html` (y, por consistencia, en
`sdda/index.html` y `sdda/servicios.html`, donde aparecia el mismo texto) y preparar
una propuesta para **ir recabando la informacion** del formulario de diagnostico, de
modo que mas adelante se pueda integrar en un **flujo automatizado hacia un CRM**, sin
salir de este mismo sitio/paquete.

## 2. Qué hay hoy en el prototipo (sustituto local)

- El formulario (`#diag-formulario`) ya definia los campos: nombre, negocio, telefono,
  tamano del equipo, tema. Antes no tenia ningun JavaScript enganchado: el boton
  "Enviar solicitud" no hacia nada al darle clic.
- Se agrego `assets/js/diagnostico.js`, con el mismo patron que ya usa
  `assets/js/levantamiento.js` en `anunciar.html`: al dar clic en el boton arma un
  objeto `lead` con una **forma fija** (contrato en la seccion 4) y lo registra en la
  consola del navegador con la etiqueta `[crm-diagnostico-stub]`. Muestra una
  confirmacion en pantalla (`#diag-confirmacion`, mismo estilo `.nota-ficticio` que ya
  existia). **No llama a ningun servidor.**
- El boton conserva la leyenda "(desactivado en el modelo)": sigue sin mandar nada de
  verdad. Lo que cambia es que ahora la forma del dato ya existe y se puede revisar en
  la consola, en vez de no existir en absoluto.

## 3. Por qué no se conecta ya a un CRM real

Tres razones, no una sola:

1. **Todavia no se elige el CRM** (HubSpot, Pipedrive, uno a medida, o incluso una hoja
   de calculo haciendo de CRM ligero al principio). Sin eso no hay a donde mandar el
   lead.
2. **Este es un sitio estatico servido desde GitHub Pages: no hay backend propio** que
   reciba un `POST` del formulario ni que guarde nada del lado del servidor.
3. **La politica de seguridad de la pagina lo bloquearia de todas formas.** El `<meta
   http-equiv="Content-Security-Policy">` de `sdda/diagnostico.html` trae `connect-src
   'self'` (bloquea `fetch()` hacia otro dominio) y `form-action 'none'` (bloquea el
   envio nativo del `<form>`, aunque el boton fuera `type="submit"`). Por eso el boton
   es `type="button"` con JavaScript, nunca un submit real — igual que en
   `anunciar.html`. Cualquier camino de conexion real de la seccion 5 exige ampliar uno
   de los dos, a proposito y solo hacia el destino elegido.

## 4. Contrato de datos propuesto (el "lead")

**Ninguno de estos campos esta confirmado con un CRM real**; es la forma mas razonable
de empezar a recabar mientras no se elige uno.

```json
{
  "nombre_contacto": "Maria Lopez",
  "nombre_negocio": "Tortilleria La Molienda",
  "telefono": "4181234567",
  "tamano_equipo": "5-20",
  "tema": "No se en que se me va el dinero cada mes.",
  "origen": "sdda-diagnostico-45min",
  "pagina": "/sdda/diagnostico.html",
  "estado_inicial": "nuevo",
  "fecha_solicitud": "2026-09-17T22:14:00.000Z"
}
```

Notas sobre el contrato:

- `tamano_equipo` usa un codigo corto (`menos-5`, `5-20`, `21-50`, `mas-50`) en vez del
  texto visible del `<select>`, para que no se rompa si mas adelante cambia la
  redaccion de la opcion.
- `origen` identifica que formulario genero el lead. Sirve para cuando haya mas de un
  punto de entrada — por ejemplo, si la seccion "Levantamiento" de `anunciar.html`
  tambien termina alimentando el mismo CRM mas adelante.
- `estado_inicial` deja listo el primer valor de la etapa del pipeline en el CRM
  (columna "nuevo" / "por contactar"), para no tener que inventarlo del lado del CRM
  cuando llegue el primer lead real.
- `fecha_solicitud` se genera en el navegador (`new Date().toISOString()`), igual que
  ya se hace en `levantamiento.js`.

## 5. Dos caminos para conectarlo de verdad

**A. Servicio de formularios de terceros + automatizacion (mas rapido de armar,
recomendado para empezar).** El boton pasa a hacer un `fetch()` (o el formulario a un
submit nativo) hacia un servicio como Formspree, Web3Forms o un Google Form / Apps
Script Web App, que recibe el lead y lo reenvia por correo a SDDA — esto es
exactamente lo que ya promete hoy la nota del formulario ("En el sitio final llega al
correo de SDDA"). Desde ahi, una automatizacion (Zapier, Make o n8n) toma cada envio y
crea o actualiza el contacto en el CRM elegido, usando los mismos campos del contrato
de la seccion 4. Requiere agregar el origen de ese servicio a `connect-src` (si es
`fetch()`) o a `form-action` (si es submit nativo) en la CSP de
`sdda/diagnostico.html`. No requiere backend propio.

**B. Backend propio con endpoint HTTP.** Igual que la opcion A de
`docs/mcp-clasificacion-integracion.md`: un servicio propio expone, por ejemplo,

```
POST https://api.sdda.mx/leads-diagnostico
```

recibe el lead con el contrato de la seccion 4, lo valida y lo guarda, y desde ahi
habla con la API del CRM elegido (o dispara la misma automatizacion de la opcion A).
Mas trabajo de construir, pero da control total sobre validacion, duplicados y
reintentos antes de que el dato le llegue al CRM. Tambien exige ampliar `connect-src`
en la CSP, solo hacia ese dominio propio.

Cualquiera de las dos deja el mismo contrato de datos de la seccion 4; solo cambia
quien recibe el envio y que hace con el despues. Se puede empezar con la opcion A y
migrar a la B sin tocar el formulario ni `diagnostico.js`, solo el destino del envio.

## 6. Qué cambiar en el repo cuando exista el conector real

1. En `assets/js/diagnostico.js`, sustituir el `console.log("[crm-diagnostico-stub]",
   lead)` por el envio real (`fetch` o submit), manteniendo la misma forma del objeto
   `lead` de la seccion 4.
2. Agregar el origen del servicio elegido a `connect-src` (o `form-action`) en el
   `<meta http-equiv="Content-Security-Policy">` de `sdda/diagnostico.html`.
3. Revisar `aviso-de-privacidad.html`: hay que decir que los datos del formulario de
   diagnostico se envian a un servicio externo (el de formularios y/o el CRM), no solo
   a SDDA.
4. Anotar la fecha de conexion, el servicio elegido y la URL en
   `docs/retroalimentacion.md`.
5. Si para entonces ya se conecto tambien la seccion "Levantamiento" de
   `anunciar.html`, revisar si conviene unificar ambos formularios al mismo
   backend/CRM en vez de mantener dos caminos por separado.

## 7. Nota de privacidad

`sdda/diagnostico.html` ya declara, en "Que se hace con sus datos", que la informacion
solo se usa para contactar y agendar la sesion, que no se comparte con terceros y que
se puede pedir su borrado en cualquier momento. Mientras el formulario no envie nada de
verdad (estado actual de este documento), ese texto sigue siendo cierto. En cuanto se
conecte cualquiera de los dos caminos de la seccion 5 — que por definicion implica
compartir el dato con un servicio de formularios y/o un CRM externos — la frase "no se
comparte con terceros" deja de ser exacta, y `aviso-de-privacidad.html` debe
actualizarse **antes** de recibir el primer lead real.
