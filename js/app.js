// Interfaz, estado y persistencia (SPEC.md §9 y §10).
(function () {
  "use strict";
  const S = window.SEMILLA;
  const G = S.generador;
  const F = S.frase;
  const R = S.respaldo;

  const CLAVES = { historial: "semilla.historial", ajustes: "semilla.ajustes", recientes: "semilla.recientes" };
  const AJUSTES_INICIALES = { soporte: "lienzo", intencion: "lucir", nivel: 1, densidad: "escueta", elementos: "auto",
    tema: "sistema", ventana: S.config.ventanaRecientes };

  // ---------- Persistencia ----------
  function leer(clave, porDefecto) {
    try {
      const v = localStorage.getItem(clave);
      return v == null ? porDefecto : JSON.parse(v);
    } catch (e) {
      return porDefecto;
    }
  }
  function escribir(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* almacenamiento lleno o bloqueado */ }
  }

  const estado = {
    ajustes: Object.assign({}, AJUSTES_INICIALES, leer(CLAVES.ajustes, {})),
    recientes: leer(CLAVES.recientes, []),
    historial: leer(CLAVES.historial, []),
    semilla: null,
    bloqueos: new Set(),
    filtro: "todas",
  };

  // ---------- Utilidades ----------
  const $ = (sel) => document.querySelector(sel);
  const rng = Math.random;

  let temporizadorAviso = null;
  function avisar(texto) {
    const el = $("#aviso");
    el.textContent = texto;
    el.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => { el.hidden = true; }, 1800);
  }

  function modoGenerador() {
    const a = estado.ajustes;
    return { soporte: a.soporte, intencion: a.intencion, nivel: +a.nivel, densidad: a.densidad,
      elementos: a.elementos, recientes: estado.recientes, ventana: +a.ventana };
  }

  function recordar(semilla) {
    estado.recientes.push({ terminos: semilla.terminos });
    const n = Math.max(0, +estado.ajustes.ventana || 0);
    if (estado.recientes.length > n) estado.recientes.splice(0, estado.recientes.length - n);
    escribir(CLAVES.recientes, estado.recientes);
  }

  // ---------- Chips ----------
  const NOMBRE_EJE = { estilo: "estilo", color: "color", sombreado: "sombreado", linea: "línea",
    elemento: "elemento", secundario: "secundario", relacion: "relación", estado: "estado",
    concepto1: "concepto", concepto2: "concepto", par: "en tensión", universo: "universo",
    formato: "formato", zona: "zona" };

  const LISTA = { estilo: S.estilos, color: S.color, sombreado: S.sombreado, linea: S.linea, foco: S.foco,
    elemento: S.elementos, secundario: S.elementos, relacion: S.relaciones, estado: S.estados,
    concepto1: S.conceptos, concepto2: S.conceptos, par: S.pares, universo: S.universos,
    formato: S.formatos, zona: S.zonas };

  function describir(eje, valor) {
    const id = typeof valor === "string" ? valor : valor.id;
    const t = LISTA[eje].find((x) => x.id === id);
    if (!t) return { eje: NOMBRE_EJE[eje] || eje, texto: id };
    if (eje === "foco") {
      const v = S.variablesFoco.find((x) => x.id === t.variable);
      return { eje: v ? v.texto : "foco", texto: t.texto };
    }
    if (eje === "universo" && valor.sub) {
      const s = (t.sub || []).find((x) => x.id === valor.sub);
      return { eje: t.texto, texto: s ? s.texto : t.texto };
    }
    if (eje === "par") return { eje: NOMBRE_EJE.par, texto: t.a + " / " + t.b };
    return { eje: NOMBRE_EJE[eje], texto: t.texto };
  }

  const ICONO_ABIERTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/>' +
    '<path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>';
  const ICONO_CERRADO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/>' +
    '<path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  function pintarChips(relanzado) {
    const ul = $("#chips");
    ul.textContent = "";
    if (!estado.semilla) return;
    for (const eje of G.EJES) {
      const valor = estado.semilla.terminos[eje];
      if (valor == null) continue;
      const d = describir(eje, valor);
      const bloqueado = estado.bloqueos.has(eje);

      const li = document.createElement("li");
      li.className = "chip" + (bloqueado ? " bloqueado" : "") + (relanzado && relanzado.has(eje) ? " relanzado" : "");

      const texto = document.createElement("button");
      texto.className = "chip-texto";
      texto.type = "button";
      texto.disabled = bloqueado;
      texto.setAttribute("aria-label", d.eje + ": " + d.texto + (bloqueado ? " (bloqueado)" : ". Tocar para relanzar"));
      const e = document.createElement("span");
      e.className = "chip-eje";
      e.textContent = d.eje;
      const v = document.createElement("span");
      v.className = "chip-valor";
      v.textContent = d.texto;
      texto.append(e, v);
      texto.addEventListener("click", () => relanzarEje(eje));

      const candado = document.createElement("button");
      candado.className = "chip-candado";
      candado.type = "button";
      candado.setAttribute("aria-pressed", String(bloqueado));
      candado.setAttribute("aria-label", (bloqueado ? "Desbloquear " : "Bloquear ") + d.eje);
      candado.innerHTML = bloqueado ? ICONO_CERRADO : ICONO_ABIERTO;
      candado.addEventListener("click", () => alternarBloqueo(eje));

      li.append(texto, candado);
      ul.append(li);
    }
  }

  // ---------- Pintado ----------
  function pintarFrase() {
    const p = $("#frase");
    if (!estado.semilla) {
      p.textContent = "Toca Generar para sembrar una idea.";
      p.classList.add("vacia");
      return;
    }
    p.classList.remove("vacia");
    p.textContent = F.construir(estado.semilla);
  }

  function pintarBotones() {
    $("#btn-generar").textContent = estado.semilla && estado.bloqueos.size ? "Relanzar" : "Generar";
    const guardada = estado.semilla && estado.historial.some((h) => h.id === estado.semilla.id);
    const g = $("#btn-guardar");
    g.disabled = !estado.semilla || guardada;
    g.textContent = guardada ? "Guardada" : "Guardar";
    $("#btn-copiar").disabled = !estado.semilla;
  }

  function pintarControles() {
    document.querySelectorAll(".segmento[data-ajuste]").forEach((seg) => {
      const clave = seg.dataset.ajuste;
      seg.querySelectorAll("button").forEach((b) => {
        b.setAttribute("aria-checked", String(String(estado.ajustes[clave]) === b.dataset.valor));
      });
    });
    $("#control-nivel").hidden = estado.ajustes.intencion !== "reto";
    const n = +estado.ajustes.ventana;
    $("#ventana-valor").textContent = n;
    $("#ventana-texto").textContent = n;
    $("#ventana-menos").disabled = n <= 0;
    $("#ventana-mas").disabled = n >= 100;
  }

  function pintarTema() {
    const t = estado.ajustes.tema;
    if (t === "claro" || t === "oscuro") document.documentElement.dataset.tema = t;
    else delete document.documentElement.dataset.tema;
  }

  function pintar(relanzado) {
    pintarFrase();
    pintarChips(relanzado);
    pintarBotones();
  }

  // ---------- Acciones ----------
  function cambios(antes, despues) {
    const s = new Set();
    for (const eje of G.EJES) {
      if (JSON.stringify(antes ? antes.terminos[eje] : undefined) !== JSON.stringify(despues.terminos[eje])) s.add(eje);
    }
    return s;
  }

  function generar() {
    const antes = estado.semilla;
    if (antes && Object.keys(antes.terminos).every((eje) => estado.bloqueos.has(eje))) {
      avisar("Todo está bloqueado: desbloquea algo para relanzar");
      return;
    }
    const bloqueos = antes ? [...estado.bloqueos] : [];
    estado.semilla = G.generar(antes, bloqueos, modoGenerador(), rng);
    for (const eje of [...estado.bloqueos]) if (estado.semilla.terminos[eje] == null) estado.bloqueos.delete(eje);
    recordar(estado.semilla);
    pintar(cambios(antes, estado.semilla));
  }

  function relanzarEje(eje) {
    if (!estado.semilla || estado.bloqueos.has(eje)) return;
    const antes = estado.semilla;
    // Relanzar un eje conserva el modo con el que se generó la semilla.
    const modo = Object.assign(modoGenerador(), antes.modo, { nivel: antes.modo.nivel || 1 });
    estado.semilla = G.relanzarEje(antes, eje, [...estado.bloqueos], modo, rng);
    recordar(estado.semilla);
    pintar(cambios(antes, estado.semilla));
  }

  function alternarBloqueo(eje) {
    if (estado.bloqueos.has(eje)) estado.bloqueos.delete(eje);
    else estado.bloqueos.add(eje);
    pintarChips();
    pintarBotones();
  }

  function guardar() {
    const s = estado.semilla;
    if (!s || estado.historial.some((h) => h.id === s.id)) return;
    estado.historial.unshift({ id: s.id, fecha: s.fecha, modo: s.modo, terminos: s.terminos,
      frase: F.construir(s), estado: "guardada", nota: "" });
    escribir(CLAVES.historial, estado.historial);
    pintarBotones();
    avisar("Semilla guardada");
  }

  async function copiar() {
    if (!estado.semilla) return;
    const texto = F.construir(estado.semilla);
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(texto);
        ok = true;
      }
    } catch (e) { /* se intenta el método antiguo */ }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
    }
    avisar(ok ? "Frase copiada" : "No se pudo copiar");
  }

  function cambiarAjuste(clave, valor) {
    estado.ajustes[clave] = clave === "nivel" || clave === "ventana" ? +valor : valor;
    escribir(CLAVES.ajustes, estado.ajustes);
    if (clave === "tema") pintarTema();
    if (clave === "ventana") {
      const sobran = estado.recientes.length - estado.ajustes.ventana;
      if (sobran > 0) { estado.recientes.splice(0, sobran); escribir(CLAVES.recientes, estado.recientes); }
    }
    pintarControles();
  }

  // ---------- Historial ----------
  const FECHA = new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" });

  function describirModo(m) {
    if (!m) return "";
    return [m.intencion === "reto" ? "Reto nivel " + (m.nivel || 1) : "Lucir",
      m.soporte === "piel" ? "piel" : "lienzo", m.densidad].join(" · ");
  }

  function guardarHistorial() {
    escribir(CLAVES.historial, estado.historial);
  }

  function pintarHistorial() {
    const ol = $("#historial");
    ol.textContent = "";
    $("#filtro").querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-checked", String(b.dataset.valor === estado.filtro));
    });
    const lista = estado.historial.filter((h) => estado.filtro === "todas" ||
      (estado.filtro === "dibujadas" ? h.estado === "dibujada" : h.estado !== "dibujada"));

    const vacio = $("#historial-vacio");
    vacio.hidden = lista.length > 0;
    if (!lista.length) {
      vacio.textContent = !estado.historial.length ? "Aún no guardaste semillas. Usa Guardar en Generar."
        : estado.filtro === "dibujadas" ? "Todavía no marcaste ninguna como dibujada." : "No hay semillas pendientes.";
    }

    for (const h of lista) {
      const dibujada = h.estado === "dibujada";
      const li = document.createElement("li");
      li.className = "entrada" + (dibujada ? " dibujada" : "");

      const frase = document.createElement("p");
      frase.className = "entrada-frase";
      frase.textContent = h.frase || "";

      const meta = document.createElement("p");
      meta.className = "entrada-meta";
      const fecha = new Date(h.fecha);
      meta.textContent = (isNaN(fecha) ? "" : FECHA.format(fecha) + " · ") + describirModo(h.modo);
      const insignia = document.createElement("span");
      insignia.className = "insignia";
      insignia.textContent = dibujada ? "dibujada" : "pendiente";
      meta.append(" ", insignia);

      const nota = document.createElement("textarea");
      nota.className = "entrada-nota";
      nota.rows = 1;
      nota.maxLength = 280;
      nota.placeholder = "Nota corta…";
      nota.value = h.nota || "";
      nota.setAttribute("aria-label", "Nota de la semilla");
      nota.addEventListener("change", () => {
        h.nota = nota.value.trim();
        h.actualizada = new Date().toISOString();
        guardarHistorial();
      });

      const acciones = document.createElement("div");
      acciones.className = "entrada-acciones";
      const marcar = document.createElement("button");
      marcar.textContent = dibujada ? "Marcar pendiente" : "Marcar dibujada";
      marcar.addEventListener("click", () => {
        h.estado = dibujada ? "guardada" : "dibujada";
        h.actualizada = new Date().toISOString();
        guardarHistorial();
        pintarHistorial();
      });
      const usar = document.createElement("button");
      usar.textContent = "Volver a usar";
      usar.addEventListener("click", () => volverAUsar(h));
      acciones.append(marcar, usar);

      li.append(frase, meta, nota, acciones);
      ol.append(li);
    }
  }

  // Carga la semilla en Generar con todos los términos bloqueados.
  function volverAUsar(h) {
    estado.semilla = { id: h.id, fecha: h.fecha, modo: h.modo, terminos: h.terminos };
    estado.bloqueos = new Set(Object.keys(h.terminos));
    if (h.modo) {
      for (const k of ["soporte", "intencion", "densidad", "elementos"]) if (h.modo[k]) estado.ajustes[k] = h.modo[k];
      if (h.modo.nivel) estado.ajustes.nivel = h.modo.nivel;
      escribir(CLAVES.ajustes, estado.ajustes);
    }
    pintarControles();
    pintar();
    mostrarPestana("generar");
    avisar("Semilla cargada con todo bloqueado");
  }

  // ---------- Respaldo ----------
  function exportar() {
    const ahora = new Date();
    const datos = R.crear(estado.historial, estado.ajustes, ahora);
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = R.nombreArchivo(ahora);
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    avisar(estado.historial.length + " semillas exportadas");
  }

  function importar(archivo) {
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = R.leer(String(lector.result));
        const r = R.fusionar(estado.historial, datos.historial);
        estado.historial = r.historial;
        guardarHistorial();
        pintarHistorial();
        pintarBotones();
        let msg = "Importado: " + (r.agregadas === 1 ? "1 semilla nueva" : r.agregadas + " semillas nuevas");
        if (r.actualizadas) msg += ", " + r.actualizadas + " actualizadas";
        avisar(msg);
      } catch (e) {
        avisar(e.message || "No se pudo importar");
      }
    };
    lector.onerror = () => avisar("No se pudo leer el archivo");
    lector.readAsText(archivo);
  }

  function borrarHistorial() {
    const n = estado.historial.length;
    if (!n) { avisar("El historial ya está vacío"); return; }
    const pregunta = "¿Borrar las " + n + " semillas del historial? No se puede deshacer. " +
      "Si quieres conservarlas, exporta un respaldo antes.";
    if (!window.confirm(pregunta)) return;
    estado.historial = [];
    guardarHistorial();
    pintarHistorial();
    pintarBotones();
    avisar("Historial borrado");
  }

  function mostrarPestana(nombre) {
    for (const n of ["generar", "historial", "ajustes"]) {
      const activa = n === nombre;
      $("#tab-" + n).setAttribute("aria-selected", String(activa));
      $("#panel-" + n).hidden = !activa;
    }
    $(".acciones").hidden = nombre !== "generar";
    if (nombre === "historial") pintarHistorial();
    window.scrollTo(0, 0);
  }

  // ---------- Arranque ----------
  document.querySelectorAll(".segmento[data-ajuste]").forEach((seg) => {
    seg.addEventListener("click", (ev) => {
      const b = ev.target.closest("button");
      if (b) cambiarAjuste(seg.dataset.ajuste, b.dataset.valor);
    });
  });
  for (const n of ["generar", "historial", "ajustes"]) {
    $("#tab-" + n).addEventListener("click", () => mostrarPestana(n));
  }
  $("#btn-generar").addEventListener("click", generar);
  $("#btn-guardar").addEventListener("click", guardar);
  $("#btn-copiar").addEventListener("click", copiar);
  $("#filtro").addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    estado.filtro = b.dataset.valor;
    pintarHistorial();
  });
  $("#ventana-menos").addEventListener("click", () => cambiarAjuste("ventana", Math.max(0, +estado.ajustes.ventana - 5)));
  $("#ventana-mas").addEventListener("click", () => cambiarAjuste("ventana", Math.min(100, +estado.ajustes.ventana + 5)));
  $("#btn-exportar").addEventListener("click", exportar);
  $("#btn-importar").addEventListener("click", () => $("#archivo-importar").click());
  $("#archivo-importar").addEventListener("change", (ev) => {
    importar(ev.target.files[0]);
    ev.target.value = "";
  });
  $("#btn-borrar").addEventListener("click", borrarHistorial);

  // ---------- Service worker y actualizaciones ----------
  // Solo con http(s): desde file:// la app funciona igual, pero sin caché propia.
  function registrarServiceWorker() {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    let recargando = false;
    // En la primera visita el service worker toma el control sin que haga falta recargar.
    let habiaControlador = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!habiaControlador) { habiaControlador = true; return; }
      if (recargando) return;
      recargando = true;
      location.reload();
    });
    navigator.serviceWorker.register("sw.js").then((reg) => {
      const ofrecer = (sw) => {
        // Sin controlador es la primera instalación: no hay nada que actualizar.
        if (!sw || !navigator.serviceWorker.controller) return;
        $("#actualizacion").hidden = false;
        $("#btn-actualizar").onclick = () => sw.postMessage("activar");
      };
      if (reg.waiting) ofrecer(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const nuevo = reg.installing;
        if (!nuevo) return;
        nuevo.addEventListener("statechange", () => {
          if (nuevo.state === "installed") ofrecer(nuevo);
        });
      });
      // Al volver a la app, revisa si hay una versión nueva publicada.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update().catch(() => {});
      });
    }).catch(() => { /* sin service worker la app sigue funcionando en línea */ });
  }

  pintarTema();
  pintarControles();
  generar();
  registrarServiceWorker();
})();
