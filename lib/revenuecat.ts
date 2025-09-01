import Purchases, { 
  CustomerInfo, 
  PurchasesOffering, 
  PurchasesPackage,
  PURCHASES_ERROR_CODE
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { config } from './config';

class RevenueCatService {
  private static instance: RevenueCatService;
  private isInitialized = false;

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Initialize RevenueCat with API keys
   */
  async initialize(userId?: string): Promise<void> {
    try {
      // Skip RevenueCat initialization in development to prevent crashes
      if (__DEV__) {
        console.log('🔧 Development mode: Using RevenueCat demo mode');
        this.isInitialized = true;
        return;
      }

      const apiKey = Platform.OS === 'ios' 
        ? config.REVENUECAT_API_KEY_IOS 
        : config.REVENUECAT_API_KEY_ANDROID;

      if (!apiKey || apiKey.includes('YOUR_')) {
        console.warn('⚠️ RevenueCat API key not configured properly - using demo mode');
        this.isInitialized = true; // Mark as initialized to prevent errors
        return;
      }

      await Purchases.configure({ apiKey });
      
      if (userId) {
        await Purchases.logIn(userId);
      }

      this.isInitialized = true;
      console.log('✅ RevenueCat initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      // Mark as initialized anyway to prevent blocking the app
      this.isInitialized = true;
    }
  }

  /**
   * Get current customer info and subscription status
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    this.ensureInitialized();
    
    if (!this.isConfiguredProperly()) {
      throw new Error('RevenueCat not configured properly');
    }
    
    return await Purchases.getCustomerInfo();
  }

  /**
   * Check if user has active premium subscription
   */
  async isPremiumUser(): Promise<boolean> {
    try {
      if (!this.isConfiguredProperly()) {
        return false; // Demo mode - no premium features
      }
      
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active[config.ENTITLEMENTS.PREMIUM] !== undefined;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Get available subscription offerings
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      this.ensureInitialized();
      
      if (!this.isConfiguredProperly()) {
        console.warn('RevenueCat not configured - returning null offerings');
        return null;
      }
      
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a subscription package
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      this.ensureInitialized();
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Purchase error:', error);
      
      // Handle specific error cases
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return {
          success: false,
          error: 'Purchase was cancelled',
        };
      }
      
      if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
        return {
          success: false,
          error: 'Payment is pending',
        };
      }

      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      this.ensureInitialized();
      const customerInfo = await Purchases.restorePurchases();
      
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Restore purchases error:', error);
      return {
        success: false,
        error: error.message || 'Failed to restore purchases',
      };
    }
  }

  /**
   * Set user ID for RevenueCat
   */
  async setUserId(userId: string): Promise<void> {
    try {
      this.ensureInitialized();
      await Purchases.logIn(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
      throw error;
    }
  }

  /**
   * Log out user from RevenueCat
   */
  async logOut(): Promise<void> {
    try {
      this.ensureInitialized();
      await Purchases.logOut();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Get subscription expiration date
   */
  async getSubscriptionExpirationDate(): Promise<Date | null> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const premiumEntitlement = customerInfo.entitlements.active[config.ENTITLEMENTS.PREMIUM];
      
      if (premiumEntitlement && premiumEntitlement.expirationDate) {
        return new Date(premiumEntitlement.expirationDate);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting expiration date:', error);
      return null;
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('RevenueCat must be initialized before use');
    }
  }

  private isConfiguredProperly(): boolean {
    // In development mode, always return false to use demo mode
    if (__DEV__) {
      return false;
    }
    
    const apiKey = Platform.OS === 'ios' 
      ? config.REVENUECAT_API_KEY_IOS 
      : config.REVENUECAT_API_KEY_ANDROID;
    
    return !!(apiKey && !apiKey.includes('YOUR_'));
  }
}

export const revenueCatService = RevenueCatService.getInstance();
export default revenueCatService; 