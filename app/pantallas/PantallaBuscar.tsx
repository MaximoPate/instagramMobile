import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MiniaturaCuadricula from '../componentes/comunes/MiniaturaCuadricula';
import { colores } from '../constantes/colores';
import { ladoCeldaCuadricula, medidas } from '../constantes/medidas';
import { usePublicaciones } from '../contexto/ContextoPublicaciones';
import type { Publicacion } from '../tipos';

const COLUMNAS = 3;
const LADO_CELDA = ladoCeldaCuadricula(COLUMNAS);

/**
 * Pestaña Explorar: buscador por usuario o etiqueta y mosaico de 3 columnas
 * con todas las publicaciones cargadas desde la API.
 */
export default function PantallaBuscar() {
  const navegacion = useNavigation();
  const { publicaciones, cargando } = usePublicaciones();

  // Estado LOCAL: el texto tipeado sólo lo necesita esta pantalla.
  const [busqueda, setBusqueda] = useState('');

  /**
   * El filtrado se memoiza para no recorrer la lista completa en cada
   * re-render, sólo cuando cambia el texto o llegan publicaciones nuevas.
   */
  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return publicaciones;

    return publicaciones.filter(
      ({ autor, etiquetas, ubicacion }) =>
        autor.nombreUsuario.toLowerCase().includes(termino) ||
        ubicacion.toLowerCase().includes(termino) ||
        etiquetas.some((etiqueta) => etiqueta.toLowerCase().includes(termino)),
    );
  }, [busqueda, publicaciones]);

  const renderizarCelda = useCallback(
    ({ item, index }: { item: Publicacion; index: number }) => (
      <MiniaturaCuadricula
        uri={item.imagen}
        lado={LADO_CELDA}
        // Cada cuarta celda muestra el ícono de carrusel, como en Explorar.
        esCarrusel={index % 4 === 1}
        etiquetaAccesible={`Publicación de ${item.autor.nombreUsuario}`}
        onPress={() => navegacion.navigate('DetallePublicacion', { idPublicacion: item.id })}
      />
    ),
    [navegacion],
  );

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <View style={estilos.contenedorBuscador}>
        <View style={estilos.buscador}>
          <Ionicons name="search" size={16} color={colores.textoSecundario} />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar"
            placeholderTextColor={colores.textoSecundario}
            style={estilos.entrada}
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      {cargando ? (
        <View style={estilos.centrado}>
          <ActivityIndicator color={colores.textoSecundario} />
        </View>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(publicacion) => publicacion.id}
          renderItem={renderizarCelda}
          numColumns={COLUMNAS}
          columnWrapperStyle={estilos.fila}
          contentContainerStyle={estilos.grilla}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={estilos.sinResultados}>No encontramos nada para “{busqueda}”.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenedorBuscador: {
    paddingHorizontal: medidas.espaciadoHorizontal,
    paddingVertical: 8,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colores.bordeSuave,
  },
  entrada: {
    flex: 1,
    fontSize: 14,
    color: colores.textoPrincipal,
    padding: 0,
  },
  // La separación entre celdas se resuelve con `gap` para que las tres
  // columnas queden simétricas y no sobre ni falte un píxel al costado.
  fila: {
    gap: medidas.separacionCuadricula,
  },
  grilla: {
    gap: medidas.separacionCuadricula,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinResultados: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 14,
    color: colores.textoSecundario,
  },
});
