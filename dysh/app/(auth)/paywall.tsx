import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Logo } from '../../components/paywall/Logo';
import { Selector } from '../../components/Selector';

export default function Paywall() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity 
        style={[styles.closeButton, { marginTop: insets.top + 16 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Logo />
      </View>

      <Text style={styles.title}>Smarter Cooking,{'\n'}Better Meals!</Text>

      <View style={styles.features}>
        <View style={styles.featureRow}>
          <Image source={require('../../assets/paywall/1.png')} style={styles.featureIcon} />
          <Text style={styles.feature}>AI Recipes from Your Ingredients</Text>
        </View>
        <View style={styles.featureRow}>
          <Image source={require('../../assets/paywall/2.png')} style={styles.featureIcon} />
          <Text style={styles.feature}>Flavors from 10+ Global Cuisines</Text>
        </View>
        <View style={styles.featureRow}>
          <Image source={require('../../assets/paywall/3.png')} style={styles.featureIcon} />
          <Text style={styles.feature}>Save & Customize Your Cookbook</Text>
        </View>
        <View style={styles.featureRow}>
          <Image source={require('../../assets/paywall/4.png')} style={styles.featureIcon} />
          <Text style={styles.feature}>Instant Meal Ideas with Calories</Text>
        </View>
        <View style={styles.featureRow}>
          <Image source={require('../../assets/paywall/5.png')} style={styles.featureIcon} />
          <Text style={styles.feature}>Smart Shop Suggestions</Text>
        </View>
      </View>

      <View style={styles.plans}>
        <TouchableOpacity
          style={[styles.plan, selectedPlan === 'yearly' && styles.planSelected]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>30% Off</Text>
          </View>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Yearly</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>$33.49/year</Text>
            <Text style={styles.priceSubtext}>($2.79/monthly)</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.plan, selectedPlan === 'monthly' && styles.planSelected]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <Text style={styles.planTitle}>Monthly</Text>
          <Text style={styles.price}>$3.99/month</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button 
          label="Let's Gooo"
          onPress={() => router.push('/(tabs)')}
        />
        <View style={styles.links}>
          <Text style={styles.link}>Terms</Text>
          <Text style={styles.link}>Privacy Policy</Text>
          <Text style={styles.link}>Restore</Text>
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
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  features: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: -20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  feature: {
    fontSize: 17,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
  },
  plans: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  plan: {
    backgroundColor: '#F9F9F9',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EDEDED',
    position: 'relative',
  },
  planSelected: {
    backgroundColor: '#F0F9EA',
    borderWidth: 2,
    borderColor: '#64D61D',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 17,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
  },
  discountBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 100,
    position: 'absolute',
    right: 8,
    top: -14,
  },
  discountText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  priceSubtext: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    marginBottom: 24,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 34,
    marginTop: 40,
  },
  link: {
    fontSize: 13,
    color: '#666666',
  },
}); 