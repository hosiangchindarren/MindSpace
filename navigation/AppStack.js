import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import MeditationScreen from "../screens/Meditation/MeditationScreen";
import GoalSettingScreen from "../screens/GoalSetting/GoalSettingScreen";
import AddGoalScreen from "../screens/GoalSetting/AddGoalScreen";
import EditGoalScreen from '../screens/GoalSetting/EditGoalScreen';
import MoodTrackingScreen from '../screens/MoodTracking/MoodTrackingScreen';
import MoodHistoryScreen from '../screens/MoodTracking/MoodHistoryScreen';
import MoodStatisticsScreen from '../screens/MoodTracking/MoodStatisticsScreen';
import ViewEntriesScreen from "../screens/Journal/ViewEntriesScreen";
import EditEntryScreen from "../screens/Journal/EditEntryScreen";
import EntryDetailScreen from "../screens/Journal/EntryDetailScreen";
import JournalScreen from "../screens/Journal/JournalScreen";
import ForumScreen from "../screens/Forum/ForumScreen";
import AddPostScreen from "../screens/Forum/AddPostScreen";
import PostDetailsScreen from "../screens/Forum/PostDetailsScreen";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Journal" 
        component={JournalScreen} 
        options={{
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="EditEntry" 
        component={EditEntryScreen} 
        options={{
          headerTitleAlign: 'center',
        }}  
      /> 
      <Stack.Screen 
        name="ViewEntries" 
        component={ViewEntriesScreen} 
        options={{
          headerTitleAlign: 'center',
        }}  
      /> 
      <Stack.Screen 
        name="EntryDetail" 
        component={EntryDetailScreen} 
        options={{
          headerTitleAlign: 'center',
        }}  
      /> 
      <Stack.Screen 
        name="Meditation" 
        component={MeditationScreen} 
        options={{
          headerTitleAlign: 'center',
        }} 
      /> 
      <Stack.Screen 
        name="Goals" 
        component={GoalSettingScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Add Goal" 
        component={AddGoalScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Mood History" 
        component={MoodHistoryScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Mood Tracking" 
        component={MoodTrackingScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Mood Statistics" 
        component={MoodStatisticsScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Edit Goal" 
        component={EditGoalScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Forum" 
        component={ForumScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Add Post" 
        component={AddPostScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
      <Stack.Screen 
        name="Post Details" 
        component={PostDetailsScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
    </Stack.Navigator>
  );
};
