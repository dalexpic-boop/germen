// Integridad de data/*.js (SPEC.md §4).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { RAIZ, cargarDatos } = require("./util");

const S = cargarDatos();

const LISTAS = {
  estilo: S.estilos,
  color: S.color,
  sombreado: S.sombreado,
  linea: S.linea,
  elemento: S.elementos,
  estado: S.estados,
  relacion: S.relaciones,
  formato: S.formatos,
  concepto: S.conceptos,
  par: S.pares,
  universo: S.universos,
  foco: S.foco,
  zona: S.zonas,
};

function textoLimpio(t) {
  return typeof t === "string" && t.length > 0 && t === t.trim() && !/ {2}/.test(t) && !/[{}]/.test(t);
}

test("todas las listas cargan y no están vacías", () => {
  for (const [eje, lista] of Object.entries(LISTAS)) {
    assert.ok(Array.isArray(lista) && lista.length > 0, eje);
  }
});

test("ids únicos dentro de cada lista y campos comunes válidos", () => {
  for (const [eje, lista] of Object.entries(LISTAS)) {
    const vistos = new Set();
    for (const t of lista) {
      assert.match(t.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, eje + ": id " + t.id);
      assert.ok(!vistos.has(t.id), eje + ": id repetido " + t.id);
      vistos.add(t.id);
      assert.ok(textoLimpio(t.texto), eje + ": texto de " + t.id);
      if (t.frase !== undefined) assert.ok(textoLimpio(t.frase), eje + ": frase de " + t.id);
      assert.ok(typeof t.familia === "string" && t.familia, eje + ": familia de " + t.id);
      if (t.peso !== undefined) assert.ok(t.peso > 0, eje + ": peso de " + t.id);
    }
  }
});

test("estilos: probElementos válido", () => {
  for (const e of S.estilos) assert.ok(["alta", "media", "baja"].includes(e.probElementos), e.id);
});

test("elementos: campos gramaticales completos y familias conocidas", () => {
  const familias = new Set(S.familiasElementos.map((f) => f.id));
  for (const e of S.elementos) {
    assert.ok(familias.has(e.familia), e.id);
    assert.ok(e.genero === "m" || e.genero === "f", e.id);
    assert.ok(e.numero === "s" || e.numero === "p", e.id);
    assert.ok(textoLimpio(e.plural), e.id);
    assert.equal(typeof e.animado, "boolean", e.id);
    if (e.articulo !== undefined) assert.ok(["", "un", "una", "unos", "unas"].includes(e.articulo), e.id);
    if (e.numero === "p" && e.articulo !== "") assert.equal(e.plural, e.texto, e.id);
  }
});

test("elementos: casos gramaticales de LISTAS.md", () => {
  const el = (t) => S.elementos.find((e) => e.texto === t);
  for (const t of ["hacha de guerra", "hacha doble", "águila", "águila bicéfala", "ancla", "arpa", "ánima en pena"]) {
    assert.equal(el(t).genero, "f", t);
    assert.equal(el(t).articulo, "un", t);
  }
  for (const t of ["dados", "grilletes", "engranajes", "canicas", "cartas de póker", "manos rezando", "costillas",
    "pulmones", "runas", "máscaras de comedia y tragedia"]) {
    assert.equal(el(t).numero, "p", t);
  }
  assert.equal(el("cerdo y gallo").frase, "un cerdo y un gallo");
  assert.equal(el("pluma y tintero").frase, "una pluma y un tintero");
  const generos = { "bola 8": "f", "cota de malla": "f", "rosa de los vientos": "f", "ojo de buey": "m",
    "as de espadas": "m", "mascarón de proa": "m", kris: "m", ouroboros: "m", wyvern: "m", kitsune: "m",
    kappa: "m", baku: "m", kirin: "m", golem: "m" };
  for (const [t, g] of Object.entries(generos)) assert.equal(el(t).genero, g, t);
  assert.equal(el("telaraña").animado, false);
  assert.equal(el("coral").animado, false);
  for (const t of ["esqueleto", "fantasma", "ánima en pena", "catrina", "ángel guardián", "querubín", "cordero",
    "autómata", "robot de hojalata", "lobo", "colibrí"]) {
    assert.equal(el(t).animado, true, t);
  }
});

test("elementos: decisiones de Den en REVISION.md", () => {
  const el = (t) => S.elementos.find((e) => e.texto === t);
  const generos = { "radio de válvulas": "f", trapecista: "m", alquimista: "m", tragamonedas: "f" };
  for (const [t, g] of Object.entries(generos)) assert.equal(el(t).genero, g, t);
  for (const t of ["cerdo y gallo", "caballo con gualdrapa", "león rampante", "águila bicéfala",
    "homúnculo en frasco", "mandrágora", "muñeco vudú", "marioneta", "muñeca de porcelana", "soldadito de plomo",
    "ángel funerario", "luna con rostro", "sol con rostro"]) {
    assert.equal(el(t).animado, true, t);
  }
});

test("familias animadas de elementos según LISTAS.md", () => {
  const animadas = S.familiasElementos.filter((f) => f.animada).map((f) => f.id).sort();
  assert.deepEqual(animadas, ["aves", "bestiario-y-mitologia", "criaturas-marinas", "fauna-terrestre",
    "insectos-y-aracnidos", "personajes-y-oficios"]);
});

