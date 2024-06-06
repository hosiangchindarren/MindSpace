import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";

const AddPostScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addPost = async () => {
    if (title.trim() && content.trim()) {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        displayName: user.displayName,
        userId: user.uid,
        createdAt: new Date(),
      });
      setTitle("");
      setContent("");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Content"
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={addPost}>
        <Text style={styles.addButtonText}>ADD POST</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AddPostScreen;
