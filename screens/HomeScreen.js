import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signOut } from "firebase/auth";
import { Colors, auth } from "../config";

export const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const handleForum = () => {
    navigation.navigate("Forum");
  };
  const handleJournal = () => {
    navigation.navigate("Journal");
  };
  const handleMoodTracking = () => {
    navigation.navigate("Mood Tracking");
  };
  const handleGoalSetting = () => {
    navigation.navigate("Goals");
  };
  const handleMeditation = () => {
    navigation.navigate("Meditation"); 
  };

  const renderButton = (title, onPress, imageSource) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={imageSource} style={styles.buttonImage} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/MINDSPACE.png')} style={styles.logo}/>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {renderButton("Forum", handleForum, require('../assets/Forum.png'))}
        </View>
        <View style={styles.buttonRow}>
          {renderButton("Journal", handleJournal, require('../assets/Journal.png'))}
          {renderButton("Mood Tracking", handleMoodTracking, require('../assets/MoodTracking.png'))}
        </View>
        <View style={styles.buttonRow}>
          {renderButton("Goal Setting", handleGoalSetting, require('../assets/GoalSetting.png'))}
          {renderButton("Meditation", handleMeditation, require('../assets/Meditation.png'))}
        </View>
      </View>
      <View style={styles.signOutButtonWrapper}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: '80%',
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    height: 100,
    width: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  buttonImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
  },
  signOutButtonWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  signOutButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 8,
  },
  signOutButtonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  logo: {
    width: 1000,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  }
});

export default HomeScreen;


