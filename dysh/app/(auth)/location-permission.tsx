import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

export default function LocationPermission() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      router.push('/ingredients');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header currentScreen={2} totalScreens={3} />
      
      <Text style={styles.title}>Enable location to{'\n'}personalize recipes</Text>
      
      <Text style={styles.description}>
        We'll use your location to suggest recipes based on local and regional cuisines.
      </Text>

      <View style={[styles.permissionContainer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>
            Allow Dysh AI to access your location while you are using the app?
          </Text>
          <View style={styles.buttonContainer}>
            <Button 
              label="Don't Allow"
              variant="secondary"
              onPress={() => router.push('/(tabs)')}
              style={styles.button}
            />
            <Button 
              label="Allow"
              onPress={handleLocationPermission}
              style={styles.button}
            />
          </View>
        </View>

        <Text style={styles.handEmoji}>👆</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/food-preview.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  imageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  permissionContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  permissionBox: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  permissionText: {
    fontSize: 17,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  handEmoji: {
    fontSize: 40,
    marginTop: 12,
  },
});