import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface CookbookRecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  image: any;
  onPress?: () => void;
}

export function CookbookRecipeCard({ 
  title,
  duration,
  calories,
  image,
  onPress
}: CookbookRecipeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text 
          style={styles.title} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <View style={styles.stats}>
          <View style={styles.statContainer}>
            <Text style={styles.statIcon}>⏱</Text>
            <Text style={styles.statText}>{duration}</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statText}>{calories}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    padding: 8,
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 16,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Satoshi-Black',
    color: '#201A25',
    marginBottom: 8,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
  },
}); 