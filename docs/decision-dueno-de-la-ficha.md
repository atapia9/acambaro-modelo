# Decisión: WordPress es el dueño de la ficha publicada

**Fecha:** 21 de septiembre de 2026.
**Estado: DECIDIDA** por Armando. Todavía no se construye nada de lo que sigue: es el rumbo, no una tarea en curso.
**Alcance:** dónde vive la ficha publicada de un negocio y dónde viven los formularios de alta, cambio y baja.

## 1. Contexto

Hay tres piezas, y la pregunta es quién manda cuando el sitio deje de ser un prototipo estático:

- **Este modelo** (HTML estático en GitHub Pages): `data/directorio.json` alimenta el sitio. Es un prototipo.
- **La base de prospección** (`acambaro-db`, repositorio privado): el DENUE del INEGI, el enriquecimiento de contactos,
  el seguimiento (incluido `no contactar`) y la tabla `publicacion`, que registra las autorizaciones a mano y que
  `exportar_directorio.py` convierte en `directorio.json`. Es el **puente manual** de la fase estática.
- **El plan de WordPress** (`A-WORDPRESS.md`): la ficha pasa a ser un tipo de contenido `anunciante`, y el formulario de
  alta (§5 y §11) la crea en estado `pending` hasta que alguien de SDDA la revisa y la publica.

Con esas tres, la ficha publicada y la autorización de quien la pidió podrían quedar duplicadas.

## 2. Decisión

**WordPress es el dueño de la ficha publicada.** En el tipo de contenido `anunciante` viven la ficha, la autorización
de quien la pidió, su estado (`pending` o publicada) y sus cambios y bajas. Los formularios de alta, cambio y baja
viven en el sitio.

## 3. Quién es dueño de qué

| Dónde | Es dueño de |
|---|---|
| **WordPress** (CPT `anunciante`) | La ficha publicada; la autorización (representante, cargo, aceptada, fecha); el estado de la ficha; los lugares de pago; los clics |
| **`acambaro-db`** | El DENUE; el enriquecimiento; el seguimiento de contactos (incluido `no contactar`); y el vínculo `id_denue` de los negocios que ya se dieron de alta |
| **Este modelo estático** | El prototipo y el diseño, hasta que WordPress lo sustituya |

## 4. Por qué no la otra opción

La alternativa era que `acambaro-db` fuera el dueño y WordPress solo mostrara una exportación. Se descartó porque:

- La base es un archivo SQLite dentro de un repositorio privado: no recibe escrituras desde la web. Habría que alojarla
  en línea y montar una API con autenticación, que hoy no existe.
- El plan de WordPress ya modela la ficha, la autorización y el paso `pending` → publicada.
- Los datos personales de quien autoriza quedan en un solo sistema, en vez de dos copias que sincronizar.

**Costo aceptado:** hay dos sistemas, y hay que mantener el vínculo `id_denue` entre ellos.

## 5. Qué significa para lo que ya está construido

- **`exportar_directorio.py` y la tabla `publicacion` son un puente**, válido mientras el sitio sea estático. Cuando
  WordPress esté en línea dejan de recibir altas nuevas.
- **El JSON que exporta ya tiene la forma de la semilla.** Sus campos coinciden con los meta del CPT (`A-WORDPRESS.md`
  §1) y `fecha_alta` se mapea al `post_date`. Sirve para la importación de una sola vez.
- **Las autorizaciones ya registradas se migran a WordPress**, o se pierde la constancia. El JSON público **no** las
  lleva a propósito (representante, cargo, medio), así que hará falta una exportación privada aparte. Esa exportación
  debe incluir la huella de cada token (§9), para que los representantes conserven su contraseña sin tener que pedir otra.
- **`no contactar` se queda en `acambaro-db`:** es un dato de prospección, no de la ficha.

## 6. Qué pide hoy el formulario de alta y a dónde va

El formulario (`anunciar.html`, sección `#levantamiento`) sigue sin enviar nada. Lo que pide, y el meta del CPT al que
corresponde según `A-WORDPRESS.md`:

| Campo del formulario | Meta del CPT `anunciante` | Nota |
|---|---|---|
| Nombre del negocio | Título de la entrada | Quien revisa lo normaliza |
| Qué hace el negocio | `giro_descripcion` | La etiqueta `giro` que se ve la fija quien revisa, partiendo de este texto |
| Categoría | Término de `categoria-negocio` | Mismas categorías que `data/categorias.json` |
| Clasificación SCIAN | Término o campo `scian` | Sugerencia local hasta que el MCP esté conectado |
| Descripción (opcional) | `descripcion` | **Campo nuevo en el formulario** |
| Dirección | `direccion` | |
| Horario (opcional) | `horario` | **Campo nuevo** |
| Teléfono (opcional) | `telefono` | **Campo nuevo**: antes era un solo campo «Teléfono o WhatsApp» |
| WhatsApp (opcional) | `whatsapp` (solo dígitos) | Se separó del teléfono porque el enlace `wa.me` exige un WhatsApp |
| Nombre de quien autoriza | `representante_nombre` | No se publica |
| Cargo | `representante_cargo` | No se publica |
| Casilla de autorización | `autorizacion_aceptada` | |
| Fecha | `autorizacion_fecha` | La pone el servidor al recibirla |
| (automático) | `id_denue` | **Meta nuevo**: lo asigna quien revisa, buscando el negocio por nombre y dirección |
| (automático) | `autorizacion_medio` = `formulario` | **Meta nuevo**: distingue las altas del formulario de las que alguien de SDDA capture a mano |
| (automático) | `token_hash` | **Meta nuevo**: la huella del token de la contraseña (§9). No se muestra ni se exporta |

