import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Text } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import { RecipeCard } from './recipe-card';
import { ActionButton } from './action-button';
import { SwipeOverlay } from './swipe-overlay';
import { ApiService } from '../../services/api';
import { authService } from '../../lib/auth';
import { RecipeStackSkeleton } from './recipe-card-skeleton';
import { ExploreEmptyState } from './empty-state';

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
}

interface RecipeStackProps {
  category?: string;
}

// Removed hardcoded RECIPES - now using only API data

export interface RecipeStackRef {
  goBackFromLeft: () => void;
}

const RecipeStack = forwardRef<RecipeStackRef, RecipeStackProps>(({ category = 'thirty-min-meals' }, ref) => {
  const { height: screenHeight } = useWindowDimensions();
  const swiper = useRef<CardStack>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCards, setSwipedCards] = useState<Array<{ index: number }>>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes based on category
  useEffect(() => {
    let isCancelled = false;
    
    const fetchRecipes = async (retryCount = 0) => {
      try {
        setLoading(true);
        console.log(`🔄 Fetching recipes for category: ${category} (attempt ${retryCount + 1})`);
        
        // Add small delay to prevent rapid successive calls
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (isCancelled) {
          console.log(`🚫 Request cancelled for ${category}`);
          return;
        }
        
        let recipesData: Recipe[];
        
        if (category === 'daily') {
          // Daily recipes require authentication
          const authHeaders = await authService.getAuthHeaders();
          const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
          
          if (!token) {
            console.log('🔐 No token available for daily recipes');
            setRecipes([]); // Show empty state for daily recipes without auth
            return;
          }
          
          // Fetch daily recipes
          const dailyResponse = await ApiService.getDailyRecipes(token, 10, 0);
          // Transform daily recipes - extract recipe from nested structure
          recipesData = dailyResponse.recipes.map(dailyRecipe => ({
            ...dailyRecipe.recipe,
            country: {
              flag: '🌍',
              name: dailyRecipe.locationCountry || 'International'
            }
          }));
        } else {
          // Explore recipes don't require authentication - browse freely
          // Try to get token for personalized data, but continue without if not available
          const authHeaders = await authService.getAuthHeaders().catch(() => ({ Authorization: '' }));
          const token = authHeaders.Authorization?.replace('Bearer ', '') || null;
          
          const response = await ApiService.getExploreRecipes(token, category, 10);
          console.log(`✅ API Response for ${category}:`, {
            status: 'success',
            recipesCount: response.recipes.length,
            category: response.category,
            fullResponse: response
          });
          
          if (response.recipes.length > 0) {
            console.log('📋 Sample recipe data:', response.recipes[0]);
          }
          
          if (response.recipes && response.recipes.length > 0) {
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

            // Use API data - transform to match component interface
            recipesData = response.recipes.map(recipe => ({
              ...recipe,
              country: {
                flag: getCountryFlag(recipe.country || 'International'),
                name: recipe.country || 'International'
              }
            }));
            console.log(`Using ${recipesData.length} API recipes for ${category}`);
            console.log('🔄 Transformed recipe sample:', recipesData[0]);
          } else {
            console.log(`No recipes found for ${category}, setting empty array`);
            if (category === 'trending') {
              console.log('📈 Trending category is currently empty - this is expected if no recipes are trending yet');
            }
            recipesData = [];
          }
        }
        
        if (!isCancelled) {
          setRecipes(recipesData);
          console.log(`✅ Successfully set ${recipesData.length} recipes for ${category} category`);
          setLoading(false);
          console.log(`🔄 Loading state set to false for ${category}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error fetching ${category} recipes:`, {
          error: errorMessage,
          category,
          timestamp: new Date().toISOString(),
          fullError: error
        });
        
        // Retry logic for failed requests
        if (!isCancelled && retryCount < 2) {
          console.log(`🔄 Retrying request for ${category} in 1 second...`);
          setTimeout(() => {
            if (!isCancelled) {
              fetchRecipes(retryCount + 1);
            }
          }, 1000);
        } else if (!isCancelled) {
          console.log(`🚫 API error for ${category}, showing empty state after ${retryCount + 1} attempts`);
          setRecipes([]);
          setLoading(false);
        }
      } finally {
        // Loading state is handled in success/error blocks
        // This ensures proper state management for retries
      }
    };

    fetchRecipes();
    
    return () => {
      isCancelled = true;
    };
  }, [category]);

  useImperativeHandle(ref, () => ({
    goBackFromLeft: () => {
      if (swipedCards.length > 0) {
        const lastCard = swipedCards[swipedCards.length - 1];
        setSwipedCards(prev => prev.slice(0, -1));
        setCurrentIndex(lastCard.index);
        swiper.current?.goBackFromLeft();
      }
    }
  }));

  const handleLike = () => {
    swiper.current?.swipeRight();
  };

  const handleReject = () => {
    swiper.current?.swipeLeft();
  };

  const handleSwipedRight = async (index: number) => {
    setCurrentIndex(index + 1);
    setSwipeDirection(null);
    setSwipeProgress(0);
    
    // Like the recipe via API (optional authentication)
    try {
      const authHeaders = await authService.getAuthHeaders().catch(() => ({ Authorization: '' }));
      const token = authHeaders.Authorization?.replace('Bearer ', '') || null;
      
      await ApiService.likeRecipe(token, recipes[index].id);
      if (token) {
        console.log('Liked recipe:', recipes[index].title);
      } else {
        console.log('Guest user - recipe not saved to cookbook');
        // Could show a toast: "Sign in to save recipes to your cookbook"
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      // API should return friendly error for guest users
    }
  };

  const handleSwipedLeft = async (index: number) => {
    setSwipedCards(prev => [...prev, { index }]);
    setCurrentIndex(index + 1);
    setSwipeDirection(null);
    setSwipeProgress(0);
    
    // Unlike the recipe via API (remove from cookbook) - optional authentication
    try {
      const authHeaders = await authService.getAuthHeaders().catch(() => ({ Authorization: '' }));
      const token = authHeaders.Authorization?.replace('Bearer ', '') || null;
      
      await ApiService.unlikeRecipe(token, recipes[index].id);
      if (token) {
        console.log('Unliked recipe:', recipes[index].title);
      } else {
        console.log('Guest user - no cookbook to remove from');
        // Could show a toast: "Sign in to manage your cookbook"
      }
    } catch (error) {
      console.error('Error unliking recipe:', error);
      // API should return friendly error for guest users
    }
  };

  const handleSwipeEnd = () => {
    setSwipeDirection(null);
    setSwipeProgress(0);
  };

  const handleSwipeProgress = (progress: number) => {
    const normalizedProgress = Math.min(Math.abs(progress / 50), 1);
    setSwipeProgress(normalizedProgress);
    if (progress < 0) {
      setSwipeDirection('left');
    } else if (progress > 0) {
      setSwipeDirection('right');
    }
  };

  console.log(`🎯 Render state - loading: ${loading}, recipes count: ${recipes.length}, category: ${category}`);
  
  return (
    <View style={[styles.container, { height: screenHeight * 0.7 }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <RecipeStackSkeleton />
        </View>
      ) : recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ExploreEmptyState category={category} />
        </View>
      ) : (
        <>
          <View style={styles.cardContainer}>
            <CardStack
              ref={swiper}
              style={styles.cardStack}
              renderNoMoreCards={() => null}
              onSwipedRight={handleSwipedRight}
              onSwipedLeft={handleSwipedLeft}
              onSwipeEnd={handleSwipeEnd}
              disableTopSwipe
              disableBottomSwipe
              verticalSwipe={false}
              cardContainerStyle={styles.cardContainerStyle}
              stackSize={2}
              swipeThreshold={50}
            >
              {recipes.map((recipe, index) => {
                // Debug: Log the recipe data being passed to the card
                if (index === 0) {
                  console.log('🍳 Recipe data for card:', {
                    title: recipe.title,
                    duration: recipe.duration,
                    calories: recipe.calories,
                    rating: recipe.rating,
                    imageUrl: recipe.imageUrl,
                    country: recipe.country
                  });
                }
                
                return (
                  <View key={recipe.id} style={styles.mainCard}>
                    <RecipeCard 
                      title={recipe.title || 'Recipe'}
                      duration={recipe.duration || '30 min'}
                      calories={recipe.calories || '400 kcal'}
                      rating={recipe.rating || '4.0'}
                      image={recipe.imageUrl && recipe.imageUrl.startsWith('http') ? { uri: recipe.imageUrl } : require('../../assets/images/recipe-1.jpg')}
                      country={recipe.country || { flag: '🌍', name: 'International' }}
                    />
                    <View style={[StyleSheet.absoluteFill, styles.overlayContainer]}>
                      {swipeDirection && (
                        <SwipeOverlay 
                          type={swipeDirection === 'right' ? 'like' : 'skip'}
                          opacity={swipeProgress}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            </CardStack>
          </View>
          
          <View style={styles.actions}>
            <ActionButton variant="reject" onPress={handleReject} />
            <ActionButton variant="like" onPress={handleLike} />
          </View>
        </>
      )}
    </View>
  );
});

export { RecipeStack };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  cardContainer: {
    flex: 1,
    marginVertical: '5%',
    position: 'relative',
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainerStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mainCard: {
    flex: 1,
    position: 'relative',
    borderRadius: 40,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: '10%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: '-3%',
  },
  overlayContainer: {
    overflow: 'hidden',
    borderRadius: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});