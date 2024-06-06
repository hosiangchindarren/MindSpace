import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import MeditationScreen from "../screens/MeditationScreen";
import GoalSettingScreen from "../screens/GoalSettingScreen";
import AddGoalScreen from "../screens/AddGoalScreen";
import EditGoalScreen from '../screens/EditGoalScreen';
import MoodTrackingScreen from '../screens/MoodTrackingScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import MoodStatisticsScreen from '../screens/MoodStatisticsScreen';
import ViewEntriesScreen from "../screens/ViewEntriesScreen";
import EntryDetailScreen from "../screens/EntryDetailScreen";
import JournalScreen from "../screens/JournalScreen";
import ForumScreen from "../screens/ForumScreen";
import AddPostScreen from "../screens/AddPostScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";

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
