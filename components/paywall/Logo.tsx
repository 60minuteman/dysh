import React from 'react';
import { Image, StyleSheet } from 'react-native';

export function Logo() {
  return (
    <Image
      source={require('../../assets/logo/logo-pro.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 32,
    alignSelf: 'flex-start',
    marginLeft: -230,
    marginTop: 80,
  },
}); 