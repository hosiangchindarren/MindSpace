import React, { useState, useLayoutEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebase";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

const EditEntryScreen = ({ route, navigation }) => {
  const { entry } = route.params;
  const richText = useRef();  // Reference to the rich text editor
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const entryText = await richText.current.getContentHtml();  // Get HTML content
    try {
      const entryDoc = doc(db, "journalEntries", entry.id);
      await updateDoc(entryDoc, { entry: entryText });
      Alert.alert("Success", "Your journal entry has been updated!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating entry: ", error);
      Alert.alert("Error", "Failed to update the journal entry.");
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

  const customIconMap = {
    [actions.setBold]: ({ tintColor }) => (
      <Text style={{ ...styles.toolbarButton, color: tintColor }}>B</Text>
    ),
    [actions.setItalic]: ({ tintColor }) => (
      <Text style={{ ...styles.toolbarButton, color: tintColor }}>I</Text>
    ),
    [actions.setUnderline]: ({ tintColor }) => (
      <Text style={{ ...styles.toolbarButton, color: tintColor }}>U</Text>
    ),
    [actions.setStrikethrough]: ({ tintColor }) => (
      <Text style={{ ...styles.toolbarButton, color: tintColor }}>S</Text>
    ),
    [actions.insertBulletsList]: ({ tintColor }) => (
      <Text style={{ ...styles.toolbarButton, color: tintColor }}>•</Text>
    ),
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {isEditing && (
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.setStrikethrough,
              actions.insertBulletsList,
            ]}
            iconMap={customIconMap}
            style={styles.richTextToolbar}
          />
        )}
        <View style={styles.editorContainer}>
          <RichEditor
            ref={richText}
            initialContentHTML={entry.entry}
            disabled={!isEditing}
            style={styles.richEditor}
            useContainer={false}
            containerStyle={styles.richEditorContainer}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    paddingTop: 16,
  },
  editorContainer: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  richEditorContainer: {
    flex: 1,
    minHeight: 100,
  },
  richEditor: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    textAlignVertical: "top",
  },
  richTextToolbar: {
    backgroundColor: "#E6E6FA",
    paddingBottom: 16,
  },
  headerButton: {
    color: "#4B0082",
    fontSize: 16,
    marginRight: 16,
  },
  toolbarButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditEntryScreen;
