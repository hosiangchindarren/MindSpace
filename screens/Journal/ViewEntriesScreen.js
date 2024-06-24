import React, { useState, useEffect, useCallback, useContext, useLayoutEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import moment from "moment";
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";


const ViewEntriesScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchEntries = async () => {
    try {
      const q = query(collection(db, 'journalEntries'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const entriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString(),
      }));
      setEntries(entriesList);
      setFilteredEntries(entriesList);
    } catch (error) {
      console.error("Error fetching entries: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );

  useEffect(() => {
    fetchEntries();
  }, []);

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, 'journalEntries', id));
      fetchEntries();  // Refresh the entries list
    } catch (error) {
      console.error("Error deleting entry: ", error);
      Alert.alert("Error", "Failed to delete the journal entry.");
    }
  };

  const extractFirstLine = (html) => {
    const match = html.match(/<[^>]*>([^<]*)<\/[^>]*>/);
    return match ? match[0] : html.split('\n')[0];
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    filterEntriesByDate(date);
    hideDatePicker();
  };

  const filterEntriesByDate = (date) => {
    const filtered = entries.filter(entry => 
      moment(entry.date).isSame(date, 'day')
    );
    setFilteredEntries(filtered);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setFilteredEntries(entries);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>
            {selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : 'Select a date'}
          </Text>
        </TouchableOpacity>
        {selectedDate && (
          <TouchableOpacity onPress={clearDateFilter} style={styles.clearDateButton}>
            <Text style={styles.clearDateButtonText}>X</Text>
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
        data={filteredEntries}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <TouchableOpacity style={styles.entry} onPress={() => navigation.navigate("Edit Entry", { entry: item })}>
              <Text style={styles.date}>{moment(item.date).format('DD-MM-YYYY HH:mm')}</Text>
              <RenderHtml
                contentWidth={400}
                source={{ html: extractFirstLine(item.entry) }}
                baseStyle={styles.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteEntry(item.id)} style={styles.deleteButton}>
              <Icon name="trash" size={24} color="grey"/>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('New Entry')}
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
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#4B0082",
    borderRadius: 8,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  clearDateButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: "#4B0082",
    borderRadius: 8,
  },
  clearDateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  entry: {
    flex: 1,
    padding: 16,
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
  deleteButton: {
    padding: 16,
  },
  deleteButtonText: {
    fontSize: 24,
    color: 'red',
  },
  headerButton: {
    color: "#4B0082",
    fontSize: 16,
    marginRight: 16,
  },
});

export default ViewEntriesScreen;
