# Bitacora de retroalimentacion

Registro de cada revision del modelo y de que cambio por cada comentario.
Este archivo crece con cada revision. Es evidencia de metodo.

Los revisores se identifican con un numero ("revisor externo 1", etc.). No se ponen
sus nombres en este repositorio publico.

---

## Revision 01 — revisor externo 1

- **Fuente:** revisor externo, conversacion de WhatsApp.
- **Fecha:** 3 de septiembre de 2026.
- **Metodo:** respondio las tres preguntas de la nota de retroalimentacion sobre el
  primer modelo (portada anterior, con la parrilla de anunciantes arriba).

### Palabras textuales

**P1 — que entendio en 15 segundos:**
> "es una pagina que vende anuncios"

**P2 — sobre los 12 lugares:**
> "caben mas... pero depende a quien esta disenada... la mayoria accesan por telefono .. entonces .. caben menos"
> "ademas necesitas crear categorias"

**P3 — que le estorba o no entiende:**
> "desde el punto de vista de consumidor no se que voy a encontrar en esa pagina.. es decir.. es una pagina de turismo??? que espero de esa pagina??? lo que daria entendimiento seria las categorias"

### Diagnostico

El primer modelo abria con la parrilla de anunciantes. Un consumidor entendia
"vende anuncios" y no "aqui encuentro negocios de mi ciudad". Faltaban categorias,
que son lo que le diria de que trata el sitio.

### Que cambio por cada comentario

| Comentario del revisor | Cambio en el modelo |
|---|---|
| "es una pagina que vende anuncios" (no entendio que es un directorio) | Nuevo orden de la portada: primero un H1 que responde "que encuentro aqui" ("El directorio de negocios de Acambaro"), luego una linea de apoyo que dice para quien es. La parrilla de anunciantes deja de abrir la pagina. |
| "lo que daria entendimiento seria las categorias" / "necesitas crear categorias" | La **rejilla de categorias** pasa a ser el contenido principal de la portada, arriba de todo lo demas. Nuevo `data/categorias.json` con 10 categorias en palabras de vecino ("Talleres y refacciones", no "servicios de reparacion automotriz"). Cada tarjeta dice cuantos negocios tiene. Una categoria sin negocios no se muestra. Cada categoria tiene su URL: `/categoria.html?c=slug`. |
| "es una pagina de turismo???" (no sabia que esperar) | El H1, la linea de apoyo y las categorias juntas dejan claro en la primera pantalla que es un directorio de negocios locales, no turismo. Verificado en 380x740 (ver `verificacion-fold.md`). |
| "la mayoria accesan por telefono.. entonces.. caben menos" | En celular la banda de destacados muestra 6 y un enlace "ver los demas"; en pantallas anchas se muestran todos. Los 12 lugares y `total_portada` no cambian: el ajuste es de presentacion en pantalla chica, no de inventario. |
| "es una pagina que vende anuncios" (la banda de pago se leia como todo el sitio) | La banda de destacados lleva un encabezado que la declara: "Espacio de anunciante: estos negocios pagan por aparecer aqui. El resto del directorio es gratuito." |
| (implicito) no habia por donde empezar a buscar | Se agrega un buscador simple arriba: por nombre y por categoria. |

### Pendiente para que el revisor lo corrija

- El conjunto de 10 categorias y sus nombres/descripciones son una propuesta a partir
  de los giros tipicos de una ciudad de este tamano. Falta que Armando (y en su caso
  el revisor) los ajuste a lo que de verdad hay en Acambaro.
