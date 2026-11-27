// Reglas de incompatibilidad (LISTAS.md §12). Selector: { eje, ids? | excepto?, sub? }. Las exclusiones de estado y los requisitos de relación viven en sus propios datos.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  root.SEMILLA.reglas = [
    {alcance: "siempre", a: {eje: "estilo", ids: ["realismo"]}, b: {eje: "foco", ids: ["textura-pixel"]}, id: "regla-1"},
    {alcance: "siempre", a: {eje: "estilo", ids: ["polinesio"]}, b: {eje: "universo", ids: ["esteticas-culturales"], sub: ["polinesia", "maori"]}, id: "regla-2"},
    {alcance: "siempre", a: {eje: "estilo", ids: ["oriental", "neo-oriental"]}, b: {eje: "universo", ids: ["esteticas-culturales"], sub: ["japonesa", "china", "coreana"]}, id: "regla-3"},
    {alcance: "siempre", a: {eje: "estilo", ids: ["mehndi"]}, b: {eje: "universo", ids: ["esteticas-culturales"], sub: ["india"]}, id: "regla-4"},
    {alcance: "siempre", a: {eje: "estilo", ids: ["surrealismo"]}, b: {eje: "universo", ids: ["movimientos-artisticos"], sub: ["surrealismo"]}, id: "regla-5"},
    {alcance: "siempre", a: {eje: "elemento", ids: ["carta-de-tarot"]}, b: {eje: "formato", ids: ["carta-de-tarot"]}, id: "regla-6"},
    {alcance: "siempre", a: {eje: "elemento", ids: ["vitral"]}, b: {eje: "formato", ids: ["vitral"]}, id: "regla-7"},
    {alcance: "siempre", a: {eje: "elemento", ids: ["moneda-antigua"]}, b: {eje: "formato", ids: ["moneda"]}, id: "regla-8"},
    {alcance: "lucir", a: {eje: "estilo", ids: ["blackwork"]}, b: {eje: "color", excepto: ["solo-negro", "acento-unico"]}, id: "regla-9"},
    {alcance: "lucir", a: {eje: "estilo", ids: ["criminal-ruso"]}, b: {eje: "color", excepto: ["solo-negro", "negro-y-gris"]}, id: "regla-10"},
    {alcance: "lucir", a: {eje: "estilo", ids: ["tradicional"]}, b: {eje: "linea", ids: ["fina", "punteada", "inexistente"]}, id: "regla-11"},
    {alcance: "lucir", a: {eje: "estilo", ids: ["realismo"]}, b: {eje: "linea", ids: ["gruesa"]}, id: "regla-12"},
    {alcance: "lucir", a: {eje: "estilo", ids: ["realismo"]}, b: {eje: "sombreado", ids: ["sin-sombra", "solidos"]}, id: "regla-13"},
    {alcance: "lucir", a: {eje: "estilo", ids: ["minimalista"]}, b: {eje: "sombreado", ids: ["achurado-cruzado", "semitono", "degradado-suave"]}, id: "regla-14"}
  ];
})(typeof window !== "undefined" ? window : globalThis);
