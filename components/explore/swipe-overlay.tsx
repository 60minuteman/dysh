import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SwipeOverlayProps {
  type: 'like' | 'skip';
  opacity: number;
}

export function SwipeOverlay({ type, opacity }: SwipeOverlayProps) {
  const colors = type === 'like' 
    ? ['#64D61D', '#64D61D', 'rgba(100, 214, 29, 0)'] as const
    : ['#FF3B30', '#FF3B30', 'rgba(255, 59, 48, 0)'] as const;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { opacity }]}
    >
      <Text style={styles.text}>
        {type === 'like' ? 'Love' : 'Skip'}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '10%',
    borderRadius: 21,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    marginLeft: '10%',
    zIndex: 1000,
  },
});