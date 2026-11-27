// Utilidades de prueba: carga de los scripts clásicos en Node y rng con semilla fija.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const RAIZ = path.join(__dirname, "..");

// Ejecuta un script clásico (patrón de envoltura de SPEC.md §3) en globalThis.
function cargar(...rutas) {
  for (const ruta of rutas) {
    const codigo = fs.readFileSync(path.join(RAIZ, ruta), "utf8");
    vm.runInThisContext(codigo, { filename: ruta });
  }
  return globalThis.SEMILLA;
}

function cargarDatos() {
  const dir = path.join(RAIZ, "data");
  const archivos = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort()
    : [];
  return cargar("config.js", ...archivos.map((f) => "data/" + f));
}

// mulberry32: rng determinista para las pruebas.
function mulberry32(semilla) {
  let a = semilla >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

module.exports = { RAIZ, cargar, cargarDatos, mulberry32 };
