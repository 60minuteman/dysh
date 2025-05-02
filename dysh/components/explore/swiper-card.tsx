import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SwiperCardProps {
  children: React.ReactNode;
}

export function SwiperCard({ children }: SwiperCardProps) {
  return (
    <Animated.View style={styles.container}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
}); 