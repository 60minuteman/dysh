import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  totalScreens?: number;
  currentScreen?: number;
}

export function Header({ 
  showBack = true, 
  onBack,
  totalScreens = 3,
  currentScreen = 1 
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const progress = (currentScreen / totalScreens) * 100;

  return (
    <View>
      <View style={styles.container}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 44,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    marginLeft: 56,
    marginRight: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
  }
});
