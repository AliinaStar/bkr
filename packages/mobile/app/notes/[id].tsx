import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router"; // <- змінили хук

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Нотатка {id}</Text>
      <Text>Тут будуть записи для цієї дати...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
