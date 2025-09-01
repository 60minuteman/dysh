import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface IngredientItemProps {
  name: string;
  emoji: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function IngredientItem({ 
  name, 
  emoji, 
  quantity,
  onDecrease,
  onIncrease,
}: IngredientItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onDecrease}
          disabled={quantity === 0}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onIncrease}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F6',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
    lineHeight: 24,
  },
  quantity: {
    fontSize: 17,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
    minWidth: 24,
    textAlign: 'center',
  },
}); 