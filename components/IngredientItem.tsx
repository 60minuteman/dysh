import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IngredientItemProps {
  name: string;
  onPress: () => void;
  disabled?: boolean;
}

export function IngredientItem({ name, onPress, disabled }: IngredientItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, disabled && styles.containerDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.name, disabled && styles.nameDisabled]}>{name}</Text>
      <Ionicons 
        name="add-circle-outline" 
        size={24} 
        color={disabled ? "#999" : "#000"} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
  },
  nameDisabled: {
    color: '#999',
  },
}); 