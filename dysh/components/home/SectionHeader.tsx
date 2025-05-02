import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Pill } from '../ui/Pill';

interface SectionHeaderProps {
  title: string;
  timer?: string;
}

export function SectionHeader({ title, timer }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Image
          source={require('../../assets/icons/chevron-up-down.png')}
          style={styles.chevron}
        />
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
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  chevron: {
    width: 24,
    height: 24,
  }
}); 