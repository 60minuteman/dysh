import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { RecipeCard } from './RecipeCard';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface Recipe {
  id: string;
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
}

interface RecipeContainerProps {
  recipes: Recipe[];
  isPro?: boolean;
  onUpgrade?: () => void;
  onRecipePress?: (recipe: Recipe) => void;
}

export function RecipeContainer({ recipes, isPro = false, onUpgrade, onRecipePress }: RecipeContainerProps) {
  const router = useRouter();

  // Calculate responsive card width
  const cardWidth = screenWidth > 768 ? 320 : screenWidth * 0.8;
  const gap = 16;
  const snapToInterval = cardWidth + gap;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={snapToInterval}
      snapToAlignment="start"
    >
      {recipes.map((recipe, index) => (
        <View key={recipe.id} style={[styles.cardContainer, { width: cardWidth }]}>
          <RecipeCard
            title={recipe.title}
            duration={recipe.duration}
            calories={recipe.calories}
            rating={recipe.rating}
            image={recipe.image}
            onPress={() => onRecipePress ? onRecipePress(recipe) : router.push('/recipe')}
            isLocked={!isPro && index > 0}
            onUpgrade={onUpgrade}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardContainer: {
    // width is now dynamically set inline
  },
}); 