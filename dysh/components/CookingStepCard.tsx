import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';

interface CookingStepCardProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  timerDuration?: number;
  isActive: boolean;
  onStartTimer?: () => void;
}

export function CookingStepCard({
  step,
  totalSteps,
  title,
  description,
  timerDuration,
  isActive,
  onStartTimer,
}: CookingStepCardProps) {
  return (
    <ImageBackground
      source={require('../assets/images/card-bg.png')}
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer
      ]}
      imageStyle={styles.backgroundImage}
    >
      <Text style={styles.stepIndicator}>Step {step}/{totalSteps}</Text>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {timerDuration && (
        <TouchableOpacity 
          style={styles.timerButton}
          onPress={onStartTimer}
        >
          <Text style={styles.timerButtonText}>
            Start {timerDuration} Mins Timer
          </Text>
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: 380,
    width: width - 40, // Account for horizontal padding
    borderRadius: 24,
    padding: 24,
    marginVertical: 8,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  backgroundImage: {
    borderRadius: 24,
  },
  activeContainer: {
    opacity: 1,
  },
  inactiveContainer: {
    opacity: 0.8,
  },
  stepIndicator: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    color: '#333',
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Satoshi-Black',
    color: '#000',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    color: '#555',
    lineHeight: 22,
  },
  timerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  timerButtonText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#333',
  },
}); 