import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

const moods = [
  { id: 1, label: '😃', mood: 'Happy' },
  { id: 2, label: '😊', mood: 'Content' },
  { id: 3, label: '😐', mood: 'Neutral' },
  { id: 4, label: '😟', mood: 'Sad' },
  { id: 5, label: '😠', mood: 'Angry' },
];

const MoodTrackingScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [selectedMood, setSelectedMood] = useState(null);
  const [feeling, setFeeling] = useState('');

  const handleMoodSelection = async (mood) => {
    setSelectedMood(mood);
  };

  const saveMood = async () => {
    if (feeling.trim() && selectedMood) {
      await addDoc(collection(db, 'moods'), {
        mood: selectedMood,
        feeling,
        createdAt: new Date(),
        userId: user.uid,
      });
      setFeeling('');
      setSelectedMood(null);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>How are you feeling?</Text>
        <View style={styles.moodContainer}>
          {moods.map((mood) => (
            <TouchableOpacity key={mood.id} onPress={() => handleMoodSelection(mood.mood)}>
              <Text style={styles.mood}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedMood && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Share your thoughts..."
              value={feeling}
              onChangeText={setFeeling}
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('Mood History')}>
          <Text style={styles.historyButtonText}>Mood History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statsButton} onPress={() => navigation.navigate('Mood Statistics')}>
          <Text style={styles.statsButtonText}>Statistics</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mood: {
    fontSize: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4B0082',
    padding: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  historyButton: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  statsButton: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  statsButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MoodTrackingScreen;
