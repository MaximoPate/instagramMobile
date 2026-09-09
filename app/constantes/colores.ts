/**
 * Paleta oficial de Instagram (tema claro).
 * Todos los componentes leen los colores desde acá para que la app
 * mantenga una identidad visual consistente y sea fácil de retocar.
 */
export const colores = {
  fondo: '#FFFFFF',
  fondoSecundario: '#FAFAFA',

  textoPrincipal: '#000000',
  textoSecundario: '#737373',
  textoDeshabilitado: '#C7C7C7',

  borde: '#DBDBDB',
  bordeSuave: '#EFEFEF',

  /** Gris de los botones secundarios ("Editar perfil", "Compartir perfil"). */
  botonSecundario: '#EFEFEF',
  /** Azul de acción de Instagram (links, "Seguir", botones primarios). */
  azulAccion: '#0095F6',
  /** Rojo del corazón cuando la publicación tiene "Me gusta". */
  rojoMeGusta: '#FF3040',

  /** Marcador de posición mientras la imagen remota todavía no cargó. */
  placeholderImagen: '#F0F0F0',
} as const;

/**
 * Colores del degradado del anillo de las historias sin ver
 * (amarillo → naranja → fucsia → violeta).
 */
export const degradadoHistoria = ['#FDCB5C', '#F76C1C', '#DA1B60', '#A63EBB'] as const;
