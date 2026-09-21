# Aviso de privacidad — qué cambió y qué debe revisar una persona

**Fecha:** 21 de septiembre de 2026.
**Estado: BORRADOR.** No es asesoría legal ni un aviso listo para publicar. Lo revisa una persona
antes de que se publique el primer negocio real. Este documento existe para que esa persona vea qué se
cambió, qué hace hoy el sistema (para que pueda comprobarlo) y qué decisiones quedan abiertas.

## 1. Por qué se actualizó

El aviso solo cubría a quien pide un espacio de anunciante. Pero el formulario de `anunciar.html` ya
pide «Autorizo la publicacion de estos datos en el directorio» y enlaza a este aviso, y el conector con la
base de negocios del proyecto (privada) va a publicar fichas de negocios reales. Eso es tratamiento nuevo:
se publican datos de negocios (que en una persona física pueden identificarla) y se guardan los de quien
autoriza.

## 2. Qué cambió en `aviso-de-privacidad.html`

| Sección | Cambio | Qué del sistema lo respalda |
|---|---|---|
| Qué datos se recaban | Se agregan los de quien autoriza (nombre, cargo, medio, fecha; no se publican) y los de la ficha (sí se publican) | Tabla `publicacion` de la base; el exportador solo saca una lista fija de campos |
| De dónde vienen los datos (nueva) | Los da el representante o vienen del DENUE (INEGI) | La base parte del DENUE; el sitio cita la fuente en el pie cuando hay negocios reales |
| Para qué se usan | Se agregan publicar la ficha, guardar constancia de la autorización e invitar a negocios del DENUE | Orden `autorizar`; el contacto en frío es parte del flujo de captación |
| Qué se publica y qué no (nueva) | Aclara qué sale y que lo publicado es público y copiable | Lista blanca del exportador; representante, cargo, medio, fecha y notas nunca salen |
| Con quién se comparten | Aclara que la ficha es pública por decisión del negocio | — |
| Cómo ejercer tus derechos | Se agregan cambio de ficha, baja, borrado y no volver a contactar | `retirar` la saca del directorio y conserva la autorización; `retirar --purgar` borra también quién autorizó |

## 3. Lo que hace el sistema hoy (comprobable)

- Una ficha solo se exporta si alguien la dio de alta con `autorizar`, que exige quién autorizó y por qué medio.
- El teléfono y el WhatsApp solo se publican si se dieron o se pidió copiar los que ya se tenían; no se copian solos.
- El JSON público no lleva razón social, correo, tamaño, coordenadas, representante, cargo, medio ni notas.
- Retirar una ficha la quita del directorio en la siguiente exportación, pero **conserva** el registro de la autorización y de la baja.
- `retirar --purgar` borra la ficha y con ella quién autorizó. No se puede deshacer.
- El proceso es manual: la baja no es inmediata, depende de que se exporte y se suba el archivo.

## 4. Puntos abiertos para quien revise (no los resolví)

1. **Correo y domicilio completo del responsable.** El aviso dice «escribe al correo de contacto de SDDA» pero no
   hay un correo. Tampoco hay un domicilio más allá de la ciudad.
2. **Marco legal y autoridad vigentes.** No cité leyes ni artículos. La normativa federal de datos personales
   cambió en 2025; conviene confirmar el texto vigente y qué autoridad corresponde antes de nombrarlas.
3. **Finalidades y negativa.** Falta decidir cuáles son finalidades principales y cuáles secundarias (por ejemplo,
   «invitar a negocios a aparecer» y «mejorar el directorio»), y el mecanismo para negarse a las secundarias.
4. **Plazo de conservación.** No hay uno definido: hoy el registro de la autorización se conserva hasta que
   alguien pide su borrado. Falta fijar un plazo, y si aplica algún periodo de bloqueo antes de borrar.
5. **Aviso en el primer contacto.** Los datos que vienen del DENUE son datos obtenidos de una fuente pública, y
   se usan para escribir al negocio. Falta definir cómo se entrega el aviso en ese primer contacto (enlace en el
   primer WhatsApp, llamada o correo).
6. **Terceros que alojan los datos.** El aviso dice que no se comparte con terceros para mercadotecnia. Pero la
   base con los datos de quien autoriza vive en un repositorio privado de GitHub, y el sitio del modelo se sirve
   desde GitHub Pages. El sitio final (WordPress) tendrá otro proveedor. Falta decidir si esos proveedores deben
   nombrarse y si hace falta algún compromiso con ellos.
7. **Personas físicas y morales.** La ficha de una persona moral no son datos personales; la de una persona física
   con actividad empresarial sí puede serlo. El borrador lo dice en general; falta decidir si se distingue.
8. **Respuesta a solicitudes.** Se dejó el plazo de 20 días hábiles que ya tenía el aviso, y «la siguiente
   actualización del directorio» para retirar una ficha. Falta confirmar que ambos se pueden cumplir en la
   práctica con el proceso manual.
9. **Cómo se respalda «no se le vuelve a escribir».** El aviso lo promete, pero el seguimiento de contactos de la
   base solo tiene los estados `pendiente`, `contactado`, `interesado`, `no interesado`, `sin respuesta` y
   `dato inválido`. Ninguno distingue «no me interesa» de «no me contacten» (una oposición). Falta decidir si se
   agrega un estado propio, para que la negativa quede registrada y se pueda filtrar.

## 5. Lo que este borrador no cubre

- El formulario de diagnóstico (`sdda/diagnostico.html`) y la clasificación SCIAN por MCP: hoy no envían nada. Sus
  documentos (`crm-diagnostico-integracion.md` y `mcp-clasificacion-integracion.md`, §6 y §7 en ambos) ya dicen que
  el aviso debe actualizarse **antes** de conectarlos.
- Cookies o analítica: el sitio no usa ninguna.

---
Este material se elaboró con asistencia de Claude (Anthropic).
