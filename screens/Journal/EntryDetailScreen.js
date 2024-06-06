import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EntryDetailScreen = ({ route }) => {
  const { entry } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{entry.date}</Text>
      <Text style={styles.text}>{entry.entry}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E6FA",
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

export default EntryDetailScreen;