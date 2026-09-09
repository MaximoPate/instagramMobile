import { Dimensions } from 'react-native';

const { width: anchoPantalla } = Dimensions.get('window');

/**
 * Espaciados, tamaños y tipografías tomados de la app oficial de Instagram.
 * Centralizarlos evita "números mágicos" repartidos por los StyleSheet y
 * garantiza que los márgenes y paddings sean simétricos en toda la app.
 */
export const medidas = {
  anchoPantalla,

  /** Padding horizontal estándar del contenido (encabezados, textos del feed). */
  espaciadoHorizontal: 12,
  espaciadoChico: 8,
  espaciadoMedio: 16,

  /** Alto de las barras superior e inferior. */
  altoEncabezado: 44,
  altoBarraPestanas: 52,

  avatarPublicacion: 32,
  avatarHistoria: 62,
  avatarPerfil: 86,

  iconoAccion: 26,
  iconoPestana: 26,

  /** Separación de 1px entre las celdas de las cuadrículas de 3 columnas. */
  separacionCuadricula: 1.5,
} as const;

export const tipografia = {
  nombreUsuario: 13,
  cuerpo: 13,
  secundario: 12,
  titulo: 16,
} as const;

/**
 * Lado exacto de cada celda para una cuadrícula de N columnas,
 * descontando las separaciones internas. Evita el desbordamiento
 * horizontal cuando la división no da un entero.
 */
export function ladoCeldaCuadricula(columnas: number, separacion = medidas.separacionCuadricula) {
  return (anchoPantalla - separacion * (columnas - 1)) / columnas;
}
