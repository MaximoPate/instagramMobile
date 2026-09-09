import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colores } from '../../constantes/colores';

export type PestanaPerfil = 'publicaciones' | 'reels' | 'etiquetadas';

/** Definición de cada pestaña: qué ícono mostrar y cómo se lee en voz alta. */
const PESTANAS: { clave: PestanaPerfil; icono: keyof typeof Ionicons.glyphMap; etiqueta: string }[] = [
  { clave: 'publicaciones', icono: 'grid-outline', etiqueta: 'Publicaciones' },
  { clave: 'reels', icono: 'play-circle-outline', etiqueta: 'Reels' },
  { clave: 'etiquetadas', icono: 'person-outline', etiqueta: 'Etiquetadas' },
];

type Props = {
  activa: PestanaPerfil;
  onCambiar: (pestana: PestanaPerfil) => void;
};

/**
 * Tira de pestañas del perfil (cuadrícula / reels / etiquetadas).
 * La pestaña activa se subraya con una línea negra, igual que en la app.
 */
export default function SelectorPestanasPerfil({ activa, onCambiar }: Props) {
  return (
    <View style={estilos.contenedor}>
      {PESTANAS.map(({ clave, icono, etiqueta }) => {
        const estaActiva = clave === activa;

        return (
          <Pressable
            key={clave}
            onPress={() => onCambiar(clave)}
            style={[estilos.pestana, estaActiva && estilos.pestanaActiva]}
            accessibilityRole="tab"
            accessibilityState={{ selected: estaActiva }}
            accessibilityLabel={etiqueta}
          >
            <Ionicons
              name={icono}
              size={24}
              color={estaActiva ? colores.textoPrincipal : colores.textoSecundario}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
    backgroundColor: colores.fondo,
  },
  pestana: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  pestanaActiva: {
    borderBottomColor: colores.textoPrincipal,
  },
});
