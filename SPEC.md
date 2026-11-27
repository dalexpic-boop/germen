# Germen Graphidis — Especificación (v1)

Nombre: **Germen Graphidis**, "el brote del dibujo" en latín (*germen*: brote, semilla que germina; *graphis*: el dibujo, el arte de dibujar). En la pantalla de inicio se muestra como **Germen**. Dentro de la app, cada combinación generada se llama **semilla**.

## 1. Propósito

Generador de "semillas" creativas para dibujar. Combina términos de varias listas (estilo, elemento, concepto, universo, tratamiento, foco…) y los entrega como una frase breve. El usuario la usa como punto de partida para inventar un diseño: piezas de tatuaje o ilustración en lienzo libre (tablet, papel).

La app **no genera imágenes**. Su trabajo es proponer restricciones fértiles. La imagen la produce el dibujante.

Dos usos principales:
- **Lucir:** piezas coherentes, tipo flash, para mostrar o vender.
- **Reto:** práctica deliberada de composición, perspectiva, escorzo y pose, con dificultad graduada.

## 2. Usuario y contexto

- Den: tatuador e ilustrador, hispanohablante. Sus estilos favoritos son blackwork y neotradicional. Le atrae la imaginería medieval, sin limitarse a ella.
- Dispositivo principal: **el celular Android**. Todas las decisiones de diseño y las pruebas priorizan el celular en vertical. Secundarios: tablet Android (Galaxy Tab) y portátil.
- Debe funcionar **100 % sin conexión** después de la primera carga.
- Uso típico: abre la app, genera, relanza lo que no le sirve, bloquea lo que le gusta, copia o guarda la semilla y se pone a dibujar.

## 3. Plataforma y arquitectura (decisiones cerradas)

- **PWA** en HTML, CSS y JavaScript sin frameworks, sin build y sin dependencias de runtime. Nada de CDN ni fuentes web.
- **Alojamiento:** GitHub Pages (repositorio público, requisito de Pages en cuenta gratuita; confirmar al desplegar). Es la vía principal porque el celular necesita un origen HTTPS para instalar la PWA y usarla sin conexión. Den no tiene cuenta de GitHub: Claude Code lo guía para crearla y hace el resto del despliegue.
- **Respaldo local:** la misma carpeta debe funcionar abriendo `index.html` desde el sistema de archivos (`file://`), sobre todo en el portátil. En Android abrir HTML locales es poco fiable, así que ahí no es la vía principal. Por eso los datos se cargan como **scripts clásicos** (`<script src="data/...js">`), no con `fetch` ni módulos ES.
- **Patrón de los scripts**, para que también carguen en Node durante las pruebas:
  ```js
  (function (root) {
    root.SEMILLA = root.SEMILLA || {};
    root.SEMILLA.elementos = [ /* ... */ ];
  })(typeof window !== "undefined" ? window : globalThis);
  ```
- **Lógica pura y testeable:** `generador.js` y `frase.js` no tocan el DOM y reciben una función `rng` inyectable. `app.js` maneja la interfaz y la persistencia.
- **Tamaño:** menos de 300 KB sin contar íconos.

Estructura de carpetas:
```
index.html
manifest.json
sw.js
config.js            probabilidades y parámetros editables
css/estilos.css
js/generador.js      selección de términos y reglas
js/frase.js          construcción de la oración y concordancia
js/app.js            interfaz, estado, persistencia
data/estilos.js  tratamiento.js  foco.js  elementos.js  estados.js
data/relaciones.js  formatos.js  conceptos.js  pares.js  universos.js
data/zonas.js  reglas.js
icons/
tests/
CLAUDE.md  SPEC.md  LISTAS.md
```

## 4. Modelo de datos

Todo el contenido inicial está en LISTAS.md. Al convertirlo a `data/*.js` se generan los campos gramaticales. Los casos dudosos se listan para revisión, sin adivinar.

Campos comunes de un término:
- `id` (slug único dentro de su lista)
- `texto` (forma base, la que se muestra en los chips)
- `frase` (opcional: el texto exacto para la oración, si difiere de `texto`)
- `familia` (slug)
- `peso` (número, por defecto 1)
- `tags` (arreglo opcional)

