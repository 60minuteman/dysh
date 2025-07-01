import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface EmptyStateProps {
  category: string;
}

export function ExploreEmptyState({ category }: EmptyStateProps) {
  const { height: screenHeight } = useWindowDimensions();
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (videoRef.current) {
      void videoRef.current?.playAsync();
    }
  }, []);

  const getEmptyStateContent = (category: string) => {
    switch (category) {
      case 'trending':
        return {
          title: 'No trending recipes yet',
          subtitle: 'Check back soon for popular recipes!',
          description: 'Recipes become trending based on user engagement and popularity.',
          color: '#FF6B6B',
        };
      case 'daily':
        return {
          title: 'Sign in to see daily picks',
          subtitle: 'Personalized recipes await you',
          description: 'Get curated recipes based on your preferences and dietary needs.',
          color: '#4ECDC4',
        };
      case 'chefs-pick':
        return {
          title: 'Chef picks coming soon',
          subtitle: 'Our chefs are curating amazing recipes',
          description: 'Professional chefs are selecting the best recipes just for you.',
          color: '#45B7D1',
        };
      case 'thirty-min-meals':
        return {
          title: 'No quick meals found',
          subtitle: 'Try refreshing or check back later',
          description: 'We\'re always adding new 30-minute meal recipes.',
          color: '#96CEB4',
        };
      case 'occasion':
        return {
          title: 'No occasion recipes yet',
          subtitle: 'Special recipes for special moments',
          description: 'Perfect recipes for holidays, parties, and celebrations.',
          color: '#FFEAA7',
        };
      case 'healthy-light':
        return {
          title: 'No healthy recipes found',
          subtitle: 'Nutritious meals coming soon',
          description: 'Light and healthy recipes for your wellness journey.',
          color: '#81ECEC',
        };
      case 'comfort-food':
        return {
          title: 'No comfort food yet',
          subtitle: 'Soul-warming recipes on the way',
          description: 'Cozy, comforting meals that feel like a warm hug.',
          color: '#FD79A8',
        };
      case 'one-pot-meals':
        return {
          title: 'No one-pot meals found',
          subtitle: 'Easy cleanup recipes coming soon',
          description: 'Simple meals that require just one pot or pan.',
          color: '#FDCB6E',
        };
      default:
        return {
          title: 'No recipes found',
          subtitle: 'Try selecting a different category',
          description: 'We\'re constantly adding new recipes to explore.',
          color: '#A29BFE',
        };
    }
  };

  const content = getEmptyStateContent(category);

  return (
    <View style={[styles.container, { height: screenHeight * 0.6 }]}>
      <View style={styles.content}>
        {/* Video Circle */}
        <View style={[styles.videoContainer, { backgroundColor: `${content.color}20` }]}>
          <Video
            ref={videoRef}
            source={require('../../assets/videos/orb.mp4')}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.subtitle}</Text>
          <Text style={styles.description}>{content.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  videoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 24,
  },
  video: {
    width: '150%',
    height: '150%',
    marginLeft: -25,
    marginTop: -25,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#B2BEC3',
    textAlign: 'center',
    lineHeight: 20,
  },
});