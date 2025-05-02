import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ProBadge } from '../ui/ProBadge';

interface HeaderProps {
  isPro?: boolean;
}

export function Header({ isPro = false }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ImageBackground
        source={require('../../assets/images/header-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(249, 249, 249, 0)', 'rgba(249, 249, 249, 1)']}
          locations={[0, 1]}
          style={styles.gradient}
        />
      </ImageBackground>

      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo/logo-black.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.badgeContainer}>
            {isPro && <ProBadge />}
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Image
            source={require('../../assets/icons/3dots.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80, // Increased height for more subtle gradient
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 86,
    height: 38,
  },
  badgeContainer: {
    marginLeft: -4,
    marginTop: 6, // Added marginTop to move badge lower
  },
  menuButton: {
    width: 37,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 100,
    padding: 8,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
}); 