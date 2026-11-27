# Germen Graphidis

Generador offline de semillas creativas para dibujar: diseños de tatuaje e ilustración en lienzo libre. Combina términos de varias listas y los entrega como una frase breve que el usuario usa como punto de partida. El nombre significa "el brote del dibujo" en latín; cada combinación generada se llama "semilla".

Usuario: Den, tatuador e ilustrador, hispanohablante. Dispositivo principal: celular Android. Cuenta de GitHub: `dalexpic-boop`. Repositorio público `germen`, publicado en `dalexpic-boop.github.io/germen`. Los commits usan el correo noreply de GitHub, nunca el personal.

## Documentos

- `SPEC.md`: especificación. Es la fuente de verdad del comportamiento.
- `LISTAS.md`: contenido inicial. Después de convertirlo a `data/*.js`, los datos pasan a ser la fuente de verdad del contenido.
- `REVISION.md`: casos dudosos de la conversión, pendientes de que Den los revise.

## Reglas de trabajo

- Responde, documenta y escribe los mensajes de commit en español. La interfaz y los datos van en español.
- Stack fijo: HTML, CSS y JavaScript sin frameworks, sin build, sin dependencias de runtime, sin CDN ni fuentes web. Cero peticiones de red en tiempo de ejecución.
- Los datos se cargan como scripts clásicos (no `fetch`, no módulos ES), para que la app funcione también abierta desde `file://`. Usa el patrón de envoltura de SPEC.md §3 para que carguen igual en Node.
- `js/generador.js` y `js/frase.js` son puros: sin DOM y con `rng` inyectable. Cada regla nueva lleva su prueba.
- Pruebas: `node --test tests/`. Deben pasar antes de cada commit.
- No agregues dependencias ni cambies el stack sin preguntar.
- Antes de un cambio grande, propone un plan corto y espera aprobación.
- Commits pequeños, uno por funcionalidad.
- Al convertir LISTAS.md: genera género, número, plural, artículos forzados y las formas de los estados. Si un caso es dudoso, no adivines: inclúyelo en una lista para que Den lo revise.
- Diseño: pensado primero para el celular en vertical, compacto. La frase va en serif del sistema.
