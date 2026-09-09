import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { colores } from '../../constantes/colores';

/** Nombre con el que se registra la tipografía en `App.tsx`. */
export const FUENTE_LOGO = 'GrandHotel';

type Props = {
  tamano?: number;
  color?: string;
  estilo?: StyleProp<TextStyle>;
};

/**
 * Isologotipo "Instagram" del encabezado.
 * Usa Grand Hotel (Google Fonts), la tipografía libre más parecida a la
 * Billabong original, cargada con `expo-font` al iniciar la app.
 */
export default function LogoInstagram({
  tamano = 30,
  color = colores.textoPrincipal,
  estilo,
}: Props) {
  return (
    <Text
      // Se expone como texto accesible aunque visualmente sea un logo.
      accessibilityRole="header"
      style={[estilos.logo, { fontSize: tamano, color, lineHeight: tamano * 1.25 }, estilo]}
    >
      Instagram
    </Text>
  );
}

const estilos = StyleSheet.create({
  logo: {
    fontFamily: FUENTE_LOGO,
    includeFontPadding: false,
  },
});
