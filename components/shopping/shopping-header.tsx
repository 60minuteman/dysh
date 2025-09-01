import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface ShoppingHeaderProps {
  title: string;
  onAddPress?: () => void;
}

export function ShoppingHeader({ title, onAddPress }: ShoppingHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.back()}
      >
        <Image 
          source={require('../../assets/icons/arrow-left.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={onAddPress}
      >
        <Image 
          source={require('../../assets/icons/plus-black.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F9F9F9',
    
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
}); 