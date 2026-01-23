import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.motto}>Done is better than perfect.</Text>
      </View>

      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Що ти сьогодні зробила для покращення здоров'я?</Text>
        
        <Pressable style={styles.goalButton}>
          <Text style={styles.goalText}>За тиждень</Text>
        </Pressable>
        
        <Pressable style={styles.goalButton}>
          <Text style={styles.goalText}>За місяць</Text>
        </Pressable>
        
        <Pressable style={styles.goalButton}>
          <Text style={styles.goalText}>За рік</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#C4B8E8',
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  motto: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
  },
  goalsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  goalButton: {
    backgroundColor: '#C4B8E8',
    padding: 20,
    borderRadius: 25,
    marginBottom: 12,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#000',
  },
});