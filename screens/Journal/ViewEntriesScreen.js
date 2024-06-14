import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ViewEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const fetchEntries = async () => {
    try {
      const q = query(collection(db, 'journalEntries'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const entriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString(), // Convert timestamp to ISO string
      }));
      setEntries(entriesList);
      setFilteredEntries(entriesList);
    } catch (error) {
      console.error("Error fetching entries: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchEntries();
    }, [])
  );

  const handleConfirm = (date) => {
    setDatePickerVisibility(false);
    setSearchDate(date);

    const formattedDate = moment(date).format('DD-MM-YYYY'); // Format to DD-MM-YYYY
    const filtered = entries.filter(entry => moment(entry.date).format('DD-MM-YYYY') === formattedDate);
    setFilteredEntries(filtered);
  };

  const handlePressEntry = (entry) => {
    navigation.navigate("Edit Entry", { 
      entry, 
      onSave: updatedEntry => {
        const updatedEntries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
        setEntries(updatedEntries);
        setFilteredEntries(updatedEntries);
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePressEntry(item)}>
      <View style={styles.entry}>
        <Text style={styles.date}>{moment(item.date).format('DD-MM-YYYY HH:mm')}</Text>
        <Text style={styles.text} numberOfLines={1}>{item.entry}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {searchDate ? moment(searchDate).format('DD-MM-YYYY') : 'Select a Date'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => {
          console.log('Navigating to JournalScreen with current entries:', entries);
          console.log('Search date:', searchDate);
          navigation.navigate('Add Entry');
        }}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E6FA",
  },
  datePickerButton: {
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#4B0082",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: 'center',
  },
  datePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  entry: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  floatingButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 16,
    bottom: 16,
    backgroundColor: '#4B0082',
    borderRadius: 28,
    elevation: 8,
  },
});

export default ViewEntriesScreen;
