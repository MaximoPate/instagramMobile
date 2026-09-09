import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Avatar from '../comunes/Avatar';
import { colores } from '../../constantes/colores';
import { medidas } from '../../constantes/medidas';
import type { Historia } from '../../tipos';

type Props = {
  historia: Historia;
  onPress?: (historia: Historia) => void;
};

/**
 * Una burbuja del carrusel de historias.
 * Recibe la historia completa por props y decide sola qué anillo dibujar:
 * degradado si está sin ver, gris si ya se vio, y el botón "+" si es la
 * historia propia del usuario.
 */
export default function BurbujaHistoria({ historia, onPress }: Props) {
  const { nombreUsuario, avatar, sinVer, esPropia } = historia;

  return (
    <Pressable
      onPress={() => onPress?.(historia)}
      style={({ pressed }) => [estilos.contenedor, pressed && estilos.presionado]}
      accessibilityRole="button"
      accessibilityLabel={esPropia ? 'Agregar a tu historia' : `Historia de ${nombreUsuario}`}
    >
      <View>
        <Avatar
          uri={avatar}
          tamano={medidas.avatarHistoria}
          anillo={esPropia ? 'ninguno' : sinVer ? 'degradado' : 'visto'}
        />

        {esPropia && (
          <View style={estilos.botonAgregar}>
            <Ionicons name="add" size={15} color={colores.fondo} />
          </View>
        )}
      </View>

      <Text style={estilos.nombre} numberOfLines={1}>
        {nombreUsuario}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    width: medidas.avatarHistoria + 14,
    alignItems: 'center',
    gap: 5,
  },
  presionado: {
    opacity: 0.6,
  },
  botonAgregar: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colores.azulAccion,
    borderWidth: 2,
    borderColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 11,
    color: colores.textoPrincipal,
    maxWidth: medidas.avatarHistoria + 12,
  },
});
