import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParallaxScrollView } from '../../components/ParallaxScrollView';
import { RecipeHeader } from '../../components/RecipeHeader';
import { RecipeCard } from '../../components/RecipeCard';
import { Button } from '../../components/Button';
import { CuisineHeader } from '../../components/CuisineHeader';
import { RecipeStats } from '../../components/RecipeStats';
import { Accordion } from '../../components/Accordion';

export default function Recipe() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedSection, setExpandedSection] = useState<string | null>('ingredients');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const proTips = [
    'Add cumin or curry for a bolder flavor.',
    'Top with avocado, cheese, or hot sauce for extra richness.',
    'Swap rice for quinoa for a healthier twist.',
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <CuisineHeader 
        title="Suggested Recipe"
        cuisine="Nigerian Cuisine"
      />

      <ScrollView>
        <Image
          source={require('../../assets/images/recipe-placeholder.png')}
          style={styles.headerImage}
        />
        
        <View style={styles.content}>
          <Text style={styles.recipeTitle}>Hearty Chicken & Bean Rice Bowl</Text>
          <RecipeStats 
            duration="30 min"
            calories="320 kcal"
            rating="4.5"
          />

          <View style={styles.accordionContainer}>
            <Accordion
              title="🥘 Ingredients"
              expanded={expandedSection === 'ingredients'}
              onPress={() => toggleSection('ingredients')}
            >
              <Text style={styles.sectionText}>Ingredients list here...</Text>
            </Accordion>

            <Accordion
              title="👨‍🍳 Instructions"
              expanded={expandedSection === 'instructions'}
              onPress={() => toggleSection('instructions')}
            >
              <Text style={styles.sectionText}>Instructions here...</Text>
            </Accordion>

            <Accordion
              title="✨ Pro Tips"
              expanded={expandedSection === 'tips'}
              onPress={() => toggleSection('tips')}
            >
              {proTips.map((tip, index) => (
                <Text key={index} style={styles.tipText}>✓ {tip}</Text>
              ))}
            </Accordion>
          </View>

          <View style={styles.moreRecipes}>
            <Text style={styles.moreRecipesTitle}>More Recipes</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeCards}
            >
              <RecipeCard
                title="Spicy Jollof Rice"
                duration="30 min"
                calories="450 kcal"
                rating="4.5"
              />
              <RecipeCard
                title="One-Pot Pasta"
                duration="30 min"
                calories="380 kcal" 
                rating="4.5"
              />
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Button 
          label="Continue" 
          onPress={() => router.push('/paywall')}
          style={styles.continueButton}
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
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    flex: 1,
    paddingTop: -20,
  },
  recipeTitle: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#000',
    marginBottom: 24,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  accordionContainer: {
    paddingHorizontal: 20,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    color: '#333333',
    lineHeight: 24,
  },
  tipText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Regular',
    color: '#333333',
    marginBottom: 12,
    lineHeight: 22,
  },
  moreRecipes: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  moreRecipesTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  recipeCards: {
    paddingHorizontal: 20,
    gap: 16,
  },
  recipeCard: {
    marginRight: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButton: {
    height: 56,
    marginTop: 8,
    marginBottom: -20,
  },
});