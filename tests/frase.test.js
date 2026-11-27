// Construcción de la frase y concordancia (SPEC.md §8).
const test = require("node:test");
const assert = require("node:assert/strict");
const { cargarDatos, cargar } = require("./util");

cargarDatos();
const S = cargar("js/frase.js");
const F = S.frase;
const el = (id) => S.elementos.find((e) => e.id === id);
const est = (id) => S.estados.find((e) => e.id === id);
const lucir = { intencion: "lucir", soporte: "lienzo" };

test("ejemplo 1 de SPEC.md §8", () => {
  assert.equal(F.construir({ modo: lucir, terminos: {
    elemento: "lampara-de-aceite", secundario: "murcielago", relacion: "con", estilo: "neotradicional",
    color: "vivos", sombreado: "achurado", concepto1: "melancolia" } }),
  "Una lámpara de aceite con un murciélago, en neotradicional; colores muy vivos y sombreado en achurado. Que transmita melancolía.");
});

test("ejemplo 2 de SPEC.md §8", () => {
  assert.equal(F.construir({ modo: { intencion: "lucir", soporte: "piel" }, terminos: {
    elemento: "yelmo-de-cimera", estado: { id: "cubierto-de-musgo", en: "A" }, secundario: "colibri",
    relacion: "brotando-de", estilo: "neotradicional", formato: "carta-de-tarot", color: "vivos",
    sombreado: "achurado", foco: "luz-luz-desde-abajo", concepto1: "melancolia", concepto2: "paciencia",
    universo: { id: "movimientos-artisticos", sub: "art-nouveau" }, zona: "antebrazo-interno" } }),
  "Un yelmo de cimera cubierto de musgo con un colibrí brotando de él, en neotradicional dentro de una carta de tarot; colores muy vivos y sombreado en achurado. Foco: luz desde abajo. Que transmita melancolía y paciencia. Inspirado en el art nouveau. Zona: antebrazo interno (vertical alargado).");
});

test("ejemplo 3 de SPEC.md §8", () => {
  assert.equal(F.construir({ modo: lucir, terminos: {
    elemento: "craneo", secundario: "polilla", relacion: "formado-por", estilo: "blackwork",
    sombreado: "puntillismo" } }),
  "Un cráneo formado por polillas, en blackwork; sombreado en puntillismo.");
});

test("ejemplo 4 de SPEC.md §8 (con «hacha de guerra», que es el elemento real)", () => {
  assert.equal(F.construir({ modo: { intencion: "reto", soporte: "lienzo" }, terminos: {
    elemento: "manos-rezando", secundario: "hacha-de-guerra", relacion: "con", estado: { id: "oxidado", en: "B" },
    estilo: "tradicional", linea: "gruesa", foco: "escorzo-brazo-o-pata-extendida-hacia-el",
    concepto1: "astucia" } }),
  "Unas manos rezando con un hacha de guerra oxidada, en tradicional; línea gruesa. Reto nivel 2, escorzo: brazo o pata extendida hacia el espectador. Que transmita astucia.");
});

test("ejemplo 5 de SPEC.md §8", () => {
  assert.equal(F.construir({ modo: lucir, terminos: {
    concepto1: "desesperacion", concepto2: "voluntad", estilo: "ilustrativo", color: "apagados",
    universo: { id: "deportes" } } }),
  "Desesperación y voluntad, en ilustrativo; colores apagados. Universo: deportes.");
});

test("artículos forzados, a tónica y plurales de por sí", () => {
  assert.equal(F.sintagma(el("hacha-doble"), est("oxidado")), "un hacha doble oxidada");
  assert.equal(F.sintagma(el("aguila"), est("dorado")), "un águila dorada");
  assert.equal(F.sintagma(el("ancla"), null), "un ancla");
  assert.equal(F.sintagma(el("anima-en-pena"), est("encadenado")), "un ánima en pena encadenada");
  assert.equal(F.sintagma(el("grilletes"), est("oxidado")), "unos grilletes oxidados");
  assert.equal(F.sintagma(el("tijeras"), est("roto")), "unas tijeras rotas");
  assert.equal(F.sintagma(el("cerdo-y-gallo"), est("dorado")), "un cerdo y un gallo dorados");
  assert.equal(F.sintagma(el("radio-de-valvulas"), est("roto")), "una radio de válvulas rota");
});

test("concordancia de cada elemento con cada estado aplicable", () => {
  for (const e of S.elementos) {
    for (const s of S.estados) {
      if (s.excluir.familias.includes(e.familia) || s.excluir.ids.includes(e.id)) continue;
      const sin = F.sintagma(e, s);
      const k = F.clave(e);
      const esperado = s.formas[k];
      assert.ok(sin.endsWith(" " + esperado), e.id + " + " + s.id + ": " + sin);
      const art = F.articulo(e);
      if (art) assert.ok(sin.startsWith(art + " "), e.id);
      // a tónica: artículo "un" con adjetivo femenino
      if (e.articulo === "un" && e.genero === "f") assert.equal(esperado, s.formas.f);
      assert.ok(!/ {2}/.test(sin) && !/undefined/.test(sin), sin);
    }
  }
});

test("plantillas de relación: o, pron y plural", () => {
  const rel = (id) => S.relaciones.find((r) => r.id === id).plantilla;
  assert.equal(F.aplicarPlantilla(rel("atravesado-por"), el("tortuga"), el("flecha")),
    "una tortuga atravesada por una flecha");
  assert.equal(F.aplicarPlantilla(rel("enroscado-en"), el("craneo"), el("serpiente")),
    "una serpiente enroscada en un cráneo");
  assert.equal(F.aplicarPlantilla(rel("saliendo-de"), el("costillas"), el("rosa")),
    "unas costillas con una rosa saliendo de ellas");
  assert.equal(F.aplicarPlantilla(rel("formado-por"), el("corazon-clasico"), el("polilla-luna"), null, est("dorado")),
    "un corazón clásico formado por polillas luna doradas");
  assert.equal(F.aplicarPlantilla(rel("formado-por"), el("craneo"), el("cerdo-y-gallo")),
    "un cráneo formado por cerdos y gallos");
});

test("sin elemento, el reto con figura pide una figura humana o animal", () => {
  const frase = F.construir({ modo: { intencion: "reto" }, terminos: {
    concepto1: "ira", estilo: "blackwork", color: "solo-negro", foco: "pose-torsion-del-torso" } });
  assert.equal(frase, "Ira, en blackwork; solo negro. Reto nivel 2, pose: torsión del torso, aplicado a una figura humana o animal.");
});

test("sin elemento y con par en tensión", () => {
  const frase = F.construir({ modo: lucir, terminos: { par: "noche-dia", estilo: "ornamental", linea: "fina" } });
  assert.equal(frase, "Tensión entre noche y día, en ornamental; en línea fina.");
});
