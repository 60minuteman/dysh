import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingButtonProps {
  onPress: () => void;
}

export function FloatingButton({ onPress }: FloatingButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity 
      style={[styles.button, { bottom: insets.bottom + 20 }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={require('../../assets/icons/plus.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#64D61D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64D61D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
}); 