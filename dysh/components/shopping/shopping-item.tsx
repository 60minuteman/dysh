import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface ShoppingItemProps {
  name: string;
  emoji: string;
  onRemove?: () => void;
  onAddToCart?: () => void;
}

export function ShoppingItem({ name, emoji, onRemove, onAddToCart }: ShoppingItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
        <Image 
          source={require('../../assets/icons/cherry.png')}
          style={styles.cartIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 24,
    color: '#666666',
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  addToCartButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
}); 