El teléfono y el WhatsApp solo se publican si se escriben: no se copian del DENUE ni del enriquecimiento.

El formulario **no normaliza** lo que se escribe (guarda «417 102 4117» tal cual). Eso lo debe hacer el servidor al recibirlo:
10 dígitos para el teléfono, y para `whatsapp` solo dígitos con `52` delante, como ya hace `exportar_directorio.py`.

## 7. Flujo objetivo

**Alta.** Formulario → ficha en `pending` con su autorización → quien revisa la liga con el DENUE (`id_denue`),
comprueba la identidad de quien pide (por ejemplo, llamando al teléfono registrado), corrige nombre y dirección, y
publica → se marca en `acambaro-db` que ese negocio ya está dado de alta.

**Cambio y baja.** También en WordPress. Antes hay que comprobar quién los pide: si no, cualquiera podría pedir la baja o
modificar la ficha de otro. **La comprobación es un token que se emite en el alta** (§9): el representante lo recibe una
sola vez y es su contraseña para cambios y bajas. Una baja retira la ficha del sitio y anula su token y, si se pide,
borra los datos personales de quien autorizó. Mientras los formularios no existan, se piden por correo, como dice el aviso
de privacidad, y alguien los aplica a mano con `autorizar` y `retirar`, que ya exigen el token.

## 8. Lo que queda abierto

1. **Cómo se marca en `acambaro-db` que un `id_denue` ya está dado de alta.** A mano al principio; después, un estado de
   seguimiento, una columna o una tabla.
2. **La exportación privada de las autorizaciones** (§5) para migrarlas a WordPress.
3. **El hosting de WordPress y lo que permite Kadence Blocks Form** (formulario de varios pasos, webhooks, Action
   Scheduler). No se ha verificado.
4. **El token en WordPress** (§9): dónde se muestra o se envía al terminar el alta, cuántos intentos fallidos se permiten
   antes de bloquear, y cómo se comprueba en el formulario de cambio y de baja.
5. **El aviso de privacidad:** su revisión debe tener en cuenta que los datos de quien autoriza vivirán en WordPress
   y en el proveedor que lo aloje (punto 6 de `aviso-de-privacidad-revision.md`).
6. **La fecha de la migración.**

## 9. El token: la contraseña para cambios y bajas

Decidido el 21 de septiembre de 2026. Ya funciona en la base de prospección (`exportar_directorio.py`), y lo que sigue es lo
que debe cumplir también WordPress cuando tome el relevo.

- **Qué es.** Un valor aleatorio de 80 bits, en 16 letras y números en grupos de 4 (`ABCD-EFGH-JKLM-NPQR`), que se emite en
  cada alta. Es una **contraseña, no un identificador**: el identificador de la ficha es `id_denue` (y el de su entrada en
  WordPress); mezclar las dos cosas obligaría a guardar en claro algo que no debe estarlo.
- **Se muestra una sola vez** y se entrega al representante en el momento del alta. **En la base solo se guarda su huella
  (SHA-256)**: quien tenga acceso a la base no puede leerlo ni reenviarlo. Un token perdido no se recupera: se comprueba la
  identidad de otra forma y se emite uno nuevo, y el anterior deja de servir.
- **Lo exigen** el cambio, la baja y la emisión de uno nuevo. Si la identidad se comprobó por otra vía (por ejemplo, llamando al
  teléfono registrado), quien opera lo indica y **queda anotado con la fecha**.
- **Se anula** al retirar la ficha. Volver a darla de alta es un consentimiento nuevo y emite un token nuevo.
- **Nunca sale** al JSON público ni se muestra en ninguna pantalla después del alta.
- **En WordPress** debe guardarse solo la huella (meta `token_hash`, el mismo SHA-256 del token sin guiones y en mayúsculas), se
  debe limitar los intentos fallidos al comprobarlo, y no debe registrarse el token en ningún log. Las huellas de las fichas ya
  registradas se migran junto con sus autorizaciones (§5).

**Por qué solo la huella.** Es una contraseña que se guarda en un archivo dentro de un repositorio de git. Con 80 bits de
azar basta una huella sin más ceremonia, y si la base se filtra los tokens no se filtran con ella.

**Límite conocido.** El token protege contra quien no lo tiene, no contra quien se lo quite al representante: quien lo tenga
puede cambiar o retirar la ficha. Por eso conviene entregarlo por un canal que se controle.

---
Este material se elaboró con asistencia de Claude (Anthropic).
