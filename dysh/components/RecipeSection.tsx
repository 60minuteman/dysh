import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecipeSectionProps {
  title: string;
  expanded?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export function RecipeSection({ 
  title,
  expanded = false,
  onPress,
  children 
}: RecipeSectionProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#000" 
        />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Satoshi-Medium',
    color: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
}); 