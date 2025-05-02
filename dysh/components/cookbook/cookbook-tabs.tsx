import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const tabs = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drinks'];

export function CookbookTabs() {
  const [activeTab, setActiveTab] = React.useState(0);

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
            onPress={() => setActiveTab(index)}
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
  },
  container: {
    flexDirection: 'row',
    gap: 2,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 8,
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