import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { authService } from '../lib/auth';
import { ApiService } from '../services/api';
import type { ExploreCategory } from '../services/api';

// Query Keys
export const queryKeys = {
  user: ['user'] as const,
  userProfile: ['user', 'profile'] as const,
  recipes: ['recipes'] as const,
  dailyRecipes: (limit: number, offset: number) => ['recipes', 'daily', limit, offset] as const,
  breakfastRecipes: (limit: number) => ['recipes', 'breakfast', limit] as const,
  breakfastLowCarbRecipes: (limit: number) => ['recipes', 'breakfast-low-carb', limit] as const,
  breakfastHighProteinRecipes: (limit: number) => ['recipes', 'breakfast-high-protein', limit] as const,
  lunchRecipes: (limit: number) => ['recipes', 'lunch', limit] as const,
  lunchLowCarbRecipes: (limit: number) => ['recipes', 'lunch-low-carb', limit] as const,
  lunchHighProteinRecipes: (limit: number) => ['recipes', 'lunch-high-protein', limit] as const,
  dinnerRecipes: (limit: number) => ['recipes', 'dinner', limit] as const,
  dinnerLowCarbRecipes: (limit: number) => ['recipes', 'dinner-low-carb', limit] as const,
  dinnerHighProteinRecipes: (limit: number) => ['recipes', 'dinner-high-protein', limit] as const,
  lowCarbRecipes: (limit: number) => ['recipes', 'low-carb', limit] as const,
  highProteinRecipes: (limit: number) => ['recipes', 'high-protein', limit] as const,
  exploreRecipes: (category: string, limit: number) => ['recipes', 'explore', category, limit] as const,
  cookbookRecipes: (limit: number, offset: number) => ['recipes', 'cookbook', limit, offset] as const,
  cuisinePreferences: ['user', 'cuisine-preferences'] as const,
  nextMeal: ['user', 'next-meal'] as const,
  recipe: (id: string) => ['recipe', id] as const,
  testimonials: ['testimonials'] as const,
  generateRecipe: ['recipes', 'generate'] as const,
};

// Helper function to get token
const getToken = async () => {
  try {
    const authHeaders = await authService.getAuthHeaders();
    return authHeaders.Authorization?.replace('Bearer ', '') || null;
  } catch (error) {
    console.log('🔓 No auth token available:', error instanceof Error ? error.message : String(error));
    return null;
  }
};

// ===== Internal API Hooks (lib/api.ts) =====

// User Profile (Internal API)
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: () => apiService.getUserProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Recipe Generation (Internal API)
export const useGenerateRecipes = () => {
  return useMutation({
    mutationFn: (data: { ingredients: string[]; country?: string }) => 
      apiService.generateRecipes(data),
    onSuccess: (data) => {
      console.log('Recipes generated successfully:', data);
    },
    onError: (error) => {
      console.error('Recipe generation failed:', error);
    },
  });
};

// Personalized Recipe Generation (Internal API)
export const useGeneratePersonalizedRecipe = () => {
  return useMutation({
    mutationFn: (ingredients: string[]) => 
      apiService.generatePersonalizedRecipe(ingredients),
    onSuccess: (data) => {
      console.log('Personalized recipe generated successfully:', data);
    },
    onError: (error) => {
      console.error('Personalized recipe generation failed:', error);
    },
  });
};

// User Onboarding (Internal API)
export const useOnboardUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiService.onboardUser(data),
    onSuccess: () => {
      // Invalidate user profile to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
    onError: (error) => {
      console.error('Onboarding failed:', error);
    },
  });
};

