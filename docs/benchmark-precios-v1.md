# SDDA — Benchmark de precios v1 (documento completo)
## Insumo para la decisión P6 del Doc 04 §6 · Anillo 1: Acámbaro y sur de Guanajuato

**Versión:** 1.0 · 3 de septiembre de 2026
**Todos los montos en MXN.** Se aclara IVA cuando la fuente lo especifica.
**Reemplaza:** la captura parcial de una página que solo contenía la §9 (lista de llamadas) y la nota de cierre.

> **Nota del repo (2026-09-03):** este archivo se guarda como evidencia de la decisión P6
> (ver `docs/retroalimentacion.md`). El documento recomienda **no** cambiar los precios
> publicados hasta P6 (§0.2, §10). Armando decidió, de forma explícita, adoptar de una vez
> la columna "Propuesto" de la §2 en las páginas de SDDA del prototipo. Ese cambio queda
> registrado como override consciente de la regla de congelamiento, no como aplicación
> automática del estudio.

---

## 0. Cómo leer este documento (lea esto antes de tocar cualquier precio)

Este archivo contiene **dos listas de precios distintas que no deben mezclarse**:

| Bloque | Qué es | Dónde vive en el repo | Estado |
|---|---|---|---|
| **A** | Precios de los **servicios de consultoría de SDDA** (Diagnóstico, Mapa, Taller, Sprint, Acompañamiento, sitio, hosting, correo) | Doc 01 §5 y copy del Doc 05 §4 | Propuesta con fuente pública citada. **No editable hoy** por la regla del expediente, ver §0.2 |
| **B** | **Tarifas de espacio publicitario del portal** (lo que un anunciante paga por aparecer en `acambaro.com.mx`) | `data/tarifas.json`, hoy "precio de prueba" | **No hay dato firme local.** Solo proxies. No publicar como definitivo |

Las tarifas de radio, espectaculares y notas patrocinadas que aparecen en este estudio **son evidencia para el Bloque B y para el nuevo servicio de intermediación de pauta. No son precios de SDDA.** Confundirlos fue el problema de la captura parcial.

### 0.1 Qué depende de las llamadas del §9 y qué no

La nota *"los precios recomendados v2 deben re-validarse tras las llamadas"* **aplica al Bloque B y a las tarifas de medios locales**, que están mayoritariamente en "no informado". No aplica al Bloque A: los comparables de consultoría, talleres, automatización, WordPress y hosting **sí tienen precio público mexicano con fuente y fecha**, y están citados uno por uno en la §3.

### 0.2 Por qué este documento **no** autoriza por sí solo cambiar los precios de SDDA

Regla propia del expediente, Doc 04 §5 y decisión **P6** (fecha límite 31 dic 2026): los precios de los peldaños 1, 3 y 4 se ajustan **por comportamiento de prospectos reales** —tres rechazos seguidos por precio, o tres aceptaciones sin negociar— **después de tres propuestas enviadas**, no por investigación de escritorio.

Este benchmark es **un insumo de la decisión P6, no un sustituto de ella.** Lo correcto es:

1. Registrarlo como evidencia del paso 3 (opciones vs. criterios) de la secuencia CoT de 6 pasos.
2. **Mantener los precios publicados hasta el 31 dic 2026** o hasta que se cumplan las condiciones de la regla de ajuste.
3. Usar los rangos de la §2 como **techo defendible** al negociar, no como cambio de lista.

**Excepción razonable:** el precio del Taller ($9,999) está tan por debajo del piso de mercado documentado ($15,000) que conviene resolverlo antes, con la secuencia de 6 pasos, y no esperar a diciembre. Ver §2, fila 3.

---

## 1. Resumen ejecutivo

