import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IngredientPillProps {
  label: string;
  onRemove: () => void;
}

export function IngredientPill({ label, onRemove }: IngredientPillProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={16} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
    marginRight: 6,
  },
}); 