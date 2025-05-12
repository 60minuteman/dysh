import React from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RecipePreviewCardProps {
  title: string;
  time: string;
  calories: string;
  rating: string;
  image: ImageSourcePropType;
  countryFlag?: string;
}

export function RecipePreviewCard({ 
  title, 
  time, 
  calories, 
  rating, 
  image,
  countryFlag = '🇳🇬'
}: RecipePreviewCardProps) {
  return (
    <View style={styles.recipeCard}>
      <ImageBackground 
        source={image} 
        style={styles.recipeImage}
        resizeMode="cover"
      >
        <View style={styles.flagContainer}>
          <Text style={styles.flagText}>{countryFlag}</Text>
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <Text style={styles.recipeTitle}>{title}</Text>
          <View style={styles.recipeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statText}>{time}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statText}>{calories}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>{rating}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  recipeImage: {
    width: '100%',
    height: 500,
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  flagContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  flagText: {
    fontSize: 24,
  },
  recipeTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Regular',
  },
}); 