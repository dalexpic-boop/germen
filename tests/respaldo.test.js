// Respaldo: exportar e importar (SPEC.md §10 y §14).
const test = require("node:test");
const assert = require("node:assert/strict");
const { cargarDatos, cargar, mulberry32 } = require("./util");

cargarDatos();
const S = cargar("js/frase.js", "js/generador.js", "js/respaldo.js");
const R = S.respaldo;

function historialDePrueba(n, semilla) {
  const rng = mulberry32(semilla);
  const h = [];
  for (let i = 0; i < n; i++) {
    const s = S.generador.generar(null, [], { densidad: i % 2 ? "completa" : "escueta", ahora: 1.7e12 + i * 6e4 }, rng);
    h.unshift({ id: s.id, fecha: s.fecha, modo: s.modo, terminos: s.terminos, frase: S.frase.construir(s),
      estado: i % 3 ? "guardada" : "dibujada", nota: i % 4 ? "" : "nota " + i });
  }
  return h;
}

test("exportar seguido de importar devuelve el mismo historial", () => {
  const h = historialDePrueba(40, 1);
  const texto = JSON.stringify(R.crear(h, { tema: "oscuro" }, 1.7e12));
  const leido = R.leer(texto);
  assert.deepEqual(leido.historial, h);
  assert.deepEqual(leido.ajustes, { tema: "oscuro" });
  const { historial, agregadas } = R.fusionar([], leido.historial);
  assert.deepEqual(historial, h);
  assert.equal(agregadas, 40);
});

test("importar sobre el mismo historial no duplica", () => {
  const h = historialDePrueba(25, 2);
  const r = R.fusionar(h, R.leer(JSON.stringify(R.crear(h, {}, 0))).historial);
  assert.equal(r.historial.length, 25);
  assert.equal(r.agregadas, 0);
  assert.deepEqual(r.historial, h);
});

test("fusionar suma lo nuevo y conserva la versión más reciente de cada semilla", () => {
  const a = historialDePrueba(10, 3);
  const b = historialDePrueba(10, 4);
  const editada = Object.assign({}, a[0], { estado: "dibujada", nota: "hecha", actualizada: "2099-01-01T00:00:00.000Z" });
  const r = R.fusionar(a, [editada, ...b]);
  assert.equal(r.historial.length, 20);
  assert.equal(r.agregadas, 10);
  assert.equal(r.actualizadas, 1);
  assert.equal(r.historial.find((e) => e.id === a[0].id).nota, "hecha");
  for (let i = 1; i < r.historial.length; i++) {
    assert.ok(Date.parse(r.historial[i - 1].fecha) >= Date.parse(r.historial[i].fecha), "orden por fecha");
  }
});

test("un respaldo dañado o ajeno se rechaza con un mensaje claro", () => {
  assert.throws(() => R.leer("{no es json"), /no es un respaldo válido/);
  assert.throws(() => R.leer(JSON.stringify({ historial: [] })), /no es un respaldo de Germen/);
  assert.throws(() => R.leer(JSON.stringify({ formato: "germen-respaldo", version: 99, historial: [] })), /más nueva/);
});

test("las entradas inválidas se ignoran al fusionar", () => {
  const r = R.fusionar([], [null, {}, { id: "x" }, { id: "y", terminos: {}, fecha: "2026-01-01T00:00:00Z" }]);
  assert.deepEqual(r.historial.map((e) => e.id), ["y"]);
});

test("nombre del archivo de respaldo", () => {
  assert.equal(R.nombreArchivo(new Date(2026, 10, 26, 15, 0)), "germen-respaldo-2026-11-26.json");
  assert.equal(R.nombreArchivo(new Date(2027, 0, 5)), "germen-respaldo-2027-01-05.json");
});
