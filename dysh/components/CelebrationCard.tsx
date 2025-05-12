import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CelebrationCardProps {
  title: string;
  description: string;
  onShare?: () => void;
  onRate?: (rating: number) => void;
  onFavorite?: () => void;
}

export function CelebrationCard({
  title,
  description,
  onShare,
  onRate,
  onFavorite,
}: CelebrationCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rate this recipe</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => onRate && onRate(star)}
              style={styles.starButton}
            >
              <Text style={styles.starIcon}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
          <Text style={styles.favoriteIcon}>♥</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Text style={styles.shareButtonText}>Share Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginVertical: 8,
    width: '100%',
  },
  contentContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    color: '#555',
    lineHeight: 22,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#999',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    marginRight: 8,
  },
  starIcon: {
    fontSize: 24,
    color: '#DDDDDD',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  favoriteIcon: {
    fontSize: 22,
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#F2FFE6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    flex: 1,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#333',
  },
}); 