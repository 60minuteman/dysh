import React from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RecipePreviewCardProps {
  title: string;
  time: string;
  calories: string;
  rating: string;
  image: ImageSourcePropType | { uri: string }; // Support both local and URI images
  countryFlag?: string;
  onPress?: () => void;
}

export function RecipePreviewCard({ 
  title, 
  time, 
  calories, 
  rating, 
  image,
  countryFlag = '🇳🇬',
  onPress
}: RecipePreviewCardProps) {
  // Format the stats
  const formattedTime = time.replace('minutes', 'mins');
  const formattedCalories = calories.includes('per serving') 
    ? calories.replace('per serving', '').replace('calories', 'KCAL').trim()
    : calories.replace('calories', 'KCAL');
  const formattedRating = rating.includes('stars') 
    ? rating.split(' ')[0] 
    : rating;

  const CardContent = () => (
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
              <Text style={styles.statText}>{formattedTime}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statText}>{formattedCalories}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>{formattedRating}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
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