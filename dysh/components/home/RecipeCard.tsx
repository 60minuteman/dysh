import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargePhone = screenWidth >= 414;
const isMediumPhone = screenWidth >= 375;
const isSmallPhone = screenWidth < 375;

interface RecipeCardProps {
  title: string;
  duration: string;
  calories: string;
  rating: string;
  image: any;
  onPress?: () => void;
  countryFlag?: string;
  isLocked?: boolean;
  onUpgrade?: () => void;
}

export function RecipeCard({ 
  title, 
  duration, 
  calories, 
  rating, 
  image,
  onPress,
  countryFlag = '🇳🇬',
  isLocked = false,
  onUpgrade
}: RecipeCardProps) {
  // Truncate title if it's more than 2 lines
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 60)}...` : title;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={isLocked ? onUpgrade : onPress} 
      activeOpacity={0.9}
    >
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
            <Text style={styles.title} numberOfLines={2}>{truncatedTitle}</Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={isTablet ? 20 : isSmallPhone ? 12 : 16} color="#FFF" />
                <Text style={styles.statText}>{duration}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="flame-outline" size={isTablet ? 20 : isSmallPhone ? 12 : 16} color="#FFF" />
                <Text style={styles.statText}>{calories}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="star-outline" size={isTablet ? 20 : isSmallPhone ? 12 : 16} color="#FFF" />
                <Text style={styles.statText}>{rating}</Text>
              </View>
            </View>
            <Button 
              label={isLocked ? "Upgrade to Pro" : "Open Recipe"}
              onPress={isLocked ? (onUpgrade || (() => {})) : (onPress || (() => {}))}
            />
          </View>
        </LinearGradient>
        
        {/* Blur overlay for locked recipes */}
        {isLocked && (
          <View style={styles.lockOverlay}>
            <BlurView intensity={80} style={styles.blurView}>
              <View style={styles.lockContent}>
                <View style={styles.lockIconContainer}>
                  <Ionicons name="lock-closed" size={48} color="#FF6B6B" />
                </View>
                <Text style={styles.lockTitle}>Premium Recipe</Text>
                <Text style={styles.lockSubtitle}>Upgrade to unlock this recipe</Text>
              </View>
            </BlurView>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: isTablet ? 500 : isLargePhone ? 500 : isMediumPhone ? 400 : 380,
    borderRadius: isTablet ? 32 : isSmallPhone ? 16 : 24,
    overflow: 'hidden',
    marginBottom: isTablet ? 20 : isSmallPhone ? 12 : 16,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: isTablet ? 32 : isSmallPhone ? 16 : 24,
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
    top: isTablet ? 24 : isSmallPhone ? 12 : 16,
    left: isTablet ? 24 : isSmallPhone ? 12 : 16,
    right: isTablet ? 24 : isSmallPhone ? 12 : 16,
  },
  flag: {
    fontSize: isTablet ? 32 : isSmallPhone ? 18 : 24,
  },
  content: {
    padding: isTablet ? 32 : isSmallPhone ? 12 : 20,
    paddingBottom: isTablet ? 36 : isSmallPhone ? 16 : 24,
  },
  title: {
    fontSize: isTablet ? 20 : isLargePhone ? 22 : isMediumPhone ? 20 : 20,
    fontFamily: 'Satoshi-Black',
    color: '#FFF',
    marginBottom: isTablet ? 16 : isSmallPhone ? 8 : 12,
    lineHeight: isTablet ? 48 : isLargePhone ? 38 : isMediumPhone ? 32 : 28,
  },
  stats: {
    flexDirection: 'row',
    gap: isTablet ? 24 : isSmallPhone ? 8 : 16,
    marginBottom: isTablet ? 28 : isSmallPhone ? 16 : 20,
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isTablet ? 6 : isSmallPhone ? 3 : 4,
  },
  statText: {
    fontSize: isTablet ? 18 : isSmallPhone ? 11 : 15,
    fontFamily: 'Satoshi-Medium',
    color: '#FFF',
  },
  bookmarkContainer: {
    width: isTablet ? 48 : isSmallPhone ? 32 : 40,
    height: isTablet ? 48 : isSmallPhone ? 32 : 40,
    borderRadius: isTablet ? 24 : isSmallPhone ? 16 : 20,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  bookmarkButton: {
    width: isTablet ? 48 : isSmallPhone ? 32 : 40,
    height: isTablet ? 48 : isSmallPhone ? 32 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkIcon: {
    width: isTablet ? 28 : isSmallPhone ? 18 : 24,
    height: isTablet ? 28 : isSmallPhone ? 18 : 24,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: isTablet ? 32 : isSmallPhone ? 16 : 24,
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  lockContent: {
    alignItems: 'center',
    padding: 20,
  },
  lockIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Black',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockSubtitle: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.8,
  },
}); 