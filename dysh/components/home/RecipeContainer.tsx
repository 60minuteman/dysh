import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RecipeCard } from './RecipeCard';
import { useRouter } from 'expo-router';

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
}

export function RecipeContainer({ recipes }: RecipeContainerProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={320 + 16} // card width + gap
      snapToAlignment="start"
    >
      {recipes.map((recipe) => (
        <View key={recipe.id} style={styles.cardContainer}>
          <RecipeCard
            title={recipe.title}
            duration={recipe.duration}
            calories={recipe.calories}
            rating={recipe.rating}
            image={recipe.image}
            onPress={() => router.push('/recipe')}
          />
        </View>
      ))}
      <View style={styles.cardContainer}>
        <RecipeCard
          title="Grilled Salmon"
          duration="25 min"
          calories="350 kcal"
          rating="4.8"
          image={require('../../assets/images/placeholder.png')}
          onPress={() => router.push('/recipe')}
        />
      </View>
      <View style={styles.cardContainer}>
        <RecipeCard
          title="Chicken Stir Fry"
          duration="30 min" 
          calories="400 kcal"
          rating="4.6"
          image={require('../../assets/images/placeholder.png')}
          onPress={() => router.push('/recipe')}
        />
      </View>
      <View style={styles.cardContainer}>
        <RecipeCard
          title="Vegetable Pasta"
          duration="20 min"
          calories="300 kcal"
          rating="4.5"
          image={require('../../assets/images/placeholder.png')}
          onPress={() => router.push('/recipe')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardContainer: {
    width: 350,
  },
}); 