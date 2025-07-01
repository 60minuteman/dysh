import { authService } from './auth';
import { config } from './config';

const API_BASE_URL = config.API_BASE_URL;

interface OnboardingData {
  dietaryPreference: string;
  location?: {
    latitude?: number;
    longitude?: number;
    region?: string;
    country?: string;
    country_code?: string;
    permission_granted: boolean;
  };
  ingredients: string[];
  preferredServings: number;
  subscriptionPlan?: 'yearly' | 'monthly' | 'skip';
  onboardingVersion?: string;
}

interface RecipeGenerationData {
  ingredients: string[];
  dietaryPreference?: string;
  servings?: number;
  cuisineFilter?: string;
  country?: string;
}

interface Meal {
  name: string;
  image: string; // Base64 encoded image data
  estimatedCookTime: string;
  calories: string;
  rating: number;
  ingredients: string[];
  instructions: string[];
  proTips: string[];
}

interface RecipeResponse {
  meals: Meal[];
  location: string;
  provider: string;
}

class ApiService {
  async onboardUser(data: OnboardingData) {
    const response = await authService.authenticatedFetch(`${API_BASE_URL}/user/onboard`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Onboarding failed');
    }

    return response.json();
  }

  async generatePersonalizedRecipe(ingredients: string[]): Promise<RecipeResponse> {
    if (!ingredients || ingredients.length === 0) {
      throw new Error('Ingredients are required for recipe generation');
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/recipes/generate`, {
      method: 'POST',
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Recipe generation failed');
    }

    return response.json();
  }

  async generateRecipes(data: RecipeGenerationData): Promise<RecipeResponse> {
    try {
      console.log('Generating recipes with data:', data);
      
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/recipes/generate`, {
        method: 'POST',
        body: JSON.stringify({
          ingredients: data.ingredients,
          country: data.country // Send country if specified for cuisine override
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Recipe generation failed');
      }

      const result: RecipeResponse = await response.json();
      console.log('Recipe generation successful:', {
        mealsCount: result.meals.length,
        location: result.location,
        provider: result.provider
      });
      
      return result;
    } catch (error: any) {
      console.error('Recipe generation failed:', error);
      throw new Error(error.message || 'Failed to generate recipes');
    }
  }

  async getUserProfile() {
    const response = await authService.authenticatedFetch(`${API_BASE_URL}/auth/profile`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get profile');
    }

    return response.json();
  }

  async getRecipe(recipeId: string) {
    const response = await authService.authenticatedFetch(`${API_BASE_URL}/recipes/${recipeId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get recipe');
    }

    return response.json();
  }

  async getTestimonials() {
    const response = await fetch(`${API_BASE_URL}/testimonials`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get testimonials');
    }

    return response.json();
  }

  // Helper method for checking onboarding status
  async checkOnboardingStatus() {
    try {
      const user = await authService.getCurrentUser();
      return user?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }
}

export const apiService = new ApiService(); 