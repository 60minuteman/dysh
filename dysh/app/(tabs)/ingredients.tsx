import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingList } from '../../components/ingredients/ShoppingList';
import { CategoryTabs } from '../../components/ingredients/CategoryTabs';
import { IngredientItem } from '../../components/ingredients/IngredientItem';
import { FloatingButton } from '../../components/ui/FloatingButton';
import { AddIngredientsModal } from '../../components/ingredients/AddIngredientsModal';

export default function Ingredients() {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [ingredients, setIngredients] = React.useState<{[key: string]: number}>({
    chicken: 0,
    pasta: 0,
    beans: 0,
    garlic: 0,
  });

  // Get list of current ingredients for filtering suggestions
  const currentIngredients = React.useMemo(() => {
    return Object.keys(ingredients);
  }, [ingredients]);

  const handleAddIngredient = () => {
    setIsModalVisible(true);
  };

  const handleAddNewIngredients = (newIngredients: string[]) => {
    const updatedIngredients = { ...ingredients };
    newIngredients.forEach(ingredient => {
      const key = ingredient.toLowerCase();
      if (!(key in updatedIngredients)) {
        updatedIngredients[key] = 0;
      }
    });
    setIngredients(updatedIngredients);
    setIsModalVisible(false);
  };

  // Render ingredient items dynamically based on state
  const renderIngredientItems = () => {
    return Object.entries(ingredients).map(([key, quantity]) => (
      <IngredientItem
        key={key}
        name={key.charAt(0).toUpperCase() + key.slice(1)}
        emoji={getEmojiForIngredient(key)}
        quantity={quantity}
        onDecrease={() => setIngredients(prev => ({
          ...prev,
          [key]: Math.max(0, prev[key] - 1)
        }))}
        onIncrease={() => setIngredients(prev => ({
          ...prev,
          [key]: prev[key] + 1
        }))}
      />
    ));
  };

  // Helper function to get emoji for ingredient
  const getEmojiForIngredient = (ingredient: string): string => {
    const emojiMap: {[key: string]: string} = {
      chicken: '🍗',
      pasta: '🍝',
      beans: '🫘',
      garlic: '🧄',
      rice: '🍚',
      onion: '🧅',
      tomato: '🍅',
      potato: '🥔',
      beef: '🥩',
      carrot: '🥕',
      // Add more mappings as needed
    };
    return emojiMap[ingredient] || '🥘';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingredients</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.shoppingListContainer}>
          <ShoppingList />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          <CategoryTabs />
        </ScrollView>

        <View style={styles.ingredientsList}>
          {renderIngredientItems()}
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <FloatingButton onPress={handleAddIngredient} />
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddIngredientsModal
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddNewIngredients}
          existingIngredients={currentIngredients}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 26,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  shoppingListContainer: {
    height: 96,
  },
  tabsContainer: {
    paddingHorizontal: 20,
  },
  ingredientsList: {
    paddingHorizontal: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: -30,
    right: 0,
  },
}); 