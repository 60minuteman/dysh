import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Animated, Vibration } from 'react-native';
import { Audio } from 'expo-av';

interface CookingStepCardProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  timerDuration?: number;
  isActive: boolean;
  isCompleted?: boolean;
  onStartTimer?: () => void;
  onTimerComplete?: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function CookingStepCard({
  step,
  totalSteps,
  title,
  description,
  timerDuration,
  isActive,
  isCompleted,
  onStartTimer,
  onTimerComplete,
}: CookingStepCardProps) {
  const [timerActive, setTimerActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(timerDuration ? timerDuration * 60 : 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer if step or timerDuration changes
  useEffect(() => {
    setTimerActive(false);
    setRemainingSeconds(timerDuration ? timerDuration * 60 : 0);
    setHasPlayedSound(false); // Reset sound flag
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [step, timerDuration]);

  useEffect(() => {
    if (timerActive && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerActive]);

  // Handle timer completion in a separate useEffect
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  
  useEffect(() => {
    if (!timerActive && remainingSeconds === 0 && timerDuration && !hasPlayedSound) {
      // Timer just completed - play sound only once
      setHasPlayedSound(true);
      playTimerCompleteSound();
      if (onTimerComplete) {
        onTimerComplete();
      }
    }
    // Reset sound flag when timer starts again
    if (timerActive && hasPlayedSound) {
      setHasPlayedSound(false);
    }
  }, [timerActive, remainingSeconds, timerDuration, hasPlayedSound]);

  // Set audio mode on component mount
  useEffect(() => {
    setupAudio();
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.log('Error setting up audio:', error);
    }
  };

  const playTimerCompleteSound = async () => {
    try {
      // Play vibration first
      Vibration.vibrate([0, 500, 200, 500]); // Vibration pattern
      
      // Play the bell sound
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/bell.wav'),
        { 
          shouldPlay: true,
          volume: 1.0,
        }
      );
      
      // Unload sound after playing
      setTimeout(() => {
        sound.unloadAsync();
      }, 3000); // Give it 3 seconds to finish playing
    } catch (error) {
      console.log('Error playing sound:', error);
      // Fallback to just vibration
      Vibration.vibrate(1000);
    }
  };

  const handleStartTimer = () => {
    setTimerActive(true);
    if (onStartTimer) onStartTimer();
  };

  const handleEndTimer = () => {
    setTimerActive(false);
    setRemainingSeconds(timerDuration ? timerDuration * 60 : 0);
    setHasPlayedSound(false); // Reset sound flag
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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
        isCompleted ? (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        ) : !timerActive ? (
          <TouchableOpacity 
            style={[
              styles.timerButton,
              !isActive && styles.timerButtonDisabled
            ]}
            onPress={isActive ? handleStartTimer : undefined}
            disabled={!isActive}
          >
            <Text style={[
              styles.timerButtonText,
              !isActive && styles.timerButtonTextDisabled
            ]}>
              Start {timerDuration} Mins Timer
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.timerActiveRow}>
            <View style={styles.timerActiveTimeBox}>
              <Text style={styles.timerActiveTimeText}>{formatTime(remainingSeconds)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.timerActiveEndButton}
              onPress={handleEndTimer}
            >
              <Text style={styles.timerActiveEndButtonText}>End Timer</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: 480,
    width: width - 40,
    borderRadius: 24,
    padding: 24,
    marginVertical: 8,
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: '#E6F8DF',
  },
  backgroundImage: {
    borderRadius: 24,
    resizeMode: 'cover',
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
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#000',
    marginBottom: 16,
    lineHeight: 36,
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
    opacity: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerButtonText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#333',
    opacity: 1,
  },
  timerButtonDisabled: {
    opacity: 0.5,
  },
  timerButtonTextDisabled: {
    opacity: 0.5,
  },
  timerActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 1,
  },
  timerActiveTimeBox: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: 100,
    alignItems: 'center',
    opacity: 1,
  },
  timerActiveTimeText: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
    opacity: 1,
  },
  timerActiveEndButton: {
    backgroundColor: '#D4EDC5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    opacity: 1,
  },
  timerActiveEndButtonText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
    opacity: 1,
  },
  completedContainer: {
    backgroundColor: '#D4EDC5',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
  },
}); 