import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

const CustomDrawerContent = ({ navigation, state }) => {
  const { user } = useContext(AuthenticatedUserContext);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    }).catch((error) => console.error('Error signing out: ', error));
  };

  const handleNavigate = (name) => {
    navigation.reset({
      index: 0,
      routes: [{ name }],
    });
  };

  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.userContainer}>
        <Text style={styles.userName}>Hello, {user.displayName}</Text>
      </View>
      <View style={styles.drawerContent}>
        <DrawerItem
          label="Journal"
          icon={() => <Image source={require('../assets/Journal.png')} style={styles.icon} />}
          onPress={() => handleNavigate('Journal')}
          focused={state.index === 0}
          activeBackgroundColor="#E6E6FA"
          activeTintColor='#4B0082'
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Mood Tracker"
          icon={() => <Image source={require('../assets//MoodTracking.png')} style={styles.icon} />}
          onPress={() => handleNavigate('Mood Tracker')}
          focused={state.index === 1}
          activeBackgroundColor="#E6E6FA"
          activeTintColor='#4B0082'
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Goals"
          icon={() => <Image source={require('../assets/GoalSetting.png')} style={styles.icon} />}
          onPress={() => handleNavigate('Goals')}
          focused={state.index === 2}
          activeBackgroundColor="#E6E6FA"
          activeTintColor='#4B0082'
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Forum"
          icon={() => <Image source={require('../assets/Forum.png')} style={styles.icon} />}
          onPress={() => handleNavigate('Forum')}
          focused={state.index === 3}
          activeBackgroundColor="#E6E6FA"
          activeTintColor='#4B0082'
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Meditation"
          icon={() => <Image source={require('../assets/Meditation.png')} style={styles.icon} />}
          onPress={() => handleNavigate('Meditation')}
          focused={state.index === 4}
          activeBackgroundColor="#E6E6FA"
          activeTintColor='#4B0082'
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Calendar"
          icon={() => <Image source={require('../assets/calendar.png')} style={styles.icon} />}
          onPress={() => handleNavigate('Calendar')}
          focused={state.index === 5}
          activeBackgroundColor="#E6E6FA"
          activeTintColor='#4B0082'
          labelStyle={styles.drawerLabel}
        />
      </View>
      <View style={styles.signOutContainer}>
        <Button title="Sign Out" color = '#4B0082' onPress={handleSignOut} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    marginVertical: 20,
    marginHorizontal: 16,
  },
  userName: {
    fontSize: 16,
    marginBottom: 10,
  },
  drawerContent: {
    flexGrow: 1,
  },
  signOutContainer: {
    flexShrink: 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 1,
  },
  drawerLabel: {
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
