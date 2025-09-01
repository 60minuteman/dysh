import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const tabs = ['All • 23', 'Proteins', 'Dairy & Eggs', 'Vegetables'];

export function CategoryTabs() {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    padding: 24,
    paddingHorizontal: -20,
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