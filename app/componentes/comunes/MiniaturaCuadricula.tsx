import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { colores } from '../../constantes/colores';

type Props = {
  uri: string;
  /** Lado de la celda, calculado con `ladoCeldaCuadricula()`. */
  lado: number;
  onPress?: () => void;
  /** Dibuja el ícono de "varias fotos" en la esquina, como en Instagram. */
  esCarrusel?: boolean;
  /** Dibuja el ícono de reel en la esquina. */
  esReel?: boolean;
  etiquetaAccesible?: string;
};

/**
 * Celda cuadrada de las cuadrículas de 3 columnas.
 * La comparten la pestaña Buscar y el portafolio del perfil: como recibe el
 * lado por props, el mismo componente sirve para cualquier grilla.
 */
export default function MiniaturaCuadricula({
  uri,
  lado,
  onPress,
  esCarrusel = false,
  esReel = false,
  etiquetaAccesible,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ width: lado, height: lado }, pressed && estilos.presionada]}
      accessibilityRole="imagebutton"
      accessibilityLabel={etiquetaAccesible}
    >
      <Image
        source={{ uri }}
        style={estilos.imagen}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {(esCarrusel || esReel) && (
        <View style={estilos.indicador}>
          <Ionicons
            name={esReel ? 'play' : 'copy-outline'}
            size={14}
            color={colores.fondo}
            // El ícono de copiar de Ionicons viene espejado respecto al de Instagram.
            style={esReel ? undefined : estilos.iconoEspejado}
          />
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  imagen: {
    width: '100%',
    height: '100%',
    backgroundColor: colores.placeholderImagen,
  },
  presionada: {
    opacity: 0.7,
  },
  indicador: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  iconoEspejado: {
    transform: [{ scaleX: -1 }],
  },
});
