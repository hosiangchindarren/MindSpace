import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '../components/CustomDrawerContent';  // Ensure correct import path
import ViewEntriesScreen from '../screens/Journal/ViewEntriesScreen';
import EditEntryScreen from '../screens/Journal/EditEntryScreen';
import NewEntryScreen from '../screens/Journal/NewEntryScreen';
import MoodTrackingScreen from '../screens/MoodTracking/MoodTrackingScreen';
import MoodHistoryScreen from '../screens/MoodTracking/MoodHistoryScreen';
import MoodStatisticsScreen from '../screens/MoodTracking/MoodStatisticsScreen';
import GoalSettingScreen from '../screens/GoalSetting/GoalSettingScreen';
import AddGoalScreen from '../screens/GoalSetting/AddGoalScreen';
import EditGoalScreen from '../screens/GoalSetting/EditGoalScreen';
import ForumScreen from '../screens/Forum/ForumScreen';
import AddPostScreen from '../screens/Forum/AddPostScreen';
import PostDetailsScreen from '../screens/Forum/PostDetailsScreen';
import MeditationScreen from '../screens/Meditation/MeditationScreen';
import CalendarScreen from '../screens/DynamicCalendar/CalendarScreen';
import AddReminderScreen from '../screens/DynamicCalendar/AddReminderScreen';
import EditReminderScreen from '../screens/DynamicCalendar/EditReminderScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const defaultScreenOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
      <Ionicons name="menu" size={24} color="black" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  ),
});

const JournalStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Journal" 
      component={ViewEntriesScreen} 
      options={({ navigation }) => ({
        ...defaultScreenOptions({ navigation }),
        headerTitle: "Journal",
      })} 
    />
    <Stack.Screen name="Edit Entry" component={EditEntryScreen} options={{ headerTitle: "Edit Entry" }} />
    <Stack.Screen name="New Entry" component={NewEntryScreen} options={{ headerTitle: "New Entry" }} />
  </Stack.Navigator>
);

const MoodTrackingStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Mood Tracker" 
      component={MoodTrackingScreen} 
      options={({ navigation }) => ({
        ...defaultScreenOptions({ navigation }),
        headerTitle: "Mood Tracker",
      })} 
    />
    <Stack.Screen name="Mood History" component={MoodHistoryScreen} options={{ headerTitle: "Mood History" }} />
    <Stack.Screen name="Mood Statistics" component={MoodStatisticsScreen} options={{ headerTitle: "Mood Statistics" }} />
  </Stack.Navigator>
);

const GoalSettingStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Goals" 
      component={GoalSettingScreen} 
      options={({ navigation }) => ({
        ...defaultScreenOptions({ navigation }),
        headerTitle: "Goals",
      })} 
    />
    <Stack.Screen name="Add Goal" component={AddGoalScreen} options={{ headerTitle: "Add Goal" }} />
    <Stack.Screen name="Edit Goal" component={EditGoalScreen} options={{ headerTitle: "Edit Goal" }} />
  </Stack.Navigator>
);

const ForumStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Forum" 
      component={ForumScreen} 
      options={({ navigation }) => ({
        ...defaultScreenOptions({ navigation }),
        headerTitle: "Forum",
      })} 
    />
    <Stack.Screen name="Add Post" component={AddPostScreen} options={{ headerTitle: "Add Post" }} />
    <Stack.Screen name="Post Details" component={PostDetailsScreen} options={{ headerTitle: "Post Details" }} />
  </Stack.Navigator>
);

const MeditationStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Meditation" 
      component={MeditationScreen} 
      options={({ navigation }) => ({
        ...defaultScreenOptions({ navigation }),
        headerTitle: "Meditation",
      })} 
    />
  </Stack.Navigator>
);

const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Calendar" 
      component={CalendarScreen} 
      options={({ navigation }) => ({
        ...defaultScreenOptions({ navigation }),
        headerTitle: "Calendar",
      })} 
    />
    <Stack.Screen name="Add Reminder" component={AddReminderScreen} options={{ headerTitle: "Add Reminder" }} />
    <Stack.Screen name="Edit Reminder" component={EditReminderScreen} options={{ headerTitle: "Edit Reminder" }} />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Journal"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ 
        headerShown: false,
        drawerLabelStyle: { fontSize: 16 }, // Optional: Customize the label style
        drawerActiveTintColor: '#E6E6FA',  // Set active item color
      }}
    >
      <Drawer.Screen name="Journal" component={JournalStack} />
      <Drawer.Screen name="Mood Tracker" component={MoodTrackingStack} />
      <Drawer.Screen name="Goals" component={GoalSettingStack} />
      <Drawer.Screen name="Forum" component={ForumStack} />
      <Drawer.Screen name="Meditation" component={MeditationStack} />
      <Drawer.Screen name="Calendar" component={CalendarStack} />
    </Drawer.Navigator>
  );
};

export default AppStack;
