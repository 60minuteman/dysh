import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchInput } from '../../components/SearchInput';
import { CookbookTabs } from '../../components/cookbook/cookbook-tabs';
import { CookbookRecipeCard } from '../../components/cookbook/cookbook-recipe-card';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../../services/api';
import { authService } from '../../lib/auth';
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
  const [recipes, setRecipes] = useState(RECIPES);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication and fetch cookbook recipes
  useEffect(() => {
    const fetchCookbookRecipes = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
          router.replace('/(auth)/onboarding');
          return;
        }

        // Get token from auth service
        const authHeaders = await authService.getAuthHeaders();
        const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
        
        if (!token) {
          console.log('No token available for cookbook recipes');
          return;
        }

        const response = await ApiService.getCookbookRecipes(token, 20, 0);
        if (response.recipes.length > 0) {
          // Transform API data to match local interface
          const transformedRecipes = response.recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            duration: recipe.duration,
            calories: recipe.calories,
            image: { uri: recipe.imageUrl },
          }));
          setRecipes(transformedRecipes);
        }
      } catch (error) {
        console.error('Error fetching cookbook recipes:', error);
        // Keep fallback recipes if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCookbookRecipes();
  }, []);

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
}); 