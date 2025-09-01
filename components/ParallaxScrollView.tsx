import React from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerHeight?: number;
  renderHeader?: () => React.ReactNode;
}

export function ParallaxScrollView({ 
  children, 
  headerHeight = 300,
  renderHeader 
}: ParallaxScrollViewProps) {
  const scrollY = new Animated.Value(0);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {renderHeader && (
        <Animated.View 
          style={[
            styles.header,
            { height: headerHeight, transform: [{ translateY: headerTranslateY }] }
          ]}
        >
          {renderHeader()}
        </Animated.View>
      )}
      
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
