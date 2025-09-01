import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface PlanOptionProps {
  title: string;
  price: string;
  selected?: boolean;
  onSelect: () => void;
}

export function PlanOption({ title, price, selected, onSelect }: PlanOptionProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, selected && styles.containerSelected]} 
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View>
        <Text style={[styles.title, selected && styles.textSelected]}>{title}</Text>
        <Text style={[styles.price, selected && styles.textSelected]}>{price}</Text>
      </View>
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {selected && (
          <Image 
            source={require('../../assets/icons/check.png')}
            style={styles.checkIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerSelected: {
    backgroundColor: '#64D61D',
    borderColor: '#64D61D',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: {
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF'
  }
}); 