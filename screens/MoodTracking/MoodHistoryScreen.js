import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { FontAwesome } from '@expo/vector-icons';

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
  const [sortOrder, setSortOrder] = useState("desc");

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
    let filteredMoods = moods;
    if (searchDate) {
      filteredMoods = filteredMoods.filter((mood) => {
        const moodDate = new Date(mood.createdAt.toDate());
        return (
          moodDate.getDate() === searchDate.getDate() &&
          moodDate.getMonth() === searchDate.getMonth() &&
          moodDate.getFullYear() === searchDate.getFullYear()
        );
      });
    }
    return filteredMoods.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAt.toDate() - b.createdAt.toDate();
      } else {
        return b.createdAt.toDate() - a.createdAt.toDate();
      }
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

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "desc" ? "asc" : "desc"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {searchDate ? searchDate.toDateString() : 'Select a date'}
          </Text>
        </TouchableOpacity>
        {!searchDate && (
          <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
            <Image
              source={sortOrder === "desc" ? require('../../assets/sort-desc.png') : require('../../assets/sort-asc.png')}
              style={styles.sortIcon}
            />
          </TouchableOpacity>
        )}
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
    alignItems: 'center',
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
  sortButton: {
    padding: 10,
    marginLeft: 10,
  },
  sortIcon: {
    width: 24,
    height: 24,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    backgroundColor: '#4B0082',
    alignItems: 'center',
    marginLeft: 10,
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
