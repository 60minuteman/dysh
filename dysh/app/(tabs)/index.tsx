import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/home/Header';
import { Pill } from '../../components/ui/Pill';
import { RecipeSection } from '../../components/home/RecipeSection';
import { SmallRecipeContainer } from '../../components/home/SmallRecipeContainer';

export default function Home() {
  const router = useRouter();
  const isPro = true; // This would come from your auth/subscription state

  const breakfastRecipes = [
    {
      id: '1',
      title: 'Sweet Potato Porridge',
      duration: '30 min',
      calories: '320 kcal',
      rating: '4.5',
      image: require('../../assets/images/sweet-potato.jpg'),
    },
    {
      id: '2',
      title: 'Jollof Rice',
      duration: '45 min',
      calories: '450 kcal',
      rating: '4.8',
      image: require('../../assets/images/sweet-potato.jpg'),
    },
    // Add more recipes as needed
  ];

  const lowCarbRecipes = [
    {
      id: '1',
      title: 'Boiled Plantain & Egg Sauce',
      duration: '30 min',
      calories: '320 kcal',
      rating: '4.5',
      image: require('../../assets/images/sweet-potato.jpg'),
    },
    // Add more recipes...
  ];

  const highProteinRecipes = [
    {
      id: '1',
      title: 'Spicy Garlic Chicken Pasta with Beans',
      duration: '30 min',
      calories: '320 kcal',
      rating: '4.5',
      image: require('../../assets/images/sweet-potato.jpg'),
    },
    // Add more recipes...
  ];

  return (
    <ImageBackground 
      source={require('../../assets/images/Home-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Header isPro={isPro} />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paddedContent}>
          <View style={styles.pillsRow}>
            <Pill label="Nigerian Cuisine" />
            <Pill label="Add" icon="add" onPress={() => {}} />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: -12 }]}>
          <RecipeSection
            title="Breakfast"
            timer="Lunch in 35:00"
            recipes={breakfastRecipes}
          />
        </View>
        
        <View style={[styles.section, { marginBottom: 24 }]}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Low-Carb</Text>
          </View>
          <SmallRecipeContainer recipes={lowCarbRecipes} />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>High Protein</Text>
          </View>
          <SmallRecipeContainer recipes={highProteinRecipes} />
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 120, // Account for header
    backgroundColor: 'transparent',
  },
  paddedContent: {
    paddingHorizontal: 20,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 34,
    marginTop: 24,
  },
  section: {
    marginBottom: 24,
    
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
  },
});