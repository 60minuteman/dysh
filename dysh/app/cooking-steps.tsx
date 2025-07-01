import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CookingHeader } from '../components/CookingHeader';
import { CookingStepsCarousel, CookingStepsCarouselRef } from '../components/CookingStepsCarousel';
import { CelebrationCard } from '../components/CelebrationCard';

// Function to convert instructions to cooking steps
const convertToSteps = (instructions: string[]) => {
  // Filter out serving instructions
  const filteredInstructions = instructions.filter((instruction, index) => {
    const cleanedInstruction = instruction.replace(/^Step\s*\d+[\s\-\.\:]*\s*/i, '').trim();
    const lowerInstruction = cleanedInstruction.toLowerCase();
    
    // Check if this is a serving instruction
    const isServingInstruction = (
      lowerInstruction.includes('serve hot') ||
      lowerInstruction.includes('serve cold') ||
      lowerInstruction.includes('serve warm') ||
      lowerInstruction.includes('serve chilled') ||
      lowerInstruction.includes('serve immediately') ||
      lowerInstruction.includes('serve while hot') ||
      lowerInstruction.includes('serve while warm') ||
      lowerInstruction.includes('serve and enjoy') ||
      lowerInstruction.includes('enjoy hot') ||
      lowerInstruction.includes('enjoy warm') ||
      lowerInstruction.includes('enjoy immediately') ||
      (lowerInstruction.startsWith('serve') && lowerInstruction.length < 40) || // Simple "serve" instructions
      (lowerInstruction.startsWith('enjoy') && lowerInstruction.length < 30) // Simple "enjoy" instructions
    );
    
    return !isServingInstruction;
  });
  
  return filteredInstructions.map((instruction, index) => {
    // Clean up instruction by removing "Step X" prefixes
    const cleanedInstruction = instruction.replace(/^Step\s*\d+[\s\-\.\:]*\s*/i, '').trim();
    
    // Determine timer duration based on instruction content
    let timerDuration = 5; // Default 5 minutes
    const lowerInstruction = cleanedInstruction.toLowerCase();
    
    if (lowerInstruction.includes('prepare') || lowerInstruction.includes('gather') || lowerInstruction.includes('chop') || lowerInstruction.includes('dice')) {
      timerDuration = 3; // Prep steps - 3 minutes
    } else if (lowerInstruction.includes('cook') || lowerInstruction.includes('fry') || lowerInstruction.includes('boil') || lowerInstruction.includes('simmer')) {
      timerDuration = 10; // Cooking steps - 10 minutes
    } else if (lowerInstruction.includes('bake') || lowerInstruction.includes('roast')) {
      timerDuration = 20; // Baking steps - 20 minutes
    } else if (lowerInstruction.includes('rest') || lowerInstruction.includes('marinate') || lowerInstruction.includes('chill')) {
      timerDuration = 15; // Resting steps - 15 minutes
    } else if (lowerInstruction.includes('garnish') || lowerInstruction.includes('finish')) {
      timerDuration = 2; // Final steps - 2 minutes
    }
    
    return {
      title: cleanedInstruction,
      description: `Follow this step to complete your meal`,
      timerDuration
    };
  });
};

export default function CookingSteps() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const carouselRef = useRef<CookingStepsCarouselRef>(null);

  // Parse recipe data from params
  const recipeData = params.recipeData ? JSON.parse(params.recipeData as string) : null;
  
  // Default recipe data
  const defaultRecipe = {
    title: 'Default Recipe',
    duration: '30min',
    calories: '350kcal',
    rating: '4.5',
    instructions: [
      'Prepare all ingredients and have them ready',
      'Follow the cooking steps carefully',
      'Taste and adjust seasoning as needed',
      'Serve hot and enjoy!'
    ]
  };

  const recipe = recipeData || defaultRecipe;

  // Debug: Log the recipe data to see what we received
  React.useEffect(() => {
    if (recipeData) {
      console.log('Received recipe data:', recipeData);
      console.log('Original instructions count:', recipeData.instructions?.length || 0);
      console.log('Original instructions:', recipeData.instructions);
      
      // Show filtered instructions count
      if (recipeData.instructions) {
        const filtered = convertToSteps(recipeData.instructions);
        console.log('Filtered steps count:', filtered.length);
        console.log('Filtered steps:', filtered.map(step => step.title));
      }
    }
  }, [recipeData]);

  // Convert instructions to cooking steps if we have a real recipe
  const steps = recipe.instructions && recipe.instructions.length > 0 
    ? convertToSteps(recipe.instructions)
    : convertToSteps(defaultRecipe.instructions);

  const totalSteps = steps.length;

  const handleAllStepsCompleted = () => {
    setShowCelebration(true);
  };

  const handleStartTimer = () => {
    // Timer functionality is now handled within individual cards
  };

  const handleEndCooking = () => {
    router.push('/(auth)/paywall');
  };

  const handleViewRecipe = () => {
    router.push('/recipe');
  };

  const handleShareRecipe = () => {
    // Implement share functionality here
    Alert.alert('Share Recipe', 'Share functionality triggered!');
    console.log('Share recipe');
  };

  const handleFavoriteRecipe = () => {
    // Implement favorite functionality here
    Alert.alert('Favorite Recipe', 'Recipe added to favorites!');
    console.log('Favorite recipe');
  };

  const handleCelebrationShare = () => {
    handleShareRecipe();
  };

  const handleCelebrationFavorite = () => {
    handleFavoriteRecipe();
  };

  const handleBackToHome = () => {
    router.push('/(tabs)');
  };

  const headerHeight = insets.top + 100; // Approximate header height

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with blur effect */}
      <BlurView intensity={80} style={styles.headerBlur}>
        <CookingHeader
          duration={recipe.duration || '30min'}
          calories={recipe.calories || '350kcal'}
          rating={recipe.rating || '4.5'}
          onEndCooking={handleEndCooking}
          onViewRecipe={handleViewRecipe}
        />
      </BlurView>

      {/* Cooking Steps with vertical scroll */}
      <View 
        style={[styles.scrollContainer, { paddingTop: headerHeight }]}
      >
        <CookingStepsCarousel
          ref={carouselRef}
          steps={steps}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepChange={setCurrentStep}
          onStartTimer={handleStartTimer}
          onEndCooking={handleEndCooking}
          onShareRecipe={handleShareRecipe}
          onFavoriteRecipe={handleFavoriteRecipe}
          onAllStepsCompleted={handleAllStepsCompleted}
        />
      </View>

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={['rgba(100, 214, 29, 0)', '#64D61D']}
        style={[styles.bottomGradient, { paddingBottom: insets.bottom }]}
        pointerEvents="none"
      />

      {/* Celebration overlay */}
      {showCelebration && (
        <CelebrationCard
          title="Share your dish with us @dailydysh"
          description="Rate this recipe"
          onShare={handleCelebrationShare}
          onFavorite={handleCelebrationFavorite}
          onEndCooking={handleBackToHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64D61D',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Increased padding for taller gradient
    alignItems: 'center',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120, // Increased height from 60 to 120
  },
});