import React, { useState, useLayoutEffect, useRef } from "react";
import { Text, TouchableOpacity, StyleSheet, Alert, Platform, Keyboard, KeyboardAvoidingView, SafeAreaView, TouchableWithoutFeedback, View } from "react-native";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

const NewEntryScreen = ({ navigation }) => {
  const richText = useRef();  // Reference to the rich text editor
  const [entry, setEntry] = useState("");

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
    const entryText = await richText.current.getContentHtml(); // Get HTML content
    if (entryText.trim().length > 0) {
      try {
        await addDoc(collection(db, 'journalEntries'), {
          userId: auth.currentUser.uid,
          entry: entryText,
          date: Timestamp.fromDate(new Date())
        });
        Alert.alert("Success", "Your journal entry has been saved!");
        setEntry(""); // Clear the input after saving
        navigation.goBack();
      } catch (error) {
        console.error("Error saving entry: ", error);
        Alert.alert("Error", "Failed to save the journal entry.");
      }
    } else {
      Alert.alert("Error", "Please write something before saving.");
    }
  };

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
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      console.log('Keyboard dismissed');
    }} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <RichToolbar
            editor={richText} // Correctly reference the RichEditor
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.setStrikethrough,
            ]}
            iconMap={customIconMap}
            style={styles.richTextToolbar}
          />
          <View style={styles.editorContainer}>
            <RichEditor
              ref={richText}
              initialContentHTML={entry}
              disabled={false}
              style={styles.richEditor}
              useContainer={false}
              containerStyle={styles.richEditorContainer}
              onChange={setEntry}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6E6FA",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  editorContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  richEditorContainer: {
    minHeight: 100,  // Adjust the height as needed
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
    marginTop: 0, // Adjust this to match the distance you want from the header
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

export default NewEntryScreen;
