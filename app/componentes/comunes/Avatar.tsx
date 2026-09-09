import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colores, degradadoHistoria } from '../../constantes/colores';

/** Grosor del anillo que rodea al avatar en las historias. */
const GROSOR_ANILLO = 2;
/** Separación blanca entre el anillo y la foto. */
const RESPIRO_INTERNO = 2;

type TipoAnillo =
  /** Sin borde: feed, comentarios, notificaciones. */
  | 'ninguno'
  /** Degradado naranja-fucsia: historia sin ver. */
  | 'degradado'
  /** Gris claro: historia ya vista. */
  | 'visto';

type Props = {
  /** URL remota de la foto de perfil. */
  uri: string;
  /** Diámetro total del componente en píxeles. */
  tamano: number;
  anillo?: TipoAnillo;
  estilo?: StyleProp<ViewStyle>;
};

/**
 * Foto de perfil circular, con o sin el anillo de historias.
 * Es el átomo visual más reutilizado: aparece en el feed, el carrusel de
 * historias, los comentarios, las notificaciones, los reels y el perfil.
 */
export default function Avatar({ uri, tamano, anillo = 'ninguno', estilo }: Props) {
  const foto = (
    <Image
      source={{ uri }}
      style={[
        estilosCirculo(anillo === 'ninguno' ? tamano : tamano - (GROSOR_ANILLO + RESPIRO_INTERNO) * 2),
        estilos.foto,
      ]}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );

  if (anillo === 'ninguno') {
    return <View style={estilo}>{foto}</View>;
  }

  return (
    <LinearGradient
      // Diagonal, igual que el degradado oficial del anillo de historias.
      colors={anillo === 'degradado' ? [...degradadoHistoria] : [colores.borde, colores.borde]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[estilosCirculo(tamano), estilos.centrado, estilo]}
    >
      <View style={[estilosCirculo(tamano - GROSOR_ANILLO * 2), estilos.centrado, estilos.fondoBlanco]}>
        {foto}
      </View>
    </LinearGradient>
  );
}

/** Devuelve un círculo perfecto para cualquier diámetro. */
function estilosCirculo(diametro: number) {
  return { width: diametro, height: diametro, borderRadius: diametro / 2 };
}

const estilos = StyleSheet.create({
  centrado: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fondoBlanco: {
    backgroundColor: colores.fondo,
  },
  foto: {
    backgroundColor: colores.placeholderImagen,
  },
});
