import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

export function RecipeCardSkeleton() {
  const pulseAnimation = useRef(new Animated.Value(0.5)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => pulse());
    };
    pulse();
  }, [pulseAnimation, scaleAnimation]);

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: pulseAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      <Image
        source={require('../../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

export function RecipeStackSkeleton() {
  return (
    <Animated.View style={styles.stackSkeletonContainer}>
      <RecipeCardSkeleton />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  stackSkeletonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});