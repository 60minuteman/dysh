import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchInput } from '../../components/SearchInput';
import { CookbookTabs } from '../../components/cookbook/cookbook-tabs';
import { CookbookRecipeCard } from '../../components/cookbook/cookbook-recipe-card';
import { Ionicons } from '@expo/vector-icons';
import { useCookbookRecipes } from '../../hooks/useApiQueries';
import { useRouter } from 'expo-router';

const RECIPES = [
  {
    id: '1',
    title: 'Boiled Plantain & Egg Sauce',
    duration: '30 min',
    calories: '320 kcal',
    image: require('../../assets/images/recipe-1.jpg'),
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    duration: '45 min',
    calories: '450 kcal',
    image: require('../../assets/images/recipe-2.jpg'),
  },
];

export default function Cookbook() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  // Use React Query hook for cookbook recipes
  const {
    data: cookbookData,
    isLoading,
    error,
    isError
  } = useCookbookRecipes(20, 0);

  // Transform API data to match local interface or use fallback
  const recipes = (cookbookData?.recipes && cookbookData.recipes.length > 0)
    ? cookbookData.recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        duration: recipe.duration,
        calories: recipe.calories,
        image: { uri: recipe.imageUrl },
      }))
    : RECIPES; // Fallback to local recipes if API data not available

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: width * 0.05 }]}>
        <Text style={[styles.title, { fontSize: width * 0.08 }]}>Cookbook</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchInput 
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search recipes..." 
        />
      </View>

      <View style={styles.tabsContainer}>
        <CookbookTabs />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading cookbook recipes...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load recipes. Using saved recipes.</Text>
          </View>
        ) : null}
        
        <View style={styles.grid}>
          {recipes.slice(0, 2).map((recipe) => (
            <View key={recipe.id} style={styles.cardWrapper}>
              <CookbookRecipeCard {...recipe} />
            </View>
          ))}
        </View>
        
        <View style={styles.proLineContainer}>
          <Image 
            source={require('../../assets/images/pro-line.png')}
            style={styles.proLine}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    marginBottom: '6%',
    marginTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  searchContainer: {
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  cardWrapper: {
    width: '47.5%',
  },
  proLineContainer: {
    marginTop: -10,
    alignItems: 'center',
  },
  proLine: {
    width: '80%',
    height: 100,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
}); 