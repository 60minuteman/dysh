import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export function ShoppingList() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={() => router.push('/shopping-list')}
    >
      <ImageBackground
        source={require('../../assets/images/banner-bg.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <Text style={styles.title}>AI Shopping List</Text>
          <Text style={styles.subtitle}>Low Stock: 4 • Suggested:12</Text>
        </View>
        <Image 
          source={require('../../assets/icons/Arrow_Right.png')}
          style={styles.icon}
        />
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 96,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 32,
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backgroundImage: {
    borderRadius: 20,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: 'rgb(255, 255, 255)',
    marginTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
}); 