import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SummaryHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Підсумки 📊</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/summary/week')}>
        <Text style={styles.buttonText}>Тижні</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/summary/month')}>
        <Text style={styles.buttonText}>Місяці</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/summary/year')}>
        <Text style={styles.buttonText}>Роки</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: '700', marginBottom: 30, color: '#9B8FD9' },
  button: { padding: 15, backgroundColor: '#F3F0FF', borderRadius: 10, marginBottom: 15, width: 200, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: '600' },
});
