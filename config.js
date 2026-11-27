// Probabilidades y parámetros editables del generador (SPEC.md §7).
(function (root) {
  root.SEMILLA = root.SEMILLA || {};
  root.SEMILLA.config = {
    densidad: {
      escueta: {
        secundario: 0.3,
        estado: 0.3,
        conceptos: 1,
        par: 0,
        universo: 0.3,
        universoSinElemento: 1,
        tratamiento: [1, 2],
        foco: { lucir: 0, reto: 1 },
        formato: 0
      },
      completa: {
        secundario: 0.8,
        estado: 0.5,
        conceptos: 2,
        par: 0.2,
        universo: 1,
        universoSinElemento: 1,
        tratamiento: [2, 3],
        foco: { lucir: 1, reto: 1 },
        formato: 0.3
      }
    },
    zonaEnPiel: 1,
    probElementos: { alta: 0.9, media: 0.6, baja: 0.3 },
    secundarioContraste: 2 / 3,
    ventanaRecientes: 15,
    factorRecientes: 0.25
  };
})(typeof window !== "undefined" ? window : globalThis);
