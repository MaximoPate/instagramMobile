/**
 * Generador de los recursos gráficos de la app (icono, splash y favicon).
 *
 * Dibuja el isotipo de la cámara de Instagram por código, sin librerías
 * externas: calcula la distancia de cada píxel a las figuras (rectángulo
 * redondeado, círculo y punto), la usa para antialiasing y escribe el PNG
 * a mano con `zlib`.
 *
 * Uso:  node herramientas/generarIconos.js
 */

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const CARPETA_SALIDA = path.join(__dirname, '..', 'assets', 'imagenes');

/** Paradas del degradado oficial de Instagram, desde abajo a la izquierda. */
const DEGRADADO = [
  { posicion: 0.0, color: [253, 244, 151] },
  { posicion: 0.25, color: [253, 89, 73] },
  { posicion: 0.5, color: [214, 36, 159] },
  { posicion: 0.75, color: [150, 47, 191] },
  { posicion: 1.0, color: [40, 90, 235] },
];

// --------------------------------------------------------------------------
// Utilidades de dibujo
// --------------------------------------------------------------------------

const limitar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo);

/** Distancia con signo de un punto al borde de un rectángulo redondeado. */
function distanciaRectanguloRedondeado(x, y, centroX, centroY, medioLado, radio) {
  const dx = Math.abs(x - centroX) - (medioLado - radio);
  const dy = Math.abs(y - centroY) - (medioLado - radio);
  const fueraX = Math.max(dx, 0);
  const fueraY = Math.max(dy, 0);

  return Math.hypot(fueraX, fueraY) + Math.min(Math.max(dx, dy), 0) - radio;
}

/** Distancia con signo de un punto al borde de un círculo. */
function distanciaCirculo(x, y, centroX, centroY, radio) {
  return Math.hypot(x - centroX, y - centroY) - radio;
}

/** Convierte una distancia en cobertura 0..1, generando el antialiasing. */
function cobertura(distancia) {
  return limitar(0.5 - distancia, 0, 1);
}

/** Color del degradado en la posición `t` (0..1) interpolando entre paradas. */
function colorDelDegradado(t) {
  const posicion = limitar(t, 0, 1);

  for (let i = 1; i < DEGRADADO.length; i++) {
    const anterior = DEGRADADO[i - 1];
    const siguiente = DEGRADADO[i];

    if (posicion <= siguiente.posicion) {
      const tramo = (posicion - anterior.posicion) / (siguiente.posicion - anterior.posicion);
      return anterior.color.map((canal, indice) =>
        Math.round(canal + (siguiente.color[indice] - canal) * tramo),
      );
    }
  }

  return DEGRADADO[DEGRADADO.length - 1].color;
}

/**
 * Cobertura del isotipo (cámara) en un píxel: es la unión del contorno del
 * rectángulo redondeado, el contorno del círculo y el punto del visor.
 */
function coberturaIsotipo(x, y, lado, escala) {
  const centro = lado / 2;
  const medioLado = 300 * escala;
  const radioEsquina = 92 * escala;
  const grosor = 62 * escala;
  const radioCirculo = 148 * escala;
  const desplazamientoPunto = 186 * escala;
  const radioPunto = 36 * escala;

  // Contorno del cuerpo de la cámara: se toma el valor absoluto de la
  // distancia para convertir la figura rellena en un anillo del grosor pedido.
  const marco =
    Math.abs(distanciaRectanguloRedondeado(x, y, centro, centro, medioLado, radioEsquina)) -
    grosor / 2;

  const lente = Math.abs(distanciaCirculo(x, y, centro, centro, radioCirculo)) - grosor / 2;

  const punto = distanciaCirculo(
    x,
    y,
    centro + desplazamientoPunto,
    centro - desplazamientoPunto,
    radioPunto,
  );

  return Math.max(cobertura(marco), cobertura(lente), cobertura(punto));
}

// --------------------------------------------------------------------------
// Escritura del PNG (RGBA de 8 bits, sin dependencias)
// --------------------------------------------------------------------------

function fragmentoPng(tipo, datos) {
  const longitud = Buffer.alloc(4);
  longitud.writeUInt32BE(datos.length, 0);

  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(calcularCrc32(cuerpo), 0);

  return Buffer.concat([longitud, cuerpo, crc]);
}

const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);

  for (let n = 0; n < 256; n++) {
    let valor = n;
    for (let k = 0; k < 8; k++) {
      valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1;
    }
    tabla[n] = valor >>> 0;
  }

  return tabla;
})();

