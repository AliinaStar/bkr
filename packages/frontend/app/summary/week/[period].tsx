import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const C = {
  bg: '#F5F4F0',
  heroBg: '#EEEDFE',
  card: '#FFFFFF',
  purple: '#7F77DD',
  purpleMid: '#534AB7',
  purpleDark: '#26215C',
  textPrimary: '#2C2C2A',
  textSecondary: '#5F5E5A',
  textMuted: '#888780',
  border: '#EBEBEB',
  statBg: 'rgba(255,255,255,0.65)',
};

const PILL_COLORS = {
  teal:   { bg: '#E1F5EE', text: '#0F6E56' },
  purple: { bg: '#EEEDFE', text: '#534AB7' },
  coral:  { bg: '#FAECE7', text: '#993C1D' },
  amber:  { bg: '#FAEEDA', text: '#854F0B' },
  green:  { bg: '#EAF3DE', text: '#3B6D11' },
};

const MOCK = {
  eyebrow: 'Week 23 · Jun 2–8',
  headline: 'A week of small bets that paid off',
  sub: 'Consistent and low-friction — your best week in June so far.',
  stats: [
    { value: '6/7', label: 'active days' },
    { value: '4.1', label: 'avg score' },
    { value: '+0.4', label: 'vs last week' },
  ],
  goals: [
    {
      name: 'Thesis writing',
      score: '4.1 · 4 entries',
      progress: 0.82,
      color: '#1D9E75',
      note: 'Literature review done. Chapter 2 outline drafted.',
    },
    {
      name: 'Exercise',
      score: '4.0 · 4 entries',
      progress: 0.80,
      color: '#7F77DD',
      note: 'Personal best for June — 4 sessions, all finished.',
    },
    {
      name: 'Reading',
      score: '3.8 · 2 entries',
      progress: 0.76,
      color: '#D85A30',
      note: 'Work and leisure reading kept separate this week.',
    },
  ],
  tone: {
    word: 'Steady',
    sub: 'між scattered і focused',
    activeSegs: [2, 3, 4],
    total: 7,
    leftLabel: 'scattered',
    rightLabel: 'focused',
    desc: 'Не було різких злетів, але й падінь теж. Твої записи цього тижня — про послідовність, а не про героїзм.',
  },
  worked: [
    {
      pill: 'Morning writing',
      color: 'purple' as keyof typeof PILL_COLORS,
      detail: 'Three of four thesis sessions were before noon — consistently longer and higher-scored. Your best output comes before the day fragments.',
    },
    {
      pill: 'One clear question',
      color: 'teal' as keyof typeof PILL_COLORS,
      detail: 'Starting with a specific question instead of "work on chapter 2" made Tuesday your longest and highest-scored session of the week.',
    },
    {
      pill: 'Low-friction start',
      color: 'coral' as keyof typeof PILL_COLORS,
      detail: '"Just 20 minutes" got you 4 exercise sessions. You noted twice that once you started, you always went longer anyway.',
    },
    {
      pill: 'Logging right after',
      color: 'amber' as keyof typeof PILL_COLORS,
      detail: 'Entries written within 30 minutes are noticeably more detailed and honest than the ones written later that evening.',
    },
  ],
};

function WorkedItem({ pill, color, detail }: { pill: string; color: keyof typeof PILL_COLORS; detail: string }) {
  const [open, setOpen] = useState(false);
  const pc = PILL_COLORS[color];
  return (
    <View style={s.wItem}>
      <TouchableOpacity style={s.wToggle} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={[s.wPill, { backgroundColor: pc.bg, color: pc.text }]}>{pill}</Text>
        <Text style={[s.wChev, open && s.wChevOpen]}>›</Text>
      </TouchableOpacity>
      {open && <Text style={s.wDetail}>{detail}</Text>}
    </View>
  );
}