Campos por tipo:
- **Estilo:** `probElementos`: "alta" | "media" | "baja".
- **Elemento:** `genero`: "m" | "f"; `numero`: "s" | "p"; `plural` (forma plural sin artículo); `articulo` (opcional, para forzar, por ejemplo "un" en "un hacha"); `animado`: boolean.
- **Estado:** `formas`: { m, f, mp, fp }; `excluir`: { familias: [], ids: [] }.
- **Relación:** `plantilla`; `requiere`: { A?: "animado", B?: { familias: [] } }.
- **Foco:** `variable`; `modo`: "lucir" | "reto"; `nivel`: 1 | 2 | 3 (solo reto y composición); `figura`: boolean; `soporte`: "piel" (opcional, si solo aplica a piel).
- **Universo:** `sub` (arreglo opcional de { id, texto, frase }); `fraseSub` (plantilla).
- **Zona:** `forma`.
- **Regla:** { `alcance`: "siempre" | "lucir", `a`: selector, `b`: selector }. Un selector identifica un término por eje, id, familia o subnivel.

Detalles fijados en la conversión:
- `articulo: ""` indica que la `frase` ya trae sus artículos ("un cerdo y un gallo").
- Foco: `tambienLucir: true` en las variantes de composición de nivel 1 y 2. Los nombres de las variables están en `SEMILLA.variablesFoco`.
- Las familias, con su nombre visible, están en `SEMILLA.familiasElementos` (con `animada`) y `SEMILLA.familiasConceptos`.
- Tratamiento: `SEMILLA.color`, `SEMILLA.sombreado` y `SEMILLA.linea`.
- Selector de regla: `{ eje, ids }` o `{ eje, excepto }`, más `sub` opcional para los subniveles de universo. Ejes: estilo, color, sombreado, linea, elemento (principal o secundario), formato, universo, foco.

## 5. Ejes

1. **Estilo:** siempre presente.
2. **Tratamiento:** color, sombreado y línea, cada uno opcional.
3. **Elemento principal**, más **secundario** y **relación** opcionales, más **estado** opcional.
4. **Concepto:** uno o dos, de familias distintas, o un **par en tensión**.
5. **Universo**, con segundo nivel donde aplica.
6. **Foco:** en lucir, una variable de lucir; en reto, una variable de reto con nivel.
7. **Formato:** opcional.
8. **Zona del cuerpo:** solo en soporte piel.

## 6. Modos y controles

Controles independientes:
- **Soporte:** Lienzo libre (por defecto) | Piel. Piel agrega la zona del cuerpo.
- **Intención:** Lucir (por defecto) | Reto. Reto muestra un selector de **nivel 1 / 2 / 3**.
- **Densidad:** Escueta (por defecto) | Completa.
- **Elementos:** Auto (por defecto) | Siempre | Nunca.

## 7. Algoritmo de generación

Todas las probabilidades viven en `config.js`. Valores iniciales:

**Densidad escueta**
- estilo: 1
- elemento principal: según el modo Elementos
- secundario: 0,3 · estado: 0,3
- conceptos: 1
- universo: 0,3 (1 si no hay elemento)
- tratamiento: 1 o 2 componentes (50/50)
- foco: 0 en lucir, 1 en reto
- formato: 0

**Densidad completa**
- estilo: 1
- elemento principal: según el modo Elementos
- secundario: 0,8 · estado: 0,5
- conceptos: 2, con 0,2 de probabilidad de que sean un par en tensión
- universo: 1
- tratamiento: 2 o 3 componentes
- foco: 1
- formato: 0,3

**Zona:** 1 si el soporte es piel.

**Modo Elementos = Auto:** probabilidad del elemento principal según el `probElementos` del estilo sorteado: alta 0,9 · media 0,6 · baja 0,3. Siempre = 1. Nunca = 0.

**Selección ponderada:** cada término se elige según su `peso`. Los términos usados en las últimas N semillas generadas (N = 15, ajustable) tienen el peso multiplicado por 0,25. No se excluyen, solo se vuelven menos probables.

**Familias:**
- Dos conceptos nunca de la misma familia.
- Elemento secundario: con probabilidad 2/3 de una familia distinta a la del principal (contraste) y 1/3 de la misma familia pero un término distinto (afinidad).

