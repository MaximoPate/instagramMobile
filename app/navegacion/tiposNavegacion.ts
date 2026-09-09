import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Contratos de navegación tipados.
 * Definir acá los params hace que TypeScript verifique cada `navigate()` y
 * que `route.params` llegue tipado a la pantalla de destino.
 */

/** Pestañas inferiores. Ninguna recibe parámetros. */
export type ParametrosPestanas = {
  Inicio: undefined;
  Buscar: undefined;
  Reels: undefined;
  Notificaciones: undefined;
  Perfil: undefined;
};

/** Stack raíz: contiene las pestañas y las pantallas que se apilan encima. */
export type ParametrosStackPrincipal = {
  Pestanas: NavigatorScreenParams<ParametrosPestanas>;
  /**
   * Detalle de una publicación. Se envía sólo el id y el detalle lee el
   * objeto completo del contexto global, así el "Me gusta" que se toca en el
   * detalle queda reflejado al volver al feed.
   */
  DetallePublicacion: { idPublicacion: string; tituloEncabezado?: string };
  /** Se presenta como modal desde el botón "Editar perfil". */
  EditarPerfil: undefined;
};

export type PropsPantallaStack<Pantalla extends keyof ParametrosStackPrincipal> =
  NativeStackScreenProps<ParametrosStackPrincipal, Pantalla>;

export type PropsPantallaPestana<Pantalla extends keyof ParametrosPestanas> = BottomTabScreenProps<
  ParametrosPestanas,
  Pantalla
>;

// Hace que `useNavigation()` sin genéricos ya conozca las rutas del stack raíz.
declare global {
  namespace ReactNavigation {
    // La interfaz vacía es a propósito: sólo extiende el tipo global de
    // React Navigation con nuestras rutas.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends ParametrosStackPrincipal {}
  }
}
