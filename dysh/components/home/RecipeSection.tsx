import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { RecipeContainer } from './RecipeContainer';
import { SectionHeader } from './SectionHeader';

const { width: screenWidth } = Dimensions.get('window');

interface Recipe {
  id: string;
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
}

interface RecipeSectionProps {
  title: string;
  timer?: string;
  recipes: Recipe[];
  isPro?: boolean;
  onUpgrade?: () => void;
  onRecipePress?: (recipe: Recipe) => void;
  onMealTypeSelect?: (mealType: string) => void;
}

export function RecipeSection({ title, timer, recipes, isPro = false, onUpgrade, onRecipePress, onMealTypeSelect }: RecipeSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeader title={title} timer={timer} onMealTypeSelect={onMealTypeSelect} />
      </View>
      <RecipeContainer recipes={recipes} isPro={isPro} onUpgrade={onUpgrade} onRecipePress={onRecipePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: screenWidth > 768 ? 40 : 32,
  },
  header: {
    paddingHorizontal: screenWidth > 768 ? 32 : screenWidth > 480 ? 24 : 20,
    marginBottom: screenWidth > 768 ? 20 : 16,
  },
}); 