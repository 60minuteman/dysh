import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecipeStats } from './RecipeStats';
import { Accordion } from './Accordion';
import { Button } from './Button';

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
  onStartCooking: () => void;
  recipe?: {
    title: string;
    image: any;
    duration: string;
    calories: string;
    rating: string;
  };
}

export function RecipeModal({ visible, onClose, onStartCooking, recipe }: RecipeModalProps) {
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

  if (!recipe) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Image
            source={recipe.image || require('../assets/images/recipe-placeholder.png')}
            style={styles.headerImage}
          />

          <ScrollView style={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <RecipeStats 
                duration={recipe.duration}
                calories={recipe.calories}
                rating={recipe.rating}
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
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button 
              label="Start Cooking" 
              onPress={onStartCooking}
              style={styles.startCookingButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 0,
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
    marginBottom: 24,
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
  startCookingButton: {
    height: 56,
  },
}); 