- SDDA está **bien posicionada pero subvaluada en su producto ancla**, el Taller.
- El **mercado local del anillo 1 no publica tarifas de medios**. Radio local, portales de Facebook municipales y espectaculares de Acámbaro, Moroleón, Uriangato y Salvatierra venden por cotización directa. Todo lo que aquí aparece con confianza media viene de tarifario de cadena o de Celaya, marcado **[PROXY]**.
- El **community management mensual** a PyMEs mexicanas se cobra entre **$6,000 y $25,000, promedio $12,000**. Ese es el número contra el que el dueño de negocio compara todo, aunque resuelva otro problema.
- La **gestión de pauta** tiene tres modelos estándar en México: fee fijo $3,000–$15,000/mes, 10–20% del ad spend, o híbrido. **SDDA hoy no lo cobra y no lo tiene en la lista.** Es el hueco comercial más claro que revela el estudio.
- Los **talleres de IA in-company** en México van de $15,000 a $90,000 por evento. El Taller de SDDA a $9,999 está debajo del piso.
- **Automatización** ($30,000–$80,000 típico PyME) valida el Sprint. **WordPress informativo** ($8,000–$25,000) deja el sitio en línea. **Diagnóstico con reporte de 10-15 páginas** ($8,000–$15,000) hace del Mapa a $4,900 un gancho agresivo, lo cual es coherente con su función.

---

## 2. BLOQUE A — Precios de SDDA: actual → propuesto

Tabla de decisión. La columna **Estado** dice qué se puede mover y cuándo.

| # | Servicio | Precio actual | Rango de mercado (fuente) | Posición | **Propuesto** | Estado |
|---|---|---|---|---|---|---|
| 0 | Diagnóstico exprés, 45 min | Gratis | Consulta gratuita 30-45 min es gancho estándar | En línea | **Gratis (sin cambio)** | Firme |
| 1 | Mapa de Oportunidades, 2 sem, 10-14 pp | $4,900 | $8,000–$15,000 diagnóstico PyME con reporte de 10-15 pp (magokoro.mx, 2026) | Por debajo | **$4,900 hoy → $6,900 tras P6** | Congelado hasta P6 |
| 2 | Taller Operación Digital Productiva, 6 h, ≤12 pers. | $9,999 | $15,000–$90,000 taller IA in-company; ejecutivo 3-4 h $15,000–$35,000 (100x.mx, innovaycree.com, 2026) | **Muy por debajo** | **$16,900** | **Decidir antes, con CoT de 6 pasos** |
| 3 | Sprint de Operación, 4 sem | $24,900 | $30,000–$80,000 implementación n8n PyME; flujos simples desde $15,000 (gabrielneuman.com, 2026) | En línea, extremo bajo | **$29,900 tras P6** | Congelado hasta P6 |
| 4 | Programa de Acompañamiento | $18,900/mes · $49,900/trim | Iguala consultoría MX $6,000–$12,000/mes; fractional CMO MX 30-50% bajo EUA (praxiumconsultores.com, alexisoubran.com, 2026) | **Por encima** del retainer local | **$14,900/mes · $39,900/trim** | Congelado hasta P6 |
| 5 | Sitio WordPress hasta 7 pp | Desde $12,900 | $8,000–$25,000 freelancer 5-7 pp (nebugrama.com, 2026) | En línea | **Sin cambio** | Firme |
| 6 | Hosting, respaldos y mantenimiento | $890/mes | $1,000–$5,000/mes mantenimiento WordPress MX (nebugrama.com, 2026) | Extremo bajo | **$1,190/mes** | Bajo riesgo, editable |
| 7 | Correo profesional por buzón | $390/mes | Google Workspace Starter $140/usuario/mes de lista; reseller desde $79–$97 (blog.norihost.com, 2026) | Por encima, margen amplio | **Sin cambio**, reempaquetar como "buzón administrado" | Firme |
| **8** | **Gestión de pauta digital** | **No existe** | Fee fijo $3,000–$15,000/mes · 10–20% ad spend · híbrido | Hueco | **$5,900/mes + 15% del ad spend sobre $20,000** | **Nuevo, ver §4** |
| **9** | **Intermediación de espacios locales** | **No existe** | Sin tarifa pública local | Hueco | **15–20% sobre costo del medio, mínimo $2,500/campaña** | **Nuevo, ver §4** |

**Razonamiento, una línea por precio:**

