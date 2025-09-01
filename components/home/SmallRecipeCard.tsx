import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface SmallRecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
  onPress?: () => void;
  isLocked?: boolean;
  onUpgrade?: () => void;
}

export function SmallRecipeCard({ 
  title, 
  duration, 
  calories, 
  rating,
  image,
  onPress,
  isLocked = false,
  onUpgrade
}: SmallRecipeCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={isLocked ? onUpgrade : onPress} 
      activeOpacity={0.8}
    >
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
      
      {/* Blur overlay for locked recipes */}
      {isLocked && (
        <View style={styles.lockOverlay}>
          <BlurView intensity={60} style={styles.blurView}>
            <View style={styles.lockContent}>
              <View style={styles.lockIconContainer}>
                <Ionicons name="lock-closed" size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.lockTitle}>Premium</Text>
              <Text style={styles.lockSubtitle}>Tap to upgrade</Text>
            </View>
          </BlurView>
        </View>
      )}
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
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  lockContent: {
    alignItems: 'center',
    padding: 16,
  },
  lockIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockTitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Black',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  lockSubtitle: {
    fontSize: 12,
    fontFamily: 'Satoshi-Medium',
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.8,
  },
}); 