import React, { useState, useLayoutEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import RNPickerSelect from "react-native-picker-select";

const JournalScreen = ({ navigation }) => {
  const richText = useRef();  // Reference to the rich text editor
  const [entry, setEntry] = useState("");
  const [selectedFont, setSelectedFont] = useState("Roboto-Regular");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, entry]);

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

  const handleFontChange = (font) => {
    setSelectedFont(font);
    richText.current?.setContentHTML(`<span style="font-family: ${font}; font-size: 20px;">`);
  };

  return (
    <View style={styles.container}>
      <RichEditor
        ref={richText}
        initialContentHTML={entry}
        disabled={false}
        style={[styles.richEditor, { fontFamily: selectedFont }]}
        onChange={setEntry}
      />
      <View style={styles.toolbarContainer}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
          ]}
          style={styles.richTextToolbar}
        />
        <RNPickerSelect
          onValueChange={handleFontChange}
          items={[
            { label: "Roboto-Regular", value: "Roboto-Regular" },
            { label: "Roboto-Bold", value: "Roboto-Bold" },
            { label: "Roboto-Italic", value: "Roboto-Italic" },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: "Font", value: null }}  // Change placeholder to 'Font'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
  },
  richEditor: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  richTextToolbar: {
    backgroundColor: "#4B0082",
  },
  headerButton: {
    color: "#4B0082",
    fontSize: 16,
    marginRight: 16,
  },
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B0082",
    padding: 8,
  },
  toolbarButton: {
    color: "white",
    fontSize: 16,
    marginRight: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: "white",
    padding: 10,
    backgroundColor: "#4B0082",
    borderRadius: 5,
    marginLeft: 8,
  },
  inputAndroid: {
    color: "white",
    padding: 10,
    backgroundColor: "#4B0082",
    borderRadius: 5,
    marginLeft: 8,
  },
});

export default JournalScreen;
