import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text } from 'react-native';

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Actividad</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
});