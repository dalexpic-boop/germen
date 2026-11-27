// Generador (SPEC.md §7 y §14). El validador de abajo es independiente del
// código del generador: revisa reglas, familias y requisitos desde los datos.
const test = require("node:test");
const assert = require("node:assert/strict");
const { cargarDatos, cargar, mulberry32 } = require("./util");

cargarDatos();
const S = cargar("js/frase.js", "js/generador.js");
const G = S.generador;

const N = +process.env.GERMEN_N || 10000;

const listas = {
  estilo: S.estilos, color: S.color, sombreado: S.sombreado, linea: S.linea, foco: S.foco,
  elemento: S.elementos, secundario: S.elementos, relacion: S.relaciones, estado: S.estados,
  concepto1: S.conceptos, concepto2: S.conceptos, par: S.pares, universo: S.universos,
  formato: S.formatos, zona: S.zonas,
};
const termino = (eje, x) => {
  const id = typeof x === "string" ? x : x.id;
  return listas[eje].find((t) => t.id === id);
};

function coincide(sel, eje, x) {
  if (sel.eje === "elemento" ? !(eje === "elemento" || eje === "secundario") : sel.eje !== eje) return false;
  const id = typeof x === "string" ? x : x.id;
  if (sel.ids && !sel.ids.includes(id)) return false;
  if (sel.excepto && sel.excepto.includes(id)) return false;
  if (sel.sub && !(x.sub && sel.sub.includes(x.sub))) return false;
  return true;
}

// Devuelve la lista de violaciones de una semilla.
function violaciones(s, bloqueados = new Set()) {
  const v = [];
  const t = s.terminos, m = s.modo;
  const ejes = Object.keys(t);
  for (const r of S.reglas) {
    if (r.alcance === "lucir" && m.intencion !== "lucir") continue;
    for (const ea of ejes) for (const eb of ejes) {
      if (ea === eb) continue;
      if (coincide(r.a, ea, t[ea]) && coincide(r.b, eb, t[eb]) && !(bloqueados.has(ea) && bloqueados.has(eb)))
        v.push(r.id + " " + ea + "×" + eb);
    }
  }
  if (!t.estilo) v.push("sin estilo");
  if (t.concepto1 && t.concepto2 && termino("concepto1", t.concepto1).familia === termino("concepto2", t.concepto2).familia)
    v.push("conceptos de la misma familia");
  if (t.secundario && !t.elemento) v.push("secundario sin principal");
  if (t.secundario && t.secundario === t.elemento) v.push("secundario igual al principal");
  if (t.secundario && !t.relacion) v.push("secundario sin relación");
  if (t.relacion && !t.secundario) v.push("relación sin secundario");
  if (t.relacion) {
    const r = termino("relacion", t.relacion), A = termino("elemento", t.elemento), B = termino("elemento", t.secundario);
    if (r.requiere && r.requiere.A === "animado" && !A.animado) v.push("relación exige A animado: " + r.id);
    if (r.requiere && r.requiere.B && !r.requiere.B.familias.includes(B.familia)) v.push("relación exige familia de B: " + r.id);
  }
  if (t.estado) {
    const e = termino("estado", t.estado);
    const el = termino("elemento", t.estado.en === "B" ? t.secundario : t.elemento);
    if (!el) v.push("estado sin elemento");
    else if (e.excluir.familias.includes(el.familia) || e.excluir.ids.includes(el.id)) v.push("estado excluido: " + e.id + " en " + el.id);
  }
  if (t.foco) {
    const f = termino("foco", t.foco);
    if (m.intencion === "reto") {
      if (f.modo !== "reto") v.push("foco de lucir en reto");
      if (f.nivel > m.nivel) v.push("foco de nivel mayor al pedido");
      if (f.figura && t.elemento && !termino("elemento", t.elemento).animado) v.push("figura con elemento no animado");
    } else if (f.modo !== "lucir" && !f.tambienLucir) v.push("foco de reto en lucir");
    if (f.soporte === "piel" && m.soporte !== "piel") v.push("foco solo de piel en lienzo");
  }
  if (m.soporte === "piel" && !t.zona) v.push("piel sin zona");
  if (m.soporte !== "piel" && t.zona) v.push("zona en lienzo");
  if (m.elementos === "nunca" && t.elemento && !bloqueados.has("elemento")) v.push("elemento con modo nunca");
  if (m.elementos === "siempre" && !t.elemento) v.push("sin elemento con modo siempre");
  if (m.intencion === "reto" && !t.foco) v.push("reto sin foco");
  if (!t.concepto1 && !t.par) v.push("sin concepto ni par");
  const trats = ["color", "sombreado", "linea"].filter((e) => t[e]).length;
  const [lo, hi] = S.config.densidad[m.densidad].tratamiento;
  if (trats < lo || trats > hi) v.push("tratamientos fuera de rango: " + trats);
  return v;
}

