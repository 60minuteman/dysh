import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface CelebrationCardProps {
  title: string;
  description: string;
  onShare?: () => void;
  onFavorite?: () => void;
  onEndCooking?: () => void;
}

export function CelebrationCard({
  title,
  description,
  onShare,
  onFavorite,
  onEndCooking,
}: CelebrationCardProps) {
  const router = useRouter();

  const handleEndCooking = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Share your dish with us @dailydysh</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
          <Text style={styles.favoriteIcon}>🖤</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Text style={styles.shareIcon}>🔗</Text>
          <Text style={styles.shareButtonText}>Share Recipe</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.endCookingButton} onPress={handleEndCooking}>
        <Text style={styles.endCookingButtonText}>End Cooking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D4EDC5',
    borderRadius: 24,
    padding: 24,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    marginBottom: 32,
    width: '100%',
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
    textAlign: 'left',
    lineHeight: 30,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
    width: '100%',
  },
  favoriteButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: 'transparent',
  },
  shareIcon: {
    fontSize: 18,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
  },
  endCookingButton: {
    backgroundColor: '#64D61D',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 32,
    width: '100%',
    alignItems: 'center',
  },
  endCookingButtonText: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
});