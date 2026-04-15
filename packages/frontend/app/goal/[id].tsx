import { View, Text, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function GoalNotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ціль {id}</Text>

      <Text style={styles.label}>
        Що ти зробила для цієї цілі сьогодні?
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Напиши тут..."
        multiline
      />

      <Text style={styles.label}>
        Наскільки ти відчуваєш прогрес?
      </Text>

      <Text style={styles.stars}>⭐ ⭐ ⭐ ⭐ ⭐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  stars: {
    fontSize: 24,
  },
});
