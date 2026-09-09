import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from '../componentes/comunes/Avatar';
import LogoInstagram from '../componentes/comunes/LogoInstagram';
import { colores } from '../constantes/colores';
import { medidas } from '../constantes/medidas';
import { reelsSimulados } from '../datos/reelsSimulados';
import type { Reel } from '../tipos';
import { formatearCompacto } from '../utilidades/formato';

/**
 * Pestaña Reels: portadas a pantalla completa que se recorren de a una con
 * scroll vertical (`pagingEnabled`). Es la única pantalla con fondo negro,
 * así que también es la única que pone la StatusBar en modo claro.
 */
export default function PantallaReels() {
  // Estado LOCAL: alto disponible para que cada reel ocupe exactamente una
  // pantalla, y qué reels marcó el usuario con "Me gusta".
  const [altoDisponible, setAltoDisponible] = useState(0);
  const [reelsConMeGusta, setReelsConMeGusta] = useState<string[]>([]);

  const medirContenedor = useCallback((evento: LayoutChangeEvent) => {
    setAltoDisponible(evento.nativeEvent.layout.height);
  }, []);

  const alternarMeGusta = useCallback((idReel: string) => {
    setReelsConMeGusta((anteriores) =>
      anteriores.includes(idReel)
        ? anteriores.filter((id) => id !== idReel)
        : [...anteriores, idReel],
    );
  }, []);

  const renderizarReel = useCallback(
    ({ item }: { item: Reel }) => {
      const tieneMeGusta = reelsConMeGusta.includes(item.id);

      return (
        <View style={[estilos.reel, { height: altoDisponible }]}>
          <Image
            source={{ uri: item.portada }}
            style={estilos.portada}
            contentFit="cover"
            transition={250}
            cachePolicy="memory-disk"
            accessibilityLabel={`Reel de ${item.autor.nombreUsuario}`}
          />

          <View style={estilos.columnaAcciones}>
            <Pressable
              onPress={() => alternarMeGusta(item.id)}
              style={estilos.accion}
              accessibilityRole="button"
              accessibilityLabel="Me gusta"
            >
              <Ionicons
                name={tieneMeGusta ? 'heart' : 'heart-outline'}
                size={30}
                color={tieneMeGusta ? colores.rojoMeGusta : colores.fondo}
              />
              <Text style={estilos.contador}>
                {formatearCompacto(item.cantidadMeGusta + (tieneMeGusta ? 1 : 0))}
              </Text>
            </Pressable>

            <View style={estilos.accion}>
              <Ionicons name="chatbubble-outline" size={28} color={colores.fondo} />
              <Text style={estilos.contador}>{formatearCompacto(item.cantidadComentarios)}</Text>
            </View>

            <View style={estilos.accion}>
              <Ionicons name="paper-plane-outline" size={28} color={colores.fondo} />
            </View>

            <View style={estilos.accion}>
              <Ionicons name="ellipsis-vertical" size={22} color={colores.fondo} />
            </View>
          </View>

          <View style={estilos.piePantalla}>
            <View style={estilos.filaAutor}>
              <Avatar uri={item.autor.avatar} tamano={30} />
              <Text style={estilos.nombreAutor}>{item.autor.nombreUsuario}</Text>
              <Pressable style={estilos.botonSeguir} accessibilityRole="button">
                <Text style={estilos.textoSeguir}>Seguir</Text>
              </Pressable>
            </View>

            <Text style={estilos.descripcion} numberOfLines={2}>
              {item.descripcion}
            </Text>

            <View style={estilos.filaAudio}>
              <Ionicons name="musical-notes" size={12} color={colores.fondo} />
              <Text style={estilos.audio} numberOfLines={1}>
                {item.audio}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [altoDisponible, alternarMeGusta, reelsConMeGusta],
  );

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      <View style={estilos.encabezado}>
        <LogoInstagram tamano={24} color={colores.fondo} />
        <Text style={estilos.tituloReels}>reels</Text>
        <View style={estilos.espaciadorEncabezado} />
        <Ionicons name="camera-outline" size={26} color={colores.fondo} />
      </View>

      <View style={estilos.listaContenedor} onLayout={medirContenedor}>
        {altoDisponible > 0 && (
          <FlatList
            data={reelsSimulados}
            keyExtractor={(reel) => reel.id}
            renderItem={renderizarReel}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={altoDisponible}
            decelerationRate="fast"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.textoPrincipal,
  },
  encabezado: {
    height: medidas.altoEncabezado,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: medidas.espaciadoMedio,
  },
  tituloReels: {
    color: colores.fondo,
    fontSize: 15,
    fontWeight: '600',
  },
  espaciadorEncabezado: {
    flex: 1,
  },
  listaContenedor: {
    flex: 1,
  },
  reel: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  portada: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colores.textoPrincipal,
  },
  columnaAcciones: {
    position: 'absolute',
    right: 10,
    bottom: 92,
    alignItems: 'center',
    gap: 20,
  },
  accion: {
    alignItems: 'center',
    gap: 3,
  },
  contador: {
    color: colores.fondo,
    fontSize: 12,
    fontWeight: '600',
  },
  piePantalla: {
    paddingHorizontal: medidas.espaciadoMedio,
    paddingBottom: 20,
    gap: 8,
  },
  filaAutor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nombreAutor: {
    color: colores.fondo,
    fontSize: 13,
    fontWeight: '600',
  },
  // Sobre fondo negro el botón va contorneado en blanco, no gris relleno.
  botonSeguir: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colores.fondo,
  },
  textoSeguir: {
    color: colores.fondo,
    fontSize: 12,
    fontWeight: '600',
  },
  descripcion: {
    color: colores.fondo,
    fontSize: 13,
    lineHeight: 18,
    // Ancho acotado para que el texto no se meta debajo de la columna de acciones.
    paddingRight: 64,
  },
  filaAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 64,
  },
  audio: {
    color: colores.fondo,
    fontSize: 12,
  },
});
