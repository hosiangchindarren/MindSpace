import React, { useState, useLayoutEffect } from "react";
import { View, TextInput, Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

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
        navigation.navigate("ViewEntries");
      } catch (error) {
        console.error("Error saving entry: ", error);
        Alert.alert("Error", "Failed to save the journal entry.");
      }
    } else {
      Alert.alert("Error", "Please write something before saving.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, entry]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        value={entry}
        onChangeText={setEntry}
        multiline
      />
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
  headerButton: {
    color: "#4B0082",
    fontSize: 16,
    marginRight: 16,
  },
});

export default JournalScreen;