**Relación:** se sortea entre las que cumplen sus requisitos. Si ninguna cumple, se usa "con".

**Estado:** hay a lo sumo uno por semilla. Se aplica al elemento principal o, si hay secundario, a uno de los dos al azar. Se sortea entre los que no excluyen a ese elemento.

**Reto:**
- El foco sale de las variables de reto (perspectiva, escorzo, pose, composición) del nivel elegido. Si no hay variantes compatibles, baja un nivel.
- Si la variante tiene `figura: true`, el elemento principal debe ser animado: se resortea entre animados. Si no hay elemento (Elementos = Nunca, o en Auto no salió), la frase del reto agrega "aplicado a una figura humana o animal".
- Las variantes con `soporte: "piel"` solo salen con soporte piel.
- Las reglas de alcance "lucir" no aplican en reto.

**Reglas:** después de sortear, se validan todas las reglas aplicables. Si una falla, se resortea el término no bloqueado más reciente del conflicto. Si ambos están bloqueados, se respeta el bloqueo y se ignora la regla para esa semilla.

**Bloqueo y relanzar:**
- Cada término de la semilla se puede bloquear.
- "Relanzar" resortea todo lo no bloqueado, respetando las reglas frente a lo bloqueado.
- Tocar un chip resortea solo ese eje.

El generador recibe `(estadoActual, bloqueos, ajustes, rng)` y devuelve una semilla: un objeto con los términos elegidos por eje, más el modo y la fecha.

## 8. Construcción de la frase

Orden de la oración:
1. Cláusula de elementos (o, si no hay elemento, los conceptos con mayúscula inicial)
2. `, en {estilo}`
3. ` {formato}` si hay
4. `; {tratamientos}` unidos con comas y "y"
5. `. Foco: {variante}.` en lucir, o `. Reto nivel {n}, {variable}: {variante}.` en reto
6. `Que transmita {c1}` o `{c1} y {c2}.`, o `En tensión: {a} y {b}.` (solo si hubo cláusula de elementos)
7. Frase del universo, si hay
8. `Zona: {zona} ({forma}).` si el soporte es piel

Sintagma de un elemento: `{artículo} {frase o texto} {estado concordado}`.
- Artículo indefinido según género y número: un, una, unos, unas.
- Con `articulo` forzado: "un hacha", "un águila", "un ancla".
- El estado concuerda con el género y número reales: "un hacha oxidada", "unos grilletes oxidados".

Plantillas de relación:
- `{A}` y `{B}`: sintagma completo
- `{o:A}`: o / a / os / as según A
- `{pron:A}`: él / ella / ellos / ellas según A
- `{B:plural}`: plural de B sin artículo

Primera letra en mayúscula. Sin dobles espacios ni signos sueltos.

Ejemplos esperados:
- "Una lámpara de aceite con un murciélago, en neotradicional; colores muy vivos y sombreado en achurado. Que transmita melancolía."
- "Un yelmo de cimera cubierto de musgo con un colibrí brotando de él, en neotradicional dentro de una carta de tarot; colores muy vivos y sombreado en achurado. Foco: luz desde abajo. Que transmita melancolía y paciencia. Inspirado en el art nouveau. Zona: antebrazo interno (vertical alargado)."
- "Un cráneo formado por polillas, en blackwork; sombreado en puntillismo."
- "Unas manos rezando con un hacha oxidada, en tradicional; línea gruesa. Reto nivel 2, escorzo: brazo o pata extendida hacia el espectador. Que transmita astucia."
- "Desesperación y voluntad, en ilustrativo; colores apagados. Universo: deportes."

## 9. Interfaz

Mobile-first, compacta, utilizable en una tablet apoyada al lado del papel.

**Pestaña Generar**
- Arriba: controles compactos (soporte, intención, nivel si es reto, densidad, elementos).
- Centro: la frase, grande, en serif del sistema (`Georgia, "Noto Serif", "Times New Roman", serif`).
- Debajo: un chip por término con su eje en pequeño. Tocar el chip lo relanza; el ícono de candado lo bloquea.
- Abajo: botón grande "Generar" o "Relanzar" (relanza lo no bloqueado), "Guardar" y "Copiar frase".

