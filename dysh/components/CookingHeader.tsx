import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CookingHeaderProps {
  duration: string;
  calories: string;
  rating: string;
  onEndCooking: () => void;
  onViewRecipe: () => void;
}

export function CookingHeader({ 
  duration, 
  calories, 
  rating, 
  onEndCooking, 
  onViewRecipe 
}: CookingHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#64D61D', 'rgba(100, 214, 29, 0)']}
      style={[styles.container, { paddingTop: insets.top + 16 }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.8]} // Added locations for better gradient control
    >
      {/* Top row - Navigation buttons */}
      <View style={styles.headerButtonRow}>
        <TouchableOpacity onPress={onEndCooking}>
          <Text style={styles.headerButton}>End Cooking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onViewRecipe}>
          <Text style={styles.headerButton}>View Recipe</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom row - Recipe stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⏱</Text>
          <Text style={styles.statText}>{duration}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 200,
    backgroundColor: 'transparent', // Added to ensure gradient shows properly
  },
  headerButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerButton: {
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
  },
});