function revisarFrase(frase) {
  const v = [];
  if (/undefined|null|NaN/.test(frase)) v.push("valor vacío");
  if (/[{}]/.test(frase)) v.push("llave suelta");
  if (/ {2}/.test(frase)) v.push("doble espacio");
  if (!/^[A-ZÁÉÍÓÚÑ¿]/.test(frase)) v.push("sin mayúscula inicial");
  if (/ [,.;:]|[,;:]\.|\.\.|,,|; ?;/.test(frase)) v.push("signo suelto");
  if (!/\.$/.test(frase)) v.push("sin punto final");
  return v;
}

const COMBINACIONES = [];
for (const soporte of ["lienzo", "piel"])
  for (const [intencion, nivel] of [["lucir", 1], ["reto", 1], ["reto", 2], ["reto", 3]])
    for (const densidad of ["escueta", "completa"])
      for (const elementos of ["auto", "siempre", "nunca"])
        COMBINACIONES.push({ soporte, intencion, nivel, densidad, elementos });

test(N + " semillas por combinación de modos, sin errores de frase ni de reglas", () => {
  let semilla = 1;
  for (const modo of COMBINACIONES) {
    const rng = mulberry32(semilla++);
    const recientes = [];
    const errores = new Map();
    for (let i = 0; i < N; i++) {
      const s = G.generar(null, [], Object.assign({ recientes, ahora: 0 }, modo), rng);
      recientes.push(s);
      if (recientes.length > 15) recientes.shift();
      const frase = S.frase.construir(s);
      for (const e of [...violaciones(s), ...revisarFrase(frase)]) {
        if (!errores.has(e)) errores.set(e, frase);
      }
    }
    assert.deepEqual([...errores.entries()], [], JSON.stringify(modo));
  }
});

test("los términos bloqueados se conservan al relanzar", () => {
  const rng = mulberry32(99);
  for (const modo of COMBINACIONES) {
    for (let i = 0; i < 300; i++) {
      const s = G.generar(null, [], modo, rng);
      const ejes = Object.keys(s.terminos);
      const bloq = new Set(ejes.filter(() => rng() < 0.4));
      const r = G.generar(s, [...bloq], modo, rng);
      for (const e of bloq) assert.deepEqual(r.terminos[e], s.terminos[e], e);
      assert.deepEqual(violaciones(r, bloq).filter((x) => !/^(elemento con modo|tratamientos)/.test(x)), [],
        JSON.stringify({ modo, bloq: [...bloq], t: r.terminos }));
      assert.deepEqual(revisarFrase(S.frase.construir(r)), []);
    }
  }
});

