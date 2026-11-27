// Estados (LISTAS.md §5): formas m, f, mp, fp y exclusiones.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  root.SEMILLA.estados = [
    {id: "oxidado", texto: "oxidado", familia: "estado", formas: {m: "oxidado", f: "oxidada", mp: "oxidados", fp: "oxidadas"}, excluir: {familias: [], ids: []}},
    {id: "roto", texto: "roto", familia: "estado", formas: {m: "roto", f: "rota", mp: "rotos", fp: "rotas"}, excluir: {familias: [], ids: []}},
    {id: "agrietado", texto: "agrietado", familia: "estado", formas: {m: "agrietado", f: "agrietada", mp: "agrietados", fp: "agrietadas"}, excluir: {familias: [], ids: []}},
    {id: "en-llamas", texto: "en llamas", familia: "estado", formas: {m: "en llamas", f: "en llamas", mp: "en llamas", fp: "en llamas"}, excluir: {familias: [], ids: []}},
    {id: "derretido", texto: "derretido", familia: "estado", formas: {m: "derretido", f: "derretida", mp: "derretidos", fp: "derretidas"}, excluir: {familias: [], ids: []}},
    {id: "congelado", texto: "congelado", familia: "estado", formas: {m: "congelado", f: "congelada", mp: "congelados", fp: "congeladas"}, excluir: {familias: [], ids: []}},
    {id: "petrificado", texto: "petrificado", familia: "estado", formas: {m: "petrificado", f: "petrificada", mp: "petrificados", fp: "petrificadas"}, excluir: {familias: [], ids: []}},
    {id: "dorado", texto: "dorado", familia: "estado", formas: {m: "dorado", f: "dorada", mp: "dorados", fp: "doradas"}, excluir: {familias: [], ids: []}},
    {id: "cubierto-de-musgo", texto: "cubierto de musgo", familia: "estado", formas: {m: "cubierto de musgo", f: "cubierta de musgo", mp: "cubiertos de musgo", fp: "cubiertas de musgo"}, excluir: {familias: [], ids: []}},
    {id: "florecido", texto: "florecido", familia: "estado", formas: {m: "florecido", f: "florecida", mp: "florecidos", fp: "florecidas"}, excluir: {familias: ["botanica"], ids: []}},
    {id: "envuelto-en-espinas", texto: "envuelto en espinas", familia: "estado", formas: {m: "envuelto en espinas", f: "envuelta en espinas", mp: "envueltos en espinas", fp: "envueltas en espinas"}, excluir: {familias: [], ids: []}},
    {id: "encadenado", texto: "encadenado", familia: "estado", formas: {m: "encadenado", f: "encadenada", mp: "encadenados", fp: "encadenadas"}, excluir: {familias: [], ids: []}},
    {id: "vendado", texto: "vendado", familia: "estado", formas: {m: "vendado", f: "vendada", mp: "vendados", fp: "vendadas"}, excluir: {familias: [], ids: []}},
    {id: "cosido", texto: "cosido", familia: "estado", formas: {m: "cosido", f: "cosida", mp: "cosidos", fp: "cosidas"}, excluir: {familias: [], ids: []}},
    {id: "sangrante", texto: "sangrante", familia: "estado", formas: {m: "sangrante", f: "sangrante", mp: "sangrantes", fp: "sangrantes"}, excluir: {familias: [], ids: []}},
    {id: "marchito", texto: "marchito", familia: "estado", formas: {m: "marchito", f: "marchita", mp: "marchitos", fp: "marchitas"}, excluir: {familias: [], ids: []}},
    {id: "hueco", texto: "hueco", familia: "estado", formas: {m: "hueco", f: "hueca", mp: "huecos", fp: "huecas"}, excluir: {familias: [], ids: []}},
    {id: "en-ruinas", texto: "en ruinas", familia: "estado", formas: {m: "en ruinas", f: "en ruinas", mp: "en ruinas", fp: "en ruinas"}, excluir: {familias: [], ids: []}},
    {id: "fragmentado", texto: "fragmentado", familia: "estado", formas: {m: "fragmentado", f: "fragmentada", mp: "fragmentados", fp: "fragmentadas"}, excluir: {familias: [], ids: []}},
    {id: "deshaciendose-en-humo", texto: "deshaciéndose en humo", familia: "estado", formas: {m: "deshaciéndose en humo", f: "deshaciéndose en humo", mp: "deshaciéndose en humo", fp: "deshaciéndose en humo"}, excluir: {familias: [], ids: []}},
    {id: "iluminado-desde-dentro", texto: "iluminado desde dentro", familia: "estado", formas: {m: "iluminado desde dentro", f: "iluminada desde dentro", mp: "iluminados desde dentro", fp: "iluminadas desde dentro"}, excluir: {familias: [], ids: []}},
    {id: "con-ojos", texto: "con ojos", familia: "estado", formas: {m: "con ojos", f: "con ojos", mp: "con ojos", fp: "con ojos"}, excluir: {familias: [], ids: ["ojo", "ojo-llorando", "ojo-de-la-providencia", "ojo-de-horus", "mano-con-ojo-en-la-palma"]}},
    {id: "alado", texto: "alado", familia: "estado", formas: {m: "alado", f: "alada", mp: "alados", fp: "aladas"}, excluir: {familias: ["aves", "insectos-y-aracnidos"], ids: []}},
    {id: "mecanico", texto: "mecánico", familia: "estado", formas: {m: "mecánico", f: "mecánica", mp: "mecánicos", fp: "mecánicas"}, excluir: {familias: ["mecanismos-tiempo-y-ciencia"], ids: []}},
    {id: "translucido", texto: "translúcido", familia: "estado", formas: {m: "translúcido", f: "translúcida", mp: "translúcidos", fp: "translúcidas"}, excluir: {familias: [], ids: []}}
  ];
})(typeof window !== "undefined" ? window : globalThis);
