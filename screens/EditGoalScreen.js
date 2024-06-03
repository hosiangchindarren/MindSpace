import React, { useState, useContext } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";

const EditGoalScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const { goalId, currentTitle } = route.params;
  const [newGoal, setNewGoal] = useState(currentTitle);

  const editGoal = async () => {
    if (newGoal.trim()) {
      const goalDoc = doc(db, "goals", goalId);
      await updateDoc(goalDoc, {
        title: newGoal,
        updatedAt: new Date(),
      });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Edit Your Goal"
        value={newGoal}
        onChangeText={setNewGoal}
        multiline
      />
      <TouchableOpacity style={styles.editButton} onPress={editGoal}>
        <Text style={styles.editButtonText}>EDIT GOAL</Text>
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
  editButton: {
    marginTop: 20,
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EditGoalScreen;
