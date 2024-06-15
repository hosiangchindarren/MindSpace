import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import moment from "moment";
import Icon from 'react-native-vector-icons/Ionicons';

const ViewEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error fetching entries: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Edit Entry", { entry: item })}>
            <View style={styles.entry}>
              <Text style={styles.date}>{moment(item.date).format('DD-MM-YYYY HH:mm')}</Text>
              <Text style={styles.text} numberOfLines={1}>{item.entry}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Add Entry')}
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
