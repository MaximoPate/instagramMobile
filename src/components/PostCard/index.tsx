import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Post } from '../../types';

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  // Like local por ahora (cada card maneja su propio estado). Cuando
  // conectemos el detalle del post vamos a tener que decidir si esto
  // sigue siendo local o lo subimos más arriba — lo vemos en ese paso.
  const [likeado, setLikeado] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLikeado(!likeado);
    setLikes(likeado ? likes - 1 : likes + 1);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.usuario.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{post.usuario.username}</Text>
          <Text style={styles.ubicacion}>{post.ubicacion}</Text>
        </View>
      </View>

      <Image source={{ uri: post.imagen }} style={styles.imagen} />

      <View style={styles.acciones}>
        <TouchableOpacity onPress={toggleLike}>
          <Ionicons
            name={likeado ? 'heart' : 'heart-outline'}
            size={26}
            color={likeado ? '#ed4956' : '#000000'}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{likes} Me gusta</Text>
      <Text style={styles.caption}>
        <Text style={styles.username}>{post.usuario.username} </Text>
        {post.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  username: {
    fontWeight: '600',
    fontSize: 13,
  },
  ubicacion: {
    fontSize: 11,
    color: '#737373',
  },
  imagen: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  acciones: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  likes: {
    fontWeight: '600',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  caption: {
    fontSize: 13,
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 4,
  },
});