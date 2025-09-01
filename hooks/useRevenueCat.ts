import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import revenueCatService from '../lib/revenuecat';

interface UseRevenueCatReturn {
  // State
  isLoading: boolean;
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  
  // Actions
  initialize: (userId?: string) => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const useRevenueCat = (): UseRevenueCatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  /**
   * Initialize RevenueCat
   */
  const initialize = useCallback(async (userId?: string) => {
    try {
      setIsLoading(true);
      await revenueCatService.initialize(userId);
      // Only fetch data if RevenueCat is properly configured (not in dev mode)
      if (!__DEV__) {
        await refreshData();
      } else {
        console.log('🔧 Development mode: Using demo subscription data');
        setIsPremium(false);
        setCustomerInfo(null);
        setOfferings(null);
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if user has premium subscription
   */
  const checkPremiumStatus = useCallback(async () => {
    try {
      const premium = await revenueCatService.isPremiumUser();
      setIsPremium(premium);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    }
  }, []);

  /**
   * Purchase a subscription package
   */
  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await revenueCatService.purchasePackage(pkg);
      
      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        await checkPremiumStatus();
        
        Alert.alert(
          '🎉 Welcome to Premium!',
          'You now have access to all premium features. Enjoy!',
          [{ text: 'Great!', style: 'default' }]
        );
        
        return true;
      } else {
        if (result.error && !result.error.includes('cancelled')) {
          Alert.alert(
            'Purchase Failed',
            result.error,
            [{ text: 'OK', style: 'default' }]
          );
        }
        return false;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        'Purchase Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkPremiumStatus]);

  /**
   * Restore previous purchases
   */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await revenueCatService.restorePurchases();
      
      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        await checkPremiumStatus();
        
        Alert.alert(
          'Purchases Restored',
          'Your previous purchases have been restored successfully.',
          [{ text: 'OK', style: 'default' }]
        );
        
        return true;
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found for this account.',
          [{ text: 'OK', style: 'default' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkPremiumStatus]);

  /**
   * Refresh all RevenueCat data
   */
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if RevenueCat is properly configured before making calls
      try {
        // Fetch customer info and offerings in parallel
        const [customerInfoResult, offeringsResult] = await Promise.allSettled([
          revenueCatService.getCustomerInfo(),
          revenueCatService.getOfferings(),
        ]);

        if (customerInfoResult.status === 'fulfilled') {
          setCustomerInfo(customerInfoResult.value);
        } else {
          console.warn('Could not fetch customer info:', customerInfoResult.reason);
        }

        if (offeringsResult.status === 'fulfilled') {
          setOfferings(offeringsResult.value);
        } else {
          console.warn('Could not fetch offerings:', offeringsResult.reason);
        }

        await checkPremiumStatus();
      } catch (initError) {
        console.warn('RevenueCat not properly configured, using demo mode');
        // Set demo mode - no premium features
        setIsPremium(false);
        setCustomerInfo(null);
        setOfferings(null);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [checkPremiumStatus]);

  // Auto-refresh premium status when customer info changes
  useEffect(() => {
    if (customerInfo) {
      checkPremiumStatus();
    }
  }, [customerInfo, checkPremiumStatus]);

  return {
    // State
    isLoading,
    isPremium,
    customerInfo,
    offerings,
    
    // Actions
    initialize,
    checkPremiumStatus,
    purchasePackage,
    restorePurchases,
    refreshData,
  };
}; 