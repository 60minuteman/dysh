import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ProBadge() {
  return (
    <LinearGradient
      colors={['#A8FF96', '#67E0E3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.text}>PRO</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Satoshi-Black',
    color: '#201A25',
    letterSpacing: 2,
  },
}); 