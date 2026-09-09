/**
 * Modelos de dominio de la app. Son los "contratos" que viajan por props
 * entre los componentes y por params entre las pantallas.
 */

export type Usuario = {
  /** Nombre de usuario sin arroba, ej: "gato_lover". */
  nombreUsuario: string;
  /** URL remota del avatar. */
  avatar: string;
  /** Cuentas con tilde de verificado azul. */
  verificado?: boolean;
};

export type Comentario = {
  id: string;
  autor: Usuario;
  texto: string;
  /** Texto ya formateado, ej: "2 h" o "3 d". */
  hace: string;
  meGusta: number;
};

export type Publicacion = {
  /** Identificador que devuelve The Cat API; es la key de las FlatList. */
  id: string;
  autor: Usuario;
  /** URL de la imagen del gato. */
  imagen: string;
  /** Relación de aspecto real de la imagen (ancho / alto). */
  relacionAspecto: number;
  ubicacion: string;
  cantidadMeGusta: number;
  /** Pie del posteo. */
  descripcion: string;
  /** Etiquetas que se muestran debajo de la descripción, sin el "#". */
  etiquetas: string[];
  hace: string;
  comentarios: Comentario[];
  /** Estado de la interacción del usuario, vive en el contexto global. */
  meGusta: boolean;
  guardada: boolean;
};

export type Historia = {
  id: string;
  nombreUsuario: string;
  avatar: string;
  /** Si es `true` se dibuja el anillo con degradado. */
  sinVer: boolean;
  /** La primera burbuja del carrusel es la del usuario propio ("Tu historia"). */
  esPropia?: boolean;
};

export type PerfilUsuario = {
  nombreUsuario: string;
  nombreCompleto: string;
  avatar: string;
  biografia: string;
  /** Renglón en gris debajo del nombre, ej: "Fotografía digital". */
  categoria: string;
  enlace: string;
  cantidadPublicaciones: number;
  cantidadSeguidores: number;
  cantidadSeguidos: number;
  destacadas: HistoriaDestacada[];
};

export type HistoriaDestacada = {
  id: string;
  titulo: string;
  portada: string;
};

export type TipoNotificacion = 'meGusta' | 'comentario' | 'seguimiento' | 'mencion';

export type Notificacion = {
  id: string;
  tipo: TipoNotificacion;
  autor: Usuario;
  texto: string;
  hace: string;
  /** Miniatura de la publicación involucrada; las de seguimiento no la tienen. */
  miniatura?: string;
};

export type Reel = {
  id: string;
  autor: Usuario;
  portada: string;
  descripcion: string;
  cantidadMeGusta: number;
  cantidadComentarios: number;
  audio: string;
};
