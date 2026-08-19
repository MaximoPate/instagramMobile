import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { historiasFake } from '../../data/historiasFake';

export default function StoryCarousel() {
  return (
    <FlatList
      data={historiasFake}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contenido}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.anillo}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          </View>
          <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  contenido: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  item: {
    alignItems: 'center',
    width: 72,
  },
  anillo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#ed4956',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  username: {
    fontSize: 11,
    marginTop: 4,
  },
});