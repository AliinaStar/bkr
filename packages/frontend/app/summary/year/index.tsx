import { Text, TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

const YEARS = [
  { id: 'y1', label: '2025', score: '4.0', days: '268', entries: '147', headline: 'The year you stopped waiting for the right moment' },
  { id: 'y2', label: '2024', score: '3.6', days: '210', entries: '98',  headline: 'Building the foundation' },
  { id: 'y3', label: '2023', score: '3.2', days: '180', entries: '74',  headline: 'The year of first steps' },
];

export default function YearList() {
  const router = useRouter();

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.header}>Yearly reports</Text>
      {YEARS.map(y => (
        <TouchableOpacity
          key={y.id}
          style={s.card}
          onPress={() => router.push(`/summary/year/${y.id}`)}
          activeOpacity={0.7}
        >
          <View style={s.cardTop}>
            <Text style={s.cardLabel}>{y.label}</Text>
            <Text style={s.cardScore}>{y.score} avg</Text>
          </View>
          <Text style={s.cardHeadline}>{y.headline}</Text>
          <View style={s.cardBottom}>
            <Text style={s.cardMeta}>{y.days} active days</Text>
            <Text style={s.cardDot}>·</Text>
            <Text style={s.cardMeta}>{y.entries} entries</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F5F4F0' },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  header: { fontSize: 13, fontWeight: '600', color: '#888780', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  card: { backgroundColor: '#26215C', borderRadius: 16, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardLabel: { fontSize: 15, fontWeight: '600', color: '#F1EFE8' },
  cardScore: { fontSize: 13, color: '#7F77DD', fontWeight: '500' },
  cardHeadline: { fontSize: 13, color: '#AFA9EC', marginBottom: 8, lineHeight: 18, fontFamily: 'serif' },
  cardBottom: { flexDirection: 'row', gap: 6 },
  cardMeta: { fontSize: 12, color: '#7F77DD' },
  cardDot: { fontSize: 12, color: '#534AB7' },
});
