import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

interface ActionButtonProps {
  variant: 'like' | 'reject';
  onPress: () => void;
}

export function ActionButton({ variant, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        variant === 'like' ? styles.likeButton : styles.rejectButton
      ]}
      onPress={onPress}
    >
      <Image
        source={
          variant === 'like' 
            ? require('../../assets/icons/heart.png')
            : require('../../assets/icons/close.png')
        }
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    backgroundColor: '#64D61D',
  },
  rejectButton: {
    backgroundColor: '#FF4B55',
  },
  icon: {
    width: 32,
    height: 32,
  },
}); 