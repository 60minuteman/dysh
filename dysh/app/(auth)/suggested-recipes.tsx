import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { CuisineTab } from '../../components/CuisineTab';
import { RecipePreviewCard } from '../../components/RecipePreviewCard';
import { RecipePreviewContainer } from '../../components/RecipePreviewContainer';
import { RecipeModal } from '../../components/RecipeModal';
import { useState } from 'react';
import { Stack } from 'expo-router';

const cuisines = ["Nigerian", "American", "Arab", "Spanish", "Korean"];
type Cuisine = "Nigerian" | "American" | "Arab" | "Spanish" | "Korean";

const cuisineFlags: Record<Cuisine, string> = {
  "Nigerian": "🇳🇬",
  "American": "🇺🇸", 
  "Arab": "🇸🇦",
  "Spanish": "🇪🇸",
  "Korean": "🇰🇷"
};

export default function SuggestedRecipes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>("Nigerian");
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinue = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleStartCooking = () => {
    setModalVisible(false);
    router.push('/cooking-steps');
  };

  // Handle cuisine selection with type safety
  const handleSelectCuisine = (cuisine: string) => {
    if (cuisines.includes(cuisine)) {
      setSelectedCuisine(cuisine as Cuisine);
    }
  };

  // Sample recipe data
  const recipeData = [
    {
      id: '1',
      title: 'Hearty Chicken & Bean Rice Bowl',
      time: '30 min',
      calories: '320 kcal',
      rating: '4.5',
      image: require('../../assets/images/recipe-1.jpg'),
    },
    {
      id: '2',
      title: 'Spicy Grilled Fish with Plantains',
      time: '45 min',
      calories: '420 kcal',
      rating: '4.8',
      image: require('../../assets/images/recipe-1.jpg'),
    }
  ];

  // Selected recipe for the modal
  const selectedRecipe = {
    title: 'Hearty Chicken & Bean Rice Bowl',
    image: require('../../assets/images/recipe-1.jpg'),
    duration: '30 min',
    calories: '320 kcal',
    rating: '4.5',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Suggested meal{'\n'}recipes in 5 cuisines</Text>
        
        {/* Cuisine Filter using the CuisineTab component */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisineTabContainer}
          decelerationRate="fast"
          snapToInterval={screenWidth / 3} // Show 3 tabs at a time
          snapToAlignment="start"
        >
          <CuisineTab 
            cuisines={cuisines}
            selectedCuisine={selectedCuisine}
            onSelectCuisine={handleSelectCuisine}
          />
        </ScrollView>

        {/* Recipe Preview Cards Container */}
        <View style={styles.recipeCardContainer}>
          <RecipePreviewContainer 
            recipes={recipeData}
            countryFlag={cuisineFlags[selectedCuisine]}
          />
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          onPress={handleContinue}
          label="Continue"
        />
      </View>

      {/* Recipe Modal */}
      <RecipeModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onStartCooking={handleStartCooking}
        recipe={selectedRecipe}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  cuisineTabContainer: {
    paddingHorizontal: 20,
  },
  recipeCardContainer: {
    marginTop: 20,
    width: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
  }
}); 