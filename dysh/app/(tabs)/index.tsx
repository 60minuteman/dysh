import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { authService } from '../../lib/auth';
import { ApiService } from '../../services/api';
import { Header } from '../../components/home/Header';
import { RecipeSection } from '../../components/home/RecipeSection';
import { SmallRecipeContainer } from '../../components/home/SmallRecipeContainer';
import { RecipeModal } from '../../components/RecipeModal';

// React Query hooks
import {
  useExternalUserProfile,
  useCuisinePreferences,
  useNextMeal,
  useBreakfastRecipes,
  useBreakfastLowCarbRecipes,
  useBreakfastHighProteinRecipes,
  useLunchRecipes,
  useLunchLowCarbRecipes,
  useLunchHighProteinRecipes,
  useDinnerRecipes,
  useDinnerLowCarbRecipes,
  useDinnerHighProteinRecipes,
  useLowCarbRecipes,
  useHighProteinRecipes,
  useAddCuisinePreference,
  useRemoveCuisinePreference,
} from '../../hooks/useApiQueries';

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

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const mealTimeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // React Query hooks
  const userProfileQuery = useExternalUserProfile();
  const cuisinePreferencesQuery = useCuisinePreferences();
  const nextMealQuery = useNextMeal();
  
  // Recipe queries
  const breakfastQuery = useBreakfastRecipes(5);
  const breakfastLowCarbQuery = useBreakfastLowCarbRecipes(5);
  const breakfastHighProteinQuery = useBreakfastHighProteinRecipes(5);
  const lunchQuery = useLunchRecipes(5);
  const lunchLowCarbQuery = useLunchLowCarbRecipes(5);
  const lunchHighProteinQuery = useLunchHighProteinRecipes(5);
  const dinnerQuery = useDinnerRecipes(5);
  const dinnerLowCarbQuery = useDinnerLowCarbRecipes(5);
  const dinnerHighProteinQuery = useDinnerHighProteinRecipes(5);
  const lowCarbQuery = useLowCarbRecipes(5);
  const highProteinQuery = useHighProteinRecipes(5);

  // Mutations
  const addCuisineMutation = useAddCuisinePreference();
  const removeCuisineMutation = useRemoveCuisinePreference();

  // Helper function to get current meal time
  const getCurrentMealTime = (): 'breakfast' | 'lunch' | 'dinner' => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 11) {
      return 'breakfast';
    } else if (hour >= 11 && hour < 17) {
      return 'lunch';
    } else {
      return 'dinner';
    }
  };

  // Check authentication and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.replace('/(auth)/onboarding');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/(auth)/onboarding');
      }
    };

    checkAuth();
  }, []);

  // Set initial meal type based on current time
  useEffect(() => {
    setSelectedMealType(getCurrentMealTime());
    
    // Set up interval to automatically update meal type every hour
    mealTimeInterval.current = setInterval(() => {
      setSelectedMealType(getCurrentMealTime());
    }, 60 * 60 * 1000); // Update every hour

    return () => {
      if (mealTimeInterval.current) {
        clearInterval(mealTimeInterval.current);
      }
    };
  }, []);

  // Transform recipes helper
  const transformRecipes = (recipes: any[] | undefined): Recipe[] => {
    if (!recipes) return [];
    return recipes.map(recipe => ({
      ...recipe,
      image: { uri: recipe.imageUrl }
    }));
  };

  // Handle cuisine preference mutations
  const handleAddCuisine = (cuisine: string) => {
    addCuisineMutation.mutate(cuisine, {
      onError: (error: any) => {
        console.error('Error adding cuisine:', error);
        Alert.alert('Error', 'Failed to add cuisine preference.');
      }
    });
  };

  const handleRemoveCuisine = (cuisine: string) => {
    removeCuisineMutation.mutate(cuisine, {
      onError: (error: any) => {
        console.error('Error removing cuisine:', error);
        Alert.alert('Error', 'Failed to remove cuisine preference.');
      }
    });
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
  const getCurrentMealRecipes = (): Recipe[] => {
    switch (selectedMealType) {
      case 'breakfast':
        return transformRecipes(breakfastQuery.data?.recipes);
      case 'lunch':
        return transformRecipes(lunchQuery.data?.recipes);
      case 'dinner':
        return transformRecipes(dinnerQuery.data?.recipes);
      default:
        return [];
    }
  };

  const getCurrentLowCarbRecipes = (): Recipe[] => {
    switch (selectedMealType) {
      case 'breakfast':
        return transformRecipes(breakfastLowCarbQuery.data?.recipes);
      case 'lunch':
        return transformRecipes(lunchLowCarbQuery.data?.recipes);
      case 'dinner':
        return transformRecipes(dinnerLowCarbQuery.data?.recipes);
      default:
        return transformRecipes(lowCarbQuery.data?.recipes);
    }
  };

  const getCurrentHighProteinRecipes = (): Recipe[] => {
    switch (selectedMealType) {
      case 'breakfast':
        return transformRecipes(breakfastHighProteinQuery.data?.recipes);
      case 'lunch':
        return transformRecipes(lunchHighProteinQuery.data?.recipes);
      case 'dinner':
        return transformRecipes(dinnerHighProteinQuery.data?.recipes);
      default:
        return transformRecipes(highProteinQuery.data?.recipes);
    }
  };

  // Check if any critical queries are loading
  const isLoading = userProfileQuery.isLoading || 
                   cuisinePreferencesQuery.isLoading || 
                   nextMealQuery.isLoading ||
                   breakfastQuery.isLoading ||
                   lunchQuery.isLoading ||
                   dinnerQuery.isLoading;

  // Check if recipes are loading
  const areRecipesLoading = breakfastQuery.isLoading ||
                           breakfastLowCarbQuery.isLoading ||
                           breakfastHighProteinQuery.isLoading ||
                           lunchQuery.isLoading ||
                           lunchLowCarbQuery.isLoading ||
                           lunchHighProteinQuery.isLoading ||
                           dinnerQuery.isLoading ||
                           dinnerLowCarbQuery.isLoading ||
                           dinnerHighProteinQuery.isLoading ||
                           lowCarbQuery.isLoading ||
                           highProteinQuery.isLoading;

  // Handle refresh
  const handleRefresh = () => {
    // React Query will handle the refetching automatically
    userProfileQuery.refetch();
    cuisinePreferencesQuery.refetch();
    nextMealQuery.refetch();
    breakfastQuery.refetch();
    breakfastLowCarbQuery.refetch();
    breakfastHighProteinQuery.refetch();
    lunchQuery.refetch();
    lunchLowCarbQuery.refetch();
    lunchHighProteinQuery.refetch();
    dinnerQuery.refetch();
    dinnerLowCarbQuery.refetch();
    dinnerHighProteinQuery.refetch();
    lowCarbQuery.refetch();
    highProteinQuery.refetch();
  };

  const isRefreshing = userProfileQuery.isFetching ||
                      cuisinePreferencesQuery.isFetching ||
                      nextMealQuery.isFetching ||
                      areRecipesLoading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header isPro={userProfileQuery.data?.isPro ?? false} />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#64D61D"
          />
        }
      >
        {/* Main Meal Section */}
        <RecipeSection
          title={selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
          timer={nextMealQuery.data?.displayText ?? "Loading..."}
          recipes={getCurrentMealRecipes()}
          isPro={userProfileQuery.data?.isPro ?? false}
          onUpgrade={handleUpgrade}
          onRecipePress={handleRecipePress}
          onMealTypeSelect={handleMealTypeSelect}
        />

        {/* Low Carb Section */}
        <SmallRecipeContainer
          recipes={getCurrentLowCarbRecipes()}
          isPro={userProfileQuery.data?.isPro ?? false}
          onUpgrade={handleUpgrade}
          onRecipePress={handleRecipePress}
        />

        {/* High Protein Section */}
        <SmallRecipeContainer
          recipes={getCurrentHighProteinRecipes()}
          isPro={userProfileQuery.data?.isPro ?? false}
          onUpgrade={handleUpgrade}
          onRecipePress={handleRecipePress}
        />
      </ScrollView>

      {/* Recipe Modal */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
});