function calcularCrc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = TABLA_CRC[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function escribirPng(rutaSalida, lado, pixeles) {
  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(lado, 0);
  cabecera.writeUInt32BE(lado, 4);
  cabecera[8] = 8; // 8 bits por canal
  cabecera[9] = 6; // RGBA
  cabecera[10] = 0; // compresión deflate
  cabecera[11] = 0; // filtro adaptativo
  cabecera[12] = 0; // sin entrelazado

  // Cada scanline lleva adelante un byte de filtro (0 = sin filtro).
  const crudo = Buffer.alloc(lado * (lado * 4 + 1));
  for (let fila = 0; fila < lado; fila++) {
    const origen = fila * lado * 4;
    const destino = fila * (lado * 4 + 1);
    crudo[destino] = 0;
    pixeles.copy(crudo, destino + 1, origen, origen + lado * 4);
  }

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    fragmentoPng('IHDR', cabecera),
    fragmentoPng('IDAT', zlib.deflateSync(crudo, { level: 9 })),
    fragmentoPng('IEND', Buffer.alloc(0)),
  ]);

  fs.writeFileSync(rutaSalida, png);
  console.log(`✓ ${path.relative(process.cwd(), rutaSalida)} (${lado}×${lado})`);
}

// --------------------------------------------------------------------------
// Composición de cada recurso
// --------------------------------------------------------------------------

/**
 * @param {object} opciones
 * @param {'degradado'|'transparente'} opciones.fondo
 * @param {'blanco'|'degradado'} opciones.isotipo
 * @param {number} opciones.escala  Tamaño del isotipo respecto del lienzo.
 */
function componer(lado, { fondo, isotipo, escala }) {
  const pixeles = Buffer.alloc(lado * lado * 4);
  const referencia = lado / 1024;
  const escalaIsotipo = referencia * escala;

  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      const indice = (y * lado + x) * 4;

      // Eje del degradado: diagonal desde abajo-izquierda (amarillo) hacia
      // arriba-derecha (azul), igual que el isologotipo oficial.
      const t = (x / lado) * 0.5 + (1 - y / lado) * 0.5;
      const [r, g, b] = colorDelDegradado(t);

      // Con escala 0 se genera sólo el fondo (capa de atrás del icono adaptativo).
      const alfaIsotipo = escala > 0 ? coberturaIsotipo(x, y, lado, escalaIsotipo) : 0;

      if (fondo === 'degradado') {
        // Fondo con el degradado y el isotipo calado en blanco encima.
        pixeles[indice] = Math.round(r + (255 - r) * alfaIsotipo);
        pixeles[indice + 1] = Math.round(g + (255 - g) * alfaIsotipo);
        pixeles[indice + 2] = Math.round(b + (255 - b) * alfaIsotipo);
        pixeles[indice + 3] = 255;
      } else {
        // Sólo el isotipo, con el resto transparente.
        const [cr, cg, cb] = isotipo === 'blanco' ? [255, 255, 255] : [r, g, b];
        pixeles[indice] = cr;
        pixeles[indice + 1] = cg;
        pixeles[indice + 2] = cb;
        pixeles[indice + 3] = Math.round(alfaIsotipo * 255);
      }
    }
  }

  return pixeles;
}

function generar() {
  fs.mkdirSync(CARPETA_SALIDA, { recursive: true });

  const recursos = [
    // Icono de la app: degradado a sangre con la cámara calada en blanco.
    { nombre: 'icono.png', lado: 1024, opciones: { fondo: 'degradado', escala: 1 } },
    // Splash: sólo el isotipo en degradado sobre el fondo blanco del plugin.
    { nombre: 'splash.png', lado: 1024, opciones: { fondo: 'transparente', isotipo: 'degradado', escala: 1 } },
    // Android adaptativo: el isotipo va más chico para respetar la zona segura.
    { nombre: 'android-icono-frente.png', lado: 1024, opciones: { fondo: 'transparente', isotipo: 'blanco', escala: 0.68 } },
    { nombre: 'android-icono-fondo.png', lado: 1024, opciones: { fondo: 'degradado', escala: 0 } },
    { nombre: 'android-icono-monocromo.png', lado: 1024, opciones: { fondo: 'transparente', isotipo: 'blanco', escala: 0.68 } },
    { nombre: 'favicon.png', lado: 128, opciones: { fondo: 'degradado', escala: 1 } },
  ];

  for (const { nombre, lado, opciones } of recursos) {
    escribirPng(path.join(CARPETA_SALIDA, nombre), lado, componer(lado, opciones));
  }
}

generar();
