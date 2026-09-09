import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores } from '../../constantes/colores';
import { medidas, tipografia } from '../../constantes/medidas';
import type { Publicacion } from '../../tipos';
import { formatearEtiquetas, formatearNumero } from '../../utilidades/formato';

type Props = {
  publicacion: Publicacion;
  /** En el detalle se muestran todos los comentarios, así que se oculta el enlace. */
  mostrarEnlaceComentarios?: boolean;
  onVerComentarios?: () => void;
};

/**
 * Pie de la publicación: contador de "Me gusta", descripción con el nombre
 * de usuario en negrita, etiquetas, enlace a los comentarios y antigüedad.
 */
export default function PiePublicacion({
  publicacion,
  mostrarEnlaceComentarios = true,
  onVerComentarios,
}: Props) {
  const { autor, cantidadMeGusta, descripcion, etiquetas, comentarios, hace } = publicacion;

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.meGusta}>{formatearNumero(cantidadMeGusta)} Me gusta</Text>

      <Text style={estilos.descripcion}>
        <Text style={estilos.nombreUsuario}>{autor.nombreUsuario}</Text>
        {'  '}
        {descripcion}
      </Text>

      {etiquetas.length > 0 && <Text style={estilos.etiquetas}>{formatearEtiquetas(etiquetas)}</Text>}

      {mostrarEnlaceComentarios && comentarios.length > 0 && (
        <Pressable onPress={onVerComentarios} hitSlop={4}>
          <Text style={estilos.enlaceComentarios}>
            Ver los {comentarios.length} comentarios
          </Text>
        </Pressable>
      )}

      <Text style={estilos.antiguedad}>Hace {hace}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingHorizontal: medidas.espaciadoHorizontal,
    gap: 3,
  },
  meGusta: {
    fontSize: tipografia.cuerpo,
    fontWeight: '600',
    color: colores.textoPrincipal,
  },
  descripcion: {
    fontSize: tipografia.cuerpo,
    color: colores.textoPrincipal,
    lineHeight: 18,
  },
  nombreUsuario: {
    fontWeight: '600',
  },
  etiquetas: {
    fontSize: tipografia.cuerpo,
    color: colores.azulAccion,
    lineHeight: 18,
  },
  enlaceComentarios: {
    fontSize: tipografia.cuerpo,
    color: colores.textoSecundario,
    marginTop: 1,
  },
  antiguedad: {
    fontSize: 11,
    color: colores.textoSecundario,
    marginTop: 1,
  },
});