// Single Recipe (Internal API)
export const useRecipe = (recipeId: string) => {
  return useQuery({
    queryKey: queryKeys.recipe(recipeId),
    queryFn: () => apiService.getRecipe(recipeId),
    enabled: !!recipeId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Testimonials (Internal API)
export const useTestimonials = () => {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => apiService.getTestimonials(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Authentication Status (Internal API)
export const useOnboardingStatus = () => {
  return useQuery({
    queryKey: ['user', 'onboarding-status'],
    queryFn: () => apiService.checkOnboardingStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Current User (Internal API)
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ===== External API Hooks (services/api.ts) =====

// External User Profile
export const useExternalUserProfile = () => {
  return useQuery({
    queryKey: ['external', 'user', 'profile'],
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getUserProfile(token);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Cuisine Preferences
export const useCuisinePreferences = () => {
  return useQuery({
    queryKey: queryKeys.cuisinePreferences,
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getCuisinePreferences(token);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddCuisinePreference = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cuisine: string) => {
      const token = await getToken();
      return ApiService.addCuisinePreference(token, cuisine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cuisinePreferences });
    },
  });
};

export const useRemoveCuisinePreference = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cuisine: string) => {
      const token = await getToken();
      return ApiService.removeCuisinePreference(token, cuisine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cuisinePreferences });
    },
  });
};

// Next Meal
export const useNextMeal = () => {
  return useQuery({
    queryKey: queryKeys.nextMeal,
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getNextMeal(token);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// ===== Recipe Category Hooks =====

export const useBreakfastRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.breakfastRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getBreakfastRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBreakfastLowCarbRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.breakfastLowCarbRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getBreakfastLowCarbRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useBreakfastHighProteinRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.breakfastHighProteinRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getBreakfastHighProteinRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLunchRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.lunchRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getLunchRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLunchLowCarbRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.lunchLowCarbRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getLunchLowCarbRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLunchHighProteinRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.lunchHighProteinRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getLunchHighProteinRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useDinnerRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.dinnerRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getDinnerRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useDinnerLowCarbRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.dinnerLowCarbRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getDinnerLowCarbRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useDinnerHighProteinRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.dinnerHighProteinRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getDinnerHighProteinRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLowCarbRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.lowCarbRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getLowCarbRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useHighProteinRecipes = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.highProteinRecipes(limit),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getHighProteinRecipes(token, limit);
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ===== Explore Hooks =====

export const useExploreRecipes = (category: ExploreCategory, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.exploreRecipes(category, limit),
    queryFn: async () => {
      console.log('🚀 API Request - Explore Recipes:', { category, limit });
      const token = await getToken();
      console.log('🔑 Token obtained for explore:', token ? 'YES' : 'NO');
      
      try {
        // Explore endpoint works without authentication
        const result = await ApiService.getExploreRecipes(token, category, limit);
        console.log('✅ API Response - Explore Recipes:', result);
        return result;
      } catch (error) {
        console.error('❌ API Error - Explore Recipes:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3, // Retry failed requests
  });
};

export const useLikeRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recipeId: string) => {
      const token = await getToken();
      return ApiService.likeRecipe(token, recipeId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbookRecipes(20, 0) });
    },
  });
};

export const useUnlikeRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recipeId: string) => {
      const token = await getToken();
      return ApiService.unlikeRecipe(token, recipeId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbookRecipes(20, 0) });
    },
  });
};

// ===== Cookbook Hooks =====

export const useCookbookRecipes = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: queryKeys.cookbookRecipes(limit, offset),
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getCookbookRecipes(token, limit, offset);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ===== Daily Recipe Hooks =====

export const useDailyRecipes = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: queryKeys.dailyRecipes(limit, offset),
    queryFn: async () => {
      console.log('🚀 API Request - Daily Recipes:', { limit, offset });
      const token = await getToken();
      console.log('🔑 Token obtained for daily:', token ? 'YES' : 'NO');
      
      if (!token) {
        console.warn('⚠️ No token available for daily recipes - user not authenticated');
        throw new Error('Authentication required for daily recipes');
      }
      
      try {
        const result = await ApiService.getDailyRecipes(token, limit, offset);
        console.log('✅ API Response - Daily Recipes:', result);
        return result;
      } catch (error) {
        console.error('❌ API Error - Daily Recipes:', error);
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: false, // We'll enable this conditionally based on auth
    retry: 1, // Only retry once for auth errors
  });
};

export const useDailyRecipesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['recipes', 'daily', 'category', category],
    queryFn: async () => {
      const token = await getToken();
      return ApiService.getDailyRecipesByCategory(token, category);
    },
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
  });
};

export const useGenerateDailyRecipes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return ApiService.generateDailyRecipes(token);
    },
    onSuccess: () => {
      // Invalidate daily recipes queries
      queryClient.invalidateQueries({ 
        queryKey: ['recipes', 'daily']
      });
    },
  });
}; 