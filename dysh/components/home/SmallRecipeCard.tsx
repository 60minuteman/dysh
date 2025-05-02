import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface SmallRecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
  onPress?: () => void;
}

export function SmallRecipeCard({ 
  title, 
  duration, 
  calories, 
  rating,
  image,
  onPress 
}: SmallRecipeCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title + '\n'} {/* Forces 2 lines even for short text */}
        </Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>⏱ {duration}</Text>
          <Text style={styles.stat}>🔥 {calories}</Text>
          <Text style={styles.stat}>⭐️ {rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 288,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 20,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 24, // Increased to 120% of fontSize (20 * 1.2 = 24)
    height: 48, // Adjusted for 2 lines with new lineHeight (24 * 2)
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    fontSize: 13,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
  },
}); 