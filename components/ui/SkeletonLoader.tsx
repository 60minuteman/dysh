import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface SkeletonLoaderProps {
  variant?: 'large' | 'small';
}

export function SkeletonLoader({ variant = 'large' }: SkeletonLoaderProps) {
  const isLarge = variant === 'large';
  const cardWidth = isLarge ? screenWidth * 0.8 : 160;
  const cardHeight = isLarge ? 380 : 200;

  return (
    <View style={[styles.container, { width: cardWidth, height: cardHeight }]}>
      <LinearGradient
        colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, isLarge ? styles.largeCard : styles.smallCard]}
      >
        {/* Image placeholder */}
        <View style={[styles.imagePlaceholder, isLarge ? styles.largeImage : styles.smallImage]} />
        
        {/* Content placeholder */}
        <View style={styles.content}>
          <View style={[styles.textLine, styles.titleLine]} />
          <View style={[styles.textLine, styles.subtitleLine]} />
          
          {isLarge && (
            <>
              <View style={styles.statsContainer}>
                <View style={[styles.textLine, styles.statLine]} />
                <View style={[styles.textLine, styles.statLine]} />
                <View style={[styles.textLine, styles.statLine]} />
              </View>
              <View style={[styles.buttonPlaceholder]} />
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

export function SkeletonSection({ count = 3, variant = 'large' }: { count?: number; variant?: 'large' | 'small' }) {
  return (
    <View style={styles.section}>
      {/* Section title skeleton */}
      <View style={styles.sectionHeader}>
        <View style={[styles.textLine, styles.sectionTitle]} />
      </View>
      
      {/* Cards skeleton */}
      <View style={[styles.cardsContainer, variant === 'small' && styles.smallCardsContainer]}>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonLoader key={index} variant={variant} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
  },
  largeCard: {
    borderRadius: 24,
  },
  smallCard: {
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  imagePlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  largeImage: {
    height: '60%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  smallImage: {
    height: 120,
    margin: 10,
    borderRadius: 20,
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  textLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
    marginBottom: 8,
  },
  titleLine: {
    height: 20,
    width: '80%',
  },
  subtitleLine: {
    height: 16,
    width: '60%',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 12,
  },
  statLine: {
    height: 14,
    width: 50,
  },
  buttonPlaceholder: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    height: 24,
    width: 150,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  smallCardsContainer: {
    gap: 140,
  },
}); 