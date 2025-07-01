import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { CuisineTab } from '../../components/CuisineTab';
import { RecipePreviewCard } from '../../components/RecipePreviewCard';
import { RecipePreviewContainer } from '../../components/RecipePreviewContainer';
import { RecipeModal } from '../../components/RecipeModal';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Stack } from 'expo-router';
import { apiService } from '../../lib/api';

const cuisines = ["Nigerian", "American", "Arab", "Spanish", "Korean"];
type Cuisine = "Nigerian" | "American" | "Arab" | "Spanish" | "Korean";

const cuisineFlags: Record<Cuisine, string> = {
  "Nigerian": "🇳🇬",
  "American": "🇺🇸", 
  "Arab": "🇸🇦",
  "Spanish": "🇪🇸",
  "Korean": "🇰🇷"
};

// Map cuisines to country codes for API
const cuisineToCountry: Record<Cuisine, string> = {
  "Nigerian": "Nigeria",
  "American": "United States",
  "Arab": "Saudi Arabia",
  "Spanish": "Spain",
  "Korean": "Korea"
};

interface CachedRecipes {
  [country: string]: {
    meals: any[];
    location: string;
    provider: string;
  };
}

export default function SuggestedRecipes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>("Nigerian");
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);
  const [focusedRecipeIndex, setFocusedRecipeIndex] = useState(0); // Track focused card based on scroll
  const [isLoading, setIsLoading] = useState(false);
  const [cachedRecipes, setCachedRecipes] = useState<CachedRecipes>({});

  // Parse parameters from recipe generation using useMemo to prevent re-parsing
  const initialRecipeData = useMemo(() => {
    return params.recipeData ? JSON.parse(params.recipeData as string) : null;
  }, [params.recipeData]);

  const ingredients = useMemo(() => {
    return params.ingredients ? JSON.parse(params.ingredients as string) : [];
  }, [params.ingredients]);

  const servings = (params.servings as string) || '2';

  // Initialize with the first generated recipe (from previous screen)
  useEffect(() => {
    if (initialRecipeData && !cachedRecipes["Initial"]) {
      console.log(`🏁 Initializing cache with recipe data:`, {
        title: initialRecipeData.title,
        location: initialRecipeData.location
      });
      
      // Store the initial recipe data as "Initial" country
      const initialMeals = [{
        name: initialRecipeData.title,
        image: initialRecipeData.image || '', // Handle base64 image
        estimatedCookTime: initialRecipeData.duration,
        calories: initialRecipeData.calories,
        rating: parseFloat(initialRecipeData.rating),
        ingredients: initialRecipeData.ingredients,
        instructions: initialRecipeData.instructions,
        proTips: initialRecipeData.proTips,
      }];

      setCachedRecipes(prev => ({
        ...prev,
        "Initial": {
          meals: initialMeals,
          location: initialRecipeData.location || "International",
          provider: initialRecipeData.provider || "AI"
        }
      }));
    }
  }, [initialRecipeData]); // Removed cachedRecipes from dependency to prevent infinite loop

  // Reset focused index when cuisine changes
  useEffect(() => {
    setFocusedRecipeIndex(0);
  }, [selectedCuisine]);

  // Get current recipes based on selected cuisine
  const getCurrentRecipes = () => {
    console.log(`🔍 Getting recipes for ${selectedCuisine}`);
    console.log(`📦 Available cache keys:`, Object.keys(cachedRecipes));
    
    if (selectedCuisine === "Nigerian" && cachedRecipes["Initial"]) {
      console.log(`✅ Returning Initial data for Nigerian`);
      return cachedRecipes["Initial"];
    }
    
    const country = cuisineToCountry[selectedCuisine];
    const result = cachedRecipes[country] || null;
    
    if (result) {
      console.log(`✅ Found cached recipes for ${country}`);
    } else {
      console.log(`❌ No cached recipes found for ${country}`);
    }
    
    return result;
  };

  const currentRecipes = getCurrentRecipes();

  // Generate recipes for a specific country
  const generateRecipesForCountry = async (cuisine: Cuisine) => {
    const country = cuisineToCountry[cuisine];
    
    // Special handling for Nigerian - check if we have Initial data
    if (cuisine === "Nigerian" && cachedRecipes["Initial"]) {
      console.log(`✅ Using cached Initial data for Nigerian cuisine`);
      return;
    }
    
    // Check if we already have cached recipes for this country
    if (cachedRecipes[country]) {
      console.log(`✅ Using cached recipes for ${country}`);
      return;
    }

    console.log(`🔄 Cache miss for ${country}, generating new recipes...`);
    console.log(`📦 Current cache keys:`, Object.keys(cachedRecipes));
    
    setIsLoading(true);
    
    try {
      console.log(`🚀 Generating recipes for ${country}...`);
      
      const result = await apiService.generateRecipes({
        ingredients: ingredients,
        servings: parseInt(servings),
        country: country
      });

      console.log(`✅ Recipes generated for ${country}:`, {
        mealsCount: result.meals.length,
        location: result.location,
        provider: result.provider
      });

      // Cache the results
      setCachedRecipes(prev => {
        const newCache = {
          ...prev,
          [country]: result
        };
        console.log(`💾 Updated cache keys:`, Object.keys(newCache));
        return newCache;
      });

    } catch (error: any) {
      console.error(`❌ Failed to generate recipes for ${country}:`, error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cuisine selection
  const handleSelectCuisine = async (cuisine: string) => {
    if (cuisines.includes(cuisine)) {
      const newCuisine = cuisine as Cuisine;
      console.log(`🎯 Selecting cuisine: ${newCuisine}`);
      
      setSelectedCuisine(newCuisine);
      
      // Generate recipes for the new cuisine if not cached
      await generateRecipesForCountry(newCuisine);
    }
  };

  // Handle scroll to track focused recipe
  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const cardWidth = screenWidth - 60 + 16; // Card width + margin
    const index = Math.round(contentOffset.x / cardWidth);
    const maxIndex = displayRecipeData.length - 1;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    
    if (clampedIndex !== focusedRecipeIndex) {
      setFocusedRecipeIndex(clampedIndex);
      console.log(`📍 Focused recipe changed to index: ${clampedIndex}`);
    }
  };

  const handleContinue = () => {
    console.log(`🎯 Continue clicked - showing modal for focused recipe index: ${focusedRecipeIndex}`);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleStartCooking = () => {
    setModalVisible(false);
    
    // Get the currently focused recipe data
    const currentRecipe = displayRecipeData[focusedRecipeIndex];
    if (currentRecipe) {
      // Pass the recipe data to cooking steps
      router.push({
        pathname: '/cooking-steps',
        params: {
          recipeData: JSON.stringify({
            title: currentRecipe.title,
            duration: currentRecipe.time,
            calories: currentRecipe.calories,
            rating: currentRecipe.rating,
            image: currentRecipe.image,
            ingredients: currentRecipe.ingredients,
            instructions: currentRecipe.instructions,
            proTips: currentRecipe.proTips,
          })
        }
      });
    } else {
      // Fallback if no recipe data
      router.push('/cooking-steps');
    }
  };

  // Convert meals to display format
  const displayRecipeData = currentRecipes ? currentRecipes.meals.map((meal, index) => ({
    id: (index + 1).toString(),
    title: meal.name,
    time: meal.estimatedCookTime,
    calories: meal.calories,
    rating: meal.rating.toString(),
    image: meal.image ? { uri: meal.image } : require('../../assets/images/recipe-1.jpg'), // Use base64 image or fallback
    ingredients: meal.ingredients,
    instructions: meal.instructions,
    proTips: meal.proTips,
  })) : [];

  // Selected recipe for the modal - now uses focusedRecipeIndex instead of selectedRecipeIndex
  const selectedRecipe = displayRecipeData[focusedRecipeIndex] ? {
    title: displayRecipeData[focusedRecipeIndex].title,
    image: displayRecipeData[focusedRecipeIndex].image, // Use the actual image from recipe data
    duration: displayRecipeData[focusedRecipeIndex].time,
    calories: displayRecipeData[focusedRecipeIndex].calories,
    rating: displayRecipeData[focusedRecipeIndex].rating,
    ingredients: displayRecipeData[focusedRecipeIndex].ingredients,
    instructions: displayRecipeData[focusedRecipeIndex].instructions,
    proTips: displayRecipeData[focusedRecipeIndex].proTips,
  } : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Suggested meal{'\n'}recipes in 5 cuisines</Text>
        
        {/* Cuisine Filter using the CuisineTab component */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisineTabContainer}
          decelerationRate="fast"
          snapToInterval={screenWidth / 3}
          snapToAlignment="start"
        >
          <CuisineTab 
            cuisines={cuisines}
            selectedCuisine={selectedCuisine}
            onSelectCuisine={handleSelectCuisine}
          />
        </ScrollView>

        {/* Recipe Preview Cards Container or Loading */}
        <View style={styles.recipeCardContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#64D61D" />
              <Text style={styles.loadingText}>Loading {selectedCuisine} recipes...</Text>
            </View>
          ) : displayRecipeData.length > 0 ? (
            <RecipePreviewContainer 
              recipes={displayRecipeData}
              countryFlag={cuisineFlags[selectedCuisine]}
              onRecipePress={setFocusedRecipeIndex}
              onScroll={handleScroll}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recipes available</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          onPress={handleContinue}
          label="Continue"
          disabled={!selectedRecipe}
        />
      </View>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onStartCooking={handleStartCooking}
          recipe={selectedRecipe}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  cuisineTabContainer: {
    paddingHorizontal: 20,
  },
  recipeCardContainer: {
    marginTop: 20,
    width: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
}); 