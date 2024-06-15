import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";
import ForumScreen from "../screens/Forum/ForumScreen";
import ViewEntriesScreen from "../screens/Journal/ViewEntriesScreen";
import MoodTrackingScreen from "../screens/MoodTracking/MoodTrackingScreen";
import GoalSettingScreen from "../screens/GoalSetting/GoalSettingScreen";
import MeditationScreen from "../screens/Meditation/MeditationScreen";
import SignOutScreen from "../screens/SignOutScreen";
import CalendarScreen from "../screens/DynamicCalendar/CalendarScreen";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Forum":
              iconName = require("../assets/Forum.png");
              break;
            case "Journal":
              iconName = require("../assets/Journal.png");
              break;
            case "Mood Tracking":
              iconName = require("../assets/MoodTracking.png");
              break;
            case "Goal Setting":
              iconName = require("../assets/GoalSetting.png");
              break;
            case "Meditation":
              iconName = require("../assets/Meditation.png");
              break;
            case "Sign Out":
              iconName = require("../assets/SignOut.png"); 
              break;
            case "Dynamic Calendar":
              iconName = require("../assets/calendar.png"); 
              break;
          }

          return <Image source={iconName} style={{ width: size, height: size }} />;
        },
        tabBarActiveTintColor: "#4B0082",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Journal" component={ViewEntriesScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Mood Tracking" component={MoodTrackingScreen} />
      <Tab.Screen name="Goal Setting" component={GoalSettingScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Dynamic Calendar" component={CalendarScreen} />
      <Tab.Screen name="Sign Out" component={SignOutScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    left: '10%',
    right: '10%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 8,
  },
  signOutButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
});

export default HomeScreen;
