import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { Pill } from '../ui/Pill';

interface SectionHeaderProps {
  title: string;
  timer?: string;
  onMealTypeSelect?: (mealType: string) => void;
}

export function SectionHeader({ title, timer, onMealTypeSelect }: SectionHeaderProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(title);

  const handleMealSelect = (mealType: string) => {
    setIsDropdownVisible(false);
    setSelectedMealType(mealType);
    onMealTypeSelect?.(mealType);
  };

  return (
    <View style={styles.container}>
      <View>
        <Pressable 
          style={styles.titleContainer}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.title}>{selectedMealType}</Text>
          <Image
            source={require('../../assets/icons/chevron-up-down.png')}
            style={[
              styles.chevron,
              isDropdownVisible && styles.chevronRotated
            ]}
          />
        </Pressable>
        
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.mealOption}
              onPress={() => handleMealSelect('Breakfast')}
            >
              <Text style={styles.mealText}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mealOption}
              onPress={() => handleMealSelect('Lunch')}
            >
              <Text style={styles.mealText}>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mealOption}
              onPress={() => handleMealSelect('Dinner')}
            >
              <Text style={styles.mealText}>Dinner</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {timer && (
        <Pill 
          label={timer}
          variant="outline"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  chevron: {
    width: 24,
    height: 24,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  mealOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 150,
  },
  mealText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
  }
}); 