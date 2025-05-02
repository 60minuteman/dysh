import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShoppingHeader } from '../../components/shopping/shopping-header';
import { ShoppingItem } from '../../components/shopping/shopping-item';
import { Button } from '../../components/Button';

interface ShoppingItem {
  name: string;
  emoji: string;
  isEssential?: boolean;
}

export default function ShoppingList() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const essentialItems: ShoppingItem[] = [
    { name: 'Chicken', emoji: '🍗', isEssential: true },
    { name: 'Tomatoes', emoji: '🍅', isEssential: true },
    { name: 'Onions', emoji: '🧅', isEssential: true },
  ];

  const suggestedItems: ShoppingItem[] = [
    { name: 'Rice', emoji: '🍚' },
    { name: 'Eggs', emoji: '🥚' },
    { name: 'Milk', emoji: '🥛' },
    { name: 'Pepper', emoji: '🌶' },
    { name: 'Garlic', emoji: '🧄' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ShoppingHeader 
        title="Shopping List"
        onAddPress={() => {}}
      />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Essentials Running Low</Text>
        {essentialItems.map(item => (
          <ShoppingItem
            key={item.name}
            name={item.name}
            emoji={item.emoji}
            onRemove={() => {}}
            onAddToCart={() => {}}
          />
        ))}

        <Text style={[styles.sectionTitle, styles.suggestedTitle]}>✨ Suggested</Text>
        {suggestedItems.map(item => (
          <ShoppingItem
            key={item.name}
            name={item.name}
            emoji={item.emoji}
            onRemove={() => {}}
            onAddToCart={() => {}}
          />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          label="Export List"
          style={styles.continueButton}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Satoshi-Bold',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
    marginBottom: 16,
  },
  suggestedTitle: {
    marginTop: 32,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    height: 56,
    width: 268,
    alignSelf: 'center',
  },
}); 