1. **Mapa $6,900:** sigue debajo del piso de mercado, mantiene su función de producto de entrada y recupera margen. Hacerlo **100% acreditable a 30 días** en lugar de 60 aprieta el ciclo de venta.
2. **Taller $16,900:** el mercado arranca en $15,000; la constancia respaldada en EC0217.01 y la deducibilidad del gasto de capacitación para el cliente justifican el alza y siguen dejándolo como el más accesible de su categoría.
3. **Sprint $29,900:** entra apenas en el rango típico ($30,000–$80,000), lo que lo vuelve el acceso más competitivo sin regalar cuatro semanas de trabajo.
4. **Acompañamiento $14,900:** el precio actual está arriba del retainer PyME local y no es vendible en el anillo 1; $14,900 mantiene la distancia frente al community management de $12,000 sin salirse del mercado.
5. **Hosting $1,190:** sigue en el extremo bajo del rango de agencia y corrige un precio que hoy castiga el margen de un servicio con costo marginal cercano a cero.
6. **Correo $390:** con costo reseller de $79–$168, el margen ya es amplio; el trabajo está en justificar el precio con alta, DNS y soporte, no en subirlo.

---

## 3. BLOQUE B — Tarifas de anunciante del portal (`data/tarifas.json`)

### 3.1 Estado real: no hay dato firme

**No se encontró ni una sola tarifa pública de espacio publicitario en el anillo 1.** Ni radio local, ni portales de Facebook municipales, ni espectaculares con proveedor identificado en Acámbaro, Moroleón, Uriangato o Salvatierra. Todos venden por cotización.

**Consecuencia operativa: los precios de `tarifas.json` no se pueden fijar con este estudio.** Siguen siendo "precio de prueba" hasta que se hagan las llamadas de la §9.

### 3.2 Lo único que sirve como ancla, y con qué reservas

| Referencia | Precio | Fuente y fecha | Uso |
|---|---|---|---|
| Publicación patrocinada en muro de página local, 15 días, alcance ~10 km **[PROXY nacional]** | $495 | espacio-publicitario.com, 2026 | Ilustra el **modelo** de cobro de una página local, no el precio del anillo 1 |
| Publicación patrocinada, alcance municipal **[PROXY nacional]** | $749 | espacio-publicitario.com, 2026 | Igual |
| Exa FM 90.5 Acámbaro, paquete mensual (**tarifa de cadena**, no precio comercial local) | $13,561.77 | Tarifario MVS Radio, 31-mar-2023 | Techo de referencia del medio dominante local |

`[ESTIMACIÓN]` Una banda provisional para el portal, **derivada y no encontrada**: si una publicación patrocinada de alcance municipal ronda $500–$750 por 15 días, un banner mensual en un portal municipal con tráfico modesto se ubicaría entre **$800 y $1,500/mes**. Cálculo: $749 × 2 quincenas = $1,498 como techo, ajustado a la baja porque un banner en sitio tiene menos alcance que una publicación en Facebook. **No publicar esta cifra como tarifa.** Es un punto de partida para negociar el primer anunciante y nada más.

`[POR VERIFICAR]` La única forma de cerrar esto es preguntar a Guanajuato Sur Noticias y A La Una Noticias Acámbaro qué cobran, y a dos anunciantes locales qué han pagado.

---

## 4. NUEVO — Cómo cobrar la pauta y la intermediación

Hoy no existe en la lista de SDDA y es el hueco comercial más claro del estudio.

### 4.1 Gestión de pauta digital (Meta / Google) — modelo híbrido

- **Fee base: $5,900/mes.**
- **Más 15% del ad spend** cuando la inversión mensual del cliente supere $20,000.
- **Mínimo de inversión publicitaria del cliente: $8,000/mes.** Debajo de eso, no se acepta el servicio.

**Razonamiento:** replica el estándar mexicano documentado en la §6 (fee fijo $3,000–$15,000, o 10–20% del gasto, o base + porcentaje que baja al subir el volumen). El mínimo de inversión protege las 3.5 horas semanales: administrar una campaña de $3,000 cuesta el mismo tiempo que una de $30,000.

