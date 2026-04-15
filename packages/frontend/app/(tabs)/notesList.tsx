import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";

const notes = [
  { id: "1", date: new Date(2026, 0, 25) },
  { id: "2", date: new Date(2026, 0, 24) },
  { id: "3", date: new Date(2026, 0, 23) },
];

export default function NotesList() {
  const router = useRouter();

  const handlePress = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Нотатки по датах</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.noteItem} onPress={() => handlePress(item.id)}>
            <Text style={styles.noteText}>{item.date.toDateString()}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  noteItem: { padding: 15, borderRadius: 8, backgroundColor: "#f0f0f0", marginBottom: 10 },
  noteText: { fontSize: 18 },
});
