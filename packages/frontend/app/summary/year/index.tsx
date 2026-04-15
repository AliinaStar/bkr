import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WeekList() {
  const router = useRouter();
  const weeks = [
    { id: 1, title: 'Тиждень 1' },
    { id: 2, title: 'Тиждень 2' },
    { id: 3, title: 'Тиждень 3' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Тижні 📅</Text>
      {weeks.map(week => (
        <TouchableOpacity
          key={week.id}
          style={styles.item}
          onPress={() => router.push(`/summary/week/${week.id}`)}
        >
          <Text style={styles.itemText}>{week.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#9B8FD9' },
  item: { padding: 15, borderRadius: 10, backgroundColor: '#F3F0FF', marginBottom: 10 },
  itemText: { fontSize: 18 },
});
