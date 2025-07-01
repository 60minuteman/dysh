import { config } from '../lib/config';

// Temporarily hardcode production URL to bypass config issues
const API_BASE_URL = 'https://dysh-app-eu5iz.ondigitalocean.app';
console.log('🔧 Hardcoded API Base URL:', API_BASE_URL);
console.log('🔧 Config API_BASE_URL:', config.API_BASE_URL);
console.log('🔧 __DEV__ flag:', typeof __DEV__ !== 'undefined' ? __DEV__ : 'undefined');

export interface Recipe {
  id: string;
  title: string;
  duration: string;
  calories: string;
  rating: string;
  imageUrl: string;
  ingredients?: string[];
  instructions?: string[];
  proTips?: string[];
  country?: string;
  isLiked?: boolean;
}

export type ExploreCategory = 
  | 'trending'
  | 'thirty-min-meals'
  | 'chefs-pick'
  | 'occasion'
  | 'healthy-light'
  | 'comfort-food'
  | 'one-pot-meals';

export interface ExploreResponse {
  recipes: Recipe[];
  category: string;
}

export interface UserProfile {
  isPro: boolean;
  userId: string;
  email: string;
  fullName: string;
}

export interface NextMeal {
  nextMealType: string;
  minutesUntil: number;
  displayText: string;
}

export interface DailyRecipe {
  id: string;
  category: string;
  generatedAt: string;
  generatedDate: string;
  recipe: Recipe;
  locationName: string;
  locationCountry: string;
}

export interface DailyRecipesResponse {
  recipes: DailyRecipe[];
  totalCount: number;
  limit: number;
  offset: number;
}

export class ApiService {
  private static getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // User Profile
  static async getUserProfile(token: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Cuisine Preferences
  static async getCuisinePreferences(token: string): Promise<{ preferences: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/user/cuisine-preferences`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async addCuisinePreference(token: string, cuisine: string): Promise<{ preferences: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/user/cuisine-preferences`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ cuisine })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async removeCuisinePreference(token: string, cuisine: string): Promise<{ preferences: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/user/cuisine-preferences/${cuisine}`, {
      method: 'DELETE',
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Next Meal Timer
  static async getNextMeal(token: string): Promise<NextMeal> {
    const response = await fetch(`${API_BASE_URL}/api/user/next-meal`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Recipe Categories
  static async getBreakfastRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/breakfast?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getBreakfastLowCarbRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/breakfast-low-carb?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getBreakfastHighProteinRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/breakfast-high-protein?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getLunchRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/lunch?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getLunchLowCarbRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/lunch-low-carb?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getLunchHighProteinRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/lunch-high-protein?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getDinnerRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/dinner?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getDinnerLowCarbRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/dinner-low-carb?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getDinnerHighProteinRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/dinner-high-protein?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getLowCarbRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/low-carb?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getHighProteinRecipes(token: string, limit: number = 5): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/recipes/high-protein?limit=${limit}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Explore Endpoints
  static async getExploreRecipes(token: string | null, category: string, limit: number = 10): Promise<ExploreResponse> {
    const headers = token ? this.getHeaders(token) : { 'Content-Type': 'application/json' };
    const url = `${API_BASE_URL}/api/explore/${category}?limit=${limit}`;
    
    console.log(`🌐 API Request: GET ${url}`, {
      headers: token ? { Authorization: 'Bearer [TOKEN]' } : headers,
      category,
      limit
    });
    
    const response = await fetch(url, { headers });
    
    console.log(`📡 API Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.text();
        console.log(`❌ API Error Response:`, errorDetails);
      } catch (e) {
        console.log(`❌ Could not read error response`);
      }
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails || 'No details'}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success Response:`, data);
    return data;
  }

  static async likeRecipe(token: string | null, recipeId: string): Promise<{ success: boolean }> {
    const headers = token ? this.getHeaders(token) : { 'Content-Type': 'application/json' };
    const response = await fetch(`${API_BASE_URL}/api/explore/${recipeId}/like`, {
      method: 'POST',
      headers
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async unlikeRecipe(token: string | null, recipeId: string): Promise<{ success: boolean }> {
    const headers = token ? this.getHeaders(token) : { 'Content-Type': 'application/json' };
    const response = await fetch(`${API_BASE_URL}/api/explore/${recipeId}/like`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Cookbook Endpoints
  static async getCookbookRecipes(token: string, limit: number = 20, offset: number = 0): Promise<{ recipes: Recipe[] }> {
    const response = await fetch(`${API_BASE_URL}/api/cookbook?limit=${limit}&offset=${offset}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Daily Recipe Endpoints
  static async getDailyRecipes(token: string, limit: number = 20, offset: number = 0): Promise<DailyRecipesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/daily-recipes?limit=${limit}&offset=${offset}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getDailyRecipesByCategory(token: string, category: string): Promise<DailyRecipe[]> {
    const response = await fetch(`${API_BASE_URL}/api/daily-recipes/category/${category}`, {
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async generateDailyRecipes(token: string): Promise<{ message: string; recipesGenerated: number }> {
    const response = await fetch(`${API_BASE_URL}/api/daily-recipes/generate`, {
      method: 'POST',
      headers: this.getHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
} 