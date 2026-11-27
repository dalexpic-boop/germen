// Selección de términos y reglas (SPEC.md §7). Puro: sin DOM, con rng inyectable.
//
// Una semilla es { id, fecha, modo, terminos }. terminos guarda ids por eje;
// universo es { id, sub? } y estado es { id, en: "A" | "B" }.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  const S = root.SEMILLA;

  // Orden de sorteo. El foco va antes del elemento para que una variante con
  // figura pueda exigir un elemento animado.
  const EJES = ["estilo", "color", "sombreado", "linea", "foco", "elemento", "secundario", "relacion", "estado",
    "concepto1", "concepto2", "par", "universo", "formato", "zona"];
  const TRATAMIENTO = ["color", "sombreado", "linea"];

  const AJUSTES = { soporte: "lienzo", intencion: "lucir", nivel: 1, densidad: "escueta", elementos: "auto" };

  function cfg() { return S.config; }

  function listaDe(eje) {
    switch (eje) {
      case "estilo": return S.estilos;
      case "color": return S.color;
      case "sombreado": return S.sombreado;
      case "linea": return S.linea;
      case "foco": return S.foco;
      case "elemento": case "secundario": return S.elementos;
      case "relacion": return S.relaciones;
      case "estado": return S.estados;
      case "concepto1": case "concepto2": return S.conceptos;
      case "par": return S.pares;
      case "universo": return S.universos;
      case "formato": return S.formatos;
      case "zona": return S.zonas;
    }
    throw new Error("Eje desconocido: " + eje);
  }

  const indices = new Map();
  function porId(eje, id) {
    const lista = listaDe(eje);
    let m = indices.get(lista);
    if (!m) { m = new Map(lista.map((t) => [t.id, t])); indices.set(lista, m); }
    return m.get(id) || null;
  }

  // ---------- Valores ----------
  // En el sorteo, un valor es { t: término, sub?, en? }.
  function idDe(v) { return v.t.id; }
  function aTermino(eje, v) {
    if (eje === "universo") return v.sub ? { id: v.t.id, sub: v.sub.id } : { id: v.t.id };
    if (eje === "estado") return { id: v.t.id, en: v.en };
    return v.t.id;
  }
  function deTermino(eje, x) {
    if (x == null) return null;
    if (eje === "universo") {
      const t = porId(eje, x.id);
      if (!t) return null;
      const sub = t.sub && x.sub ? t.sub.find((s) => s.id === x.sub) || null : null;
      return { t, sub };
    }
    if (eje === "estado") {
      const t = porId(eje, x.id);
      return t ? { t, en: x.en === "B" ? "B" : "A" } : null;
    }
    const t = porId(eje, x);
    return t ? { t } : null;
  }

  // ---------- Recientes ----------
  function grupo(eje) {
    if (eje === "secundario") return "elemento";
    if (eje === "concepto2") return "concepto1";
    return eje;
  }
  function claves(semilla) {
    const out = [];
    if (!semilla || !semilla.terminos) return out;
    for (const eje of EJES) {
      const x = semilla.terminos[eje];
      if (x == null) continue;
      out.push(grupo(eje) + ":" + (typeof x === "string" ? x : x.id));
    }
    return out;
  }

  // ---------- Selección ponderada ----------
  function peso(t, rec, factor) {
    const p = t.peso == null ? 1 : t.peso;
    return rec && rec.has(t.id) ? p * factor : p;
  }
  // Pesos acumulados una sola vez por pozo; cada toma es una búsqueda binaria.
  // Sin recientes en el grupo, los pesos base de un pozo fijo se reutilizan.
  const cacheBase = new WeakMap();
  function preparar(eje, pool, ctx) {
    const rec = ctx.recientes[grupo(eje)];
    const conRec = rec && rec.size > 0;
    if (!conRec) {
      const c = cacheBase.get(pool);
      if (c) return c;
    }
    const factor = cfg().factorRecientes;
    const acum = new Array(pool.length);
    let total = 0;
    for (let i = 0; i < pool.length; i++) { total += peso(pool[i], conRec ? rec : null, factor); acum[i] = total; }
    const prep = { pool, acum, total };
    if (!conRec) cacheBase.set(pool, prep);
    return prep;
  }
  function tomar(prep, rng) {
    if (!prep.pool.length || prep.total <= 0) return null;
    const x = rng() * prep.total;
    let lo = 0, hi = prep.acum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (prep.acum[mid] > x) hi = mid; else lo = mid + 1;
    }
    return prep.pool[lo];
  }
  function elegir(eje, pool, ctx) {
    return tomar(preparar(eje, pool, ctx), ctx.rng);
  }
  function azar(pool, rng) {
    return pool[Math.floor(rng() * pool.length)];
  }

  // ---------- Reglas y restricciones ----------
  function coincide(sel, eje, v) {
    const ejeSel = sel.eje === "elemento" ? (eje === "elemento" || eje === "secundario") : sel.eje === eje;
    if (!ejeSel) return false;
    const id = idDe(v);
    if (sel.ids && !sel.ids.includes(id)) return false;
    if (sel.excepto && sel.excepto.includes(id)) return false;
    if (sel.sub && !(v.sub && sel.sub.includes(v.sub.id))) return false;
    return true;
  }

  // Reglas indexadas por eje: para cada eje, pares [selector propio, selector del otro].
  let indiceReglas = null;
  function reglasPara(eje, intencion) {
    if (!indiceReglas || indiceReglas.reglas !== S.reglas) {
      indiceReglas = { reglas: S.reglas, siempre: {}, todas: {} };
      for (const e of EJES) { indiceReglas.siempre[e] = []; indiceReglas.todas[e] = []; }
      const ejesSel = (sel) => (sel.eje === "elemento" ? ["elemento", "secundario"] : [sel.eje]);
      for (const r of S.reglas || []) {
        for (const [mio, otro] of [[r.a, r.b], [r.b, r.a]]) {
          for (const e of ejesSel(mio)) {
            const par = [mio, otro, ejesSel(otro)];
            indiceReglas.todas[e].push(par);
            if (r.alcance === "siempre") indiceReglas.siempre[e].push(par);
          }
        }
      }
    }
    return (intencion === "lucir" ? indiceReglas.todas : indiceReglas.siempre)[eje];
  }

  function reglaChoca(eje, v, puestos, ctx) {
    for (const [mio, otro, ejesOtro] of reglasPara(eje, ctx.ajustes.intencion)) {
      if (!coincide(mio, eje, v)) continue;
      for (const oe of ejesOtro) {
        if (oe !== eje && puestos[oe] && coincide(otro, oe, puestos[oe])) return true;
      }
    }
    return false;
  }

  function excluye(estado, el) {
    return estado.excluir.familias.includes(el.familia) || estado.excluir.ids.includes(el.id);
  }

  function relacionCumple(rel, A, B) {
    const q = rel.requiere;
    if (!q) return true;
    if (q.A === "animado" && A && !A.animado) return false;
    if (q.B && B && !q.B.familias.includes(B.familia)) return false;
    return true;
  }

  // ¿Choca el valor v en el eje con lo ya colocado?
  function choca(eje, v, puestos, ctx) {
    const t = v.t;
    const g = (e) => puestos[e] && puestos[e].t;
    if (reglaChoca(eje, v, puestos, ctx)) return true;
    switch (eje) {
      case "elemento":
      case "secundario": {
        const otroEl = g(eje === "elemento" ? "secundario" : "elemento");
        if (otroEl && otroEl.id === t.id) return true;
        const rel = g("relacion");
        if (rel && !relacionCumple(rel, eje === "elemento" ? t : g("elemento"), eje === "secundario" ? t : g("secundario"))) return true;
        const est = puestos.estado;
        if (est && (est.en === "A") === (eje === "elemento") && excluye(est.t, t)) return true;
        if (eje === "elemento" && !t.animado) {
          const f = g("foco");
          if (f && f.figura && ctx.ajustes.intencion === "reto") return true;
        }
        return false;
      }
      case "relacion":
        return !relacionCumple(t, g("elemento"), g("secundario"));
      case "estado": {
        const el = g(v.en === "B" ? "secundario" : "elemento");
        return !!(el && excluye(t, el));
      }
      case "foco": {
        const el = g("elemento");
        return !!(t.figura && el && !el.animado && ctx.ajustes.intencion === "reto");
      }
      case "concepto1":
      case "concepto2": {
        const otro = g(eje === "concepto1" ? "concepto2" : "concepto1");
        return !!(otro && otro.familia === t.familia);
      }
      default:
        return false;
    }
  }

  // ---------- Pozos de candidatos ----------
  const cachePozos = new Map();
  function pozosFamilia(familia) {
    let p = cachePozos.get(familia);
    if (!p || p.lista !== S.elementos) {
      p = { lista: S.elementos, misma: S.elementos.filter((e) => e.familia === familia),
        distinta: S.elementos.filter((e) => e.familia !== familia) };
      cachePozos.set(familia, p);
    }
    return p;
  }
  function pozoFoco(ctx, nivel) {
    const a = ctx.ajustes;
    return S.foco.filter((f) => {
      if (f.soporte === "piel" && a.soporte !== "piel") return false;
      if (a.intencion === "reto") return f.modo === "reto" && f.nivel === nivel;
      return f.modo === "lucir" || f.tambienLucir;
    });
  }

  // Sortea un valor compatible para el eje. evitar: id a evitar si hay alternativa.
  function sortear(eje, puestos, ctx, evitar) {
    const intentar = (pool) => {
      let base = pool;
      if (evitar && pool.length > 1) base = pool.filter((t) => t.id !== evitar);
      // Muestreo con rechazo; si no alcanza, filtrado completo.
      const prep = preparar(eje, base, ctx);
      for (let i = 0; i < 25; i++) {
        const t = tomar(prep, ctx.rng);
        if (!t) break;
        const v = completar(eje, t, puestos, ctx);
        if (v && !choca(eje, v, puestos, ctx)) return v;
      }
      const ok = base.filter((t) => completar(eje, t, puestos, ctx, true));
      if (!ok.length) return null;
      return completar(eje, elegir(eje, ok, ctx), puestos, ctx, true);
    };

    if (eje === "foco") {
      const nivelPedido = ctx.ajustes.intencion === "reto" ? ctx.ajustes.nivel : 0;
      for (let n = nivelPedido; n >= (nivelPedido ? 1 : 0); n--) {
        const v = intentar(pozoFoco(ctx, n));
        if (v) return v;
      }
      return null;
    }
    if (eje === "secundario") {
      const A = puestos.elemento && puestos.elemento.t;
      const contraste = ctx.rng() < cfg().secundarioContraste;
      const distinta = A ? pozosFamilia(A.familia).distinta : S.elementos;
      const misma = A ? pozosFamilia(A.familia).misma.filter((e) => e.id !== A.id) : [];
      return (contraste ? intentar(distinta) || intentar(misma) : intentar(misma) || intentar(distinta));
    }
    if (eje === "relacion") {
      return intentar(S.relaciones) || { t: porId("relacion", "con") };
    }
    return intentar(listaDe(eje));
  }

  // Completa sub (universo) o en (estado). Con exigir, devuelve null si no hay
  // combinación compatible.
  function completar(eje, t, puestos, ctx, exigir) {
    if (eje === "universo") {
      if (!t.sub) {
        const v = { t };
        return exigir && choca(eje, v, puestos, ctx) ? null : v;
      }
      const subs = t.sub.filter((s) => !choca(eje, { t, sub: s }, puestos, ctx));
      if (!subs.length) return exigir ? null : { t, sub: azar(t.sub, ctx.rng) };
      return { t, sub: azar(subs, ctx.rng) };
    }
    if (eje === "estado") {
      const en = ctx.estadoEn;
      const v = { t, en };
      return exigir && choca(eje, v, puestos, ctx) ? null : v;
    }
    const v = { t };
    return exigir && choca(eje, v, puestos, ctx) ? null : v;
  }

  // ---------- Presencia de los ejes ----------
  function decidirPresencia(eje, puestos, ctx) {
    const a = ctx.ajustes, d = cfg().densidad[a.densidad], rng = ctx.rng;
    switch (eje) {
      case "estilo": return true;
      case "color": case "sombreado": case "linea": return ctx.tratamiento.has(eje);
      case "foco": return rng() < d.foco[a.intencion];
      case "elemento": {
        if (a.elementos === "nunca") return false;
        if (a.elementos === "siempre") return true;
        const est = puestos.estilo && puestos.estilo.t;
        return rng() < cfg().probElementos[est ? est.probElementos : "media"];
      }
      case "secundario": return !!puestos.elemento && rng() < d.secundario;
      case "relacion": return !!puestos.secundario;
      case "estado": return !!puestos.elemento && rng() < d.estado;
      case "concepto1": return !ctx.hayPar;
      case "concepto2": {
        if (ctx.hayPar) return false;
        if (!puestos.elemento && d.conceptos === 1) return rng() < 0.5;
        return d.conceptos >= 2;
      }
      case "par": return ctx.hayPar;
      case "universo": return rng() < (puestos.elemento ? d.universo : d.universoSinElemento);
      case "formato": return rng() < d.formato;
      case "zona": return a.soporte === "piel" && rng() < cfg().zonaEnPiel;
    }
    return false;
  }

  function elegirTratamiento(ctx, fijos) {
    const [lo, hi] = cfg().densidad[ctx.ajustes.densidad].tratamiento;
    const k = lo + Math.floor(ctx.rng() * (hi - lo + 1));
    const elegidos = new Set(fijos);
    const libres = TRATAMIENTO.filter((e) => !elegidos.has(e));
    while (elegidos.size < k && libres.length) {
      elegidos.add(libres.splice(Math.floor(ctx.rng() * libres.length), 1)[0]);
    }
    return elegidos;
  }

  // ---------- Generar ----------
  // previa: semilla actual (o null). bloqueos: ejes bloqueados (arreglo o Set).
  // ajustes: modo, más recientes (semillas previas), ventana, ahora y soloEje.
  function generar(previa, bloqueos, ajustes, rng) {
    const a = Object.assign({}, AJUSTES, ajustes || {});
    a.nivel = Math.min(3, Math.max(1, +a.nivel || 1));
    const ventana = a.ventana != null ? a.ventana : cfg().ventanaRecientes;
    // recientes: { grupo: Set(ids) }
    const recientes = {};
    for (const s of (a.recientes || []).slice(-ventana)) {
      const t = (s && s.terminos) || {};
      for (const eje of EJES) {
        const x = t[eje];
        if (x == null) continue;
        const g = grupo(eje);
        (recientes[g] = recientes[g] || new Set()).add(typeof x === "string" ? x : x.id);
      }
    }

    const ctx = { ajustes: a, rng, recientes };
    const prev = (previa && previa.terminos) || {};
    const bloq = new Set(bloqueos || []);
    const soloEje = a.soloEje || null;

    // Valores fijos (bloqueados) y conservados (relanzar un solo eje).
    const fijos = {}, conservados = {};
    for (const eje of EJES) {
      const v = deTermino(eje, prev[eje]);
      if (!v) continue;
      if (bloq.has(eje)) fijos[eje] = v;
      else if (soloEje && eje !== soloEje) conservados[eje] = v;
    }
    const puestos = {};
    for (const eje of EJES) if (fijos[eje]) puestos[eje] = fijos[eje];

    // Presencia.
    const presente = {};
    if (soloEje) {
      for (const eje of EJES) presente[eje] = prev[eje] != null;
      ctx.hayPar = presente.par;
      ctx.tratamiento = new Set(TRATAMIENTO.filter((e) => presente[e]));
    } else {
      const d = cfg().densidad[a.densidad];
      const conceptoFijo = fijos.concepto1 || fijos.concepto2;
      ctx.hayPar = !!fijos.par || (!conceptoFijo && ctx.rng() < d.par);
      ctx.tratamiento = elegirTratamiento(ctx, TRATAMIENTO.filter((e) => fijos[e]));
    }
    const estadoPrevio = prev.estado && prev.estado.en;

    for (const eje of EJES) {
      if (fijos[eje]) { presente[eje] = true; continue; }
      if (!soloEje) {
        presente[eje] = decidirPresencia(eje, puestos, ctx) || dependeDeFijo(eje, fijos);
      }
      if (!presente[eje]) continue;

      if (eje === "estado") {
        const haySec = presente.secundario;
        ctx.estadoEn = soloEje && estadoPrevio ? estadoPrevio : (haySec && ctx.rng() < 0.5 ? "B" : "A");
        if (ctx.estadoEn === "B" && !haySec) ctx.estadoEn = "A";
      }

      const cons = conservados[eje];
      if (cons && !choca(eje, cons, puestos, ctx)) { puestos[eje] = cons; continue; }
      const evitar = eje === soloEje && prev[eje] != null ? (typeof prev[eje] === "string" ? prev[eje] : prev[eje].id) : null;
      let v = sortear(eje, puestos, ctx, evitar);
      if (!v && eje === "estilo") v = { t: elegir(eje, S.estilos, ctx) };
      if (v) puestos[eje] = v;
      else presente[eje] = false;
    }

    // Los dependientes sin su base desaparecen.
    if (!puestos.elemento) { delete puestos.secundario; delete puestos.relacion; delete puestos.estado; }
    if (!puestos.secundario) delete puestos.relacion;
    if (puestos.secundario && !puestos.relacion) puestos.relacion = { t: porId("relacion", "con") };
    if (puestos.estado && puestos.estado.en === "B" && !puestos.secundario) puestos.estado.en = "A";

    const terminos = {};
    for (const eje of EJES) if (puestos[eje]) terminos[eje] = aTermino(eje, puestos[eje]);

    const ahora = a.ahora != null ? a.ahora : Date.now();
    return {
      id: ahora.toString(36) + "-" + Math.floor(rng() * 1e9).toString(36),
      fecha: new Date(ahora).toISOString(),
      modo: { soporte: a.soporte, intencion: a.intencion, nivel: a.intencion === "reto" ? a.nivel : null,
        densidad: a.densidad, elementos: a.elementos },
      terminos,
    };
  }

  function dependeDeFijo(eje, fijos) {
    if (eje === "elemento") return !!(fijos.secundario || fijos.relacion || fijos.estado);
    if (eje === "secundario") return !!(fijos.relacion || (fijos.estado && fijos.estado.en === "B"));
    return false;
  }

  // Tocar un chip: resortea solo ese eje y conserva el resto si es compatible.
  function relanzarEje(semilla, eje, bloqueos, ajustes, rng) {
    return generar(semilla, bloqueos, Object.assign({}, ajustes, { soloEje: eje }), rng);
  }

  S.generador = { EJES, generar, relanzarEje, claves };
})(typeof window !== "undefined" ? window : globalThis);
