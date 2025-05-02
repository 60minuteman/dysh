import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

interface RecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
  onPress?: () => void;
  countryFlag?: string;
}

export function RecipeCard({ 
  title, 
  duration, 
  calories, 
  rating, 
  image,
  onPress,
  countryFlag = '🇳🇬'
}: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={image}
        style={styles.background}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.topBar}>
            <Text style={styles.flag}>{countryFlag}</Text>
            <View style={styles.bookmarkContainer}>
              <TouchableOpacity style={styles.bookmarkButton}>
                <Image 
                  source={require('../../assets/icons/love.png')}
                  style={styles.bookmarkIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={16} color="#FFF" />
                <Text style={styles.statText}>{duration}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="flame-outline" size={16} color="#FFF" />
                <Text style={styles.statText}>{calories}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="star-outline" size={16} color="#FFF" />
                <Text style={styles.statText}>{rating}</Text>
              </View>
            </View>
            <Button 
              label="Open Recipe"
              onPress={onPress || (() => {})}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 24,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  flag: {
    fontSize: 24,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#FFF',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#FFF',
  },
  bookmarkContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
  },
}); 