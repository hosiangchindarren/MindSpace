import React, { useState } from "react";
import { View, TextInput, Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const JournalScreen = ({ navigation }) => {
  const [entry, setEntry] = useState("");

  const handleSave = async () => {
    if (entry.trim().length > 0) {
      try {
        await addDoc(collection(db, 'journalEntries'), {
          userId: auth.currentUser.uid,
          entry: entry,
          date: Timestamp.fromDate(new Date())
        });
        Alert.alert("Success", "Your journal entry has been saved!");
        setEntry(""); // Clear the input after saving
      } catch (error) {
        console.error("Error saving entry: ", error);
        Alert.alert("Error", "Failed to save the journal entry.");
      }
    } else {
      Alert.alert("Error", "Please write something before saving.");
    }
  };

  const handleViewEntries = () => {
    navigation.navigate("ViewEntries")
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Write your thoughts here..."
        value={entry}
        onChangeText={setEntry}
        multiline
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleViewEntries}>
          <Text style={styles.buttonText}>View Entries</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E6FA",
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default JournalScreen;
