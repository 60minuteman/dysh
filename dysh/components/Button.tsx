import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function Button({ label, onPress, disabled, variant = 'primary', style }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variant === 'secondary' && styles.containerSecondary,
        disabled && styles.containerDisabled,
        variant === 'primary' && !disabled && styles.containerPrimaryShadow,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.label,
        variant === 'secondary' && styles.labelSecondary,
        disabled && styles.labelDisabled,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#64D61D',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPrimaryShadow: {
    shadowColor: '#64D61D',
    shadowOffset: {
      width: 0,
      height: 13,
    },
    shadowOpacity: 0.44,
    shadowRadius: 14,
    elevation: 14,
  },
  containerSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDisabled: {
    backgroundColor: '#EDEDED',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    }, 
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
  labelSecondary: {
    color: '#000000',
  },
  labelDisabled: {
    color: '#999999',
  },
});
