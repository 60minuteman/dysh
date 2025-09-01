import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { CookingStepCard } from './CookingStepCard';

const { height: screenHeight } = Dimensions.get('window');

interface CookingStep {
  title: string;
  description: string;
  timerDuration?: number;
}

interface CookingStepsCarouselProps {
  steps: CookingStep[];
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onStartTimer: () => void;
  onEndCooking?: () => void;
  onShareRecipe?: () => void;
  onFavoriteRecipe?: () => void;
  onAllStepsCompleted?: () => void;
}

export interface CookingStepsCarouselRef {
  handleScroll: (event: any) => void;
  scrollToStep: (stepIndex: number) => void;
  onTimerComplete: (stepIndex: number) => void;
}

export const CookingStepsCarousel = forwardRef<CookingStepsCarouselRef, CookingStepsCarouselProps>(({
  steps,
  currentStep,
  totalSteps,
  onStepChange,
  onStartTimer,
  onEndCooking,
  onShareRecipe,
  onFavoriteRecipe,
  onAllStepsCompleted
}, ref) => {
  const [visibleMiddleIndex, setVisibleMiddleIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    if (!scrollEnabled) return;
    
    const { contentOffset } = event.nativeEvent;
    const scrollY = contentOffset.y;
    
    const cardHeight = 500; // Card height + margin
    const middleScreenY = scrollY + (screenHeight / 2);
    const middleCardIndex = Math.floor(middleScreenY / cardHeight);
    
    const clampedIndex = Math.max(0, Math.min(middleCardIndex, steps.length - 1));
    setVisibleMiddleIndex(clampedIndex);
    
    // Update current step based on scroll position
    const newCurrentStep = clampedIndex + 1;
    if (newCurrentStep !== currentStep && newCurrentStep <= totalSteps) {
      onStepChange(newCurrentStep);
    }
  };

  const scrollToStep = (stepIndex: number) => {
    if (scrollViewRef.current) {
      const cardHeight = 500; // Card height + margin
      const targetY = stepIndex * cardHeight;
      
      scrollViewRef.current.scrollTo({
        y: targetY,
        animated: true,
      });
    }
  };

  const onTimerComplete = (stepIndex: number) => {
    // Mark step as completed
    setCompletedSteps(prev => new Set([...prev, stepIndex + 1]));
    
    // Check if this was the last step
    if (stepIndex + 1 === totalSteps) {
      // All steps completed - trigger parent celebration
      setTimeout(() => {
        if (onAllStepsCompleted) {
          onAllStepsCompleted();
        }
      }, 500); // Short delay for completion feedback
    } else {
      // Move to next step after a short delay
      setTimeout(() => {
        const nextStep = stepIndex + 2;
        onStepChange(nextStep);
        scrollToStep(stepIndex + 1);
      }, 1000); // Give user time to see completion
    }
  };

  useImperativeHandle(ref, () => ({
    handleScroll,
    scrollToStep,
    onTimerComplete,
  }));

  const getCardStyle = (index: number) => {
    if (index + 1 === currentStep) {
      return styles.activeCard;
    }
    if (index === visibleMiddleIndex) {
      return styles.middleCard;
    }
    return styles.inactiveCard;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={true}
        bouncesZoom={false}
        decelerationRate="normal"
        pagingEnabled={false}
        snapToInterval={500}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContentContainer}
        scrollEnabled={scrollEnabled}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Regular cooking step cards */}
        {steps.map((step, index) => (
          <View 
            key={index} 
            style={[
              styles.cardContainer,
              getCardStyle(index)
            ]}
          >
            <CookingStepCard 
              step={index + 1}
              totalSteps={totalSteps}
              title={step.title}
              description={step.description}
              timerDuration={step.timerDuration}
              isActive={index + 1 === currentStep}
              isCompleted={completedSteps.has(index + 1)}
              onStartTimer={index + 1 === currentStep ? onStartTimer : () => {}}
              onTimerComplete={() => onTimerComplete(index)}
            />
          </View>
        ))}


      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    borderRadius: 24,
    marginBottom: 20,
    height: 480,
    alignItems: 'center',
  },
  celebrationContainer: {
    height: 400, // Taller height for celebration content
    justifyContent: 'center',
  },
  activeCard: {
    opacity: 0.8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  middleCard: {
    opacity: 0.8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inactiveCard: {
    opacity: 0.8,
  },
}); 