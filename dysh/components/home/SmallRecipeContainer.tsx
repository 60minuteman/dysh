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
}

export function SmallRecipeContainer({ recipes }: SmallRecipeContainerProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {recipes.map((recipe) => (
        <View key={recipe.id} style={styles.cardContainer}>
          <SmallRecipeCard
            {...recipe}
            onPress={() => router.push('/recipe')}
          />
        </View>
      ))}
      <View style={styles.cardContainer}>
        <SmallRecipeCard
          id="placeholder1"
          title="Recipe 1"
          duration="30 min"
          calories="300 kcal" 
          rating="4.5"
          image={require('../../assets/images/placeholder.png')}
          onPress={() => router.push('/recipe')}
        />
      </View>
      <View style={styles.cardContainer}>
        <SmallRecipeCard
          id="placeholder2"
          title="Recipe 2"
          duration="45 min"
          calories="400 kcal"
          rating="4.7"
          image={require('../../assets/images/placeholder.png')}
          onPress={() => router.push('/recipe')}
        />
      </View>
      <View style={styles.cardContainer}>
        <SmallRecipeCard
          id="placeholder3"
          title="Recipe 3"
          duration="25 min"
          calories="250 kcal"
          rating="4.3"
          image={require('../../assets/images/placeholder.png')}
          onPress={() => router.push('/recipe')}
        />
      </View>
      <View style={styles.cardContainer}>
        <SmallRecipeCard
          id="placeholder4"
          title="Recipe 4"
          duration="35 min"
          calories="350 kcal"
          rating="4.6"
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
    gap: 140,
  },
  cardContainer: {
    width: 160,
  },
}); 