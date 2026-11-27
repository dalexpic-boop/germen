// Genera los íconos PNG de la app (herramienta de desarrollo, sin dependencias).
// Uso: node tools/iconos.js
// Dibuja un brote: una semilla roja con un tallo y dos hojas, sobre fondo de tinta.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const FONDO = [29, 26, 23];
const HUESO = [236, 228, 216];
const ROJO = [205, 72, 52];

// ---------- Figuras en coordenadas normalizadas (0..1) ----------
function elipse(cx, cy, rx, ry, angulo) {
  const c = Math.cos(angulo), s = Math.sin(angulo);
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    const u = (dx * c + dy * s) / rx, v = (-dx * s + dy * c) / ry;
    return u * u + v * v <= 1;
  };
}
// Hoja: intersección de dos círculos (forma de almendra) a lo largo de un eje.
function hoja(x0, y0, x1, y1, ancho) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const L = Math.hypot(x1 - x0, y1 - y0) / 2;
  const r = (L * L + ancho * ancho) / (2 * ancho);
  const nx = -(y1 - y0) / (2 * L), ny = (x1 - x0) / (2 * L);
  const d = r - ancho;
  const c1 = [mx + nx * d, my + ny * d], c2 = [mx - nx * d, my - ny * d];
  return (x, y) => Math.hypot(x - c1[0], y - c1[1]) <= r && Math.hypot(x - c2[0], y - c2[1]) <= r;
}
// Tallo: curva cuadrática con grosor.
function tallo(p0, p1, p2, grosor) {
  const puntos = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    puntos.push([a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]);
  }
  return (x, y) => puntos.some(([px, py]) => Math.hypot(x - px, y - py) <= grosor / 2);
}

// La figura ocupa el 60 % central, dentro de la zona segura de los íconos adaptables.
function escena(escala) {
  const k = (v) => 0.5 + (v - 0.5) * escala;
  const capas = [
    [HUESO, tallo([k(0.5), k(0.66)], [k(0.47), k(0.5)], [k(0.53), k(0.3)], 0.045 * escala)],
    [HUESO, hoja(k(0.49), k(0.47), k(0.22), k(0.33), 0.075 * escala)],
    [HUESO, hoja(k(0.52), k(0.38), k(0.8), k(0.2), 0.085 * escala)],
    [ROJO, elipse(k(0.5), k(0.72), 0.15 * escala, 0.1 * escala, 0)],
  ];
  return (x, y) => {
    let color = FONDO;
    for (const [c, f] of capas) if (f(x, y)) color = c;
    return color;
  };
}

// ---------- PNG ----------
const TABLA_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const td = Buffer.concat([Buffer.from(tipo, "ascii"), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([largo, td, crc]);
}
function png(tam, pintar) {
  const SS = 4; // supermuestreo para suavizar bordes
  const filas = Buffer.alloc((tam * 3 + 1) * tam);
  for (let y = 0; y < tam; y++) {
    filas[y * (tam * 3 + 1)] = 0;
    for (let x = 0; x < tam; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const c = pintar((x + (sx + 0.5) / SS) / tam, (y + (sy + 0.5) / SS) / tam);
        r += c[0]; g += c[1]; b += c[2];
      }
      const o = y * (tam * 3 + 1) + 1 + x * 3;
      filas[o] = Math.round(r / (SS * SS));
      filas[o + 1] = Math.round(g / (SS * SS));
      filas[o + 2] = Math.round(b / (SS * SS));
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(tam, 0);
  ihdr.writeUInt32BE(tam, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo("IHDR", ihdr),
    trozo("IDAT", zlib.deflateSync(filas, { level: 9 })),
    trozo("IEND", Buffer.alloc(0)),
  ]);
}

const dir = path.join(__dirname, "..", "icons");
fs.mkdirSync(dir, { recursive: true });
const salida = [
  ["icono-192.png", 192, 1],
  ["icono-512.png", 512, 1],
  ["icono-maskable-512.png", 512, 0.8],
  ["apple-touch-icon.png", 180, 1],
];
for (const [nombre, tam, escala] of salida) {
  fs.writeFileSync(path.join(dir, nombre), png(tam, escena(escala)));
  console.log(nombre, tam + "px");
}
