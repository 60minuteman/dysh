import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { SearchInput } from '../../components/SearchInput';
import { IngredientItem } from '../../components/IngredientItem';
import { Button } from '../../components/Button';
import { IngredientPill } from '../../components/IngredientPill';

const SUGGESTED_INGREDIENTS = [
  'Chicken',
  'Rice',
  'Onion',
  'Garlic',
  'Pasta',
  'Tomato',
  'Potato',
  'Beef',
  'Carrot',
  'Bell Pepper',
  'Mushroom',
  'Egg',
  'Cheese',
  'Broccoli',
  'Spinach',
];

export default function Ingredients() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) return SUGGESTED_INGREDIENTS;
    
    const query = searchQuery.toLowerCase().trim();
    return SUGGESTED_INGREDIENTS.filter(ingredient => 
      ingredient.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient) && selectedIngredients.length < 10) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setSearchQuery(''); // Clear search after adding
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const handleGetRecipe = () => {
    // Pass ingredients to the next screen
    const params = new URLSearchParams();
    params.set('ingredients', JSON.stringify(selectedIngredients));
    router.push(`/servings?${params.toString()}`);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && selectedIngredients.length < 10) {
      // Capitalize first letter of each word
      const formattedIngredient = searchQuery.trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      if (!selectedIngredients.includes(formattedIngredient)) {
        handleAddIngredient(formattedIngredient);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header currentScreen={3} totalScreens={3} />

      {selectedIngredients.length > 0 && (
        <View style={styles.pillsContainer}>
          <Text style={styles.pillsCount}>
            {selectedIngredients.length}/10
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsScroll}
          >
            {selectedIngredients.map((ingredient) => (
              <IngredientPill
                key={ingredient}
                label={ingredient}
                onRemove={() => handleRemoveIngredient(ingredient)}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      <Text style={styles.title}>Add atleast 4{'\n'}ingredients</Text>
      
      <Text style={styles.subtitle}>Generate your first meal now</Text>

      <View style={styles.content}>
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search for ingredients"
          selectedIngredients={selectedIngredients}
          onSubmit={handleSearchSubmit}
        />

        <Text style={styles.sectionTitle}>
          {searchQuery.trim() ? 'Search result' : 'Suggestion'}
        </Text>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredIngredients.map((ingredient) => (
            <IngredientItem
              key={ingredient}
              name={ingredient}
              onPress={() => handleAddIngredient(ingredient)}
              disabled={selectedIngredients.length >= 10}
            />
          ))}
        </ScrollView>
      </View>

      {selectedIngredients.length >= 4 && (
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
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  pillsCount: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#000',
    marginRight: 12,
  },
  pillsScroll: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 24,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
  },
}); 