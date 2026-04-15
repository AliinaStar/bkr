import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const C = {
  bg: '#F5F4F0',
  heroBg: '#26215C',
  card: '#FFFFFF',
  purple: '#7F77DD',
  purpleMid: '#534AB7',
  purpleDark: '#26215C',
  textPrimary: '#2C2C2A',
  textSecondary: '#5F5E5A',
  textMuted: '#888780',
  border: '#EBEBEB',
  subtleBg: '#F5F4F0',
};

const PILL_COLORS = {
  teal:   { bg: '#E1F5EE', text: '#0F6E56' },
  purple: { bg: '#EEEDFE', text: '#534AB7' },
  coral:  { bg: '#FAECE7', text: '#993C1D' },
  amber:  { bg: '#FAEEDA', text: '#854F0B' },
  green:  { bg: '#EAF3DE', text: '#3B6D11' },
};

const GOAL_STATUS = {
  active:    { bg: '#E1F5EE', text: '#0F6E56', label: 'active' },
  completed: { bg: '#EEEDFE', text: '#534AB7', label: 'completed' },
  paused:    { bg: '#F1EFE8', text: '#888780', label: 'paused' },
};

const MOCK = {
  eyebrow: '2025 · Yearly report',
  headline: 'The year you stopped waiting for the right moment',
  sub: '268 active days, three goals, and one shift in approach that changed everything.',
  stats: [
    { value: '268',   label: 'active days' },
    { value: '4.0',   label: 'avg score' },
    { value: '147',   label: 'total entries' },
  ],
  highlights: {
    best:  { period: 'June',  reason: '24 active days, thesis breakthrough, exercise record. Everything clicked at once.' },
    hard:  { period: 'March', reason: 'Two-week plateau, lowest scores of the year. Came back stronger in April.' },
  },
  goals: [
    {
      name: 'Thesis writing',
      status: 'active' as keyof typeof GOAL_STATUS,
      progress: 0.80,
      color: '#1D9E75',
      summary: 'From scattered ideas in January to a structured draft by December. The turning point was June — when you stopped planning how to write and started writing.',
      comparison: 'Січневі записи — про те що треба зробити. Грудневі — про те що зроблено і що далі. Це інша людина пише.',
      peak: 'Jun 18 · Chapter 2 fully drafted in one week. Score 5.0 три дні поспіль.',
    },
    {
      name: 'Exercise',
      status: 'active' as keyof typeof GOAL_STATUS,
      progress: 0.74,
      color: '#7F77DD',
      summary: 'Started the year with ambitious plans, ended with sustainable habits. Total sessions almost doubled from H1 to H2 — not because of more effort, but less resistance.',
      comparison: 'У лютому пропускала через "немає часу". У листопаді — через "не хочу". Різниця: тепер це звичка, а не намір.',
      peak: 'Jun · 14 sessions — рекорд за весь рік. Low-friction підхід на піку.',
    },
    {
      name: 'Reading',
      status: 'completed' as keyof typeof GOAL_STATUS,
      progress: 0.68,
      color: '#D85A30',
      summary: 'Goal completed in October — 24 books read, target was 20. Shifted to a new reading goal in November focused on research papers specifically.',
      comparison: 'Ціль виконана і переросла сама себе. Це не провал планування — це ознака того що ціль була правильною.',
      peak: 'Oct 3 · 24-та книга. Написала що це перший рік коли читання не здавалося зусиллям.',
    },
  ],
  tone: {
    word: 'Driven',
    sub: 'рік з чіткою дугою',
    activeSegs: [4, 5],
    total: 7,
    leftLabel: 'scattered',
    rightLabel: 'focused',
    desc: 'Рік не був рівним — але загальний вектор завжди йшов вперед. Навіть важкий березень не скинув темп надовго.',
    quarters: [
      { label: 'Q1', word: 'Drifting' },
      { label: 'Q2', word: 'Focused' },
      { label: 'Q3', word: 'Driven' },
      { label: 'Q4', word: 'Steady' },
    ],
  },
  patterns: [
    {
      title: 'Ранок — твій незамінний ресурс',
      since: 'Помічено з квітня, підтверджено до грудня',
      detail: 'З усіх сесій що отримали score 5.0 — 91% були до полудня. Це не перевага — це факт про те як влаштований твій мозок.',
    },
    {
      title: 'Низький поріг входу = вищий результат',
      since: 'Помічено з червня',
      detail: 'Кожного разу коли ти знижувала планку старту — кількість сесій зростала, а середній score не падав. Амбітні плани системно давали менше ніж скромні старти.',
    },
    {
      title: 'Спорт передбачає продуктивну тезу',
      since: 'Помічено з серпня',
      detail: 'У 78% випадків день після спортивної сесії давав вищий score по тезі ніж середній. Це найстабільніший кореляційний патерн року.',
    },
    {
      title: 'Після зупинки — перший день завжди важкий',
      since: 'Стабільний протягом усього року',
      detail: 'Після будь-якої паузи 3+ дні перший запис стабільно нижчий за середній. Але другий день вже повертається до норми. Знання цього робить паузи менш страшними.',
    },
  ],
  worked: [
    { pill: 'Morning sessions', color: 'teal' as keyof typeof PILL_COLORS, detail: 'Найконсистентніший фактор року. Коли ранковий слот захищений — все інше вибудовується навколо нього.' },
    { pill: 'One clear question', color: 'purple' as keyof typeof PILL_COLORS, detail: "З'явилося у червні, стало звичкою до вересня. Знизило activation cost кожної сесії до мінімуму." },
    { pill: 'Low-friction starts', color: 'coral' as keyof typeof PILL_COLORS, detail: 'Працює для тези, для спорту, для читання. Універсальний принцип який ти відкрила емпірично за рік.' },
    { pill: 'Supervisor check-ins', color: 'amber' as keyof typeof PILL_COLORS, detail: 'Чотири рази за рік розблоковували застрягання. Навчилася просити допомоги раніше ніж застрягала надовго.' },
    { pill: 'Logging right after', color: 'green' as keyof typeof PILL_COLORS, detail: 'Записи написані одразу — в середньому на 40% довші і конкретніші. Саме вони дають матеріал для цього звіту.' },
  ],
  insight: 'Цей рік навчив тебе одному: опір на початку — це не сигнал що не готова. Це просто тертя. Ти навчилася відрізняти ці два відчуття — і це змінило все. Не результати. Підхід.',
  nextYear: 'Захистити ранковий слот як незмінний — навіть у місяць з дедлайнами. Червень показав що це твій головний важіль. Все інше підлаштовується.',
};

