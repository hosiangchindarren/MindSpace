import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const FireEffect = ({ children, source }) => {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.flame}
        resizeMode="cover"
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
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 10,
  },
  flame: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  textContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FireEffect;
