import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';

export default function Paywall() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Image source={require('../../assets/icons/cherry.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>
              Get personalized recipes based on the{'\n'}ingredients in your kitchen.
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Image source={require('../../assets/icons/search.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>
              Enjoy fresh daily meal ideas across African,{'\n'}Asian, and global cuisines.
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Image source={require('../../assets/icons/book.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>
              Follow clear step-by-step guides that make{'\n'}cooking effortless.
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.fireIcon}>🔥</Text>
            <Text style={styles.featureText}>
              See detailed calorie info for every recipe to{'\n'}eat smarter.
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Image source={require('../../assets/icons/plus.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>
              Get smart shopping suggestions so you{'\n'}never run out of what you need.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <Button 
          label="Continue"
          onPress={() => router.push('/(tabs)')}
        />
        
        <Text style={styles.planText}>
          Plan automatically renews for $2.99/week until canceled
        </Text>
        
        <View style={styles.links}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Terms</Text>
          </TouchableOpacity>
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
    height: 200,
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
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
    marginTop: 32,
  },
  logo: {
    height: 24,
    width: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
    paddingHorizontal: 32,
    marginTop: 24,
    lineHeight: 40,
  },
  features: {
    paddingHorizontal: 32,
    marginTop: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    width: 20,
    height: 20,
    marginRight: 16,
    marginTop: 2,
    tintColor: '#666666',
  },
  fireIcon: {
    fontSize: 20,
    marginRight: 16,
    marginTop: 2,
    width: 20,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
    lineHeight: 22,
    flex: 1,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  planText: {
    fontSize: 13,
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
  linkText: {
    fontSize: 13,
    fontFamily: 'Satoshi-Medium',
    color: '#999999',
  },
}); 