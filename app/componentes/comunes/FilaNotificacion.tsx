import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import Avatar from './Avatar';
import BotonSecundario from './BotonSecundario';
import { colores } from '../../constantes/colores';
import { tipografia } from '../../constantes/medidas';
import type { Notificacion } from '../../tipos';

type Props = {
  notificacion: Notificacion;
  /** Sólo aplica a las de tipo "seguimiento". */
  siguiendo: boolean;
  onAlternarSeguir: (idNotificacion: string) => void;
};

/**
 * Renglón de la pestaña de actividad.
 * Según el tipo de notificación cierra con la miniatura de la publicación
 * o con el botón "Seguir" / "Siguiendo".
 */
export default function FilaNotificacion({ notificacion, siguiendo, onAlternarSeguir }: Props) {
  const { autor, texto, hace, miniatura, tipo } = notificacion;

  return (
    <View style={estilos.contenedor}>
      <Avatar uri={autor.avatar} tamano={44} />

      <Text style={estilos.texto}>
        <Text style={estilos.nombreUsuario}>{autor.nombreUsuario}</Text> {texto}{' '}
        <Text style={estilos.antiguedad}>{hace}</Text>
      </Text>

      {tipo === 'seguimiento' ? (
        <BotonSecundario
          texto={siguiendo ? 'Siguiendo' : 'Seguir'}
          destacado={!siguiendo}
          onPress={() => onAlternarSeguir(notificacion.id)}
          estilo={estilos.boton}
        />
      ) : (
        miniatura && (
          <Image
            source={{ uri: miniatura }}
            style={estilos.miniatura}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        )
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  texto: {
    flex: 1,
    fontSize: tipografia.cuerpo,
    color: colores.textoPrincipal,
    lineHeight: 18,
  },
  nombreUsuario: {
    fontWeight: '600',
  },
  antiguedad: {
    color: colores.textoSecundario,
  },
  boton: {
    paddingHorizontal: 18,
  },
  miniatura: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: colores.placeholderImagen,
  },
});
