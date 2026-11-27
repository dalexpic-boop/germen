// Exportar e importar el respaldo (SPEC.md §10). Puro: sin DOM ni almacenamiento.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};

  const FORMATO = "germen-respaldo";
  const VERSION = 1;

  function dosDigitos(n) { return (n < 10 ? "0" : "") + n; }

  // germen-respaldo-AAAA-MM-DD.json, con la fecha local.
  function nombreArchivo(fecha) {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return "germen-respaldo-" + d.getFullYear() + "-" + dosDigitos(d.getMonth() + 1) + "-" + dosDigitos(d.getDate()) + ".json";
  }

  function crear(historial, ajustes, fecha) {
    return {
      formato: FORMATO,
      version: VERSION,
      exportado: new Date(fecha).toISOString(),
      historial: historial || [],
      ajustes: ajustes || {},
    };
  }

  function entradaValida(e) {
    return !!(e && typeof e.id === "string" && e.id && e.terminos && typeof e.terminos === "object");
  }

  // Lee el texto de un respaldo. Lanza un Error con mensaje para el usuario si no sirve.
  function leer(texto) {
    let datos;
    try {
      datos = JSON.parse(texto);
    } catch (e) {
      throw new Error("El archivo no es un respaldo válido.");
    }
    if (!datos || datos.formato !== FORMATO || !Array.isArray(datos.historial)) {
      throw new Error("El archivo no es un respaldo de Germen.");
    }
    if (datos.version > VERSION) {
      throw new Error("El respaldo es de una versión más nueva de Germen.");
    }
    return datos;
  }

  function marca(e) {
    return Date.parse(e.actualizada || e.fecha) || 0;
  }

  // Fusiona por id sin duplicar. Si una semilla está en los dos lados, queda la
  // modificada más recientemente. El resultado va de la más reciente a la más antigua.
  function fusionar(actual, entrante) {
    const porId = new Map();
    for (const e of actual || []) if (entradaValida(e)) porId.set(e.id, e);
    let agregadas = 0, actualizadas = 0;
    for (const e of entrante || []) {
      if (!entradaValida(e)) continue;
      const previa = porId.get(e.id);
      if (!previa) { porId.set(e.id, e); agregadas++; }
      else if (marca(e) > marca(previa)) { porId.set(e.id, e); actualizadas++; }
    }
    const historial = [...porId.values()].sort((a, b) => (Date.parse(b.fecha) || 0) - (Date.parse(a.fecha) || 0));
    return { historial, agregadas, actualizadas };
  }

  root.SEMILLA.respaldo = { nombreArchivo, crear, leer, fusionar };
})(typeof window !== "undefined" ? window : globalThis);
