import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { CookingStepCard } from '../components/CookingStepCard';
import { CelebrationCard } from '../components/CelebrationCard';
import { CelebrationAnimation } from '../components/CelebrationAnimation';

// Mock recipe data
const recipe = {
  title: 'Hearty Chicken & Bean Rice Bowl',
  duration: '30min',
  calories: '320kcal',
  rating: '4.5',
  steps: [
    {
      title: 'Chop onions & sauté in oil for 3mins',
      description: 'Use low heat to avoid burning.',
      timerDuration: 3
    },
    {
      title: 'Boil the pasta in salted water for 10mins',
      description: 'Add a splash of oil to keep pasta from sticking',
      timerDuration: 10
    },
    {
      title: 'Add spices and stir',
      description: 'Add the chopped vegetables and spices, stir well',
      timerDuration: 5
    },
    {
      title: 'Let sauce simmer',
      description: 'Stir now and then to boost flavor.',
      timerDuration: 10
    },
    {
      title: 'Mix everything together',
      description: 'Combine the pasta with sauce and mix well',
      timerDuration: 2
    },
    {
      title: 'Serve hot',
      description: 'Garnish with fresh herbs and serve immediately',
    }
  ]
};

export default function CookingSteps() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const totalSteps = recipe.steps.length;

  const handleStartTimer = () => {
    setTimerActive(true);
    // In a real app, you would set up a countdown timer here
    
    // Simulate timer completion
    setTimeout(() => {
      setTimerActive(false);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsCompleted(true);
      }
    }, 3000); // Just for demo purposes, actual implementation would use real timer
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEndCooking = () => {
    router.back();
  };

  const handleViewRecipe = () => {
    router.push('/recipe');
  };

  const handleShareRecipe = () => {
    // Implement share functionality here
    console.log('Share recipe');
  };

  const handleRateRecipe = (rating: number) => {
    // Implement rating functionality here
    console.log('Rate recipe:', rating);
  };

  const handleFavoriteRecipe = () => {
    // Implement favorite functionality here
    console.log('Favorite recipe');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Celebration Animation (only shown when completed) */}
      {isCompleted && (
        <CelebrationAnimation message="10-15 mins till sauce thickens." />
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleEndCooking}>
          <Text style={styles.headerButton}>End Cooking</Text>
        </TouchableOpacity>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>⏱ {recipe.duration}</Text>
          <Text style={styles.statText}>🔥 {recipe.calories}</Text>
          <Text style={styles.statText}>⭐ {recipe.rating}</Text>
        </View>
        
        <TouchableOpacity onPress={handleViewRecipe}>
          <Text style={styles.headerButton}>View Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display (only shown when timer is active) */}
      {timerActive && (
        <View style={styles.timerContainer}>
          <TouchableOpacity style={styles.timerButton}>
            <Text style={styles.timerButtonText}>
              Start 3 Mins Timer
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cooking Steps */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isCompleted ? (
          // Show celebration/completion card
          <>
            <View style={styles.timerContainer}>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={styles.timerButtonText}>
                  Start 3 Mins Timer
                </Text>
              </TouchableOpacity>
            </View>
            <CelebrationCard 
              title="Share your dish with us @dailydysh"
              description="Rate this recipe"
              onShare={handleShareRecipe}
              onRate={handleRateRecipe}
              onFavorite={handleFavoriteRecipe}
            />
          </>
        ) : (
          // Show current and next steps
          <>
            <CookingStepCard 
              step={currentStep}
              totalSteps={totalSteps}
              title={recipe.steps[currentStep - 1].title}
              description={recipe.steps[currentStep - 1].description}
              timerDuration={recipe.steps[currentStep - 1].timerDuration}
              isActive={true}
              onStartTimer={handleStartTimer}
            />
            
            {currentStep < totalSteps && (
              <CookingStepCard 
                step={currentStep + 1}
                totalSteps={totalSteps}
                title={recipe.steps[currentStep].title}
                description={recipe.steps[currentStep].description}
                timerDuration={recipe.steps[currentStep].timerDuration}
                isActive={false}
                onStartTimer={() => {}}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#68D431', // Bright green background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    marginBottom: 16,
  },
  timerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  timerButtonText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
}); 