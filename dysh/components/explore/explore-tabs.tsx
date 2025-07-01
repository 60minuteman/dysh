import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useExploreContext } from '../../contexts/ExploreContext';

const tabs = ['Daily', 'Trending', '30-Min Meals', 'Chef Picks', 'Occasion'];

interface ExploreTabsProps {
  onTabChange?: (category: string) => void;
}

export function ExploreTabs({ onTabChange }: ExploreTabsProps) {
  const [activeTab, setActiveTab] = React.useState(2);
  const { setCategory } = useExploreContext();

  const categoryMap = {
    0: 'daily',
    1: 'trending',
    2: 'thirty-min-meals',
    3: 'chefs-pick',
    4: 'occasion'
  };

  // Trigger initial category selection
  React.useEffect(() => {
    console.log('ExploreTabs: Setting initial category to thirty-min-meals');
    setCategory(categoryMap[2] as any); // Default to thirty-min-meals
    onTabChange?.(categoryMap[2]);
  }, [setCategory, onTabChange]); 

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    const selectedCategory = categoryMap[index as keyof typeof categoryMap];
    setCategory(selectedCategory as any);
    onTabChange?.(selectedCategory);
  };

  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <Text style={[styles.text, activeTab === index && styles.activeText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 0,
    marginRight: '-10%',
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    paddingHorizontal: 0,
    marginRight: '-10%',
  },
  tab: {
    padding: 8,
    borderRadius: 20,
  },
  text: {
    fontFamily: 'Satoshi-Medium',
    color: '#CACACA',
    fontSize: 18,
  },
  activeText: {
    color: '#201A25',
  },
});