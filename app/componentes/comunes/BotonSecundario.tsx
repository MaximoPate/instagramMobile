import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colores } from '../../constantes/colores';

type Props = {
  texto: string;
  onPress?: () => void;
  /** `true` pinta el botón de azul (acción principal, ej: "Seguir"). */
  destacado?: boolean;
  estilo?: StyleProp<ViewStyle>;
};

/**
 * Botón gris redondeado de Instagram ("Editar perfil", "Compartir perfil").
 * Se comparte entre el perfil y el detalle para no repetir el mismo estilo.
 */
export default function BotonSecundario({ texto, onPress, destacado = false, estilo }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        estilos.boton,
        destacado && estilos.botonDestacado,
        pressed && estilos.presionado,
        estilo,
      ]}
    >
      <Text style={[estilos.texto, destacado && estilos.textoDestacado]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    backgroundColor: colores.botonSecundario,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonDestacado: {
    backgroundColor: colores.azulAccion,
  },
  presionado: {
    opacity: 0.6,
  },
  texto: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoPrincipal,
  },
  textoDestacado: {
    color: colores.fondo,
  },
});
