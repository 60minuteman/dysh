import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';

interface CuisineTabProps {
  cuisines: string[];
  selectedCuisine: string;
  onSelectCuisine: (cuisine: string) => void;
}

export function CuisineTab({ cuisines, selectedCuisine, onSelectCuisine }: CuisineTabProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cuisineContainer}
    >
      {cuisines.map((cuisine) => (
        <TouchableOpacity
          key={cuisine}
          style={[
            styles.cuisineItem,
            selectedCuisine === cuisine && styles.cuisineItemSelected
          ]}
          onPress={() => onSelectCuisine(cuisine)}
        >
          <Text
            style={[
              styles.cuisineText,
              selectedCuisine === cuisine && styles.cuisineTextSelected
            ]}
          >
            {cuisine}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cuisineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuisineItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cuisineItemSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  cuisineText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
  },
  cuisineTextSelected: {
    color: '#FFFFFF',
  },
}); 