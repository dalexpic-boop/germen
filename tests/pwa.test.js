// PWA y funcionamiento sin conexión (SPEC.md §11 y §14).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { RAIZ } = require("./util");
const version = require("../tools/version");

const leer = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");
const sw = leer("sw.js");
const cacheados = version.archivosCacheados(sw);
const html = leer("index.html");

function archivosDe(dir) {
  return fs.readdirSync(path.join(RAIZ, dir)).map((f) => dir + "/" + f);
}
const RUNTIME = ["index.html", "manifest.json", "config.js", ...archivosDe("css"), ...archivosDe("js"),
  ...archivosDe("data"), ...archivosDe("icons")];

test("todo lo que usa la app está en la caché del service worker", () => {
  for (const f of RUNTIME) assert.ok(cacheados.includes(f), "falta en sw.js: " + f);
  for (const f of cacheados) assert.ok(fs.existsSync(path.join(RAIZ, f)), "no existe: " + f);
  const referencias = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  for (const r of referencias) assert.ok(cacheados.includes(r), "index.html usa algo que no está en caché: " + r);
  const manifiesto = JSON.parse(leer("manifest.json"));
  for (const i of manifiesto.icons) assert.ok(cacheados.includes(i.src), i.src);
});

test("sw.js tiene la versión al día (correr node tools/version.js)", () => {
  assert.match(sw, new RegExp('const VERSION = "' + version.calcular(sw) + '";'));
});

test("ninguna petición de red externa en tiempo de ejecución", () => {
  for (const f of RUNTIME.filter((x) => !x.endsWith(".png"))) {
    const t = leer(f);
    assert.ok(!/https?:\/\//.test(t), f + " tiene una URL externa");
    assert.ok(!/@import|url\(\s*["']?(https?:)?\/\//.test(t), f + " carga algo externo");
    if (f.endsWith(".js")) {
      assert.ok(!/\bfetch\(|XMLHttpRequest|import\s*\(|^\s*import\s/m.test(t), f + " hace peticiones o usa módulos");
    }
  }
  assert.ok(!/type="module"/.test(html), "los scripts deben ser clásicos");
});

test("manifest.json según SPEC.md §11", () => {
  const m = JSON.parse(leer("manifest.json"));
  assert.equal(m.name, "Germen Graphidis");
  assert.equal(m.short_name, "Germen");
  assert.equal(m.display, "standalone");
  assert.equal(m.orientation, "portrait");
  const tam = m.icons.map((i) => i.sizes);
  assert.ok(tam.includes("192x192") && tam.includes("512x512"));
  for (const i of m.icons) {
    const png = fs.readFileSync(path.join(RAIZ, i.src));
    const ancho = png.readUInt32BE(16), alto = png.readUInt32BE(20);
    assert.equal(ancho + "x" + alto, i.sizes, i.src);
  }
});
