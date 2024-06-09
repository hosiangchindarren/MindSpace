import React, { useState, useLayoutEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebase";
import moment from "moment";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import RNPickerSelect from "react-native-picker-select";

const EditEntryScreen = ({ route, navigation }) => {
  const { entry } = route.params;
  const richText = useRef();  // Reference to the rich text editor
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const entryText = await richText.current.getContentHtml();  // Get HTML content
    try {
      const entryDoc = doc(db, "journalEntries", entry.id);
      await updateDoc(entryDoc, { entry: entryText });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating entry: ", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          if (isEditing) {
            handleSave();
          }
          setIsEditing(!isEditing);
        }}>
          <Text style={styles.headerButton}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  const formattedDate = moment(entry.date).format('DD-MM-YYYY');
  const formattedTime = moment(entry.date).format('HH:mm');

  const handleFontSizeChange = (value) => {
    richText.current?.commandExecutor?.execCommand('fontSize', false, value);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>{formattedDate}</Text>
        <Text style={styles.timeLabel}>{formattedTime}</Text>
      </View>
      <RichEditor
        ref={richText}
        initialContentHTML={entry.entry}
        disabled={!isEditing}  // Disable editing when not in edit mode
        style={styles.richEditor}
      />
      {isEditing && (
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
            onValueChange={(value) => {
              richText.current?.insertHTML(`<span style="font-size: ${value}px;">`);
            }}
            items={[
              { label: "8", value: "8" },
              { label: "10", value: "10" },
              { label: "12", value: "12" },
              { label: "14", value: "14" },
              { label: "18", value: "18" },
              { label: "24", value: "24" },
              { label: "30", value: "30" },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: "Font Size", value: null }}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,  // Add horizontal padding
    marginBottom: 3,
    marginTop: 3, // Reduce space here
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',  // Make the date text bold
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: 'bold',  // Make the time text bold
  },
  richEditor: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E6FA",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 0,  // Reduce space here
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

export default EditEntryScreen;
