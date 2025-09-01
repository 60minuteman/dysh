import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  inputStyle?: any;
}

export function Input({ 
  label, 
  error, 
  containerStyle, 
  inputStyle,
  style, 
  ...props 
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle, style]}
        placeholderTextColor="#999999"
        selectionColor="#64D61D"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4D4D4',
    fontFamily: 'Satoshi-Medium',
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingHorizontal: 0,
    paddingVertical: 12,
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Satoshi-Regular',
    minHeight: 48,
  },
  error: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'Satoshi-Regular',
    marginTop: 4,
  },
});
