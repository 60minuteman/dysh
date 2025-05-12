import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { RecipePreviewCard } from './RecipePreviewCard';

interface RecipePreviewItem {
  id?: string;
  title: string;
  time: string;
  calories: string;
  rating: string;
  image: any;
  countryFlag?: string;
}

interface RecipePreviewContainerProps {
  recipes: RecipePreviewItem[];
  countryFlag?: string;
}

export function RecipePreviewContainer({ recipes, countryFlag }: RecipePreviewContainerProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 60; // Increased width by reducing the subtraction from 80 to 60

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={cardWidth + 16} // Add gap to snap interval
      snapToAlignment="start"
      pagingEnabled={false}
    >
      {recipes.map((recipe, index) => (
        <View key={recipe.id || index} style={[styles.cardWrapper, { width: cardWidth }]}>
          <RecipePreviewCard
            title={recipe.title}
            time={recipe.time}
            calories={recipe.calories}
            rating={recipe.rating}
            image={recipe.image}
            countryFlag={recipe.countryFlag || countryFlag}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginRight: 16,
  },
}); 