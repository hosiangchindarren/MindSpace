import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import MeditationScreen from "../screens/MeditationScreen";
import GoalSettingScreen from "../screens/GoalSettingScreen";
import AddGoalScreen from "../screens/AddGoalScreen";
import EditGoalScreen from '../screens/EditGoalScreen';

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
        name="Meditation" 
        component={MeditationScreen} 
        options={{
          headerTitleAlign: 'center',
          headerLeft: () => null,
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
        name="Edit Goal" 
        component={EditGoalScreen}
        options={{
          headerTitleAlign: 'center',
        }}  
      />
    </Stack.Navigator>
  );
};
