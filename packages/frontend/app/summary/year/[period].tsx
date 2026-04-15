import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'

export default function WeekSummary() {
  const { period } = useLocalSearchParams<{ period: string }>(); // типізація для TypeScript

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Підсумок: {period}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#9B8FD9' },
  content: { fontSize: 18, color: '#555' },
});