**Advertencia de capacidad:** este servicio es **recurrente y mensual**. Antes de venderlo hay que decidir cuántos caben en el presupuesto de 30 minutos diarios. `[SUPUESTO]` No más de dos cuentas simultáneas.

### 4.2 Intermediación de espacios locales (radio, espectacular, portales, perifoneo)

- **Fee de gestión: 15–20% sobre el costo del medio.**
- **Mínimo $2,500 por campaña.**
- **Costo del medio y fee se muestran por separado en la cotización.**

**Razonamiento:** como los medios del anillo 1 no publican tarifa y se negocian caso por caso, SDDA cobra por **curaduría, negociación y verificación** —evidencia fotográfica de la lona, monitoreo del spot, reporte de lo pautado—, no por revender el espacio con sobreprecio oculto. Transparentar los dos renglones evita el conflicto de interés y es coherente con el valor de "evidencia" del Doc 01 §1.

---

## 5. Evidencia — tarifas de medios locales encontradas

### 5.1 Radio

| Medio | Cobertura | Formato | Precio | Fuente y fecha | Confianza |
|---|---|---|---|---|---|
| Exa FM 90.5 (XHVW), Acámbaro | Acámbaro y alrededores | Spot, tarifa de **cadena** MVS | $276.77–$966.69 por spot según horario; **paquete mensual $13,561.77** | Tarifario MVS Radio, 31-mar-2023 | Media |
| Exa FM 104.5 (XHZN), Celaya **[PROXY]** | Celaya | Spot / mensual | $171.14–$775.49 por spot; mensual $20,744.44 | Tarifario MVS Radio, 31-mar-2023 | Media |
| Estaciones locales de Acámbaro, Salvatierra y Moroleón | Anillo 1 | Spot 20/30", paquete, patrocinio, mención | **No informado** — venta por cotización | Verificación directa, sep-2026 | — |

`[POR VERIFICAR]` El tarifario MVS es de marzo 2023: ajustar **+12–15%** por inflación acumulada. No especifica si incluye IVA. La cifra de Exa Acámbaro es tarifa de cadena y **puede no ser el precio comercial local negociado**.

`[POR VERIFICAR]` **Corrección a un dato del encargo original:** se pidió investigar "La Q 1290 AM" de Salvatierra. La frecuencia 1290 AM de Salvatierra migró a FM y hoy corresponde a **Fiesta Mexicana 92.9 (XHFAC, Grupo Radiorama)**. No se localizó una estación activa llamada "La Q" en Salvatierra con tarifa pública.

### 5.2 Publicidad exterior

| Proveedor | Cobertura | Formato | Precio | Fuente y fecha | Confianza |
|---|---|---|---|---|---|
| Publisitios **[PROXY Celaya]** | Celaya | Espectacular 12.9 × 7.2 m, mensual | Desde $20,000/mes | publisitios.com, 2026 | Media |
| Publisitios **[PROXY Celaya]** | Celaya | Bardas pintadas | Desde $9,500, mínimo 10 bardas | publisitios.com, 2026 | Media |
| Publisitios **[PROXY Celaya]** | Celaya | Valla fija 4 × 2 m | Desde $8,000/mes | publisitios.com, 2026 | Media |
| Naranti **[PROXY Celaya]** | Celaya | Espectacular, rango general | $10,000–$35,000/mes | naranti.com, 2026 | Media |
| Proveedores de Acámbaro, Moroleón, Uriangato, Salvatierra | Anillo 1 | Renta mensual por cara | **No informado** | — | — |

`[SUPUESTO]` Celaya es un mercado mayor y más caro; en los municipios pequeños del anillo 1 el inventario debería costar menos por menor demanda. No hay dato que lo confirme.

### 5.3 Prensa y portales de noticias

| Medio | Cobertura | Formato | Precio | Fuente y fecha | Confianza |
|---|---|---|---|---|---|
| Periódico Correo, AM, Noticias Bajío | Guanajuato / sur del estado | Nota patrocinada, banner, inserción | **No informado** — sin media kit público | Verificación directa, sep-2026 | — |
| El Universal **[PROXY nacional]** | Nacional | Nota patrocinada | $69,216 | Tarifario El Universal 2025 | Baja — solo escala, **no aplica al anillo 1** |