test("estados: cuatro formas y exclusiones que apuntan a datos reales", () => {
  const familias = new Set(S.familiasElementos.map((f) => f.id));
  const ids = new Set(S.elementos.map((e) => e.id));
  for (const e of S.estados) {
    for (const k of ["m", "f", "mp", "fp"]) assert.ok(textoLimpio(e.formas[k]), e.id + "." + k);
    for (const f of e.excluir.familias) assert.ok(familias.has(f), e.id + ": familia " + f);
    for (const i of e.excluir.ids) assert.ok(ids.has(i), e.id + ": id " + i);
  }
  const est = (id) => S.estados.find((e) => e.id === id);
  assert.deepEqual(est("cubierto-de-musgo").formas,
    { m: "cubierto de musgo", f: "cubierta de musgo", mp: "cubiertos de musgo", fp: "cubiertas de musgo" });
  assert.deepEqual(est("sangrante").formas, { m: "sangrante", f: "sangrante", mp: "sangrantes", fp: "sangrantes" });
  assert.equal(est("en-llamas").formas.fp, "en llamas");
  assert.equal(est("alado").excluir.familias.length, 2);
  assert.equal(est("con-ojos").excluir.ids.length, 5);
});

test("relaciones: plantillas con marcadores conocidos y requisitos válidos", () => {
  const familias = new Set(S.familiasElementos.map((f) => f.id));
  for (const r of S.relaciones) {
    const marcas = r.plantilla.match(/\{[^}]*\}/g) || [];
    for (const m of marcas) assert.match(m, /^\{(A|B|o:A|o:B|pron:A|pron:B|B:plural)\}$/, r.id + ": " + m);
    assert.ok(r.plantilla.includes("{A}") && /\{B(:plural)?\}/.test(r.plantilla), r.id);
    if (r.requiere) {
      if (r.requiere.A) assert.equal(r.requiere.A, "animado", r.id);
      if (r.requiere.B) for (const f of r.requiere.B.familias) assert.ok(familias.has(f), r.id + ": " + f);
    }
  }
  assert.ok(S.relaciones.find((r) => r.id === "con"), "existe la relación de respaldo 'con'");
});

test("foco: variables conocidas, niveles completos en reto", () => {
  const variables = new Map(S.variablesFoco.map((v) => [v.id, v]));
  for (const f of S.foco) {
    assert.ok(variables.has(f.variable), f.id);
    assert.ok(f.modo === "lucir" || f.modo === "reto", f.id);
    if (f.modo === "reto") assert.ok([1, 2, 3].includes(f.nivel), f.id);
    if (f.soporte !== undefined) assert.equal(f.soporte, "piel", f.id);
  }
  for (const v of ["perspectiva", "escorzo", "pose", "composicion"]) {
    for (const n of [1, 2, 3]) {
      assert.ok(S.foco.some((f) => f.variable === v && f.nivel === n), v + " nivel " + n);
    }
  }
  assert.ok(S.foco.filter((f) => f.variable === "pose").every((f) => f.figura), "pose: todas con figura");
  assert.ok(S.foco.filter((f) => f.tambienLucir).every((f) => f.variable === "composicion" && f.nivel <= 2));
});

test("universos: subniveles con frase de plantilla", () => {
  for (const u of S.universos) {
    if (!u.sub) continue;
    assert.ok(u.fraseSub.includes("{sub}"), u.id);
    const vistos = new Set();
    for (const s of u.sub) {
      assert.ok(!vistos.has(s.id), u.id + ": sub repetido " + s.id);
      vistos.add(s.id);
      assert.ok(textoLimpio(s.texto), u.id + ": " + s.id);
    }
  }
  const conSub = S.universos.filter((u) => u.sub).map((u) => u.id).sort();
  assert.deepEqual(conSub, ["esteticas-culturales", "movimientos-artisticos", "tarot", "zodiaco"]);
  assert.equal(S.universos.find((u) => u.id === "tarot").sub.length, 22);
});

test("conceptos: familias y etiquetas", () => {
  const familias = new Set(S.familiasConceptos.map((f) => f.id));
  for (const c of S.conceptos) assert.ok(familias.has(c.familia), c.id);
  for (const f of familias) assert.ok(S.conceptos.some((c) => c.familia === f), f);
  assert.equal(S.conceptos.filter((c) => c.tags && c.tags.includes("pecado")).length, 7);
  assert.equal(S.conceptos.filter((c) => c.tags && c.tags.includes("virtud")).length, 7);
});

test("pares y zonas tienen sus campos", () => {
  for (const p of S.pares) assert.ok(textoLimpio(p.a) && textoLimpio(p.b), p.id);
  for (const z of S.zonas) assert.ok(textoLimpio(z.forma), z.id);
});

test("reglas: selectores que apuntan a términos existentes", () => {
  const lista = (eje) => (eje === "elemento" ? S.elementos : LISTAS[eje]);
  for (const r of S.reglas) {
    assert.ok(r.alcance === "siempre" || r.alcance === "lucir", r.id);
    for (const lado of ["a", "b"]) {
      const sel = r[lado];
      const terms = lista(sel.eje);
      assert.ok(terms, r.id + ": eje " + sel.eje);
      for (const id of [...(sel.ids || []), ...(sel.excepto || [])]) {
        const t = terms.find((x) => x.id === id);
        assert.ok(t, r.id + ": " + sel.eje + "/" + id);
        for (const s of sel.sub || []) assert.ok(t.sub.some((x) => x.id === s), r.id + ": sub " + s);
      }
      assert.ok(sel.ids || sel.excepto, r.id + ": selector vacío");
    }
  }
});

test("tamaño total por debajo de 300 KB (sin íconos)", () => {
  let total = 0;
  for (const dir of ["data", "js", "css"]) {
    const d = path.join(RAIZ, dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) total += fs.statSync(path.join(d, f)).size;
  }
  for (const f of ["index.html", "config.js", "sw.js", "manifest.json"]) {
    const p = path.join(RAIZ, f);
    if (fs.existsSync(p)) total += fs.statSync(p).size;
  }
  assert.ok(total < 300 * 1024, total + " bytes");
});
