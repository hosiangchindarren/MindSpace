import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const FireEffect = ({ children }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/flame_textbox.png')}
        style={styles.flame}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',  
    marginTop: 16,  
  },
  flame: {
    position: 'absolute',
    width: '100%',  
    height: 100,  
  },
  textContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FireEffect;