### 5.4 Perifoneo, volanteo y lonas

| Proveedor | Cobertura | Formato | Precio | Fuente y fecha | Confianza |
|---|---|---|---|---|---|
| Perifoneo **[PROXY Celaya]** | Celaya y región | Carro de sonido, recorrido 8 h | **No informado** — hay oferta, sin precio público | planetamexico.com.mx, 2026 | Baja |
| Impresión de lona **[PROXY Celaya]** | Celaya | Lona impresa por m² | Desde $70/m² | playerasdecampana.info, 2026 | Media |
| Directorio automatizado | Moroleón | Impresión gran formato | $506–$40,506 por pieza, rango genérico | directorioempresas.mx, 2026 | Baja — rango tan amplio que no sirve para cotizar |

### 5.5 Portales y páginas de Facebook locales

| Página | Cobertura | Formato | Precio | Fuente y fecha | Confianza |
|---|---|---|---|---|---|
| Guanajuato Sur Noticias | Sur de Guanajuato | Publicación patrocinada | **No informado** | Verificación directa, sep-2026 | — |
| A La Una Noticias Acámbaro | Acámbaro | Publicación patrocinada | **No informado** | Verificación directa, sep-2026 | — |
| "Espacio Publicitario" **[PROXY nacional]** | Local 10 km / municipal | Publicación en muro, 15 días | $495 / $749 | espacio-publicitario.com, 2026 | Baja — ilustra el modelo |

### 5.6 Publicidad digital — referencias para dimensionar pauta

| Métrica | Valor | Fuente y fecha | Confianza |
|---|---|---|---|
| CPM Meta México (Tier 2) | $4.50 USD | admakeai.com, 2026 | Media |
| CPC Meta e-commerce, blended sobre 1,247 cuentas y $87M de gasto | $0.87 USD | mhigrowthengine.com, feb-2026 | Media |
| CPC Meta Retail | $0.70 USD | trendtrack.io, 2025 | Media |
| CPC Meta Apparel / moda | $0.45–$0.64 USD | trendtrack.io y mhigrowthengine, 2025-2026 | Media |
| CPM Google Ads general, ago-2025 a jul-2026 | $15.35 USD | triplewhale.com, 2026 | Media |
| Presupuesto mínimo PyME México | $3,000–$5,000/mes en pruebas; $8,000–$30,000/mes para resultados | shortway.com.mx, focusmedia-agency.com, 2026 | Media |

**Dato útil para el clúster textil:** moda y confección tienen de los CPC más bajos de Meta ($0.45–$0.64 USD), lo que hace viables campañas locales de presupuesto pequeño en Moroleón-Uriangato.

---

## 6. Evidencia — fees de gestión de pauta y community management

| Modelo | Rango México 2026 | Fuente | Confianza |
|---|---|---|---|
| Fee fijo mensual | $3,000–$15,000/mes, pauta aparte. Freelancer $3,000–$6,000; agencia PyME $6,000–$15,000 | Shortway, 2026 | Alta |
| Porcentaje sobre ad spend | 10–20% de la inversión publicitaria | Shortway, 2026; Dinametra, 2026 | Alta |
| Híbrido | Fee base + porcentaje que baja al subir el volumen: con $10,000/mes de pauta, base + 15%; con $30,000/mes, base + 12% | Old Fox, 2026 | Alta |
| Gestión básica, negocios locales | $8,000–$15,000/mes para 1-2 campañas | Unocollective, 2026 | Media |
| Fee mínimo de gestión SEM/PPC | Desde $8,000/mes | 347.business.blog, 2025 | Media |
| **Community management PyME** | **$6,000–$25,000/mes, promedio $12,000.** Junior $6,000–$10,000; semi-senior $10,000–$18,000; senior $18,000–$25,000+ | Shortway, 2026 | Alta |
| CM freelance por cliente | $3,000–$18,000/mes según seniority | atempora.studio, luzzidigital.com, 2026 | Alta |

