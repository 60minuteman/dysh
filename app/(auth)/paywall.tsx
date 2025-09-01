import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';

export default function Paywall() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Responsive font sizing based on screen dimensions
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  
  const featureFontSize = isTablet ? 18 : isSmallScreen ? 12 : 16;
  const emojiSize = isTablet ? 24 : isSmallScreen ? 16 : 20;
  const emojiWidth = isTablet ? 32 : isSmallScreen ? 24 : 28;
  const featureSpacing = isTablet ? 24 : isSmallScreen ? 16 : 20;
  const horizontalPadding = isTablet ? 48 : isSmallScreen ? 24 : 32;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top section with food images */}
      <View style={styles.topSection}>
        <Image 
          source={require('../../assets/images/top.png')} 
          style={styles.topImage}
          resizeMode="cover"
        />
        
        <TouchableOpacity 
          style={[styles.closeButton, { marginTop: insets.top + 16 }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content section */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo/logo-green.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Smarter Cooking,{'\n'}Better Meals!</Text>

        {/* Features */}
        <View style={[styles.features, { paddingHorizontal: horizontalPadding }]}>
          <View style={[styles.featureRow, { marginBottom: featureSpacing }]}>
            <Text style={[styles.emoji, { fontSize: emojiSize, width: emojiWidth }]}>🧺</Text>
            <Text style={[styles.featureText, { fontSize: featureFontSize }]}>
              Get personalized recipes based on the ingredients in your kitchen.
            </Text>
          </View>

          <View style={[styles.featureRow, { marginBottom: featureSpacing }]}>
            <Text style={[styles.emoji, { fontSize: emojiSize, width: emojiWidth }]}>🍽️</Text>
            <Text style={[styles.featureText, { fontSize: featureFontSize }]}>
              Enjoy fresh daily meal ideas across African, Asian, and global cuisines.
            </Text>
          </View>

          <View style={[styles.featureRow, { marginBottom: featureSpacing }]}>
            <Text style={[styles.emoji, { fontSize: emojiSize, width: emojiWidth }]}>👩‍🍳</Text>
            <Text style={[styles.featureText, { fontSize: featureFontSize }]}>
              Follow clear step-by-step guides that make cooking effortless.
            </Text>
          </View>

          <View style={[styles.featureRow, { marginBottom: featureSpacing }]}>
            <Text style={[styles.emoji, { fontSize: emojiSize, width: emojiWidth }]}>🔥</Text>
            <Text style={[styles.featureText, { fontSize: featureFontSize }]}>
              See detailed calorie info for every recipe to eat smarter.
            </Text>
          </View>

          <View style={[styles.featureRow, { marginBottom: featureSpacing }]}>
            <Text style={[styles.emoji, { fontSize: emojiSize, width: emojiWidth }]}>🛒</Text>
            <Text style={[styles.featureText, { fontSize: featureFontSize }]}>
              Get smart shopping suggestions so you never run out of what you need.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <Button 
          label="Continue"
          onPress={() => router.push('/(tabs)/explore')}
        />
        
        <Text style={styles.planText}>
          Plan automatically renews for $2.99/week until canceled
        </Text>
        
        <View style={styles.links}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Terms</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.linkText}>Restore</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    height: 190,
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  logoContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 32,
    marginTop: 22,
  },
  logo: {
    height: 42,
    width: 74,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
    paddingHorizontal: 32,
    marginTop: 14,
    lineHeight: 40,
  },
  features: {
    marginTop: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emoji: {
    marginRight: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#000000',
    lineHeight: 22,
    flex: 1,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 10,
    marginBottom: -8,
  },
  planText: {
    fontSize: 12,
    fontFamily: 'Satoshi-Medium',
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 40,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#CCCCCC',
  },
  linkText: {
    fontSize: 13,
    fontFamily: 'Satoshi-Medium',
    color: '#999999',
  },
}); 