import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebase";

const EditEntryScreen = ({ route, navigation }) => {
  const { entry } = route.params;
  const [entryText, setEntryText] = useState(entry.entry);

  const handleSave = async () => {
    try {
      const entryDoc = doc(db, "journalEntries", entry.id);
      await updateDoc(entryDoc, { entry: entryText });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating entry: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Entry</Text>
      <TextInput
        style={styles.input}
        value={entryText}
        onChangeText={setEntryText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E6FA",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 200,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlignVertical: "top",
  },
  button: {
    width: '45%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditEntryScreen;
