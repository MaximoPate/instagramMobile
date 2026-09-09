import { FlatList, StyleSheet, View } from 'react-native';

import BurbujaHistoria from './BurbujaHistoria';
import { colores } from '../../constantes/colores';
import { medidas } from '../../constantes/medidas';
import type { Historia } from '../../tipos';

type Props = {
  historias: Historia[];
};

/**
 * Carrusel horizontal de historias que se monta como cabecera del feed.
 * También usa FlatList (con `horizontal`) en lugar de un ScrollView con
 * `.map()`, para reciclar las burbujas igual que la lista principal.
 */
export default function CarruselHistorias({ historias }: Props) {
  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={historias}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(historia) => historia.id}
        contentContainerStyle={estilos.contenido}
        ItemSeparatorComponent={() => <View style={estilos.separador} />}
        renderItem={({ item }) => <BurbujaHistoria historia={item} />}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
    backgroundColor: colores.fondo,
  },
  contenido: {
    paddingHorizontal: medidas.espaciadoChico,
    paddingTop: 8,
    paddingBottom: 10,
  },
  separador: {
    width: 6,
  },
});
