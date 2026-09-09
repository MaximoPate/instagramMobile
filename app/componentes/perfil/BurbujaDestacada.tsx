import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores } from '../../constantes/colores';
import type { HistoriaDestacada } from '../../tipos';

/** Diámetro de la portada de cada historia destacada. */
const DIAMETRO = 62;

type Props = {
  destacada: HistoriaDestacada;
  onPress?: () => void;
};

/** Historia destacada del perfil: portada circular con borde gris y su título. */
export default function BurbujaDestacada({ destacada, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.contenedor, pressed && estilos.presionada]}
      accessibilityRole="button"
      accessibilityLabel={`Historia destacada ${destacada.titulo}`}
    >
      <Image
        source={{ uri: destacada.portada }}
        style={estilos.portada}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={estilos.titulo} numberOfLines={1}>
        {destacada.titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    width: DIAMETRO + 12,
    alignItems: 'center',
    gap: 5,
  },
  presionada: {
    opacity: 0.6,
  },
  portada: {
    width: DIAMETRO,
    height: DIAMETRO,
    borderRadius: DIAMETRO / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.borde,
    backgroundColor: colores.placeholderImagen,
  },
  titulo: {
    fontSize: 12,
    color: colores.textoPrincipal,
  },
});
