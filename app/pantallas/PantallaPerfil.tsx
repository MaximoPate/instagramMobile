import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MiniaturaCuadricula from '../componentes/comunes/MiniaturaCuadricula';
import EncabezadoPerfil from '../componentes/perfil/EncabezadoPerfil';
import SelectorPestanasPerfil, {
  type PestanaPerfil,
} from '../componentes/perfil/SelectorPestanasPerfil';
import { colores } from '../constantes/colores';
import { ladoCeldaCuadricula, medidas } from '../constantes/medidas';
import { usePublicaciones } from '../contexto/ContextoPublicaciones';
import { perfilPropio } from '../datos/perfilPropio';
import type { Publicacion } from '../tipos';


/** La consigna pide exactamente 3 columnas simétricas. */
const COLUMNAS = 3;

/**
 * Perfil emulado del usuario activo.
 *
 * Toda la pantalla es UNA sola FlatList de 3 columnas: el bloque de datos y
 * las pestañas van como `ListHeaderComponent`. Así se evita anidar una lista
 * dentro de un ScrollView (que rompe el reciclado de vistas) y el scroll
 * queda continuo entre la biografía y el portafolio.
 */
export default function PantallaPerfil() {
  const navegacion = useNavigation();
  const { publicaciones, cargando } = usePublicaciones();
  const { width } = useWindowDimensions(); 


  // Estado LOCAL: qué solapa del portafolio se está mirando.
  const [pestanaActiva, setPestanaActiva] = useState<PestanaPerfil>('publicaciones');

  const ladoCelda = useMemo(() => ladoCeldaCuadricula(width, COLUMNAS), [width]);

  /**
   * Cada solapa muestra un recorte distinto del mismo set de publicaciones:
   * es contenido simulado, pero permite que las tres pestañas respondan.
   */
  const publicacionesVisibles = useMemo(() => {
    if (pestanaActiva === 'reels') return publicaciones.filter((_, indice) => indice % 3 === 0);
    if (pestanaActiva === 'etiquetadas') return publicaciones.filter((_, indice) => indice % 4 === 1);
    return publicaciones;
  }, [pestanaActiva, publicaciones]);

  const renderizarCelda = useCallback(
    ({ item, index }: { item: Publicacion; index: number }) => (
      <MiniaturaCuadricula
        uri={item.imagen}
        lado={ladoCelda}
        esReel={pestanaActiva === 'reels'}
        esCarrusel={pestanaActiva !== 'reels' && index % 5 === 2}
        etiquetaAccesible={`Publicación de ${item.autor.nombreUsuario}`}
        onPress={() => navegacion.navigate('DetallePublicacion', { idPublicacion: item.id })}
      />
    ),
    [navegacion, pestanaActiva, ladoCelda],
  );

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <View style={estilos.encabezado}>
        <View style={estilos.tituloUsuario}>
          <Ionicons name="lock-closed-outline" size={15} color={colores.textoPrincipal} />
          <Text style={estilos.nombreUsuario}>{perfilPropio.nombreUsuario}</Text>
          <Ionicons name="chevron-down" size={15} color={colores.textoPrincipal} />
        </View>

        <View style={estilos.accionesEncabezado}>
          <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Crear">
            <Ionicons name="add-circle-outline" size={26} color={colores.textoPrincipal} />
          </Pressable>
          <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Menú">
            <Ionicons name="menu-outline" size={28} color={colores.textoPrincipal} />
          </Pressable>
        </View>
      </View>

      {cargando ? (
        <View style={estilos.centrado}>
          <ActivityIndicator color={colores.textoSecundario} />
        </View>
      ) : (
        <FlatList
          data={publicacionesVisibles}
          keyExtractor={(publicacion) => publicacion.id}
          renderItem={renderizarCelda}
          numColumns={COLUMNAS}
          columnWrapperStyle={estilos.fila}
          contentContainerStyle={estilos.grilla}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <EncabezadoPerfil
                perfil={perfilPropio}
                cantidadPublicaciones={publicaciones.length}
                onEditarPerfil={() => navegacion.navigate('EditarPerfil')}
                onCompartirPerfil={() => {}}
              />
              <SelectorPestanasPerfil activa={pestanaActiva} onCambiar={setPestanaActiva} />
            </>
          }
          ListEmptyComponent={
            <Text style={estilos.sinContenido}>Todavía no hay publicaciones acá.</Text>
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
  encabezado: {
    height: medidas.altoEncabezado,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: medidas.espaciadoMedio,
  },
  tituloUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nombreUsuario: {
    fontSize: 20,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  accionesEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  fila: {
    gap: medidas.separacionCuadricula,
  },
  grilla: {
    gap: medidas.separacionCuadricula,
    paddingBottom: 24,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinContenido: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    color: colores.textoSecundario,
  },
});
