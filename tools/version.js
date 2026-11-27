// Calcula la versión de la caché a partir del contenido de los archivos y la
// escribe en sw.js. Así cualquier cambio publicado dispara el aviso de
// actualización. Uso: node tools/version.js (antes de cada commit; las pruebas
// fallan si sw.js no está al día).
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const RAIZ = path.join(__dirname, "..");
const SW = path.join(RAIZ, "sw.js");

function archivosCacheados(textoSw) {
  const lista = textoSw.match(/const ARCHIVOS = \[([\s\S]*?)\];/)[1];
  return [...lista.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((f) => f !== "./");
}

function calcular(textoSw) {
  const h = crypto.createHash("sha256");
  for (const f of archivosCacheados(textoSw).sort()) {
    let datos = fs.readFileSync(path.join(RAIZ, f));
    if (!f.endsWith(".png")) datos = Buffer.from(datos.toString("utf8").replace(/\r/g, ""));
    h.update(f + "\0").update(datos).update("\0");
  }
  // El propio sw.js cuenta, sin la línea de la versión.
  h.update(textoSw.replace(/\r/g, "").replace(/const VERSION = "[^"]*";/, ""));
  return h.digest("hex").slice(0, 10);
}

module.exports = { archivosCacheados, calcular };

if (require.main === module) {
  const texto = fs.readFileSync(SW, "utf8");
  const v = calcular(texto);
  const nuevo = texto.replace(/const VERSION = "[^"]*";/, 'const VERSION = "' + v + '";');
  if (nuevo !== texto) fs.writeFileSync(SW, nuevo);
  console.log("sw.js versión", v);
}
