import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

interface CountryPillProps {
  flag: string;
  name: string;
}

export function CountryPill({ flag, name }: CountryPillProps) {
  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      <Text style={styles.text}>{flag} {name}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  text: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#FFFFFF',
  },
}); 