**Pestaña Historial**
- Semillas guardadas, de la más reciente a la más antigua: frase, fecha, modo y estado (guardada / dibujada).
- Marcar como dibujada y agregar una nota corta.
- Filtrar por dibujadas o pendientes.
- "Volver a usar": carga la semilla en Generar con todos los términos bloqueados.

**Pestaña Ajustes**
- Tema claro / oscuro / sistema.
- Ventana de no repetición (N).
- Exportar e importar respaldo.
- Borrar historial, con confirmación.

Áreas táctiles de al menos 44 px. Funciona en vertical y horizontal. En portátil, columna centrada de unos 640 px.

## 10. Persistencia

- `localStorage`, claves `semilla.historial`, `semilla.ajustes` y `semilla.recientes`. Los recientes alimentan la penalización por repetición; solo se guarda en historial lo que el usuario guarda.
- **Exportar:** descarga `germen-respaldo-AAAA-MM-DD.json` con historial y ajustes.
- **Importar:** fusiona por `id` sin duplicar.
- El historial vive por separado en cada dispositivo. Exportar e importar es la forma de moverlo.

## 11. Service worker y actualizaciones

- Caché "cache-first" de todos los archivos, con nombre de caché versionado.
- Al detectar una versión nueva, mostrar "Hay una actualización — recargar".
- `manifest.json`: `name` "Germen Graphidis", `short_name` "Germen", `display: standalone`, `orientation: portrait`, íconos de 192 y 512 px. Un ícono simple generado por Claude Code basta para la fase 1.

## 12. Fuera de alcance (fase 1)

- Generación de imágenes con IA.
- Sincronización en la nube.
- Fotos de los dibujos.
- Editor de listas dentro de la app.
- Lista de aestheticswiki.

## 13. Fases

**Fase 1 (MVP)**
1. Conversión de LISTAS.md a `data/*.js`, con la lista de casos dudosos para revisión.
2. `generador.js` y `frase.js`, con pruebas.
3. Interfaz de Generar con bloqueo y relanzar.
4. Historial, ajustes, exportar e importar.
5. PWA sin conexión y despliegue en GitHub Pages.

**Fase 2**
- Debilidades: marcar variantes de reto para que salgan más (peso ×3).
- Temporizador opcional en reto.
- Fotos de los dibujos (IndexedDB, miniaturas comprimidas).
- Estadísticas de práctica: qué variables y niveles se han dibujado.
- Editor de listas en la app.

**Ideas para después**
- Segundo nivel para más universos (por ejemplo deportes → boxeo, surf…; lugares → mar, norte…).
- Paquete de estéticas de aestheticswiki.
- Zodiaco chino.
- Modo de los siete pecados capitales y las siete virtudes, con las etiquetas `pecado` y `virtud`.

## 14. Criterios de aceptación (fase 1)

- Instalada en Android (Chrome) y en el portátil, funciona en modo avión.
- `index.html` abierto desde `file://` genera semillas.
- Ninguna petición de red en tiempo de ejecución.
- Pruebas con `node --test tests/` y `rng` con semilla fija (por ejemplo mulberry32):
  - 10 000 semillas por combinación de modos sin `undefined`, sin `{`, sin dobles espacios y con mayúscula inicial.
  - Cero violaciones de reglas, familias y requisitos de relación.
  - Concordancia de cada elemento con cada estado aplicable, incluidos los femeninos con a tónica y los plurales de por sí.
  - Los términos bloqueados se conservan al relanzar.
  - Exportar seguido de importar devuelve el mismo historial.
- Generar tarda menos de 50 ms en el celular.

## 15. Pendientes

- **Cuenta de GitHub:** creada (`dalexpic-boop`). Se despliega desde el paso 3 de la fase 1 para probar en el celular.

## 16. Decisiones tomadas al planear la fase 1

- Sin elemento, los conceptos encabezan la frase y pueden ser 1 o 2 aun en densidad escueta (ejemplo 5 de §8).
- Los conceptos que son adjetivos llevan `frase` propia ("lo infantil") para que "Que transmita…" sea gramatical; se revisan en REVISION.md.
- Se agregan reglas "siempre" para que un elemento no coincida con un formato del mismo nombre (carta de tarot, vitral).
- El universo "lugares" no tiene segundo nivel; los subniveles (mar, norte…) quedan como idea para después.
