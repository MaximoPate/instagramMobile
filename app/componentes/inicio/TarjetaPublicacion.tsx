import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import BarraAcciones from './BarraAcciones';
import EncabezadoPublicacion from './EncabezadoPublicacion';
import PiePublicacion from './PiePublicacion';
import { colores } from '../../constantes/colores';
import type { Publicacion } from '../../tipos';

type Props = {
  /** Toda la información del posteo llega por props desde la pantalla. */
  publicacion: Publicacion;
  onAbrirDetalle: (idPublicacion: string) => void;
  onMeGusta: (idPublicacion: string) => void;
  onGuardar: (idPublicacion: string) => void;
};

/**
 * Ítem que renderiza la FlatList del feed.
 *
 * Es un componente 100% controlado: no guarda estado propio, sólo compone
 * las tres piezas de la tarjeta (encabezado, imagen y pie) y avisa hacia
 * arriba qué botón se tocó. Así el "Me gusta" es siempre el mismo dato,
 * lo toque el usuario en el feed, en el perfil o en el detalle.
 *
 * Va envuelto en `memo` para que al cambiar un like sólo se vuelva a
 * dibujar la tarjeta afectada y no toda la lista.
 */
function TarjetaPublicacion({ publicacion, onAbrirDetalle, onMeGusta, onGuardar }: Props) {
  const abrirDetalle = () => onAbrirDetalle(publicacion.id);

  return (
    <View style={estilos.tarjeta}>
      <EncabezadoPublicacion autor={publicacion.autor} ubicacion={publicacion.ubicacion} />

      <Pressable onPress={abrirDetalle} accessibilityRole="imagebutton">
        <Image
          source={{ uri: publicacion.imagen }}
          style={[estilos.imagen, { aspectRatio: publicacion.relacionAspecto }]}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
          accessibilityLabel={`Publicación de ${publicacion.autor.nombreUsuario}`}
        />
      </Pressable>

      <BarraAcciones
        meGusta={publicacion.meGusta}
        guardada={publicacion.guardada}
        onMeGusta={() => onMeGusta(publicacion.id)}
        onComentar={abrirDetalle}
        onCompartir={abrirDetalle}
        onGuardar={() => onGuardar(publicacion.id)}
      />

      <PiePublicacion publicacion={publicacion} onVerComentarios={abrirDetalle} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    paddingBottom: 16,
    backgroundColor: colores.fondo,
  },
  imagen: {
    width: '100%',
    backgroundColor: colores.placeholderImagen,
  },
});

export default memo(TarjetaPublicacion);
