import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecipeStatsProps {
  duration: string;
  calories: string;
  rating: string;
}

export function RecipeStats({ duration, calories, rating }: RecipeStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.icon}>⏱</Text>
        <Text style={styles.value}>{duration}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.icon}>🔥</Text>
        <Text style={styles.value}>{calories}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.icon}>⭐️</Text>
        <Text style={styles.value}>{rating}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 16,
  },
  value: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
  },
}); 