import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CuisineHeaderProps {
  title: string;
  cuisine: string;
}

export function CuisineHeader({ title, cuisine }: CuisineHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.cuisineTag}>
        <Text style={styles.cuisineText}>{cuisine}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    color: '#000000',
  },
  cuisineTag: {
    backgroundColor: '#EDEDED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  cuisineText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
  },
}); 