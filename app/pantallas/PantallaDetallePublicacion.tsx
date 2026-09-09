import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from '../componentes/comunes/Avatar';
import EncabezadoSimple from '../componentes/comunes/EncabezadoSimple';
import FilaComentario from '../componentes/detalle/FilaComentario';
import BarraAcciones from '../componentes/inicio/BarraAcciones';
import EncabezadoPublicacion from '../componentes/inicio/EncabezadoPublicacion';
import PiePublicacion from '../componentes/inicio/PiePublicacion';
import { colores } from '../constantes/colores';
import { medidas } from '../constantes/medidas';
import { usePublicaciones } from '../contexto/ContextoPublicaciones';
import { perfilPropio } from '../datos/perfilPropio';
import type { PropsPantallaStack } from '../navegacion/tiposNavegacion';
import type { Comentario } from '../tipos';

/**
 * Vista extendida de una publicación.
 *
 * Recibe por `route.params` únicamente el id y busca el objeto completo en
 * el contexto global. De esa forma el "Me gusta" que se toca acá queda
 * reflejado al volver al feed y a la cuadrícula del perfil, en lugar de
 * quedar aislado en una copia del posteo.
 */
export default function PantallaDetallePublicacion({
  route,
  navigation,
}: PropsPantallaStack<'DetallePublicacion'>) {
  const { idPublicacion, tituloEncabezado } = route.params;
  const { buscarPublicacion, alternarMeGusta, alternarGuardada } = usePublicaciones();

  const publicacion = buscarPublicacion(idPublicacion);

  /**
   * Estado LOCAL de la pantalla: qué comentarios marcó el usuario con
   * corazón y qué está escribiendo en la caja de texto. No hace falta que
   * sobrevivan al salir del detalle, así que no van al contexto global.
   */
  const [comentariosConMeGusta, setComentariosConMeGusta] = useState<string[]>([]);
  const [comentarioNuevo, setComentarioNuevo] = useState('');
  const [comentariosPropios, setComentariosPropios] = useState<Comentario[]>([]);

  const alternarMeGustaComentario = useCallback((idComentario: string) => {
    setComentariosConMeGusta((anteriores) =>
      anteriores.includes(idComentario)
        ? anteriores.filter((id) => id !== idComentario)
        : [...anteriores, idComentario],
    );
  }, []);

  const publicarComentario = useCallback(() => {
    const texto = comentarioNuevo.trim();
    if (!texto) return;

    setComentariosPropios((anteriores) => [
      ...anteriores,
      {
        id: `propio-${anteriores.length}`,
        autor: { nombreUsuario: perfilPropio.nombreUsuario, avatar: perfilPropio.avatar },
        texto,
        hace: 'ahora',
        meGusta: 0,
      },
    ]);
    setComentarioNuevo('');
  }, [comentarioNuevo]);

  // Puede pasar si se recarga el feed mientras el detalle está abierto.
  if (!publicacion) {
    return (
      <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <EncabezadoSimple titulo="Publicación" onVolver={navigation.goBack} />
        <View style={estilos.centrado}>
          <Text style={estilos.textoVacio}>Esta publicación ya no está disponible.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const comentarios = [...publicacion.comentarios, ...comentariosPropios];

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <EncabezadoSimple
        titulo={tituloEncabezado ?? 'Publicación'}
        onVolver={navigation.goBack}
        accionDerecha={
          <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Más opciones">
            <Ionicons name="ellipsis-horizontal" size={20} color={colores.textoPrincipal} />
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        style={estilos.contenedor}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={comentarios}
          keyExtractor={(comentario) => comentario.id}
          renderItem={({ item }) => (
            <FilaComentario
              comentario={item}
              meGusta={comentariosConMeGusta.includes(item.id)}
              onMeGusta={alternarMeGustaComentario}
            />
          )}
          contentContainerStyle={estilos.listaComentarios}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={estilos.publicacion}>
              <EncabezadoPublicacion autor={publicacion.autor} ubicacion={publicacion.ubicacion} />

              {/* Imagen en alta definición: sin recorte, respetando su relación de aspecto real. */}
              <Image
                source={{ uri: publicacion.imagen }}
                style={[estilos.imagen, { aspectRatio: publicacion.relacionAspecto }]}
                contentFit="cover"
                transition={250}
                cachePolicy="memory-disk"
                accessibilityLabel={`Publicación de ${publicacion.autor.nombreUsuario}`}
              />

              <BarraAcciones
                meGusta={publicacion.meGusta}
                guardada={publicacion.guardada}
                onMeGusta={() => alternarMeGusta(publicacion.id)}
                onComentar={() => {}}
                onCompartir={() => {}}
                onGuardar={() => alternarGuardada(publicacion.id)}
              />

              <PiePublicacion publicacion={publicacion} mostrarEnlaceComentarios={false} />

              <Text style={estilos.tituloComentarios}>
                Comentarios ({comentarios.length})
              </Text>
            </View>
          }
        />

        <View style={estilos.barraComentar}>
          <Avatar uri={perfilPropio.avatar} tamano={30} />
          <TextInput
            value={comentarioNuevo}
            onChangeText={setComentarioNuevo}
            placeholder={`Agregá un comentario como ${perfilPropio.nombreUsuario}...`}
            placeholderTextColor={colores.textoSecundario}
            style={estilos.entradaComentario}
            onSubmitEditing={publicarComentario}
            returnKeyType="send"
          />
          {comentarioNuevo.trim().length > 0 && (
            <Pressable onPress={publicarComentario} hitSlop={8} accessibilityRole="button">
              <Text style={estilos.botonPublicar}>Publicar</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  publicacion: {
    paddingBottom: 8,
  },
  imagen: {
    width: '100%',
    backgroundColor: colores.placeholderImagen,
  },
  tituloComentarios: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoPrincipal,
    paddingHorizontal: medidas.espaciadoHorizontal,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.bordeSuave,
  },
  listaComentarios: {
    paddingHorizontal: medidas.espaciadoHorizontal,
    paddingBottom: 16,
  },
  barraComentar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: medidas.espaciadoHorizontal,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
    backgroundColor: colores.fondo,
  },
  entradaComentario: {
    flex: 1,
    fontSize: 13,
    color: colores.textoPrincipal,
    padding: 0,
  },
  botonPublicar: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.azulAccion,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoVacio: {
    fontSize: 14,
    color: colores.textoSecundario,
  },
});
