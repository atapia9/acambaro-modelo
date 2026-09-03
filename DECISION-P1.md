# DECISION-P1

Modelo navegable de dos sitios hermanos (Portal + SDDA) en un repo.
Este documento tiene dos partes: el **plan de diseño** y la **decisión de arquitectura P1**.

---

## Parte 1 — Plan de diseño (10 líneas)

1. **Paleta: dos colores más grises.** `--azul #123f5c` para estructura, títulos, enlaces y filetes. `--ambar #f2a900` **solo** como relleno de bloque detrás de texto oscuro (espacios de anunciante y avisos de escasez); nunca como color de texto sobre blanco.
2. **Grises:** `--tinta #1a1c1f`, `--gris-fuerte #5c6166`, `--gris-medio #8b9096`, `--gris-claro #dde0e2`, `--gris-fondo #f5f6f7`, `--blanco #ffffff`.
3. **Tipografía:** pila del sistema (`system-ui, -apple-system, "Segoe UI", Roboto`). Cero fuentes descargadas, cero CDN.
4. **Rol de texto:** la misma pila para cuerpo y títulos; la jerarquía la da el peso (600–700) y el tamaño, no una segunda familia.
5. **Rol de número:** `--fuente-numero` monoespaciada del sistema (`ui-monospace, Menlo, Consolas`) para precios, contadores y el texto "Quedan N de 12". Los números son el dato: se leen como una factura.
6. **Portal = tablón municipal:** rejilla de anunciantes arriba (2 / 3 / 4 columnas), directorio abajo en lista compacta. El ámbar aparece **solo** en los espacios pagados: son lo único saturado de la página.
7. **SDDA = hoja de propuesta:** una sola columna de ~62 caracteres, secciones separadas por filete de 1px `--gris-claro`, sin tarjetas, sin sombras, sin degradados. Un único color de enlace (`--azul`).
8. **Forma:** radio de borde 2px en el portal (botones, chips de categoría), 0 en SDDA. `box-shadow` en ningún lado.
9. **Foco y movimiento:** contorno de 2px `--azul` con desplazamiento de 2px, visible con teclado. Con `prefers-reduced-motion` se apagan transiciones y el auto-scroll de la tira.
10. **Portal vs. SDDA con la MISMA hoja:** se distinguen por densidad (portal denso / SDDA aireado), color (portal usa ámbar / SDDA no) y forma (portal en rejilla / SDDA en columna).

### ¿Este plan podría ser el de cualquier sitio generado?

La primera versión **sí** lo era: tarjetas con radio de 12px y sombra suave, un héroe centrado con título grande + subtítulo + dos botones, acento terracota. Qué cambié:

- Quité toda `box-shadow` y bajé el radio a 2px (portal) y 0 (SDDA).
- SDDA dejó de ser una rejilla de tarjetas: ahora es **una sola columna de texto corrido** separada por filetes. No hay ni una tarjeta en las tres páginas de SDDA.
- El acento dejó de ser terracota (combo prohibido) y pasó a **ámbar usado solo como relleno de bloque**, no como texto ni como borde decorativo.
- El directorio del portal es una **lista compacta**, no una cuadrícula de tarjetas idénticas; así los espacios pagados son lo único con color en la página.
- No hay etiquetas en versalitas sobre los títulos.

---

## Parte 2 — Decisión de arquitectura P1

### 1. El dilema en una frase

¿El sitio de SDDA vive en la raíz del mismo dominio del portal (subcarpeta `/sdda/` en `acambaro.com.mx`) o en su propio subdominio (`sdda.acambaro.com.mx`, o un dominio aparte más adelante)?

### 2. Los cinco criterios de SDDA

- **Tiempo real:** ¿cabe el mantenimiento diario en los 30 minutos disponibles?
- **Qué desbloquea una venta:** ¿qué opción ayuda a que un dueño de negocio entienda y contrate?
- **Qué evidencia produce:** ¿qué datos deja cada opción para decidir después?
- **Reversibilidad:** ¿cuánto cuesta deshacer la decisión si sale mal?
- **Aprovecha lo ya construido:** ¿reusa el repo, la hoja de estilo y el hosting que ya existen?

### 3. Las dos opciones contra cada criterio

| Criterio | **A. Raíz — `/sdda/` en acambaro.com.mx** | **B. Subdominio — sdda.acambaro.com.mx** |
|---|---|---|
| **Tiempo real (30 min/día)** | Un repo, un deploy, una hoja CSS. Editas y publicas en un paso. | Dos configuraciones de DNS y de Pages, dos publicaciones, más pasos de rutina cada día. |
| **Qué desbloquea una venta** | El dueño llega por el portal y ve SDDA sin cambiar de dominio; el directorio funciona como prueba de trabajo a la vista. | Marca separada: permite correo y propuestas con dominio propio y se lee como consultoría independiente, no como anexo del portal. |
| **Qué evidencia produce** | Analítica y clics en un solo origen; fácil ver el paso portal → SDDA. | Métricas separadas por público desde el día uno; más limpio para saber qué canal trae clientes. |
| **Reversibilidad** | Mover luego a subdominio: redirecciones 301 de `/sdda/*` y mantener las URL viejas un tiempo. Trabajo medio. | Volver a raíz: colapsar un dominio, también con 301, y ya repartiste tarjetas con la dirección del subdominio. Trabajo medio-alto. |
| **Aprovecha lo ya construido** | Total: mismo repo, misma hoja, mismos JSON, mismo GitHub Pages. | Parcial: reusa el código pero duplica la configuración de hosting y despliegue. |

### 4. Qué información falta

- ¿SDDA va a necesitar correo con dominio propio (`@sdda…`) en los próximos meses? Si sí, empuja hacia subdominio.
- ¿Cuánto tráfico real llega al portal en el primer trimestre? Sin visitas, separar métricas no aporta nada.
- ¿Dónde está el DNS de `acambaro.com.mx` y quién lo administra? Eso define el costo en tiempo de la opción B.
- ¿Hay intención de comprar un dominio propio para SDDA a 6 meses? Si sí, el subdominio es un paso intermedio que se tira.

### 5. Recomendación (máx. 5 líneas)

Empieza en la raíz, subcarpeta `/sdda/`. Cabe en 30 minutos diarios, reusa todo lo ya construido y el portal sirve de prueba de trabajo frente al dueño de negocio. El subdominio resuelve un problema —métricas y correo propios— que hoy no existe porque no hay tráfico ni clientes. Es reversible con redirecciones 301 si a 30 días la evidencia dice otra cosa. No cierres esto hasta ver el modelo funcionando en el celular.

### 6. Qué observar a 30 días para saber que la decisión fue equivocada

**Fecha de revisión: 2026-10-03.**

- Si más de la mitad de los interesados en SDDA preguntan "¿esto es del ayuntamiento o una empresa?" → la subcarpeta confunde: mover a subdominio.
- Si hace falta correo `@sdda` y no se puede montar sin dominio separado → subdominio ya.
- Si el portal pasa de 500 visitas/mes y no se puede distinguir qué llega a SDDA → separar orígenes.
- Si publicar el portal rompe SDDA (o al revés) más de una vez en el mes → el repo único no aísla lo suficiente: separar.
- Si nada de esto ocurre → la decisión fue correcta, sigue en raíz.
