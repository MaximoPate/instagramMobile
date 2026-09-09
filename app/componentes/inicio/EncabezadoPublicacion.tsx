import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Avatar from '../comunes/Avatar';
import { colores } from '../../constantes/colores';
import { medidas, tipografia } from '../../constantes/medidas';
import type { Publicacion } from '../../tipos';

type Props = {
  autor: Publicacion['autor'];
  ubicacion: string;
  onAbrirOpciones?: () => void;
};

/**
 * Fila superior de la tarjeta: avatar, nombre de usuario (con tilde de
 * verificado si corresponde), ubicación simulada y los tres puntitos.
 */
export default function EncabezadoPublicacion({ autor, ubicacion, onAbrirOpciones }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Avatar uri={autor.avatar} tamano={medidas.avatarPublicacion} anillo="degradado" />

      <View style={estilos.datos}>
        <View style={estilos.filaNombre}>
          <Text style={estilos.nombreUsuario}>{autor.nombreUsuario}</Text>
          {autor.verificado && (
            <MaterialCommunityIcons name="check-decagram" size={13} color={colores.azulAccion} />
          )}
        </View>
        <Text style={estilos.ubicacion} numberOfLines={1}>
          {ubicacion}
        </Text>
      </View>

      <Pressable
        onPress={onAbrirOpciones}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Más opciones"
      >
        <Ionicons name="ellipsis-horizontal" size={18} color={colores.textoPrincipal} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: medidas.espaciadoHorizontal,
    paddingVertical: 8,
  },
  datos: {
    flex: 1,
  },
  filaNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nombreUsuario: {
    fontSize: tipografia.nombreUsuario,
    fontWeight: '600',
    color: colores.textoPrincipal,
  },
  ubicacion: {
    fontSize: 11,
    color: colores.textoPrincipal,
    marginTop: 1,
  },
});
