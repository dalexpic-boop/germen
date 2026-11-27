// Tratamiento (LISTAS.md §2): tres componentes independientes.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  root.SEMILLA.color = [
    {id: "vivos", texto: "vivos", frase: "colores muy vivos", familia: "color"},
    {id: "pastel", texto: "pastel", frase: "paleta pastel", familia: "color"},
    {id: "apagados", texto: "apagados", frase: "colores apagados", familia: "color"},
    {id: "tierra", texto: "tierra", frase: "tonos tierra", familia: "color"},
    {id: "solo-negro", texto: "solo negro", frase: "solo negro", familia: "color"},
    {id: "negro-y-gris", texto: "negro y gris", frase: "en negro y gris", familia: "color"},
    {id: "acuarela", texto: "acuarela", frase: "con manchas de acuarela", familia: "color"},
    {id: "dos-colores", texto: "dos colores", frase: "limitado a dos colores", familia: "color"},
    {id: "complementarios", texto: "complementarios", frase: "en colores complementarios", familia: "color"},
    {id: "acento-unico", texto: "acento único", frase: "negro con un solo color de acento", familia: "color"}
  ];
  root.SEMILLA.sombreado = [
    {id: "achurado", texto: "achurado", frase: "sombreado en achurado", familia: "sombreado"},
    {id: "achurado-cruzado", texto: "achurado cruzado", frase: "sombreado en achurado cruzado", familia: "sombreado"},
    {id: "whip-shading", texto: "whip shading", frase: "sombreado en whip shading", familia: "sombreado"},
    {id: "puntillismo", texto: "puntillismo", frase: "sombreado en puntillismo", familia: "sombreado"},
    {id: "semitono", texto: "semitono", frase: "sombreado en semitono", familia: "sombreado"},
    {id: "degradado-suave", texto: "degradado suave", frase: "sombreado en degradado suave", familia: "sombreado"},
    {id: "solidos", texto: "sólidos", frase: "rellenos sólidos sin degradado", familia: "sombreado"},
    {id: "sin-sombra", texto: "sin sombra", frase: "sin sombreado", familia: "sombreado"}
  ];
  root.SEMILLA.linea = [
    {id: "gruesa", texto: "gruesa", frase: "línea gruesa", familia: "linea"},
    {id: "fina", texto: "fina", frase: "en línea fina", familia: "linea"},
    {id: "variable", texto: "variable", frase: "línea de grosor variable", familia: "linea"},
    {id: "punteada", texto: "punteada", frase: "línea punteada", familia: "linea"},
    {id: "quebrada", texto: "quebrada", frase: "línea quebrada", familia: "linea"},
    {id: "de-color", texto: "de color", frase: "línea de color", familia: "linea"},
    {id: "inexistente", texto: "inexistente", frase: "sin contorno", familia: "linea"},
    {id: "sketch", texto: "sketch", frase: "acabado de boceto", familia: "linea"}
  ];
})(typeof window !== "undefined" ? window : globalThis);
