import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { FontAwesome } from '@expo/vector-icons';

const MoodHistoryScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [moods, setMoods] = useState([]);
  const [searchDate, setSearchDate] = useState('');

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
      const searchDateObj = new Date(searchDate);
      return (
        moodDate.getDate() === searchDateObj.getDate() &&
        moodDate.getMonth() === searchDateObj.getMonth() &&
        moodDate.getFullYear() === searchDateObj.getFullYear()
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by date (YYYY-MM-DD)"
        value={searchDate}
        onChangeText={setSearchDate}
      />
      <FlatList
        data={filterMoodsByDate()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.moodItem}>
            <View style={styles.moodInfo}>
              <Text style={styles.moodText}>{item.mood}</Text>
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#4B0082',
    padding: 8,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  moodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
