import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PillProps {
  label: string;
  onPress?: () => void;
  icon?: 'add' | null;
  variant?: 'default' | 'outline';
}

export function Pill({ 
  label, 
  onPress, 
  icon = null,
  variant = 'default'
}: PillProps) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={[
        styles.container,
        variant === 'outline' && styles.containerOutline,
        onPress && styles.pressable
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.label,
        variant === 'outline' && styles.labelOutline
      ]}>
        {label}
      </Text>
      {icon === 'add' && (
        <Ionicons name="add" size={16} color="#666666" />
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 4,
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  pressable: {
    cursor: 'pointer',
  },
  label: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
  },
  labelOutline: {
    color: '#666666',
  },
}); 