function PatternItem({ title, since, detail }: { title: string; since: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.patternItem}>
      <TouchableOpacity style={s.patternToggle} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <View style={s.patternTitleWrap}>
          <Text style={s.patternTitle}>{title}</Text>
          <Text style={s.patternSince}>{since}</Text>
        </View>
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

export default function YearReport() {
  useLocalSearchParams<{ period: string }>();
  const d = MOCK;

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      {/* Hero — dark */}
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

      {/* Highlights grid */}
      <View style={s.hlGrid}>
        <View style={[s.hlCard, s.hlBest]}>
          <Text style={[s.hlTag, s.hlBestTag]}>Best moment</Text>
          <Text style={[s.hlPeriod, s.hlBestPeriod]}>{d.highlights.best.period}</Text>
          <Text style={[s.hlReason, s.hlBestReason]}>{d.highlights.best.reason}</Text>
        </View>
        <View style={[s.hlCard, s.hlHard]}>
          <Text style={[s.hlTag, s.hlHardTag]}>Hardest moment</Text>
          <Text style={[s.hlPeriod, s.hlHardPeriod]}>{d.highlights.hard.period}</Text>
          <Text style={[s.hlReason, s.hlHardReason]}>{d.highlights.hard.reason}</Text>
        </View>
      </View>

      {/* Goals */}
      <View style={s.card}>
        <Text style={s.clabel}>Goals</Text>
        {d.goals.map((g, i) => {
          const st = GOAL_STATUS[g.status];
          return (
            <View key={i} style={[s.goalRow, i === 0 && s.goalFirst, i === d.goals.length - 1 && s.goalLast]}>
              <View style={s.goalHeader}>
                <Text style={s.goalName}>{g.name}</Text>
                <Text style={[s.goalStatus, { backgroundColor: st.bg, color: st.text }]}>{st.label}</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.bar, { width: `${g.progress * 100}%` as any, backgroundColor: g.color }]} />
              </View>
              <Text style={s.goalSummary}>{g.summary}</Text>
              <View style={s.goalBoxes}>
                <View style={[s.goalBox, s.boxComp]}>
                  <Text style={[s.boxLabel, s.boxCompLabel]}>Compared to start of year</Text>
                  <Text style={[s.boxText, s.boxCompText]}>{g.comparison}</Text>
                </View>
                <View style={[s.goalBox, s.boxPeak]}>
                  <Text style={[s.boxLabel, s.boxPeakLabel]}>Best moment</Text>
                  <Text style={[s.boxText, s.boxPeakText]}>{g.peak}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Tone */}
      <View style={s.card}>
        <Text style={s.clabel}>Tone of the year</Text>
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
          <Text style={s.trendLabel}>По кварталах</Text>
          <View style={s.trendRow}>
            {d.tone.quarters.map((q, i) => (
              <View key={i} style={s.trendQ}>
                <Text style={s.tqLabel}>{q.label}</Text>
                <Text style={s.tqWord}>{q.word}</Text>
              </View>
            ))}
          </View>
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

      {/* Insight — dark */}
      <View style={s.insightCard}>
        <Text style={s.insightLabel}>Insight</Text>
        <Text style={s.insightText}>{d.insight}</Text>
      </View>

      {/* Next year hypothesis */}
      <View style={s.nextCard}>
        <Text style={s.nextLabel}>Hypothesis for next year</Text>
        <Text style={s.nextText}>{d.nextYear}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 14, gap: 10, paddingBottom: 32 },

  hero: { backgroundColor: C.heroBg, borderRadius: 18, padding: 16 },
  heroEyebrow: { fontSize: 9, color: C.purple, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  heroHeadline: { fontSize: 22, fontWeight: '500', color: '#F1EFE8', lineHeight: 28, marginBottom: 6, fontFamily: 'serif' },
  heroSub: { fontSize: 13, color: '#AFA9EC', lineHeight: 20, marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 7 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 8, alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '500', color: '#F1EFE8' },
  statLabel: { fontSize: 9, color: C.purple, marginTop: 2 },

  hlGrid: { flexDirection: 'row', gap: 8 },
  hlCard: { flex: 1, borderRadius: 14, padding: 12 },
  hlBest: { backgroundColor: '#E1F5EE' },
  hlHard: { backgroundColor: '#FAECE7' },
  hlTag: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  hlBestTag: { color: '#0F6E56' },
  hlHardTag: { color: '#993C1D' },
  hlPeriod: { fontSize: 14, fontWeight: '500', fontFamily: 'serif', marginBottom: 4 },
  hlBestPeriod: { color: '#085041' },
  hlHardPeriod: { color: '#4A1B0C' },
  hlReason: { fontSize: 11, lineHeight: 16 },
  hlBestReason: { color: '#0F6E56' },
  hlHardReason: { color: '#993C1D' },

  card: { backgroundColor: C.card, borderRadius: 18, padding: 14 },
  clabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },

  goalRow: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: C.border },
  goalFirst: { paddingTop: 0 },
  goalLast: { borderBottomWidth: 0, paddingBottom: 0 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  goalName: { fontSize: 13, fontWeight: '500', color: C.textPrimary },
  goalStatus: { fontSize: 10, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20, overflow: 'hidden' },
  barBg: { height: 3, backgroundColor: C.border, borderRadius: 2, marginBottom: 6 },
  bar: { height: 3, borderRadius: 2 },
  goalSummary: { fontSize: 12, color: C.textPrimary, lineHeight: 18, marginBottom: 6 },
  goalBoxes: { gap: 5 },
  goalBox: { borderRadius: 8, padding: 8 },
  boxComp: { backgroundColor: C.subtleBg },
  boxPeak: { backgroundColor: '#FAEEDA' },
  boxLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  boxCompLabel: { color: C.purple },
  boxPeakLabel: { color: '#BA7517' },
  boxText: { fontSize: 11, lineHeight: 16 },
  boxCompText: { color: C.purpleMid },
  boxPeakText: { color: '#854F0B' },

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
  trendLabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  trendRow: { flexDirection: 'row', gap: 6 },
  trendQ: { flex: 1, alignItems: 'center' },
  tqLabel: { fontSize: 9, color: '#B4B2A9', marginBottom: 3 },
  tqWord: { fontSize: 11, fontWeight: '500', color: C.textPrimary },

  patternItem: { paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: C.border },
  patternToggle: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  patternTitleWrap: { flex: 1 },
  patternTitle: { fontSize: 13, fontWeight: '500', color: C.textPrimary, lineHeight: 18 },
  patternSince: { fontSize: 10, color: '#B4B2A9', marginTop: 2 },
  pChev: { fontSize: 18, color: '#C8C7C2', marginTop: 2 },
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
  insightText: { fontSize: 14, color: '#F1EFE8', lineHeight: 22, fontFamily: 'serif', fontStyle: 'italic', marginBottom: 0 },

  nextCard: { backgroundColor: '#EEEDFE', borderRadius: 18, padding: 14 },
  nextLabel: { fontSize: 9, color: C.purple, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  nextText: { fontSize: 14, color: C.purpleDark, lineHeight: 22, fontFamily: 'serif' },
});
