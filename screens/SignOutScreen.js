import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";

const SignOutScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => console.error("Error signing out: ", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to sign out, {user.displayName}?</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6FA",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center", 
  },
  button: {
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});

export default SignOutScreen;
