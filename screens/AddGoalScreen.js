import React, { useState, useContext } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";

const AddGoalScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [newGoal, setNewGoal] = useState("");

  const addGoal = async () => {
    if (newGoal.trim()) {
      await addDoc(collection(db, "goals"), {
        title: newGoal,
        status: "ongoing",
        createdAt: new Date(),
        userId: user.uid,
      });
      setNewGoal("");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write Down Your New Goal!"
        value={newGoal}
        onChangeText={setNewGoal}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={addGoal}>
        <Text style={styles.addButtonText}>ADD GOAL</Text>
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
    flex: 1,
    borderWidth: 1,
    borderColor: '#4B0082',
    padding: 8,
    backgroundColor: 'white',
    textAlignVertical: 'top', 
    paddingTop: 10, 
    paddingLeft: 10, 
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddGoalScreen;
