import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BotonSecundario from '../componentes/comunes/BotonSecundario';
import CarruselHistorias from '../componentes/inicio/CarruselHistorias';
import EncabezadoInicio from '../componentes/inicio/EncabezadoInicio';
import TarjetaPublicacion from '../componentes/inicio/TarjetaPublicacion';
import { colores } from '../constantes/colores';
import { usePublicaciones } from '../contexto/ContextoPublicaciones';
import { historiasSimuladas } from '../datos/historiasSimuladas';
import { notificacionesSimuladas } from '../datos/notificacionesSimuladas';
import type { Publicacion } from '../tipos';

/**
 * Feed principal.
 *
 * Toda la lista se dibuja con FlatList (nunca con `.map()` dentro de un
 * ScrollView) para que React Native recicle las vistas y el scroll siga
 * siendo fluido aunque lleguen cientos de publicaciones.
 */
export default function PantallaInicio() {
  const navegacion = useNavigation();
  const { publicaciones, cargando, error, recargar, alternarMeGusta, alternarGuardada } =
    usePublicaciones();

  // Estado LOCAL: sólo le importa a esta pantalla mientras dura el gesto.
  const [refrescando, setRefrescando] = useState(false);

  const refrescar = useCallback(async () => {
    setRefrescando(true);
    await recargar();
    setRefrescando(false);
  }, [recargar]);

  const abrirDetalle = useCallback(
    (idPublicacion: string) => navegacion.navigate('DetallePublicacion', { idPublicacion }),
    [navegacion],
  );

  const irANotificaciones = useCallback(
    () => navegacion.navigate('Pestanas', { screen: 'Notificaciones' }),
    [navegacion],
  );

  const renderizarPublicacion = useCallback(
    ({ item }: { item: Publicacion }) => (
      <TarjetaPublicacion
        publicacion={item}
        onAbrirDetalle={abrirDetalle}
        onMeGusta={alternarMeGusta}
        onGuardar={alternarGuardada}
      />
    ),
    [abrirDetalle, alternarMeGusta, alternarGuardada],
  );

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <EncabezadoInicio
        notificacionesSinLeer={notificacionesSimuladas.length}
        onAbrirNotificaciones={irANotificaciones}
        onAbrirMensajes={irANotificaciones}
      />

      {cargando ? (
        <View style={estilos.centrado}>
          <ActivityIndicator size="large" color={colores.textoSecundario} />
        </View>
      ) : error ? (
        <View style={estilos.centrado}>
          <Text style={estilos.textoError}>{error}</Text>
          <BotonSecundario texto="Reintentar" onPress={recargar} estilo={estilos.botonReintentar} />
        </View>
      ) : (
        <FlatList
          data={publicaciones}
          keyExtractor={(publicacion) => publicacion.id}
          renderItem={renderizarPublicacion}
          ListHeaderComponent={<CarruselHistorias historias={historiasSimuladas} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} />}
          // Ajustes de rendimiento: se monta poco al principio y se libera
          // lo que queda fuera de pantalla.
          initialNumToRender={3}
          maxToRenderPerBatch={4}
          windowSize={7}
          removeClippedSubviews
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
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  textoError: {
    fontSize: 14,
    color: colores.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
  },
  botonReintentar: {
    paddingHorizontal: 24,
  },
});