**Conflicto de fuentes declarado:** algunas fuentes citan un piso de $3,000–$4,000/mes para paquetes muy básicos de redes. El piso realista de un servicio con estrategia es $6,000/mes. Se usa este último.

---

## 7. Evidencia — comparables de los servicios de consultoría

| Servicio | Rango de mercado | Fuente y fecha |
|---|---|---|
| Consultoría / diagnóstico de negocio PyME con reporte de 10-15 pp | $8,000–$15,000 por proyecto | magokoro.mx, 2026 |
| Taller de IA in-company, ejecutivo 3-4 h | $15,000–$35,000 por evento | 100x.mx, 2026 |
| Taller de IA in-company, equipos 1-2 días | $35,000–$90,000 por evento | innovaycree.com, 2026 |
| Implementación de automatización n8n para PyME | $30,000–$80,000 típico; flujos simples desde $15,000 | gabrielneuman.com, 2026 |
| Iguala de consultoría en México | $6,000–$12,000/mes | praxiumconsultores.com, 2026 |
| Fractional CMO en México | 30–50% por debajo de tarifas EUA ($6,000–$15,000 USD) | alexisoubran.com, 2026 |
| Sitio WordPress 5-7 páginas, freelancer | $8,000–$25,000 | nebugrama.com, 2026 |
| Plan de agencia, sitio informativo | Desde $4,884 | mexicoelearning.com, 2026 |
| Mantenimiento mensual WordPress México | $1,000–$5,000/mes | nebugrama.com, 2026 |
| Google Workspace Business Starter | $140/usuario/mes en plan anual, más IVA; vía reseller desde $79–$97/mes | blog.norihost.com, 2026 |

### 7.1 Sobre la EC0217.01 y la deducibilidad — por qué el Taller puede costar más

Obtener el estándar cuesta al instructor entre **$3,000 y $9,000**; Fundación MX desglosa capacitación $3,000 + evaluación $2,300 + certificación $1,300 = **$6,600**. Es certificación oficial CONOCER-SEP, vitalicia y de validez nacional.

Su valor comercial es doble: permite emitir constancia con respaldo oficial —diferenciador frente a cualquier webinar sin aval— y la capacitación empresarial es **deducible de ISR** para el cliente, con las constancias alineadas a estándares CONOCER apoyando el cumplimiento formal de capacitación (DC-3 / DC-5). Eso justifica cobrar por encima de un curso genérico y es un argumento que se le dice al comprador escéptico.

---

## 8. Contexto económico del mercado objetivo

| Dato | Cifra | Fuente |
|---|---|---|
| Acámbaro, ciudad | 56,597 habitantes | Censo INEGI 2020 |
| Acámbaro, municipio | 108,697 habitantes | Censo INEGI 2020 |
| Corredor textil Moroleón-Uriangato | Más de 4,000 establecimientos comerciales en ~4 km | Zona conurbada, Wikipedia |
| Plaza Textil Metropolitana | 360 fabricantes de Moroleón, Uriangato y Yuriria | fashionnetwork.com |
| Participación nacional del clúster | Cerca del 25% del mercado nacional de prendas | repositorio UGTO |
| Textil y confección en Guanajuato | ~2,870 unidades económicas, ~22,500 empleos | RIICO |
| Inversión en marketing de PyME mexicana | 5–12% de ingresos brutos; hasta 8% para PyME local que factura menos de $5M/año | Simplixy, Shortway, 2026 |
| Gasto mensual promedio en marketing digital, PyME mexicana | ~$10,000/mes | Shortway, 2026 |
| PyMEs con presupuesto dedicado de marketing | 37% | ENAPROCE/INEGI, citado por Shortway |

**Lectura comercial:** el gasto digital total disponible del cliente típico del anillo 1 está entre **$3,000 y $15,000/mes**. Eso acota lo que se le puede vender de forma recurrente y refuerza que los productos de entrada acotados —Mapa y Taller— se vendan antes que los retainers.

