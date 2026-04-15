import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function GoalAdder() {
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [option, setOption] = useState("option1");

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Назва цілі</Text>

      <TextInput
        style={styles.input}
        placeholder="Goal 1..."
        multiline
      />

      <Text style={styles.title}>Опис цілі</Text>

      <TextInput
        style={styles.input}
        placeholder="Note..."
        multiline
      />

      <Text style={styles.title}>Дедлайн?</Text>

      {/* Поле дати */}
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>
          {deadline
            ? deadline.toLocaleDateString()
            : "Натисни щоб вибрати дату"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      <Text style={styles.title}>Тип цілі</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={option}
          onValueChange={(itemValue) => setOption(itemValue)}
        >
          <Picker.Item label="Звичка" value="option1" />
          <Picker.Item label="Проєкт" value="option2" />
          <Picker.Item label="Результат" value="option3" />
        </Picker>
      </View>
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
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    justifyContent: "center",
    },
  dateText: {
    fontSize: 16,
    color: "#333",
    },
  pickerContainer: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    width: "80%" }
});
