import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const tabs = ['Trending', '30-Min Meals', 'Chef’s Picks', 'Occasion'];

export function ExploreTabs() {
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