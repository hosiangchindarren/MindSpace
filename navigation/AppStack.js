import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import MeditationScreen from "../screens/MeditationScreen";

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
    </Stack.Navigator>
  );
};
