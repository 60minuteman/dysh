import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRevenueCat } from '../hooks/useRevenueCat';
import { useRouter } from 'expo-router';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export const PremiumGuard: React.FC<PremiumGuardProps> = ({ 
  children, 
  fallback,
  showUpgradePrompt = true 
}) => {
  const { isPremium, isLoading } = useRevenueCat();
  const router = useRouter();

  const presentPaywall = async () => {
    try {
      const result = await RevenueCatUI.presentPaywall();

      if (result === PAYWALL_RESULT.PURCHASED) {
        console.log('✅ User purchased subscription from PremiumGuard');
        // The useRevenueCat hook will automatically detect the premium status
      } else if (result === PAYWALL_RESULT.RESTORED) {
        console.log('🔄 User restored purchases from PremiumGuard');
        Alert.alert('Success', 'Your purchases have been restored!');
      }
    } catch (error) {
      console.error('Error presenting paywall from PremiumGuard:', error);
      
      if (__DEV__) {
        // Demo mode fallback
        Alert.alert(
          '🎉 Demo Mode',
          'This would show your RevenueCat paywall in production.',
          [
            {
              text: 'Simulate Purchase',
              onPress: () => console.log('Demo: Simulating successful purchase')
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else {
        // Fallback to navigation in production if RevenueCat fails
        router.push('/(auth)/paywall');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return (
      <View style={styles.upgradeContainer}>
        <Text style={styles.upgradeIcon}>🔒</Text>
        <Text style={styles.upgradeTitle}>Premium Feature</Text>
        <Text style={styles.upgradeDescription}>
          Unlock this feature with a premium subscription
        </Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={presentPaywall}
        >
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#666666',
  },
  upgradeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    margin: 16,
  },
  upgradeIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  upgradeTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
}); 