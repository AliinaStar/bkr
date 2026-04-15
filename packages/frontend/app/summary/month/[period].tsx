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
  subtleBg: '#F5F4F0',
};

const PILL_COLORS = {
  teal:   { bg: '#E1F5EE', text: '#0F6E56' },
  purple: { bg: '#EEEDFE', text: '#534AB7' },
  coral:  { bg: '#FAECE7', text: '#993C1D' },
  amber:  { bg: '#FAEEDA', text: '#854F0B' },
  green:  { bg: '#EAF3DE', text: '#3B6D11' },
};

const MOCK = {
  eyebrow: 'June · Monthly report',
  headline: 'The month you figured out your rhythm',
  sub: 'Three goals, 24 active days, and one recurring pattern that explains most of it.',
  stats: [
    { value: '24/30', label: 'active days' },
    { value: '4.0',   label: 'avg score' },
    { value: '+0.6',  label: 'vs May' },
  ],
  goals: [
    {
      name: 'Thesis writing',
      score: '4.2 · 18 entries',
      progress: 0.84,
      color: '#1D9E75',
      summary: 'Literature review completed, Chapter 2 fully drafted. The last week of June was the strongest — four uninterrupted sessions, all in the morning.',
      comparison: 'У лютому ти так само застрягала на структурі Chapter 2 — тоді допоміг дзвінок з науковим керівником. Цього разу ти вирішила сама, через конкретне питання на початку сесії.',
    },
    {
      name: 'Exercise',
      score: '3.9 · 14 entries',
      progress: 0.78,
      color: '#7F77DD',
      summary: '14 sessions — most since January. Short sessions dominated, but consistency was higher than any previous month.',
      comparison: 'У квітні було 9 сесій з вищим середнім score (4.3), але менше днів поспіль. Зараз менша інтенсивність, але стабільніший ритм — це інший, зрілий підсумок.',
    },
    {
      name: 'Reading',
      score: '3.7 · 8 entries',
      progress: 0.74,
      color: '#D85A30',
      summary: '8 sessions, split between research and fiction. The intentional separation of the two types became a habit by mid-month.',
      comparison: 'Вперше за 4 місяці reading не конкурувала з тезою за вечірній час — ти перемістила наукове читання на день. Записи стали детальніші.',
    },
  ],
  tone: {
    word: 'Focused',
    sub: 'ближче до focused ніж steady',
    activeSegs: [3, 4, 5],
    total: 7,
    leftLabel: 'scattered',
    rightLabel: 'focused',
    desc: 'Червень відчувався як місяць де ти знала що робити і просто робила. Без зайвих питань до себе.',
    trend: 'Тиждень 1 — Drifting. Тиждень 2 — Steady. Тижні 3–4 — Focused. Чітка дуга від розгону до ритму.',
  },
  patterns: [
    {
      title: 'Ранкові сесії дають вдвічі більше',
      detail: 'З 18 записів по тезі — 13 зроблено до полудня. Їх середній score 4.6 проти 3.4 у вечірніх. Це не збіг — це твій пік.',
    },
    {
      title: 'Після пропуску 2+ днів — важкий старт',
      detail: 'Чотири рази протягом місяця після паузи в 2 дні перший запис мав score нижче 3.0. Наступного дня завжди відновлювався. Пропуск не скидає прогрес, але перший день коштує зусиль.',
    },
    {
      title: 'Спорт і теза підсилюють одне одного',
      detail: 'У 9 з 14 днів коли була сесія спорту — наступного дня score по тезі був вищим за середній. Це як підготовка до фокусу, а не конкурент.',
    },
  ],
  worked: [
    { pill: 'Morning writing', color: 'teal' as keyof typeof PILL_COLORS, detail: 'Найстабільніший патерн місяця. 13 з 18 сесій до полудня, всі з вищим score. Варто захистити цей слот як незмінний.' },
    { pill: 'One clear question', color: 'purple' as keyof typeof PILL_COLORS, detail: "З'явилося на третьому тижні й одразу вплинуло на якість сесій. До цього — відкрита тема, після — конкретне питання. Різниця в score: +0.8 в середньому." },
    { pill: 'Low-friction exercise', color: 'coral' as keyof typeof PILL_COLORS, detail: '20-хвилинна планка дала 14 сесій — рекорд за 5 місяців. Низький поріг входу виявився ефективнішим за амбітні плани.' },
    { pill: 'Supervisor check-in', color: 'amber' as keyof typeof PILL_COLORS, detail: 'Два рази коли ти застрягала — дзвінок з керівником розблоковував наступні 3–4 сесії. Зовнішній погляд як інструмент, а не визнання невдачі.' },
    { pill: 'Reading split', color: 'green' as keyof typeof PILL_COLORS, detail: 'Наукове читання вдень, художнє — ввечері. Записи стали детальнішими, вечір перестав бути перевантаженим.' },
  ],
  insight: 'Все що спрацювало цього місяця має одну спільну рису — низький поріг входу. Ранок замість ідеального часу. Питання замість теми. 20 хвилин замість години. Червень навчив себе починати менше, щоб робити більше.',
};

