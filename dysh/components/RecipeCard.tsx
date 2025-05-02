import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

interface RecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  rating: string;
  locked?: boolean;
}

export function RecipeCard({ 
  title, 
  duration, 
  calories, 
  rating,
  locked = true 
}: RecipeCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/placeholder.png')}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          {locked && (
            <View style={styles.lockContainer}>
              <Text style={styles.lockText}>Unlock 🔒</Text>
            </View>
          )}
        </ImageBackground>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>⏱ {duration}</Text>
          <Text style={styles.metaText}>🔥 {calories}</Text>
          <Text style={styles.metaText}>⭐️ {rating}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 252,
    marginRight: 12,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    paddingBottom: 12,
  },
  image: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 12,
  },
  lockContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  lockText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#000',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Satoshi-Medium',
    color: '#666',
  },
}); 