// Relaciones (LISTAS.md §6). Plantillas: {A}, {B}, {o:A}, {pron:A}, {B:plural}. requiere.B: B cumple si está en alguna de las familias o de los ids.
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  root.SEMILLA.relaciones = [
    {id: "con", texto: "con", familia: "relacion", peso: 3, plantilla: "{A} con {B}"},
    {id: "atravesado-por", texto: "atravesado por", familia: "relacion", plantilla: "{A} atravesad{o:A} por {B}"},
    {id: "enroscado-en", texto: "enroscado en", familia: "relacion", plantilla: "{B} enroscad{o:B} en {A}", requiere: {B: {ids: ["serpiente", "cobra", "serpiente-emplumada", "basilisco", "hidra", "dragon", "wyvern", "kraken", "pulpo", "morena", "medusa", "ciempies", "ouroboros", "hiedra", "pasiflora", "rama-de-espinas", "raices", "cadena", "soga-de-horca", "rosario", "collar-de-perlas", "trenza", "red-de-pesca"]}}},
    {id: "dentro-de", texto: "dentro de", familia: "relacion", plantilla: "{B} dentro de {A}"},
    {id: "sosteniendo", texto: "sosteniendo", familia: "relacion", plantilla: "{A} sosteniendo {B}", requiere: {A: "animado"}},
    {id: "brotando-de", texto: "brotando de", familia: "relacion", plantilla: "{A} con {B} brotando de {pron:A}"},
    {id: "saliendo-de", texto: "saliendo de", familia: "relacion", plantilla: "{A} con {B} saliendo de {pron:A}"},
    {id: "coronado-por", texto: "coronado por", familia: "relacion", plantilla: "{A} coronad{o:A} por {B}"},
    {id: "encadenado-a", texto: "encadenado a", familia: "relacion", plantilla: "{A} encadenad{o:A} a {B}"},
    {id: "protegido-por", texto: "protegido por", familia: "relacion", plantilla: "{A} protegid{o:A} por {B}"},
    {id: "devorando", texto: "devorando", familia: "relacion", plantilla: "{A} devorando {B}", requiere: {A: "animado"}},
    {id: "enfrentado-a", texto: "enfrentado a", familia: "relacion", plantilla: "{A} enfrentad{o:A} a {B}", requiere: {A: "animado"}},
    {id: "cuyo-reflejo-es", texto: "cuyo reflejo es", familia: "relacion", plantilla: "{A} cuyo reflejo es {B}"},
    {id: "partido-por", texto: "partido por", familia: "relacion", plantilla: "{A} partid{o:A} por {B}", requiere: {B: {familias: ["armas-blancas-y-de-asta", "armas-a-distancia-de-fuego-y-asedio"]}}},
    {id: "oculto-tras", texto: "oculto tras", familia: "relacion", plantilla: "{A} ocult{o:A} tras {B}"},
    {id: "formado-por", texto: "formado por", familia: "relacion", plantilla: "{A} formad{o:A} por {B:plural}"}
  ];
})(typeof window !== "undefined" ? window : globalThis);
