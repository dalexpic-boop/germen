// Construcción de la oración y concordancia (SPEC.md §8). Puro: sin DOM.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  const S = root.SEMILLA;

  function buscar(lista, id) {
    return id == null ? null : lista.find((t) => t.id === id) || null;
  }

  // Clave de concordancia de un elemento: m, f, mp, fp.
  function clave(el) {
    return el.genero + (el.numero === "p" ? "p" : "");
  }

  function articulo(el) {
    if (el.articulo !== undefined) return el.articulo;
    return { m: "un", f: "una", mp: "unos", fp: "unas" }[clave(el)];
  }

  function terminacion(el) {
    return { m: "o", f: "a", mp: "os", fp: "as" }[clave(el)];
  }

  function pronombre(el) {
    return { m: "él", f: "ella", mp: "ellos", fp: "ellas" }[clave(el)];
  }

  function unir(partes) {
    return partes.filter((p) => p !== "" && p != null).join(" ");
  }

  // Sintagma completo: artículo, frase o texto, estado concordado.
  function sintagma(el, estado) {
    return unir([articulo(el), el.frase || el.texto, estado ? estado.formas[clave(el)] : ""]);
  }

  // Plural sin artículo; el estado concuerda en plural.
  function plural(el, estado) {
    const k = el.genero + "p";
    return unir([el.plural, estado ? estado.formas[k] : ""]);
  }

  function aplicarPlantilla(plantilla, A, B, estA, estB) {
    return plantilla.replace(/\{([^}]+)\}/g, (_, marca) => {
      switch (marca) {
        case "A": return sintagma(A, estA);
        case "B": return sintagma(B, estB);
        case "o:A": return terminacion(A);
        case "o:B": return terminacion(B);
        case "pron:A": return pronombre(A);
        case "pron:B": return pronombre(B);
        case "B:plural": return plural(B, estB);
        default: throw new Error("Marca desconocida en plantilla: " + marca);
      }
    });
  }

  function lista(partes) {
    if (partes.length <= 1) return partes.join("");
    return partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1];
  }

  function mayuscula(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  // Resuelve los ids de la semilla a términos de datos.
  function resolver(t) {
    const r = {
      estilo: buscar(S.estilos, t.estilo),
      color: buscar(S.color, t.color),
      sombreado: buscar(S.sombreado, t.sombreado),
      linea: buscar(S.linea, t.linea),
      elemento: buscar(S.elementos, t.elemento),
      secundario: buscar(S.elementos, t.secundario),
      relacion: buscar(S.relaciones, t.relacion),
      estado: t.estado ? buscar(S.estados, t.estado.id) : null,
      estadoEn: t.estado ? t.estado.en : null,
      concepto1: buscar(S.conceptos, t.concepto1),
      concepto2: buscar(S.conceptos, t.concepto2),
      par: buscar(S.pares, t.par),
      universo: t.universo ? buscar(S.universos, t.universo.id) : null,
      foco: buscar(S.foco, t.foco),
      formato: buscar(S.formatos, t.formato),
      zona: buscar(S.zonas, t.zona),
    };
    r.sub = r.universo && r.universo.sub && t.universo.sub
      ? r.universo.sub.find((s) => s.id === t.universo.sub) || null
      : null;
    return r;
  }

  function clausulaElementos(r) {
    if (!r.elemento) return "";
    const estA = r.estado && r.estadoEn !== "B" ? r.estado : null;
    if (!r.secundario) return sintagma(r.elemento, r.estado);
    const estB = r.estado && r.estadoEn === "B" ? r.estado : null;
    const rel = r.relacion || buscar(S.relaciones, "con");
    return aplicarPlantilla(rel.plantilla, r.elemento, r.secundario, estA, estB);
  }

  function textoConcepto(c) {
    return c.frase || c.texto;
  }

  function construir(semilla) {
    const r = resolver(semilla.terminos);
    const conceptos = [r.concepto1, r.concepto2].filter(Boolean).map(textoConcepto);
    const elementos = clausulaElementos(r);
    const oraciones = [];

    // 1 a 4: cabeza, estilo, formato, tratamientos.
    let cabeza = elementos;
    if (!cabeza) {
      if (conceptos.length) cabeza = lista(conceptos);
      else if (r.par) cabeza = "tensión entre " + r.par.a + " y " + r.par.b;
    }
    let primera = unir([cabeza ? cabeza + "," : "", r.estilo ? "en " + (r.estilo.frase || r.estilo.texto) : "",
      r.formato ? r.formato.frase : ""]);
    const trats = [r.color, r.sombreado, r.linea].filter(Boolean).map((x) => x.frase);
    if (trats.length) primera += "; " + lista(trats);
    oraciones.push(mayuscula(primera.replace(/,$/, "")) + ".");

    // 5: foco.
    if (r.foco) {
      let f;
      if (semilla.modo && semilla.modo.intencion === "reto") {
        const v = (S.variablesFoco || []).find((x) => x.id === r.foco.variable);
        f = "Reto nivel " + r.foco.nivel + ", " + (v ? v.texto : r.foco.variable) + ": " + r.foco.texto;
        if (r.foco.figura && !r.elemento) f += ", aplicado a una figura humana o animal";
      } else {
        f = "Foco: " + r.foco.texto;
      }
      oraciones.push(f + ".");
    }

    // 6: conceptos o par, solo si hubo cláusula de elementos.
    if (elementos) {
      if (conceptos.length) oraciones.push("Que transmita " + lista(conceptos) + ".");
      if (r.par) oraciones.push("En tensión: " + r.par.a + " y " + r.par.b + ".");
    } else if (conceptos.length && r.par) {
      oraciones.push("En tensión: " + r.par.a + " y " + r.par.b + ".");
    }

    // 7: universo.
    if (r.universo) {
      if (r.sub) oraciones.push(mayuscula(r.universo.fraseSub.replace("{sub}", r.sub.frase || r.sub.texto)));
      else oraciones.push("Universo: " + r.universo.texto + ".");
    }

    // 8: zona.
    if (r.zona) oraciones.push("Zona: " + r.zona.texto + " (" + r.zona.forma + ").");

    return oraciones.join(" ").replace(/ {2,}/g, " ").trim();
  }

  S.frase = { construir, sintagma, plural, aplicarPlantilla, articulo, clave };
})(typeof window !== "undefined" ? window : globalThis);
