import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../config/firebase";

const ViewEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, 'journalEntries'), where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const entriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate().toLocaleString(), // Convert timestamp to readable date
        }));
        setEntries(entriesList);
        setFilteredEntries(entriesList);
      } catch (error) {
        console.error("Error fetching entries: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleSearch = (text) => {
    setSearchDate(text);
    if (text) {
      const filtered = entries.filter(entry => entry.date.includes(text));
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  };

  const handlePressEntry = (entry) => {
    navigation.navigate("EntryDetail", { entry });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePressEntry(item)}>
      <View style={styles.entry}>
        <Text style={styles.date}>{item.date}</Text>
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
      <TextInput
        style={styles.searchBar}
        placeholder="Search by date (e.g., 2024-06-05)"
        value={searchDate}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E6FA",
  },
  searchBar: {
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
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
});

export default ViewEntriesScreen;