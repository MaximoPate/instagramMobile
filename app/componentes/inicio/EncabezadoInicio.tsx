import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import LogoInstagram from '../comunes/LogoInstagram';
import { colores } from '../../constantes/colores';
import { medidas } from '../../constantes/medidas';

type Props = {
  /** Cantidad de novedades sin leer; dibuja el globo rojo sobre el corazón. */
  notificacionesSinLeer?: number;
  onAbrirNotificaciones: () => void;
  onAbrirMensajes: () => void;
};

/**
 * Barra superior del feed: isologotipo a la izquierda y los accesos a
 * actividad y mensajes a la derecha, tal cual la app oficial.
 */
export default function EncabezadoInicio({
  notificacionesSinLeer = 0,
  onAbrirNotificaciones,
  onAbrirMensajes,
}: Props) {
  return (
    <View style={estilos.contenedor}>
      <LogoInstagram tamano={30} />

      <View style={estilos.acciones}>
        <Pressable
          onPress={onAbrirNotificaciones}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Actividad"
        >
          <Ionicons name="heart-outline" size={27} color={colores.textoPrincipal} />
          {notificacionesSinLeer > 0 && (
            <View style={estilos.globo}>
              <Text style={estilos.textoGlobo}>
                {notificacionesSinLeer > 9 ? '9+' : notificacionesSinLeer}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={onAbrirMensajes}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Mensajes"
        >
          <Ionicons name="paper-plane-outline" size={25} color={colores.textoPrincipal} />
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    height: medidas.altoEncabezado,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: medidas.espaciadoHorizontal,
    backgroundColor: colores.fondo,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  globo: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: colores.rojoMeGusta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoGlobo: {
    color: colores.fondo,
    fontSize: 10,
    fontWeight: '700',
  },
});
