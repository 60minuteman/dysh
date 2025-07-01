import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SmallRecipeCard } from './SmallRecipeCard';
import { useRouter } from 'expo-router';

interface Recipe {
  id: string;
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
}

interface SmallRecipeContainerProps {
  recipes: Recipe[];
  isPro?: boolean;
  onUpgrade?: () => void;
  onRecipePress?: (recipe: Recipe) => void;
}

export function SmallRecipeContainer({ recipes, isPro = false, onUpgrade, onRecipePress }: SmallRecipeContainerProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {recipes.map((recipe, index) => (
        <View key={recipe.id} style={styles.cardContainer}>
          <SmallRecipeCard
            {...recipe}
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
    gap: 140,
  },
  cardContainer: {
    width: 160,
  },
}); 