import React from 'react';
import { View, Text, StyleSheet, ImageBackground, useWindowDimensions } from 'react-native';
import { CountryPill } from './country-pill';
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeOverlay } from './swipe-overlay';

interface RecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
  country: {
    flag: string;
    name: string;
  };
  swipeDirection?: 'left' | 'right' | null;
  swipeProgress?: number;
}

export function RecipeCard({ 
  title,
  duration,
  calories,
  rating,
  image,
  country,
  swipeDirection,
  swipeProgress = 0,
}: RecipeCardProps) {
  const { height: screenHeight } = useWindowDimensions();
  const cardHeight = screenHeight * 0.63; // Approximately 503px on standard screen heights

  return (
    <View style={[styles.container, { height: cardHeight }]}>
      {swipeDirection && (
        <View style={[StyleSheet.absoluteFill, styles.overlayContainer]}>
          <SwipeOverlay 
            type={swipeDirection === 'right' ? 'like' : 'skip'}
            opacity={swipeProgress}
          />
        </View>
      )}
      <ImageBackground 
        source={image}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgb(0, 0, 0)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.countryPillContainer}>
              <CountryPill flag={country.flag} name={country.name} />
            </View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <View style={styles.stats}>
              <Text style={styles.stat}>⏱ {duration}</Text>
              <Text style={styles.stat}>🔥 {calories}</Text>
              <Text style={styles.stat}>⭐️ {rating}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#EAEAEA',
    backgroundColor: '#EAEAEA',
    width: '100%',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    marginBottom: '20%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 40, // Match container radius
  },
  imageStyle: {
    borderRadius: 21, // Slightly smaller to account for border
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    borderRadius: 24, // Match container radius
  },
  countryPillContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  content: {
    gap: 8,
    alignItems: 'center',
    marginBottom: '10%',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Satoshi-Black',
    color: '#FFFFFF',
    textAlign: 'center',
    maxWidth: '90%',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  stat: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#FFFFFF',
  },
  overlayContainer: {
    zIndex: 999, // Ensure overlay is on top
    elevation: 999, // For Android
  },
}); 