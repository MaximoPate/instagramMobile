import { StyleSheet, Text, View } from 'react-native';

import { colores } from '../../constantes/colores';
import { formatearNumero } from '../../utilidades/formato';

type Props = {
  /** Número de la métrica (publicaciones, seguidores o seguidos). */
  valor: number;
  etiqueta: string;
};

/**
 * Métrica del encabezado del perfil: el número arriba y su nombre abajo.
 * Se instancia tres veces con distintas props en lugar de repetir el markup.
 */
export default function EstadisticaPerfil({ valor, etiqueta }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.valor}>{formatearNumero(valor)}</Text>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    minWidth: 64,
  },
  valor: {
    fontSize: 17,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  etiqueta: {
    fontSize: 13,
    color: colores.textoPrincipal,
    marginTop: 1,
  },
});
