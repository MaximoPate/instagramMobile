import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EncabezadoSimple from '../componentes/comunes/EncabezadoSimple';
import FilaNotificacion from '../componentes/comunes/FilaNotificacion';
import { colores } from '../constantes/colores';
import { medidas } from '../constantes/medidas';
import { notificacionesSimuladas } from '../datos/notificacionesSimuladas';

/**
 * Pestaña de actividad. La lista es estática (no depende de la API) pero
 * igual se renderiza con FlatList para mantener el mismo criterio de
 * rendimiento que el resto de la app.
 */
export default function PantallaNotificaciones() {
  // Estado LOCAL: a qué cuentas de la lista el usuario apretó "Seguir".
  const [cuentasSeguidas, setCuentasSeguidas] = useState<string[]>([]);

  const alternarSeguir = useCallback((idNotificacion: string) => {
    setCuentasSeguidas((anteriores) =>
      anteriores.includes(idNotificacion)
        ? anteriores.filter((id) => id !== idNotificacion)
        : [...anteriores, idNotificacion],
    );
  }, []);

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <EncabezadoSimple titulo="Notificaciones" />

      <FlatList
        data={notificacionesSimuladas}
        keyExtractor={(notificacion) => notificacion.id}
        renderItem={({ item }) => (
          <FilaNotificacion
            notificacion={item}
            siguiendo={cuentasSeguidas.includes(item.id)}
            onAlternarSeguir={alternarSeguir}
          />
        )}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={estilos.subtitulo}>Esta semana</Text>}
        ItemSeparatorComponent={() => <View style={estilos.separador} />}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    paddingHorizontal: medidas.espaciadoMedio,
    paddingBottom: 24,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.textoPrincipal,
    paddingTop: 8,
    paddingBottom: 4,
  },
  separador: {
    height: 2,
  },
});
