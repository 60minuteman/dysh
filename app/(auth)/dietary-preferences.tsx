import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Selector } from '../../components/Selector';
import { Button } from '../../components/Button';

type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten-free' | 'keto';

export default function DietaryPreferences() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPreference, setSelectedPreference] = useState<DietaryPreference | null>(null);

  const handleContinue = () => {
    router.push('/location-permission');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header />
      
      <Text style={styles.title}>Any dietary{'\n'}preferences?</Text>

      <View style={styles.content}>
        <Selector
          label="No Restrictions"
          icon="restaurant-outline"
          selected={selectedPreference === 'none'}
          onPress={() => setSelectedPreference('none')}
        />
        <Selector
          label="Vegetarian"
          icon="leaf-outline"
          selected={selectedPreference === 'vegetarian'}
          onPress={() => setSelectedPreference('vegetarian')}
        />
        <Selector
          label="Vegan"
          icon="nutrition-outline"
          selected={selectedPreference === 'vegan'}
          onPress={() => setSelectedPreference('vegan')}
        />
        <Selector
          label="Pescatarian"
          icon="fish-outline"
          selected={selectedPreference === 'pescatarian'}
          onPress={() => setSelectedPreference('pescatarian')}
        />
        <Selector
          label="Gluten-Free"
          icon="basket-outline"
          selected={selectedPreference === 'gluten-free'}
          onPress={() => setSelectedPreference('gluten-free')}
        />
        <Selector
          label="Keto"
          icon="flame-outline"
          selected={selectedPreference === 'keto'}
          onPress={() => setSelectedPreference('keto')}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!selectedPreference}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
  },
});
