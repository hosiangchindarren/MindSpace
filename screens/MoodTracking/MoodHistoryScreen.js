import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { FontAwesome } from '@expo/vector-icons';

// Mood mapping with emojis
const moodEmojis = {
  Happy: '😃',
  Content: '😊',
  Neutral: '😐',
  Sad: '😟',
  Angry: '😠',
};

const MoodHistoryScreen = ({ defaultSearchDate = null }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [moods, setMoods] = useState([]);
  const [searchDate, setSearchDate] = useState(defaultSearchDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'moods'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const moodsArray = [];
        querySnapshot.forEach((doc) => {
          moodsArray.push({ id: doc.id, ...doc.data() });
        });
        setMoods(moodsArray);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'moods', id));
  };

  const filterMoodsByDate = () => {
    if (!searchDate) return moods;

    return moods.filter((mood) => {
      const moodDate = new Date(mood.createdAt.toDate());
      return (
        moodDate.getDate() === searchDate.getDate() &&
        moodDate.getMonth() === searchDate.getMonth() &&
        moodDate.getFullYear() === searchDate.getFullYear()
      );
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSearchDate(date);
    hideDatePicker();
  };

  const handleReset = () => {
    setSearchDate(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {searchDate ? searchDate.toDateString() : 'Select a date'}
          </Text>
        </TouchableOpacity>
        {searchDate && (
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <FlatList
        data={filterMoodsByDate()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.moodItem}>
            <View style={styles.moodInfo}>
              <Text style={styles.moodText}>{`${moodEmojis[item.mood]} ${item.mood}`}</Text>
              <Text style={styles.feelingText}>{item.feeling}</Text>
              <Text style={styles.dateText}>{new Date(item.createdAt.toDate()).toLocaleString()}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <FontAwesome name="trash" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    backgroundColor: '#4B0082',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: 'white',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    backgroundColor: '#4B0082',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: 'white',
  },
  moodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  moodInfo: {
    flex: 1,
  },
  moodText: {
    fontSize: 20,
  },
  feelingText: {
    fontSize: 16,
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default MoodHistoryScreen;
