import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SearchInput } from '../SearchInput';
import { IngredientItem } from '../IngredientItem';
import { IngredientPill } from '../IngredientPill';

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
];

interface AddIngredientsModalProps {
  onClose: () => void;
  onAdd: (ingredients: string[]) => void;
}

export function AddIngredientsModal({ onClose, onAdd }: AddIngredientsModalProps) {
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
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setSearchQuery(''); // Clear search after adding
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Ingredients</Text>
        <TouchableOpacity 
          onPress={() => {
            onAdd(selectedIngredients);
            onClose();
          }}
        >
          <Text style={styles.addButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search for ingredients"
          selectedIngredients={selectedIngredients}
          onSubmit={handleSearchSubmit}
        />

        {selectedIngredients.length > 0 && (
          <View style={styles.pillsContainer}>
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

        <Text style={styles.sectionTitle}>
          {searchQuery.trim() ? 'Search result' : 'Suggestion'}
        </Text>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredIngredients.map((ingredient) => (
            <IngredientItem
              key={ingredient}
              name={ingredient}
              onPress={() => handleAddIngredient(ingredient)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
  },
  cancelButton: {
    fontSize: 16,
    color: '#000000',
  },
  addButton: {
    fontSize: 16,
    color: '#64D61D',
    fontFamily: 'Satoshi-Bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  pillsScroll: {
    flexDirection: 'row',
    paddingRight: 20,
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
}); 