function PatternItem({ title, detail }: { title: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.patternItem}>
      <TouchableOpacity style={s.patternToggle} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={s.patternTitle}>{title}</Text>
        <Text style={[s.pChev, open && s.pChevOpen]}>›</Text>
      </TouchableOpacity>
      {open && <Text style={s.patternDetail}>{detail}</Text>}
    </View>
  );
}

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

export default function MonthReport() {
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
            <Text style={s.goalSummary}>{g.summary}</Text>
            <View style={s.compBox}>
              <Text style={s.compLabel}>Compared to past</Text>
              <Text style={s.compText}>{g.comparison}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tone */}
      <View style={s.card}>
        <Text style={s.clabel}>Tone of the month</Text>
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
        <View style={s.trendBox}>
          <Text style={s.trendLabel}>Як змінювався тон</Text>
          <Text style={s.trendText}>{d.tone.trend}</Text>
        </View>
      </View>

      {/* Patterns */}
      <View style={s.card}>
        <Text style={s.clabel}>Patterns</Text>
        {d.patterns.map((p, i) => (
          <PatternItem key={i} {...p} />
        ))}
      </View>

      {/* What worked */}
      <View style={[s.card, s.workedCard]}>
        <Text style={[s.clabel, s.workedLabel]}>What worked</Text>
        {d.worked.map((w, i) => (
          <WorkedItem key={i} {...w} />
        ))}
      </View>

      {/* Insight */}
      <View style={s.insightCard}>
        <Text style={s.insightLabel}>Insight</Text>
        <Text style={s.insightText}>{d.insight}</Text>
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

  goalRow: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: C.border },
  goalFirst: { paddingTop: 0 },
  goalLast: { borderBottomWidth: 0, paddingBottom: 0 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  goalName: { fontSize: 13, fontWeight: '500', color: C.textPrimary },
  goalScore: { fontSize: 12, color: C.textMuted },
  barBg: { height: 3, backgroundColor: C.border, borderRadius: 2, marginBottom: 6 },
  bar: { height: 3, borderRadius: 2 },
  goalSummary: { fontSize: 12, color: C.textPrimary, lineHeight: 18, marginBottom: 6 },
  compBox: { backgroundColor: C.subtleBg, borderRadius: 8, padding: 8 },
  compLabel: { fontSize: 9, color: C.purple, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  compText: { fontSize: 11, color: C.purpleMid, lineHeight: 16 },

  toneTop: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 10, marginTop: 6 },
  toneWord: { fontSize: 26, fontWeight: '500', color: C.purpleDark, fontFamily: 'serif' },
  toneSub: { fontSize: 11, color: C.textMuted },
  scale: { flexDirection: 'row', gap: 4, marginBottom: 7 },
  seg: { flex: 1, height: 5, borderRadius: 3, backgroundColor: C.border },
  segOn: { backgroundColor: C.purple },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scaleLbl: { fontSize: 9, color: '#B4B2A9' },
  toneDesc: { fontSize: 12, color: C.textSecondary, lineHeight: 18, marginBottom: 6 },
  trendBox: { backgroundColor: C.subtleBg, borderRadius: 8, padding: 8 },
  trendLabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  trendText: { fontSize: 11, color: C.textSecondary, lineHeight: 16 },

  patternItem: { paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: C.border },
  patternToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  patternTitle: { fontSize: 13, fontWeight: '500', color: C.textPrimary, flex: 1, marginRight: 8 },
  pChev: { fontSize: 18, color: '#C8C7C2' },
  pChevOpen: { transform: [{ rotate: '90deg' }] },
  patternDetail: { fontSize: 12, color: C.textSecondary, lineHeight: 19, paddingTop: 6 },

  workedCard: { padding: 0, overflow: 'hidden' },
  workedLabel: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, marginBottom: 0, borderBottomWidth: 0.5, borderBottomColor: C.border },
  wItem: { borderBottomWidth: 0.5, borderBottomColor: C.border },
  wToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, paddingHorizontal: 16 },
  wPill: { fontSize: 12, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, overflow: 'hidden' },
  wChev: { fontSize: 18, color: '#C8C7C2' },
  wChevOpen: { transform: [{ rotate: '90deg' }] },
  wDetail: { fontSize: 12, color: C.textSecondary, lineHeight: 19, paddingHorizontal: 16, paddingBottom: 12 },

  insightCard: { backgroundColor: C.purpleDark, borderRadius: 18, padding: 14 },
  insightLabel: { fontSize: 9, color: C.purple, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  insightText: { fontSize: 14, color: '#F1EFE8', lineHeight: 22, fontFamily: 'serif', fontStyle: 'italic' },
});
