import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/home/Header';
import { Pill } from '../../components/ui/Pill';
import { RecipeSection } from '../../components/home/RecipeSection';
import { SmallRecipeContainer } from '../../components/home/SmallRecipeContainer';
import { RecipeModal } from '../../components/RecipeModal';
import { SkeletonSection } from '../../components/ui/SkeletonLoader';
import { ApiService, UserProfile, NextMeal } from '../../services/api';
import { authService } from '../../lib/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Local Recipe interface that matches what components expect
interface Recipe {
  id: string;
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any; // For local images or { uri: string } for remote
  ingredients?: string[];
  instructions?: string[];
  proTips?: string[];
}

// Cache interface for storing all recipe data
interface RecipeCache {
  breakfast: Recipe[];
  breakfastLowCarb: Recipe[];
  breakfastHighProtein: Recipe[];
  lunch: Recipe[];
  lunchLowCarb: Recipe[];
  lunchHighProtein: Recipe[];
  dinner: Recipe[];
  dinnerLowCarb: Recipe[];
  dinnerHighProtein: Recipe[];
  lowCarb: Recipe[];
  highProtein: Recipe[];
}

export default function Home() {
  const router = useRouter();
  
  // Function to determine current meal time based on hour
  const getCurrentMealTime = (): 'breakfast' | 'lunch' | 'dinner' => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 6 && currentHour < 11) {
      return 'breakfast';
    } else if (currentHour >= 11 && currentHour < 17) {
      return 'lunch';
    } else {
      return 'dinner'; // 5 PM - 6 AM next day
    }
  };
  
  // State for all API data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [nextMeal, setNextMeal] = useState<NextMeal | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>(() => getCurrentMealTime());
  const [recipeCache, setRecipeCache] = useState<RecipeCache>({
    breakfast: [],
    breakfastLowCarb: [],
    breakfastHighProtein: [],
    lunch: [],
    lunchLowCarb: [],
    lunchHighProtein: [],
    dinner: [],
    dinnerLowCarb: [],
    dinnerHighProtein: [],
    lowCarb: [],
    highProtein: []
  });
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Background fetch interval ref
  const backgroundFetchInterval = useRef<number | null>(null);
  const mealTimeInterval = useRef<number | null>(null);

  // Load all data on component mount
  useEffect(() => {
    loadInitialData();
    
    // Set up background refresh every 1 minute
    backgroundFetchInterval.current = setInterval(() => {
      loadAllRecipes();
    }, 60000); // 1 minute

    // Set up meal time checking every 5 minutes
    mealTimeInterval.current = setInterval(() => {
      const currentMealTime = getCurrentMealTime();
      if (currentMealTime !== selectedMealType) {
        setSelectedMealType(currentMealTime);
      }
    }, 300000); // 5 minutes

    // Cleanup intervals on unmount
    return () => {
      if (backgroundFetchInterval.current) {
        clearInterval(backgroundFetchInterval.current);
      }
      if (mealTimeInterval.current) {
        clearInterval(mealTimeInterval.current);
      }
    };
  }, [selectedMealType]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const isAuthenticated = await authService.isAuthenticated();
      if (!isAuthenticated) {
        // User not authenticated, redirect to onboarding
        router.replace('/(auth)/onboarding');
        return;
      }

      // Get auth headers for API calls
      const authHeaders = await authService.getAuthHeaders();
      const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      if (!token) {
        // No valid token, redirect to onboarding
        router.replace('/(auth)/onboarding');
        return;
      }

      // Load user data first
      const [
        profileData,
        preferencesData,
        mealData
      ] = await Promise.all([
        ApiService.getUserProfile(token),
        ApiService.getCuisinePreferences(token),
        ApiService.getNextMeal(token)
      ]);

      setUserProfile(profileData);
      setCuisinePreferences(preferencesData.preferences);
      setNextMeal(mealData);
      
      // Load initial recipes
      await loadAllRecipes(token);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAllRecipes = async (token?: string) => {
    try {
      setRecipesLoading(true);
      
      // If no token provided, try to get it from auth service
      if (!token) {
        const authHeaders = await authService.getAuthHeaders();
        token = authHeaders.Authorization?.replace('Bearer ', '') || '';
      }
      
      if (!token) {
        console.log('No token available for loading recipes');
        return;
      }
      
      // Load all recipe endpoints in parallel
      const [
        breakfastData,
        breakfastLowCarbData,
        breakfastHighProteinData,
        lunchData,
        lunchLowCarbData,
        lunchHighProteinData,
        dinnerData,
        dinnerLowCarbData,
        dinnerHighProteinData,
        lowCarbData,
        highProteinData
      ] = await Promise.all([
        ApiService.getBreakfastRecipes(token, 5),
        ApiService.getBreakfastLowCarbRecipes(token, 5),
        ApiService.getBreakfastHighProteinRecipes(token, 5),
        ApiService.getLunchRecipes(token, 5),
        ApiService.getLunchLowCarbRecipes(token, 5),
        ApiService.getLunchHighProteinRecipes(token, 5),
        ApiService.getDinnerRecipes(token, 5),
        ApiService.getDinnerLowCarbRecipes(token, 5),
        ApiService.getDinnerHighProteinRecipes(token, 5),
        ApiService.getLowCarbRecipes(token, 5),
        ApiService.getHighProteinRecipes(token, 5)
      ]);

      // Transform all recipe data and update cache
      const transformRecipes = (recipes: any[]) => 
        recipes.map(recipe => ({
          ...recipe,
          image: { uri: recipe.imageUrl }
        }));

      setRecipeCache({
        breakfast: transformRecipes(breakfastData.recipes),
        breakfastLowCarb: transformRecipes(breakfastLowCarbData.recipes),
        breakfastHighProtein: transformRecipes(breakfastHighProteinData.recipes),
        lunch: transformRecipes(lunchData.recipes),
        lunchLowCarb: transformRecipes(lunchLowCarbData.recipes),
        lunchHighProtein: transformRecipes(lunchHighProteinData.recipes),
        dinner: transformRecipes(dinnerData.recipes),
        dinnerLowCarb: transformRecipes(dinnerLowCarbData.recipes),
        dinnerHighProtein: transformRecipes(dinnerHighProteinData.recipes),
        lowCarb: transformRecipes(lowCarbData.recipes),
        highProtein: transformRecipes(highProteinData.recipes)
      });
    } catch (error) {
      console.error('Error loading recipes:', error);
      Alert.alert('Error', 'Failed to load recipes. Please try again.');
    } finally {
      setRecipesLoading(false);
    }
  };

  const handleAddCuisine = async (cuisine: string) => {
    try {
      const authHeaders = await authService.getAuthHeaders();
      const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      if (!token) {
        Alert.alert('Error', 'Please sign in to add cuisine preferences.');
        return;
      }

      const result = await ApiService.addCuisinePreference(token, cuisine);
      setCuisinePreferences(result.preferences);
    } catch (error) {
      console.error('Error adding cuisine:', error);
      Alert.alert('Error', 'Failed to add cuisine preference.');
    }
  };

  const handleRemoveCuisine = async (cuisine: string) => {
    try {
      const authHeaders = await authService.getAuthHeaders();
      const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      if (!token) {
        Alert.alert('Error', 'Please sign in to remove cuisine preferences.');
        return;
      }

      const result = await ApiService.removeCuisinePreference(token, cuisine);
      setCuisinePreferences(result.preferences);
    } catch (error) {
      console.error('Error removing cuisine:', error);
      Alert.alert('Error', 'Failed to remove cuisine preference.');
    }
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Pro',
      'Unlock all premium recipes and features with Dysh Pro!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => console.log('Navigate to upgrade screen') }
      ]
    );
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleStartCooking = () => {
    if (selectedRecipe) {
      // Pass complete recipe data to cooking steps screen
      const recipeData = {
        title: selectedRecipe.title,
        duration: selectedRecipe.duration,
        calories: selectedRecipe.calories,
        rating: selectedRecipe.rating,
        instructions: selectedRecipe.instructions || [],
        ingredients: selectedRecipe.ingredients || [],
        proTips: selectedRecipe.proTips || []
      };
      
      router.push({
        pathname: '/cooking-steps',
        params: { recipeData: JSON.stringify(recipeData) }
      });
    } else {
      router.push('/cooking-steps');
    }
    setModalVisible(false);
  };

  const handleMealTypeSelect = (mealType: string) => {
    const normalizedMealType = mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
    setSelectedMealType(normalizedMealType);
    
    // Clear the automatic meal time interval when user manually selects
    // This prevents automatic switching until the component remounts
    if (mealTimeInterval.current) {
      clearInterval(mealTimeInterval.current);
      mealTimeInterval.current = null;
    }
  };

  // Helper functions to get current meal recipes
  const getCurrentMealRecipes = () => {
    return recipeCache[selectedMealType] || [];
  };

  const getCurrentLowCarbRecipes = () => {
    if (selectedMealType === 'breakfast') return recipeCache.breakfastLowCarb;
    if (selectedMealType === 'lunch') return recipeCache.lunchLowCarb;
    if (selectedMealType === 'dinner') return recipeCache.dinnerLowCarb;
    return recipeCache.lowCarb;
  };

  const getCurrentHighProteinRecipes = () => {
    if (selectedMealType === 'breakfast') return recipeCache.breakfastHighProtein;
    if (selectedMealType === 'lunch') return recipeCache.lunchHighProtein;
    if (selectedMealType === 'dinner') return recipeCache.dinnerHighProtein;
    return recipeCache.highProtein;
  };

  if (loading) {
    return (
      <ImageBackground 
        source={require('../../assets/images/Home-bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <Header isPro={false} />
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.paddedContent}>
            {/* Skeleton for cuisine pills */}
            <View style={styles.pillsRow}>
              <View style={[styles.skeletonPill, { width: 80 }]} />
              <View style={[styles.skeletonPill, { width: 100 }]} />
              <View style={[styles.skeletonPill, { width: 60 }]} />
              <View style={[styles.skeletonPill, { width: 70 }]} />
            </View>
          </View>

          <SkeletonSection count={3} variant="large" />
          <SkeletonSection count={3} variant="small" />
          <SkeletonSection count={3} variant="small" />
        </ScrollView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/Home-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Header isPro={userProfile?.isPro ?? false} />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paddedContent}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {/* Dynamic cuisine preferences */}
            {cuisinePreferences.map(cuisine => (
              <Pill 
                key={cuisine} 
                label={cuisine} 
                onPress={() => handleRemoveCuisine(cuisine)}
              />
            ))}
            <Pill 
              label="Add" 
              icon="add" 
              onPress={() => handleAddCuisine('italian')} // For now, adds italian - you can improve this later
            />
          </ScrollView>
        </View>

        <View style={[styles.section, { marginBottom: -12 }]}>
          <RecipeSection
            title={selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
            timer={nextMeal?.displayText ?? "Loading..."}
            recipes={getCurrentMealRecipes()}
            isPro={userProfile?.isPro ?? false}
            onUpgrade={handleUpgrade}
            onRecipePress={handleRecipePress}
            onMealTypeSelect={handleMealTypeSelect}
          />
        </View>
        
        <View style={[styles.section, { marginBottom: screenHeight * 0.03 }]}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Low-Carb</Text>
          </View>
          <SmallRecipeContainer 
            recipes={getCurrentLowCarbRecipes()} 
            isPro={userProfile?.isPro ?? false}
            onUpgrade={handleUpgrade}
            onRecipePress={handleRecipePress}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>High Protein</Text>
          </View>
          <SmallRecipeContainer 
            recipes={getCurrentHighProteinRecipes()} 
            isPro={userProfile?.isPro ?? false}
            onUpgrade={handleUpgrade}
            onRecipePress={handleRecipePress}
          />
        </View>

      </ScrollView>
      
      <RecipeModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onStartCooking={handleStartCooking}
        recipe={selectedRecipe ? {
          title: selectedRecipe.title,
          image: selectedRecipe.image,
          duration: selectedRecipe.duration,
          calories: selectedRecipe.calories,
          rating: selectedRecipe.rating,
          ingredients: selectedRecipe.ingredients,
          instructions: selectedRecipe.instructions,
          proTips: selectedRecipe.proTips
        } : undefined}
      />
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
    paddingTop: screenHeight * 0.15, // Account for header - responsive
    backgroundColor: 'transparent',
    paddingBottom: screenHeight * 0.05, // Add bottom padding for better scrolling
  },
  paddedContent: {
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
  },
  pillsRow: {
    flexDirection: 'row',
    gap: screenWidth * 0.02, // Responsive gap
    marginBottom: screenHeight * 0.04, // Responsive margin
    marginTop: screenHeight * 0.03, // Responsive margin
    paddingRight: screenWidth * 0.05, // Add padding to the right for better scrolling
  },
  section: {
    marginBottom: screenHeight * 0.03, // Responsive margin
  },
  sectionTitle: {
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    marginBottom: screenHeight * 0.02, // Responsive margin
  },
  title: {
    fontSize: 22,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  skeletonPill: {
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    marginRight: screenWidth * 0.02,
  },
});