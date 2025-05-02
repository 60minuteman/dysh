import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface AccordionProps {
  title: string;
  expanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export function Accordion({ title, expanded, onPress, children }: AccordionProps) {
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconContainer, expanded && styles.iconContainerExpanded]}>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#000" 
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Satoshi-Black',
    color: '#000',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  },
  iconContainerExpanded: {
    backgroundColor: '#F0F9EA',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
}); 