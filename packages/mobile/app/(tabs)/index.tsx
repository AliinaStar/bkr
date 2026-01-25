import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Text style={styles.dateText}>24 січня</Text>  */}
        <Text style={styles.quoteText}>
          Маленькі кроки щодня → великі зміни
        </Text>
      </View>

      {/* Goals */}
      <View style={styles.goals}>
        <Pressable
          style={styles.goalCard}
          onPress={() => router.push("/goal/1")}
        >
          <Text style={styles.goalText}>Ціль 1</Text>
        </Pressable>

        <Pressable
          style={styles.goalCard}
          onPress={() => router.push("/goal/2")}
        >
          <Text style={styles.goalText}>Ціль 2</Text>
        </Pressable>
      </View>

      {/* Add button */}
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/goal")}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  header: {
    marginBottom: 24,
  },

  dateText: {
    fontSize: 16,
    color: "#666",
  },

  quoteText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },

  goals: {
    gap: 12,
  },

  goalCard: {
  backgroundColor: "#E6D9FF",
  padding: 16,
  borderRadius: 12,
},

  goalText: {
    fontSize: 16,
    fontWeight: "500",
},

  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
  },
});
