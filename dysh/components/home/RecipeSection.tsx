import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RecipeContainer } from './RecipeContainer';
import { SectionHeader } from './SectionHeader';

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
}

export function RecipeSection({ title, timer, recipes }: RecipeSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeader title={title} timer={timer} />
      </View>
      <RecipeContainer recipes={recipes} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
}); 