**Hueco importante:** `[POR VERIFICAR]` No se obtuvo el **número de unidades económicas por municipio** del anillo 1 en DENUE filtrado por 5-50 empleados. Es la consulta de 20 minutos ya prevista en el Doc 01 §3.1 y sigue pendiente. Sin ella no hay tamaño de mercado direccionable.

---

## 9. Riesgos, advertencias y verificación pendiente

**Riesgos del propio estudio:**

1. **Fuentes viejas.** El tarifario MVS es de marzo 2023. Ajustar +12–15% por inflación al validar.
2. **Proxies de Celaya.** Espectaculares, lonas y perifoneo vienen de un mercado mayor y más caro. No trasladar directo a Acámbaro.
3. **Ausencia casi total de tarifas hiperlocales.** Buena parte del Bloque B está en "no informado". Sin llamadas no hay base para fijar `tarifas.json`.
4. **Capacidad, no precio, es la restricción real.** Con 3.5 horas semanales y cero clientes, subir precios es más seguro que bajar volumen de trabajo. Los servicios recurrentes nuevos (pauta) hay que dosificarlos.
5. **El dato de El Universal no aplica.** Está solo para mostrar el tope de escala nacional.

**A quién llamar y qué preguntar:**

1. **Organización Radiofónica de Acámbaro — Exa FM 90.5 y La Mejor 89.7** (representación comercial local, afiliadas MVS): rate card 2026, costo de spot de 20 y 30 segundos, paquete mensual, patrocinio de sección, menciones en vivo. Confirmar si los precios incluyen IVA y si difieren de la tarifa de cadena.
2. **Fiesta Mexicana 92.9 (XHFAC, Salvatierra, Radiorama)** y **Radio Alegría 95.7 (XHBV, Moroleón):** las mismas preguntas. Confirmar además la cobertura real en Uriangato y Yuriria.
3. **Guanajuato Sur Noticias** (teléfono registrado +52 466 126 0476) **y A La Una Noticias Acámbaro:** precio por publicación patrocinada y por paquete mensual; alcance y seguidores verificables. **Esta llamada es la que desbloquea `tarifas.json`.**
4. **Dos proveedores de espectaculares y lonas en Acámbaro y Moroleón:** renta mensual por cara, costo de impresión e instalación, inventario disponible y fotos de ubicaciones.
5. **DENUE / INEGI**, consulta directa del mapa interactivo: unidades económicas por municipio del anillo 1 —Acámbaro, Salvatierra, Jerécuaro, Tarandacuao, Moroleón, Uriangato, Yuriria— filtradas por 5-50 empleados.
6. **Dos anunciantes locales que ya pauten:** qué han pagado y a quién. Es el dato más confiable y el más barato de conseguir.

---

## 10. Qué se puede editar en el repo hoy

| Acción | ¿Ahora? | Condición |
|---|---|---|
| Cambiar precios de SDDA en Doc 01 §5 y en el copy del Doc 05 | **No** | Congelados hasta P6 (31 dic 2026) o hasta que se dispare una regla de ajuste del Doc 04 §5 |
| Resolver el precio del Taller | **Sí, como decisión** | Correr la secuencia CoT de 6 pasos. La brecha con el mercado es demasiado grande para dejarla hasta diciembre |
| Subir hosting a $1,190 | **Sí** | Bajo riesgo, sin clientes activos afectados |
| Publicar `tarifas.json` como definitivo | **No** | Requiere la llamada 3 de la §9 |
| Agregar los servicios 8 y 9 (pauta e intermediación) a la lista | **Sí, como borrador** | Marcar como precio experimental, igual que el resto de la escalera |
| Guardar este archivo como evidencia de P6 | **Sí** | Es su función principal |

---

*Regla del expediente aplicada en todo el documento: cada cifra cita fuente y fecha; lo que no existe públicamente dice "no informado"; las estimaciones propias van marcadas `[ESTIMACIÓN]` con el cálculo a la vista; los supuestos y pendientes van con `[SUPUESTO]` y `[POR VERIFICAR]`. Ninguna cifra se rellenó por inferencia.*
