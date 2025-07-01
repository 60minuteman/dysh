import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Pill } from '../../components/ui/Pill';

const INGREDIENTS = {
  '🥦 Vegetables': [
    'Onion',
    'Tomato', 
    'Bell Pepper',
    'Garlic',
    'Spinach',
    'Carrot',
    'Cabbage'
  ],
  '🍗 Proteins': [
    'Chicken',
    'Egg',
    'Minced beef',
    'Fish',
    'Tofu',
    'Sausage',
    'Goat Meat'
  ],
  '🍚 Grains & Starches': [
    'Rice',
    'Pasta',
    'Semolina',
    'Couscous',
    'Yam',
    'Plantain',
    'Bread'
  ],
  '🧀 Dairy & Alternatives': [
    'Milk',
    'Butter',
    'Sour Cream',
    'Cheese',
    'Yogurt',
    'Soy Milk'
  ],
  '🥫 Canned & Dry Goods': [
    'Beans',
    'Cashew Nuts',
    'Corn',
    'Tomato Paste',
    'Green Peas',
    'Lentils'
  ]
};

export default function Ingredients() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleToggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else if (selectedIngredients.length < 6) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleGetRecipe = () => {
    const params = new URLSearchParams();
    params.set('ingredients', JSON.stringify(selectedIngredients));
    router.push(`/servings?${params.toString()}`);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header currentScreen={3} totalScreens={3} />
      
      <Text style={styles.title}>Select 6 ingredients to{'\n'}generate your first meal</Text>
      
      <Text style={styles.subtitle}>{selectedIngredients.length}/6 Selected</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(INGREDIENTS).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {category}
            </Text>
            <View style={styles.ingredientGrid}>
              {items.map((ingredient) => (
                <Pill
                  key={ingredient}
                  label={ingredient}
                  selected={selectedIngredients.includes(ingredient)}
                  onPress={() => handleToggleIngredient(ingredient)}
                  disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= 6}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedIngredients.length === 6 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Button
            label="Continue"
            onPress={handleGetRecipe}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    fontFamily: 'Satoshi-Semibold',
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
  },
});