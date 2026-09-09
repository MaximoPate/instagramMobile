import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Avatar from '../comunes/Avatar';
import { colores } from '../../constantes/colores';
import { tipografia } from '../../constantes/medidas';
import type { Comentario } from '../../tipos';

type Props = {
  comentario: Comentario;
  /** Estado de "Me gusta" del comentario, controlado por la pantalla de detalle. */
  meGusta: boolean;
  onMeGusta: (idComentario: string) => void;
};

/**
 * Renglón de la lista de comentarios del detalle: avatar, autor, texto,
 * antigüedad, cantidad de "Me gusta" y el corazoncito de la derecha.
 */
export default function FilaComentario({ comentario, meGusta, onMeGusta }: Props) {
  const totalMeGusta = comentario.meGusta + (meGusta ? 1 : 0);

  return (
    <View style={estilos.contenedor}>
      <Avatar uri={comentario.autor.avatar} tamano={32} />

      <View style={estilos.cuerpo}>
        <Text style={estilos.texto}>
          <Text style={estilos.nombreUsuario}>{comentario.autor.nombreUsuario}</Text>
          {'  '}
          {comentario.texto}
        </Text>

        <View style={estilos.metadatos}>
          <Text style={estilos.metadato}>{comentario.hace}</Text>
          {totalMeGusta > 0 && (
            <Text style={estilos.metadato}>
              {totalMeGusta} {totalMeGusta === 1 ? 'Me gusta' : 'Me gusta'}
            </Text>
          )}
          <Text style={estilos.metadato}>Responder</Text>
        </View>
      </View>

      <Pressable
        onPress={() => onMeGusta(comentario.id)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={meGusta ? 'Quitar Me gusta al comentario' : 'Me gusta al comentario'}
      >
        <Ionicons
          name={meGusta ? 'heart' : 'heart-outline'}
          size={13}
          color={meGusta ? colores.rojoMeGusta : colores.textoSecundario}
        />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  cuerpo: {
    flex: 1,
  },
  texto: {
    fontSize: tipografia.cuerpo,
    color: colores.textoPrincipal,
    lineHeight: 18,
  },
  nombreUsuario: {
    fontWeight: '600',
  },
  metadatos: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
  },
  metadato: {
    fontSize: 11,
    fontWeight: '600',
    color: colores.textoSecundario,
  },
});
