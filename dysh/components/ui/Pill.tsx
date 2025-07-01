import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PillProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
  icon?: 'add' | null;
  variant?: 'default' | 'outline';
}

export function Pill({ 
  label, 
  onPress, 
  selected = false,
  disabled = false,
  onRemove,
  icon = null,
  variant = 'default'
}: PillProps) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={[
        styles.container,
        variant === 'outline' && styles.containerOutline,
        selected && styles.containerSelected,
        disabled && styles.containerDisabled,
        onPress && styles.pressable
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[
        styles.label,
        variant === 'outline' && styles.labelOutline,
        selected && styles.labelSelected,
        disabled && styles.labelDisabled
      ]}>
        {label}
      </Text>
      {icon === 'add' && (
        <Ionicons name="add" size={16} color="#666666" />
      )}
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={16} color={selected ? "#fff" : "#000"} />
        </TouchableOpacity>
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
    gap: 4,
  },
  containerOutline: {
    backgroundColor: 'transparent',
  },
  containerSelected: {
    backgroundColor: '#64D61D',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  pressable: {
    cursor: 'pointer',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
  },
  labelOutline: {
    color: '#666666',
  },
  labelSelected: {
    color: '#ffffff',
  },
  labelDisabled: {
    color: '#999999',
  },
}); 