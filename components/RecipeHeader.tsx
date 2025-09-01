import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecipeHeaderProps {
  title: string;
  cuisine: string;
}

export function RecipeHeader({ title, cuisine }: RecipeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.cuisineTag}>
        <Text style={styles.cuisineText}>{cuisine}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>30 min</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>320 kcal</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>4.5</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  cuisineTag: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  cuisineText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#000',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#666',
  },
}); 