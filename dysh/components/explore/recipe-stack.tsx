import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Text } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import { RecipeCard } from './recipe-card';
import { ActionButton } from './action-button';
import { SwipeOverlay } from './swipe-overlay';
import { RecipeStackSkeleton } from './recipe-card-skeleton';
import { ExploreEmptyState } from './empty-state';

// React Query hooks
import {
  useExploreRecipes,
  useDailyRecipes,
  useLikeRecipe,
  useUnlikeRecipe,
} from '../../hooks/useApiQueries';

import type { ExploreCategory } from '../../services/api';

interface Recipe {
  id: string;
  title: string;
  duration: string;
  calories: string;
  rating: string;
  imageUrl: string;
  country?: {
    flag: string;
    name: string;
  };
  ingredients?: string[];
  instructions?: string[];
  proTips?: string[];
  isLiked?: boolean;
}

export interface RecipeStackRef {
  swipeNext: () => void;
  swipePrevious: () => void;
  getCurrentRecipe: () => Recipe | null;
}

interface RecipeStackProps {
  category?: ExploreCategory;
}

const RecipeStack = forwardRef<RecipeStackRef, RecipeStackProps>(({ category = 'thirty-min-meals' }, ref) => {
  const { width } = useWindowDimensions();
  const cardStackRef = useRef<CardStack<Recipe>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // React Query hooks
  const exploreRecipesQuery = useExploreRecipes(category, 10);
  const dailyRecipesQuery = useDailyRecipes(10, 0);
  const likeRecipeMutation = useLikeRecipe();
  const unlikeRecipeMutation = useUnlikeRecipe();

  // Choose which query to use based on category
  const isDaily = category === 'daily';
  const activeQuery = isDaily ? dailyRecipesQuery : exploreRecipesQuery;
  
  // Transform recipes based on data source
  const recipes: Recipe[] = React.useMemo(() => {
    if (isDaily && dailyRecipesQuery.data?.recipes) {
      // Transform daily recipes - extract recipe from nested structure
      return dailyRecipesQuery.data.recipes.map(dailyRecipe => ({
        ...dailyRecipe.recipe,
        country: {
          flag: '🌍',
          name: dailyRecipe.locationCountry || 'International'
        }
      }));
    } else if (!isDaily && exploreRecipesQuery.data?.recipes) {
      // Use API data - transform to match component interface
      return exploreRecipesQuery.data.recipes.map(recipe => {
        // Country flag mapping
        const getCountryFlag = (countryName: string) => {
          const flagMap: { [key: string]: string } = {
            'Thailand': '🇹🇭',
            'Italy': '🇮🇹',
            'France': '🇫🇷',
            'Nigeria': '🇳🇬',
            'Greece': '🇬🇷',
            'India': '🇮🇳',
            'Mexico': '🇲🇽',
            'Japan': '🇯🇵',
            'China': '🇨🇳',
            'Spain': '🇪🇸',
            'USA': '🇺🇸',
            'United States': '🇺🇸',
            'Korea': '🇰🇷',
            'Vietnam': '🇻🇳',
            'Morocco': '🇲🇦',
            'Lebanon': '🇱🇧',
            'Turkey': '🇹🇷'
          };
          return flagMap[countryName] || '🌍';
        };

        return {
          ...recipe,
          country: {
            flag: getCountryFlag(recipe.country || 'International'),
            name: recipe.country || 'International'
          }
        };
      });
    }
    return [];
  }, [isDaily, dailyRecipesQuery.data, exploreRecipesQuery.data]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    swipeNext: () => {
      if (cardStackRef.current && currentIndex < recipes.length - 1) {
        cardStackRef.current.swipeRight();
      }
    },
    swipePrevious: () => {
      if (cardStackRef.current && currentIndex > 0) {
        cardStackRef.current.swipeLeft();
      }
    },
    getCurrentRecipe: () => {
      return recipes[currentIndex] || null;
    },
  }));

  const handleSwipeStart = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    Animated.timing(overlayOpacity, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleSwipeEnd = () => {
    setSwipeDirection(null);
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleCardSwiped = async (index: number) => {
    const swipedRecipe = recipes[index];
    if (!swipedRecipe) return;

    try {
      if (swipeDirection === 'right') {
        // Like the recipe
        await likeRecipeMutation.mutateAsync(swipedRecipe.id);
        console.log(`Liked recipe: ${swipedRecipe.title}`);
      } else if (swipeDirection === 'left') {
        // Unlike the recipe (skip)
        await unlikeRecipeMutation.mutateAsync(swipedRecipe.id);
        console.log(`Skipped recipe: ${swipedRecipe.title}`);
      }
    } catch (error) {
      console.error('Error handling recipe swipe:', error);
    }

    setCurrentIndex(index + 1);
    handleSwipeEnd();
  };

  const handleCardSwipedAll = () => {
    console.log('All cards swiped!');
    // Optionally refetch more recipes
    activeQuery.refetch();
  };

  // Loading state
  if (activeQuery.isLoading) {
    return (
      <View style={[styles.container, { width }]}>
        <RecipeStackSkeleton />
      </View>
    );
  }

  // Error state
  if (activeQuery.error) {
    return (
      <View style={[styles.container, { width }]}>
        <Text style={styles.errorText}>Failed to load recipes</Text>
      </View>
    );
  }

  // Empty state
  if (!recipes.length) {
    return (
      <View style={[styles.container, { width }]}>
        <ExploreEmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width }]}>
      <CardStack
        ref={cardStackRef}
        style={styles.cardStack}
        stackNumber={3}
        stackOffset={8}
        loop={false}
        onSwipedLeft={handleCardSwiped}
        onSwipedRight={handleCardSwiped}
        onSwipedAll={handleCardSwipedAll}
        onSwipeStart={handleSwipeStart}
        onSwipeEnd={handleSwipeEnd}
        renderCard={(recipe: Recipe, index: number) => (
          <Card key={recipe.id}>
            <RecipeCard recipe={recipe} />
            {swipeDirection && (
              <Animated.View 
                style={[
                  styles.overlay,
                  { opacity: overlayOpacity }
                ]}
              >
                <SwipeOverlay 
                  type={swipeDirection === 'right' ? 'like' : 'skip'}
                  opacity={1}
                />
              </Animated.View>
            )}
          </Card>
        )}
        cardContainerStyle={styles.cardContainer}
        verticalSwipe={false}
        horizontalSwipe={true}
        outputRotationRange={['-15deg', '0deg', '15deg']}
        disableBottomSwipe
        disableTopSwipe
      />

      <View style={styles.actionContainer}>
        <ActionButton
          type="skip"
          onPress={() => {
            if (cardStackRef.current) {
              cardStackRef.current.swipeLeft();
            }
          }}
          disabled={likeRecipeMutation.isPending || unlikeRecipeMutation.isPending}
        />
        <ActionButton
          type="like"
          onPress={() => {
            if (cardStackRef.current) {
              cardStackRef.current.swipeRight();
            }
          }}
          disabled={likeRecipeMutation.isPending || unlikeRecipeMutation.isPending}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardStack: {
    flex: 1,
    width: '100%',
  },
  cardContainer: {
    borderRadius: 21,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 21,
    zIndex: 1000,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 20,
    width: '100%',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export { RecipeStack };