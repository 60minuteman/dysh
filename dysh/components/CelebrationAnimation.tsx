import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface ConfettiProps {
  color: string;
  left: string;
  top: string;
  rotate: string;
}

const Confetti = ({ color, left, top, rotate }: ConfettiProps) => (
  <View 
    style={[
      styles.confetti, 
      { 
        backgroundColor: color,
        left,
        top,
        transform: [{ rotate }]
      }
    ]} 
  />
);

const Ribbon = ({ color, left, top, rotate }: ConfettiProps) => (
  <View 
    style={[
      styles.ribbon, 
      { 
        backgroundColor: color,
        left,
        top,
        transform: [{ rotate }]
      }
    ]} 
  />
);

interface CelebrationAnimationProps {
  message?: string;
}

export function CelebrationAnimation({ message }: CelebrationAnimationProps) {
  return (
    <View style={styles.container}>
      {/* Confetti */}
      <Confetti color="#FF5252" left="10%" top="5%" rotate="15deg" />
      <Confetti color="#FFEB3B" left="20%" top="15%" rotate="-25deg" />
      <Confetti color="#2196F3" left="70%" top="8%" rotate="45deg" />
      <Confetti color="#4CAF50" left="85%" top="20%" rotate="-10deg" />
      <Confetti color="#9C27B0" left="40%" top="5%" rotate="30deg" />
      
      {/* Ribbons */}
      <Ribbon color="#E91E63" left="5%" top="10%" rotate="35deg" />
      <Ribbon color="#FF9800" left="75%" top="5%" rotate="-30deg" />
      <Ribbon color="#03A9F4" left="45%" top="8%" rotate="15deg" />
      <Ribbon color="#8BC34A" left="65%" top="15%" rotate="-25deg" />
      <Ribbon color="#673AB7" left="25%" top="12%" rotate="40deg" />
      
      {/* Message */}
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
    zIndex: 10,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  ribbon: {
    position: 'absolute',
    width: 25,
    height: 8,
    borderRadius: 4,
  },
  messageContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  message: {
    color: '#68D431',
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
  },
}); 