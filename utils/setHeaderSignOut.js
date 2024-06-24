// utils/setHeaderSignOut.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const setHeaderSignOut = (navigation) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            signOut(auth).then(() => {
              navigation.navigate('Login');
            }).catch((error) => console.error('Error signing out: ', error));
          }}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: '#4B0082', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
};

export default setHeaderSignOut;
