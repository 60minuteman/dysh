import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Selector } from '../../components/Selector';
import { Button } from '../../components/Button';

export default function Servings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedServing, setSelectedServing] = useState<'2' | '4' | '6'>('2');

  // Parse ingredients from URL parameters
  const ingredients = params.ingredients ? JSON.parse(params.ingredients as string) : [];

  const handleGetRecipe = () => {
    // Pass both ingredients and servings to recipe loading
    const urlParams = new URLSearchParams();
    urlParams.set('ingredients', JSON.stringify(ingredients));
    urlParams.set('servings', selectedServing);
    router.push(`/recipe-loading?${urlParams.toString()}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header currentScreen={3} totalScreens={4} />

      <Text style={styles.title}>How many servings{'\n'}per meal?</Text>

      <View style={styles.options}>
        <Selector
          label="2 Serving"
          subText="For two or one with extra."
          selected={selectedServing === '2'}
          onPress={() => setSelectedServing('2')}
        />

        <Selector
          label="4 Serving"
          subText="For four or two-three with extra."
          selected={selectedServing === '4'}
          onPress={() => setSelectedServing('4')}
        />

        <Selector
          label="6 Serving"
          subText="For a family of 5+"
          selected={selectedServing === '6'}
          onPress={() => setSelectedServing('6')}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Button 
          label="Get Recipe"
          onPress={handleGetRecipe}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  options: {
    paddingHorizontal: 20,
    marginTop: 90,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
}); 