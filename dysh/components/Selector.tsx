import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectorProps {
  label: string;
  subText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function Selector({ label, subText, icon, selected, onPress, style }: SelectorProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.containerSelected,
        style,
      ]}
      onPress={onPress}
    >
      {icon && (
        <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
          <Ionicons
            name={icon}
            size={24}
            color="#000000"
          />
        </View>
      )}
      <View style={[styles.textContainer, !icon && styles.textContainerNoIcon]}>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
        {subText && (
          <Text style={[styles.subText, selected && styles.subTextSelected]}>
            {subText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 60,
    marginBottom: 12,
    minHeight: 60,
  },
  containerSelected: {
    backgroundColor: '#F1ECC1',
  },
  iconContainer: {
    width: 47,
    height: 47,
    borderRadius: 23.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerSelected: {
    backgroundColor: '#E3DEB6',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainerNoIcon: {
    paddingLeft: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
  },
  labelSelected: {
    color: '#000000',
  },
  subText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  subTextSelected: {
    color: '#000000',
  },
});
