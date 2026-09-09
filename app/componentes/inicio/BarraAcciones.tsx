import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colores } from '../../constantes/colores';
import { medidas } from '../../constantes/medidas';

type Props = {
  meGusta: boolean;
  guardada: boolean;
  onMeGusta: () => void;
  onComentar: () => void;
  onCompartir: () => void;
  onGuardar: () => void;
};

/**
 * Barra interactiva de la publicación: Me gusta, Comentar y Compartir a la
 * izquierda, Guardar a la derecha. No guarda estado propio: recibe el valor
 * actual y avisa hacia arriba con los callbacks (componente controlado).
 */
export default function BarraAcciones({
  meGusta,
  guardada,
  onMeGusta,
  onComentar,
  onCompartir,
  onGuardar,
}: Props) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.grupoIzquierdo}>
        <Pressable
          onPress={onMeGusta}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={meGusta ? 'Quitar Me gusta' : 'Me gusta'}
        >
          <Ionicons
            name={meGusta ? 'heart' : 'heart-outline'}
            size={medidas.iconoAccion}
            color={meGusta ? colores.rojoMeGusta : colores.textoPrincipal}
          />
        </Pressable>

        <Pressable
          onPress={onComentar}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Comentar"
        >
          <Ionicons
            name="chatbubble-outline"
            size={medidas.iconoAccion - 2}
            color={colores.textoPrincipal}
            style={estilos.globoComentario}
          />
        </Pressable>

        <Pressable
          onPress={onCompartir}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Compartir"
        >
          <Ionicons
            name="paper-plane-outline"
            size={medidas.iconoAccion - 2}
            color={colores.textoPrincipal}
          />
        </Pressable>
      </View>

      <Pressable
        onPress={onGuardar}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={guardada ? 'Quitar de guardados' : 'Guardar'}
      >
        <Ionicons
          name={guardada ? 'bookmark' : 'bookmark-outline'}
          size={medidas.iconoAccion - 2}
          color={colores.textoPrincipal}
        />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: medidas.espaciadoHorizontal,
    paddingTop: 10,
    paddingBottom: 6,
  },
  grupoIzquierdo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  // El globo de comentario de Instagram está espejado respecto al de Ionicons.
  globoComentario: {
    transform: [{ scaleX: -1 }],
  },
});
