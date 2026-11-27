const test = require("node:test");
const assert = require("node:assert/strict");
const { cargar, mulberry32 } = require("./util");

test("config.js carga con el patrón de envoltura", () => {
  const S = cargar("config.js");
  assert.equal(S.config.ventanaRecientes, 15);
  assert.equal(S.config.probElementos.alta, 0.9);
});

test("mulberry32 es determinista y está en [0, 1)", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 1000; i++) {
    const x = a();
    assert.equal(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});
