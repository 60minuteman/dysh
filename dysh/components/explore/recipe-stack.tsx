    import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
    import { View, StyleSheet, useWindowDimensions, Animated } from 'react-native';
    import CardStack, { Card } from 'react-native-card-stack-swiper';
    import { RecipeCard } from './recipe-card';
    import { ActionButton } from './action-button';
    import { SwipeOverlay } from './swipe-overlay';

    interface Recipe {
    id: string;
    title: string;
    duration: string;
    calories: string;
    rating: string;
    image: any;
    country: {
        flag: string;
        name: string;
    };
    }

    const RECIPES: Recipe[] = [
    {
        id: '1',
        title: 'Fried Plantain, Rice And Bean Sauce',
        duration: '30 min',
        calories: '320 kcal',
        rating: '4.5',
        image: require('../../assets/images/recipe-1.jpg'),
        country: {
        flag: '🇵🇷',
        name: 'Puerto Rican',
        },
    },
    {
        id: '2',
        title: 'Chicken Tikka Masala',
        duration: '45 min',
        calories: '450 kcal',
        rating: '4.8',
        image: require('../../assets/images/recipe-2.jpg'),
        country: {
        flag: '🇮🇳',
        name: 'Indian',
        },
    },

    {
        id: '3',
        title: 'Tikki Tikka Masala',
        duration: '45 min',
        calories: '450 kcal',
        rating: '4.8',
        image: require('../../assets/images/recipe-2.jpg'),
        country: {
        flag: '🇮🇳',
        name: 'Indian',
        },
    },

    {
        id: '4',
        title: 'Tikki Tikka Masala',
        duration: '45 min',
        calories: '450 kcal',
        rating: '4.8',
        image: require('../../assets/images/recipe-2.jpg'),
        country: {
        flag: '🇮🇳',
        name: 'Indian',
        },
    },
    // Add more recipes as needed
    ];

    export interface RecipeStackRef {
    goBackFromLeft: () => void;
    }

    const RecipeStack = forwardRef<RecipeStackRef>((_, ref) => {
    const { height: screenHeight } = useWindowDimensions();
    const swiper = useRef<CardStack>(null);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [swipeProgress, setSwipeProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipedCards, setSwipedCards] = useState<Array<{ index: number }>>([]);

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

    const handleSwipedRight = (index: number) => {
        setCurrentIndex(index + 1);
        setSwipeDirection(null);
        setSwipeProgress(0);
        console.log('Liked recipe:', RECIPES[index].title);
    };

    const handleSwipedLeft = (index: number) => {
        setSwipedCards(prev => [...prev, { index }]);
        setCurrentIndex(index + 1);
        setSwipeDirection(null);
        setSwipeProgress(0);
        console.log('Rejected recipe:', RECIPES[index].title);
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

    return (
        <View style={[styles.container, { height: screenHeight * 0.7 }]}>
        <View style={styles.cardContainer}>
            <CardStack
            ref={swiper}
            style={styles.cardStack}
            renderNoMoreCards={() => null}
            onSwipedRight={handleSwipedRight}
            onSwipedLeft={handleSwipedLeft}
            onSwipeEnd={handleSwipeEnd}
            onSwipeProgress={handleSwipeProgress}
            disableTopSwipe
            disableBottomSwipe
            verticalSwipe={false}
            cardContainerStyle={styles.cardContainerStyle}
            stackSize={2}
            swipeThreshold={50}
            >
            {RECIPES.map((recipe) => (
                <View key={recipe.id} style={styles.mainCard}>
                <RecipeCard {...recipe} />
                <View style={[StyleSheet.absoluteFill, styles.overlayContainer]}>
                    {swipeDirection && (
                    <SwipeOverlay 
                        type={swipeDirection === 'right' ? 'like' : 'skip'}
                        opacity={swipeProgress}
                    />
                    )}
                </View>
                </View>
            ))}
            </CardStack>
        </View>
        
        <View style={styles.actions}>
            <ActionButton variant="reject" onPress={handleReject} />
            <ActionButton variant="like" onPress={handleLike} />
        </View>
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
    });