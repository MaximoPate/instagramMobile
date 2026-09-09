import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores } from '../../constantes/colores';
import { medidas, tipografia } from '../../constantes/medidas';

type Props = {
  titulo: string;
  /** Si se pasa, se dibuja la flecha de volver a la izquierda. */
  onVolver?: () => void;
  /** Contenido opcional alineado a la derecha (íconos de acción). */
  accionDerecha?: React.ReactNode;
};

/**
 * Barra superior reutilizable de las pantallas internas
 * (Notificaciones, Detalle, Editar perfil).
 * El encabezado del feed es distinto y vive en `EncabezadoInicio`.
 */
export default function EncabezadoSimple({ titulo, onVolver, accionDerecha }: Props) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.lateral}>
        {onVolver && (
          <Pressable
            onPress={onVolver}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={28} color={colores.textoPrincipal} />
          </Pressable>
        )}
      </View>

      <Text style={estilos.titulo} numberOfLines={1}>
        {titulo}
      </Text>

      <View style={[estilos.lateral, estilos.lateralDerecho]}>{accionDerecha}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    height: medidas.altoEncabezado,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: medidas.espaciadoHorizontal,
    backgroundColor: colores.fondo,
  },
  // Los dos laterales tienen el mismo ancho mínimo para que el título
  // quede ópticamente centrado aunque de un lado no haya ícono.
  lateral: {
    minWidth: 32,
    justifyContent: 'center',
  },
  lateralDerecho: {
    alignItems: 'flex-end',
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: tipografia.titulo,
    fontWeight: '600',
    color: colores.textoPrincipal,
  },
});
