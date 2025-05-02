import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  selectedIngredients?: string[];
  onSubmit?: () => void;
}

export function SearchInput({ 
  value, 
  onChangeText, 
  placeholder,
  selectedIngredients = [],
  onSubmit
}: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        returnKeyType={selectedIngredients.length >= 3 ? "done" : "default"}
        onSubmitEditing={() => {
          if (selectedIngredients.length >= 3 && onSubmit) {
            onSubmit();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 60,
    paddingHorizontal: 16,
    height: 52,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#000',
    fontFamily: 'Satoshi-Regular',
  },
}); 