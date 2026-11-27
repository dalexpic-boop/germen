// Punto de entrada para `node --test tests/`: Node 24 resuelve la carpeta a
// este archivo, que carga todas las pruebas *.test.js.
const fs = require("node:fs");
const path = require("node:path");

for (const f of fs.readdirSync(__dirname).sort()) {
  if (f.endsWith(".test.js")) require(path.join(__dirname, f));
}
