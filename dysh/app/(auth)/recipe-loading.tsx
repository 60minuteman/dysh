import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiService } from '../../lib/api';

export default function RecipeLoading() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const progress = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Parse parameters
  const ingredients = params.ingredients ? JSON.parse(params.ingredients as string) : [];
  const servings = (params.servings as string) || '2';

  useEffect(() => {
    // Start Lottie animation
    lottieRef.current?.play();

    // Start recipe generation
    generateRecipe();

    // Animate loading bar
    Animated.sequence([
      Animated.timing(progress, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.delay(400),
      Animated.timing(progress, {
        toValue: 0.6,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.delay(300),
      Animated.timing(progress, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.delay(200),
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const generateRecipe = async () => {
    try {
      setIsGenerating(true);
      
      if (!ingredients || ingredients.length === 0) {
        throw new Error('No ingredients provided');
      }

      console.log('Generating recipe with ingredients:', ingredients);
      
      const result = await apiService.generateRecipes({
        ingredients: ingredients,
        servings: parseInt(servings),
      });

      console.log('Recipe generation result:', result);

      // Navigate to suggested recipes with the first meal from the response
      const firstMeal = result.meals[0];
      const recipeData = {
        title: firstMeal.name,
        image: firstMeal.image,
        duration: firstMeal.estimatedCookTime,
        calories: firstMeal.calories,
        rating: firstMeal.rating.toString(),
        ingredients: firstMeal.ingredients,
        instructions: firstMeal.instructions,
        proTips: firstMeal.proTips,
        provider: result.provider,
        location: result.location
      };

      const params = new URLSearchParams();
      params.set('recipeData', JSON.stringify(recipeData));
      params.set('ingredients', JSON.stringify(ingredients));
      params.set('servings', servings);

      router.replace(`/suggested-recipes?${params.toString()}`);
    } catch (error: any) {
      console.error('Recipe generation error:', error);
      Alert.alert(
        'Recipe Generation Failed',
        error.message || 'Unable to generate recipes. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => generateRecipe(),
          },
          {
            text: 'Go Back',
            onPress: () => router.back(),
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 66],
  });

  return (
    <ImageBackground 
      source={require('../../assets/images/sushi.png')}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <View style={styles.centerContainer}>
          <View style={styles.circle}>
            <LottieView
              ref={lottieRef}
              source={require('../../assets/lottie/recipe-loading.json')}
              style={styles.lottie}
              autoPlay
              loop
            />
          </View>
          <Text style={styles.title}>Getting{'\n'}your recipe</Text>
          
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width }
              ]} 
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 216,
    height: 216,
    borderRadius: 108,
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 60,
    overflow: 'hidden',
    width: 66,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#64D61D',
    borderRadius: 60,
  },
  lottie: {
    width: 320,
    height: 320,
  },
}); 