export default function WeekReport() {
  useLocalSearchParams<{ period: string }>();
  const d = MOCK;

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroEyebrow}>{d.eyebrow}</Text>
        <Text style={s.heroHeadline}>{d.headline}</Text>
        <Text style={s.heroSub}>{d.sub}</Text>
        <View style={s.statsRow}>
          {d.stats.map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Goals */}
      <View style={s.card}>
        <Text style={s.clabel}>Goals</Text>
        {d.goals.map((g, i) => (
          <View key={i} style={[s.goalRow, i === 0 && s.goalFirst, i === d.goals.length - 1 && s.goalLast]}>
            <View style={s.goalHeader}>
              <Text style={s.goalName}>{g.name}</Text>
              <Text style={s.goalScore}>{g.score}</Text>
            </View>
            <View style={s.barBg}>
              <View style={[s.bar, { width: `${g.progress * 100}%` as any, backgroundColor: g.color }]} />
            </View>
            <Text style={s.goalNote}>{g.note}</Text>
          </View>
        ))}
      </View>

      {/* Tone */}
      <View style={s.card}>
        <Text style={s.clabel}>Tone of the week</Text>
        <View style={s.toneTop}>
          <Text style={s.toneWord}>{d.tone.word}</Text>
          <Text style={s.toneSub}>{d.tone.sub}</Text>
        </View>
        <View style={s.scale}>
          {Array.from({ length: d.tone.total }).map((_, i) => (
            <View key={i} style={[s.seg, d.tone.activeSegs.includes(i) && s.segOn]} />
          ))}
        </View>
        <View style={s.scaleLabels}>
          <Text style={s.scaleLbl}>{d.tone.leftLabel}</Text>
          <Text style={s.scaleLbl}>{d.tone.rightLabel}</Text>
        </View>
        <Text style={s.toneDesc}>{d.tone.desc}</Text>
      </View>

      {/* What worked */}
      <View style={[s.card, s.workedCard]}>
        <Text style={[s.clabel, s.workedLabel]}>What worked</Text>
        {d.worked.map((w, i) => (
          <WorkedItem key={i} {...w} />
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 14, gap: 10, paddingBottom: 32 },

  hero: { backgroundColor: C.heroBg, borderRadius: 18, padding: 16 },
  heroEyebrow: { fontSize: 9, color: C.purple, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  heroHeadline: { fontSize: 22, fontWeight: '500', color: C.purpleDark, lineHeight: 28, marginBottom: 6, fontFamily: 'serif' },
  heroSub: { fontSize: 13, color: C.purpleMid, lineHeight: 20, marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 7 },
  statCard: { flex: 1, backgroundColor: C.statBg, borderRadius: 10, padding: 8, alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '500', color: C.purpleDark },
  statLabel: { fontSize: 9, color: C.purple, marginTop: 2 },

  card: { backgroundColor: C.card, borderRadius: 18, padding: 14 },
  clabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },

  goalRow: { paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: C.border },
  goalFirst: { paddingTop: 0 },
  goalLast: { borderBottomWidth: 0, paddingBottom: 0 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  goalName: { fontSize: 13, fontWeight: '500', color: C.textPrimary },
  goalScore: { fontSize: 12, color: C.textMuted },
  barBg: { height: 3, backgroundColor: C.border, borderRadius: 2, marginBottom: 5 },
  bar: { height: 3, borderRadius: 2 },
  goalNote: { fontSize: 12, color: C.textSecondary, lineHeight: 17 },

  toneTop: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 10, marginTop: 6 },
  toneWord: { fontSize: 26, fontWeight: '500', color: C.purpleDark, fontFamily: 'serif' },
  toneSub: { fontSize: 11, color: C.textMuted },
  scale: { flexDirection: 'row', gap: 4, marginBottom: 7 },
  seg: { flex: 1, height: 5, borderRadius: 3, backgroundColor: C.border },
  segOn: { backgroundColor: C.purple },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  scaleLbl: { fontSize: 9, color: '#B4B2A9' },
  toneDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  workedCard: { padding: 0, overflow: 'hidden' },
  workedLabel: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, marginBottom: 0, borderBottomWidth: 0.5, borderBottomColor: C.border },
  wItem: { borderBottomWidth: 0.5, borderBottomColor: C.border },
  wToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, paddingHorizontal: 16 },
  wPill: { fontSize: 12, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, overflow: 'hidden' },
  wChev: { fontSize: 18, color: '#C8C7C2' },
  wChevOpen: { transform: [{ rotate: '90deg' }] },
  wDetail: { fontSize: 12, color: C.textSecondary, lineHeight: 19, paddingHorizontal: 16, paddingBottom: 12 },
});