test("tocar un chip cambia ese eje y conserva el resto si es compatible", () => {
  const rng = mulberry32(7);
  let cambios = 0, total = 0;
  for (const modo of COMBINACIONES) {
    for (let i = 0; i < 100; i++) {
      const s = G.generar(null, [], modo, rng);
      const ejes = Object.keys(s.terminos);
      const eje = ejes[Math.floor(rng() * ejes.length)];
      const otrosBloq = ejes.filter((e) => e !== eje && rng() < 0.3);
      const r = G.relanzarEje(s, eje, otrosBloq, modo, rng);
      assert.deepEqual(Object.keys(r.terminos).sort(), ejes.sort(), "mismos ejes presentes");
      for (const e of otrosBloq) assert.deepEqual(r.terminos[e], s.terminos[e]);
      assert.deepEqual(violaciones(r, new Set(otrosBloq)), []);
      total++;
      if (JSON.stringify(r.terminos[eje]) !== JSON.stringify(s.terminos[eje])) cambios++;
      // Los ejes no tocados cambian solo si chocaban con el nuevo valor: deben ser pocos.
    }
  }
  assert.ok(cambios / total > 0.9, "el eje tocado casi siempre cambia: " + cambios + "/" + total);
});

test("figura en reto: el elemento principal es animado", () => {
  const rng = mulberry32(3);
  let figuras = 0;
  for (let i = 0; i < 5000; i++) {
    const s = G.generar(null, [], { intencion: "reto", nivel: 3, elementos: "siempre" }, rng);
    const f = termino("foco", s.terminos.foco);
    if (f.figura) { figuras++; assert.ok(termino("elemento", s.terminos.elemento).animado, s.terminos.elemento); }
  }
  assert.ok(figuras > 500);
});

test("elemento secundario: cerca de 2/3 de familia distinta", () => {
  const rng = mulberry32(5);
  let distinta = 0, total = 0;
  for (let i = 0; i < 20000; i++) {
    const s = G.generar(null, [], { densidad: "completa", elementos: "siempre" }, rng);
    if (!s.terminos.secundario) continue;
    total++;
    if (termino("elemento", s.terminos.elemento).familia !== termino("elemento", s.terminos.secundario).familia) distinta++;
  }
  const p = distinta / total;
  assert.ok(p > 0.6 && p < 0.72, "proporción " + p);
});

test("los recientes se vuelven menos probables", () => {
  const rng = mulberry32(11);
  const previa = G.generar(null, [], {}, rng);
  let repetido = 0, sinPenal = 0;
  for (let i = 0; i < 20000; i++) {
    if (G.generar(null, [], { recientes: [previa] }, rng).terminos.estilo === previa.terminos.estilo) repetido++;
    if (G.generar(null, [], { recientes: [] }, rng).terminos.estilo === previa.terminos.estilo) sinPenal++;
  }
  assert.ok(repetido < sinPenal * 0.5, repetido + " vs " + sinPenal);
});

test("probabilidad de elementos en Auto según el estilo", () => {
  const rng = mulberry32(13);
  const cuenta = { alta: [0, 0], media: [0, 0], baja: [0, 0] };
  for (let i = 0; i < 30000; i++) {
    const s = G.generar(null, [], {}, rng);
    const p = termino("estilo", s.terminos.estilo).probElementos;
    cuenta[p][1]++;
    if (s.terminos.elemento) cuenta[p][0]++;
  }
  const esperado = { alta: 0.9, media: 0.6, baja: 0.3 };
  for (const k of Object.keys(cuenta)) {
    const p = cuenta[k][0] / cuenta[k][1];
    assert.ok(Math.abs(p - esperado[k]) < 0.04, k + ": " + p);
  }
});

test("generar es rápido (menos de 1 ms de media en el portátil)", () => {
  const rng = mulberry32(17);
  const recientes = [];
  const t0 = process.hrtime.bigint();
  const n = 2000;
  for (let i = 0; i < n; i++) {
    const s = G.generar(null, [], { densidad: "completa", soporte: "piel", recientes }, rng);
    S.frase.construir(s);
    recientes.push(s);
    if (recientes.length > 15) recientes.shift();
  }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6 / n;
  assert.ok(ms < 1, ms.toFixed(3) + " ms");
});
