import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import moment from "moment";
import { Ionicons } from '@expo/vector-icons';

const AddReminderScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date(date));
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addReminder = async () => {
    if (reminderTitle.trim()) {
      try {
        const reminderDateTime = new Date(date);
        reminderDateTime.setHours(reminderTime.getHours());
        reminderDateTime.setMinutes(reminderTime.getMinutes());

        const newReminder = {
          title: reminderTitle,
          date: Timestamp.fromDate(reminderDateTime),
          userId: auth.currentUser.uid,
        };

        await addDoc(collection(db, 'reminders'), newReminder);
        Alert.alert("Success", "Reminder added successfully!");
        setReminderTitle('');
        navigation.goBack();
      } catch (error) {
        console.error("Error adding reminder: ", error);
        Alert.alert("Error", "Failed to add reminder.");
      }
    } else {
      Alert.alert("Error", "Reminder title cannot be empty.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected Date: {moment(date).format('DD-MM-YYYY')}</Text>
      <Text style={styles.label}>Selected Time: {moment(reminderTime).format('HH:mm')}</Text>
      <TextInput
        style={styles.input}
        placeholder="Reminder Title"
        value={reminderTitle}
        onChangeText={setReminderTitle}
      />
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
        <Ionicons name="time-outline" size={24} color="white" />
        <Text style={styles.timeButtonText}>Select Time</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setReminderTime(selectedTime);
            }
          }}
        />
      )}
      <TouchableOpacity onPress={addReminder} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#E6E6FA",
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B0082',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4B0082',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    fontSize: 16,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B0082',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#4B0082',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddReminderScreen;
