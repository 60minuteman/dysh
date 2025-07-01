# Dysh App Onboarding Flow - Complete Requirements Document

## Overview
This document outlines all the required steps for the complete user onboarding experience in the Dysh app, excluding authentication. The flow takes users from initial sign-up through to their first recipe generation and premium subscription.

## Onboarding Flow Steps

### 1. **Initial Onboarding Screen** (`onboarding.tsx`)
**Purpose**: Welcome screen with video background and social sign-in
**Data Requirements**: None (authentication excluded)
**UI Elements**:
- Background video player
- Logo display
- Welcome message: "World Class Meals, Home Ingredients"
- Subtitle: "Get recipes from around the world based on your stash"
- Terms & Privacy Policy links

---

### 2. **Testimonials Screen** (`testimonials.tsx`)
**Purpose**: Build trust and showcase user success stories
**Data Requirements**:
```json
{
  "testimonials": [
    {
      "id": "string",
      "title": "string",
      "text": "string",
      "userName": "string",
      "userImage": "url"
    }
  ],
  "userStats": {
    "totalUsers": "number",
    "displayText": "LOVED BY 100+ COOKS"
  }
}
```
**UI Elements**:
- User statistics display
- User avatar grid (3 overlapping avatars)
- Tagline: "Real people. Real kitchens. Real flavor."
- Testimonial card with white background
- Continue button

---

### 3. **Dietary Preferences Screen** (`dietary-preferences.tsx`)
**Purpose**: Collect user's dietary restrictions and preferences
**Data Requirements**:
```json
{
  "userPreferences": {
    "dietary_preference": "string" // "none" | "vegetarian" | "vegan" | "pescatarian" | "gluten-free" | "keto"
  }
}
```
**Backend Requirements**:
- Store user's dietary preference
- Use preference to filter recipe suggestions
**UI Elements**:
- Title: "Any dietary preferences?"
- 6 selectable options with icons:
  - No Restrictions (restaurant icon)
  - Vegetarian (leaf icon)
  - Vegan (nutrition icon)
  - Pescatarian (fish icon)
  - Gluten-Free (basket icon)
  - Keto (flame icon)
- Continue button (disabled until selection made)

---

### 4. **Location Permission Screen** (`location-permission.tsx`)
**Purpose**: Request location access for personalized regional recipes
**Data Requirements**:
```json
{
  "userLocation": {
    "latitude": "number",
    "longitude": "number",
    "region": "string",
    "country": "string",
    "permission_granted": "boolean"
  }
}
```
**Backend Requirements**:
- Store location data if permission granted
- Use location for regional cuisine suggestions
- Handle cases where permission is denied
**UI Elements**:
- Title: "Enable location to personalize recipes"
- Description: "We'll use your location to suggest recipes based on local and regional cuisines"
- Permission dialog mockup
- "Don't Allow" and "Allow" buttons
- Food preview image at bottom
- Hand pointing emoji

---

### 5. **Ingredients Input Screen** (`ingredients.tsx`)
**Purpose**: Collect user's available ingredients for recipe generation
**Data Requirements**:
```json
{
  "userIngredients": {
    "ingredients": ["string"], // Array of ingredient names
    "timestamp": "datetime",
    "minimum_required": 4,
    "maximum_allowed": 10
  }
}
```
**Backend Requirements**:
- Store selected ingredients list
- Validate minimum 4 ingredients
- Use ingredients for recipe matching algorithm
- Provide ingredient suggestions/search functionality
**UI Elements**:
- Title: "Add at least 4 ingredients"
- Subtitle: "Generate your first meal now"
- Search input with autocomplete
- Selected ingredients display as pills with count (X/10)
- Suggested ingredients list
- Remove functionality for selected ingredients
- Continue button (only visible when ≥4 ingredients selected)

---

### 6. **Servings Selection Screen** (`servings.tsx`)
**Purpose**: Determine recipe portion size
**Data Requirements**:
```json
{
  "recipePreferences": {
    "servings": "number", // 2, 4, or 6
    "serving_description": "string"
  }
}
```
**Backend Requirements**:
- Store serving preference
- Scale recipe quantities accordingly
**UI Elements**:
- Title: "How many servings per meal?"
- 3 options with descriptions:
  - 2 Serving: "For two or one with extra"
  - 4 Serving: "For four or two-three with extra"  
  - 6 Serving: "For a family of 5+"
- "Get Recipe" button

---

### 7. **Recipe Loading Screen** (`recipe-loading.tsx`)
**Purpose**: Show progress while AI generates recipe
**Data Requirements**:
```json
{
  "recipeGeneration": {
    "status": "string", // "processing" | "complete" | "error"
    "progress": "number", // 0-100
    "estimated_time": "number" // seconds
  }
}
```
**Backend Requirements**:
- Process user inputs (ingredients, preferences, servings, location, dietary restrictions)
- Generate recipe using AI/algorithm
- Return recipe data for next screen
**UI Elements**:
- Background image (sushi)
- Lottie animation in circular container
- Title: "Getting your recipe"
- Animated progress bar
- Auto-navigation after completion (~2.5 seconds)

---

### 8. **Suggested Recipes Screen** (`suggested-recipes.tsx`)
**Purpose**: Display AI-generated recipe suggestions across different cuisines
**Data Requirements**:
```json
{
  "suggestedRecipes": {
    "cuisines": ["Nigerian", "American", "Arab", "Spanish", "Korean"],
    "recipes": [
      {
        "id": "string",
        "title": "string",
        "cuisine": "string",
        "duration": "string", // "30 min"
        "calories": "string", // "320 kcal"
        "rating": "string", // "4.5"
        "image_url": "string",
        "flag_emoji": "string"
      }
    ],
    "selected_cuisine": "string"
  }
}
```
**Backend Requirements**:
- Generate multiple recipe suggestions across 5 cuisines
- Include recipe metadata (time, calories, rating)
- Provide recipe images
**UI Elements**:
- Title: "Suggested meal recipes in 5 cuisines"
- Horizontal scrollable cuisine tabs with flags
- Recipe preview cards for selected cuisine
- Recipe modal with detailed view
- Continue button
- "Start Cooking" option in modal

---

### 9. **Recipe Detail Screen** (`recipe.tsx`) - Optional
**Purpose**: Detailed view of selected recipe
**Data Requirements**:
```json
{
  "recipeDetails": {
    "id": "string",
    "title": "string",
    "cuisine": "string",
    "duration": "string",
    "calories": "string", 
    "rating": "string",
    "image_url": "string",
    "ingredients": [
      {
        "name": "string",
        "quantity": "string",
        "unit": "string"
      }
    ],
    "instructions": [
      {
        "step": "number",
        "description": "string"
      }
    ],
    "pro_tips": ["string"],
    "nutrition_info": {
      "calories": "number",
      "protein": "string",
      "carbs": "string",
      "fat": "string"
    }
  }
}
```
**Backend Requirements**:
- Provide detailed recipe information
- Include step-by-step instructions
- Suggest related recipes
**UI Elements**:
- Recipe header image
- Recipe title and stats
- Expandable accordion sections:
  - 🥘 Ingredients
  - 👨‍🍳 Instructions  
  - ✨ Pro Tips
- "More Recipes" horizontal scroll
- Continue button

---

### 10. **Paywall Screen** (`paywall.tsx`)
**Purpose**: Present premium subscription options
**Data Requirements**:
```json
{
  "subscriptionPlans": [
    {
      "id": "yearly",
      "name": "Yearly",
      "price": "$33.49/year",
      "monthly_equivalent": "$2.79/monthly",
      "discount": "30% Off",
      "is_recommended": true
    },
    {
      "id": "monthly", 
      "name": "Monthly",
      "price": "$3.99/month",
      "discount": null,
      "is_recommended": false
    }
  ],
  "features": [
    "AI Recipes from Your Ingredients",
    "Flavors from 10+ Global Cuisines", 
    "Save & Customize Your Cookbook",
    "Instant Meal Ideas with Calories",
    "Smart Shop Suggestions"
  ]
}
```
**Backend Requirements**:
- Handle subscription plan selection
- Process payment integration
- Update user subscription status
- Provide trial or free tier options
**UI Elements**:
- Close button (X)
- App logo
- Title: "Smarter Cooking, Better Meals!"
- 5 feature rows with icons
- 2 subscription plan options (yearly highlighted)
- "Let's Gooo" CTA button
- Terms, Privacy Policy, Restore links

---

## Navigation Flow
```
onboarding → testimonials → dietary-preferences → location-permission → ingredients → servings → recipe-loading → suggested-recipes → [recipe] → paywall → main app
```

## Data Storage Requirements

### User Profile
```json
{
  "user_id": "string",
  "onboarding_completed": "boolean",
  "dietary_preference": "string",
  "location": {
    "latitude": "number",
    "longitude": "number", 
    "region": "string",
    "permission_granted": "boolean"
  },
  "preferred_servings": "number",
  "subscription_status": "string", // "free" | "premium" | "trial"
  "onboarding_timestamp": "datetime"
}
```

### Recipe Generation Session
```json
{
  "session_id": "string",
  "user_id": "string",
  "ingredients": ["string"],
  "generated_recipes": ["recipe_id"],
  "selected_recipe": "recipe_id",
  "timestamp": "datetime"
}
```

## API Endpoints Needed

### 1. `POST /api/user/onboard` - Complete onboarding data submission
**Purpose**: Save all user onboarding preferences in one request
**Authentication**: Required (user must be authenticated)
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "dietary_preference": "string", // REQUIRED: "none" | "vegetarian" | "vegan" | "pescatarian" | "gluten-free" | "keto"
  "location": {
    "latitude": "number", // OPTIONAL: -90 to 90, decimal degrees
    "longitude": "number", // OPTIONAL: -180 to 180, decimal degrees
    "region": "string", // OPTIONAL: e.g., "Lagos, Nigeria" 
    "country": "string", // OPTIONAL: e.g., "Nigeria"
    "country_code": "string", // OPTIONAL: ISO 3166-1 alpha-2, e.g., "NG"
    "permission_granted": "boolean" // REQUIRED: true if location access granted
  },
  "ingredients": ["string"], // REQUIRED: Array of 4-10 ingredient names, each 2-50 chars
  "preferred_servings": "number", // REQUIRED: Must be exactly 2, 4, or 6
  "subscription_plan": "string", // OPTIONAL: "yearly" | "monthly" | "skip" | null
  "onboarding_version": "string", // REQUIRED: e.g., "1.0" for tracking onboarding flow changes
  "device_info": { // OPTIONAL: For analytics
    "platform": "string", // "ios" | "android" | "web"
    "app_version": "string",
    "device_id": "string"
  }
}
```

**Validation Rules**:
- `dietary_preference`: Must be one of the 6 allowed values
- `ingredients`: 
  - Array length: minimum 4, maximum 10
  - Each ingredient: 2-50 characters, alphanumeric + spaces/hyphens
  - No duplicate ingredients (case-insensitive)
  - Common ingredients should be normalized (e.g., "tomato" vs "tomatoes")
- `preferred_servings`: Must be exactly 2, 4, or 6
- `location.latitude`: If provided, must be valid decimal degrees (-90 to 90)
- `location.longitude`: If provided, must be valid decimal degrees (-180 to 180)
- `location.permission_granted`: Always required boolean
- `onboarding_version`: Required for tracking flow changes

**Response - Success (200)**:
```json
{
  "success": true,
  "user_id": "string", // UUID of the user
  "onboarding_completed": true,
  "message": "Onboarding completed successfully",
  "data": {
    "profile_id": "string", // UUID of created user profile
    "preferences_saved": "boolean",
    "location_saved": "boolean",
    "ingredients_count": "number",
    "next_step": "recipe_generation" // What the frontend should do next
  }
}
```

**Response - Validation Error (400)**:
```json
{
  "success": false,
  "error": "validation_error",
  "message": "Invalid data provided",
  "details": {
    "field_errors": {
      "ingredients": ["Minimum 4 ingredients required", "Ingredient 'xyz' is too long"],
      "dietary_preference": ["Must be one of: none, vegetarian, vegan, pescatarian, gluten-free, keto"],
      "preferred_servings": ["Must be 2, 4, or 6"]
    }
  }
}
```

**Response - Server Error (500)**:
```json
{
  "success": false,
  "error": "server_error", 
  "message": "Unable to save onboarding data",
  "details": {
    "error_code": "DB_CONNECTION_FAILED",
    "request_id": "string" // For debugging
  }
}
```

**Backend Processing Requirements**:
1. **Data Validation**: Validate all input according to rules above
2. **Data Normalization**:
   - Trim whitespace from strings
   - Normalize ingredient names (lowercase, singular forms)
   - Validate location coordinates if provided
3. **Database Operations**:
   - Update user profile with onboarding data
   - Create user_preferences record
   - Log onboarding completion event
   - Update user.onboarding_completed = true
4. **Error Handling**:
   - Database connection failures
   - Duplicate ingredient handling
   - Invalid location data
   - Concurrent onboarding attempts

**Database Schema Requirements**:

#### `users` table updates:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_version VARCHAR(10);
```

#### `user_profiles` table:
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dietary_preference VARCHAR(20) NOT NULL CHECK (dietary_preference IN ('none', 'vegetarian', 'vegan', 'pescatarian', 'gluten-free', 'keto')),
  preferred_servings INTEGER NOT NULL CHECK (preferred_servings IN (2, 4, 6)),
  location_permission_granted BOOLEAN NOT NULL DEFAULT FALSE,
  latitude DECIMAL(10, 8), -- Allows precision to ~1.1 meters
  longitude DECIMAL(11, 8), -- Allows precision to ~1.1 meters  
  region VARCHAR(100),
  country VARCHAR(100),
  country_code CHAR(2), -- ISO 3166-1 alpha-2
  subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('yearly', 'monthly', 'skip')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

#### `user_ingredients` table:
```sql
CREATE TABLE user_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ingredient_name VARCHAR(50) NOT NULL,
  normalized_name VARCHAR(50) NOT NULL, -- For searching/matching
  added_during_onboarding BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_ingredients_user_id (user_id),
  INDEX idx_user_ingredients_normalized (normalized_name)
);
```

#### `onboarding_events` table (for analytics):
```sql
CREATE TABLE onboarding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'started', 'completed', 'abandoned'
  step_name VARCHAR(50), -- 'dietary_preferences', 'location', etc.
  onboarding_version VARCHAR(10),
  device_platform VARCHAR(20),
  app_version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_onboarding_events_user_id (user_id),
  INDEX idx_onboarding_events_type (event_type)
);
```

#### `ingredients_master` table (for validation/suggestions):
```sql
CREATE TABLE ingredients_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  normalized_name VARCHAR(50) NOT NULL,
  category VARCHAR(30), -- 'protein', 'vegetable', 'grain', etc.
  is_common BOOLEAN DEFAULT FALSE, -- For showing in suggestions
  aliases TEXT[], -- Alternative names
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ingredients_normalized (normalized_name),
  INDEX idx_ingredients_common (is_common)
);
```

### 2. `POST /api/recipes/generate` - Generate recipes based on user inputs
**Purpose**: Create personalized recipes using onboarding data
**Authentication**: Required (user must be authenticated and onboarded)
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "user_id": "string", // REQUIRED: UUID of authenticated user
  "session_preferences": { // OPTIONAL: Override onboarding preferences for this session
    "ingredients": ["string"], // OPTIONAL: Override user's saved ingredients (4-10 items)
    "servings": "number", // OPTIONAL: Override preferred servings (2, 4, or 6)
    "cuisine_filter": "string", // OPTIONAL: "Nigerian" | "American" | "Arab" | "Spanish" | "Korean" | null
    "dietary_override": "string" // OPTIONAL: Temporarily override dietary preference
  },
  "generation_options": { // OPTIONAL: Advanced generation controls
    "max_recipes_per_cuisine": "number", // Default: 2, Max: 5
    "include_all_cuisines": "boolean", // Default: true
    "difficulty_level": "string", // "easy" | "medium" | "hard" | "any" (default: "any")
    "max_cook_time": "number" // OPTIONAL: Maximum cooking time in minutes
  }
}
```

**Validation Rules**:
- `user_id`: Must be valid UUID of authenticated user
- User must have completed onboarding (`user.onboarding_completed = true`)
- `session_preferences.ingredients`: If provided, same validation as onboarding (4-10 items)
- `session_preferences.servings`: If provided, must be 2, 4, or 6
- `session_preferences.cuisine_filter`: Must be one of supported cuisines
- `generation_options.max_recipes_per_cuisine`: 1-5 range
- `generation_options.max_cook_time`: 10-180 minutes if provided

**Response - Success (200)**:
```json
{
  "success": true,
  "session_id": "string", // UUID for this recipe generation session
  "generation_time_ms": "number", // How long AI took to generate
  "user_preferences": {
    "dietary_preference": "string",
    "ingredients_used": ["string"], // Ingredients used for generation
    "servings": "number",
    "location_influenced": "boolean" // Whether location affected results
  },
  "recipes": [
    {
      "id": "string", // UUID of the recipe
      "title": "string", // e.g., "Hearty Chicken & Bean Rice Bowl"
      "cuisine": "string", // "Nigerian" | "American" | "Arab" | "Spanish" | "Korean"
      "duration": "string", // e.g., "30 min"
      "duration_minutes": "number", // 30 (for sorting/filtering)
      "calories": "string", // e.g., "320 kcal" 
      "calories_numeric": "number", // 320 (for sorting/filtering)
      "rating": "string", // e.g., "4.5"
      "rating_numeric": "number", // 4.5 (for sorting)
      "difficulty": "string", // "easy" | "medium" | "hard"
      "image_url": "string", // Full URL to recipe image
      "flag_emoji": "string", // Country flag for cuisine
      "ingredients_match_score": "number", // 0-100, how well it matches user ingredients
      "dietary_compliant": "boolean", // Matches user's dietary preference
      "description": "string", // Short description/tagline
      "tags": ["string"] // e.g., ["quick", "healthy", "one-pot"]
    }
  ],
  "cuisines": {
    "Nigerian": "number", // Count of Nigerian recipes
    "American": "number", // Count of American recipes
    "Arab": "number",
    "Spanish": "number", 
    "Korean": "number"
  },
  "generation_metadata": {
    "total_recipes": "number",
    "algorithm_version": "string", // e.g., "v2.1" for tracking
    "fallback_used": "boolean", // If AI failed and fallback recipes used
    "cache_hit": "boolean" // If results came from cache
  }
}
```

**Response - User Not Onboarded (400)**:
```json
{
  "success": false,
  "error": "onboarding_required",
  "message": "User must complete onboarding before generating recipes",
  "details": {
    "onboarding_completed": false,
    "redirect_to": "/onboarding"
  }
}
```

**Response - No Recipes Generated (422)**:
```json
{
  "success": false,
  "error": "generation_failed",
  "message": "Unable to generate recipes with provided ingredients",
  "details": {
    "reason": "insufficient_ingredients" | "no_matching_recipes" | "ai_service_unavailable",
    "suggestions": [
      "Try adding more common ingredients",
      "Consider different dietary preferences"
    ]
  }
}
```

**Backend Processing Requirements**:
1. **User Validation**: 
   - Verify user is authenticated
   - Check onboarding completion status
   - Load user profile and preferences
2. **Data Preparation**:
   - Merge session preferences with saved preferences
   - Normalize ingredient names for matching
   - Apply dietary restrictions filter
3. **Recipe Generation**:
   - Call AI service with user parameters
   - Apply cuisine distribution logic
   - Score recipes based on ingredient match
   - Filter by dietary compliance
4. **Response Processing**:
   - Generate recipe images/select from library
   - Calculate nutritional information
   - Add recipe metadata and tags
   - Log generation session for analytics

**Database Schema Requirements**:

#### `recipe_generation_sessions` table:
```sql
CREATE TABLE recipe_generation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ingredients_used TEXT[] NOT NULL, -- Array of ingredient names used
  dietary_preference VARCHAR(20),
  servings INTEGER,
  cuisine_filter VARCHAR(20),
  generation_time_ms INTEGER,
  algorithm_version VARCHAR(10),
  recipes_generated INTEGER,
  fallback_used BOOLEAN DEFAULT FALSE,
  cache_hit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_generation_sessions_user_id (user_id),
  INDEX idx_generation_sessions_created_at (created_at)
);
```

#### `recipes` table:
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cuisine VARCHAR(30) NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_minutes INTEGER NOT NULL,
  calories_per_serving INTEGER,
  servings_default INTEGER DEFAULT 4,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  is_ai_generated BOOLEAN DEFAULT FALSE,
  dietary_tags TEXT[], -- ['vegetarian', 'gluten-free', etc.]
  ingredient_tags TEXT[], -- Main ingredients for matching
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recipes_cuisine (cuisine),
  INDEX idx_recipes_difficulty (difficulty),
  INDEX idx_recipes_duration (duration_minutes),
  INDEX idx_recipes_dietary_tags USING GIN (dietary_tags),
  INDEX idx_recipes_ingredient_tags USING GIN (ingredient_tags)
);
```

#### `recipe_ingredients` table:
```sql
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name VARCHAR(50) NOT NULL,
  quantity DECIMAL(8,2),
  unit VARCHAR(20), -- 'cups', 'tablespoons', 'grams', etc.
  is_required BOOLEAN DEFAULT TRUE,
  preparation_note VARCHAR(100), -- 'diced', 'chopped', 'optional'
  INDEX idx_recipe_ingredients_recipe_id (recipe_id),
  INDEX idx_recipe_ingredients_name (ingredient_name)
);
```

#### `recipe_instructions` table:
```sql
CREATE TABLE recipe_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  duration_minutes INTEGER, -- Time for this step
  temperature VARCHAR(20), -- 'medium heat', '350°F', etc.
  INDEX idx_recipe_instructions_recipe_id (recipe_id),
  UNIQUE(recipe_id, step_number)
);
```

#### `generated_recipe_sessions` table (links sessions to generated recipes):
```sql
CREATE TABLE generated_recipe_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES recipe_generation_sessions(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  match_score INTEGER, -- 0-100, how well recipe matched user ingredients
  cuisine_rank INTEGER, -- Rank within the cuisine (1 = best match)
  was_selected BOOLEAN DEFAULT FALSE, -- Did user select this recipe
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_generated_recipe_sessions_session_id (session_id),
  INDEX idx_generated_recipe_sessions_recipe_id (recipe_id),
  UNIQUE(session_id, recipe_id)
);
```

### 3. `GET /api/recipes/{id}` - Get detailed recipe information
**Purpose**: Fetch complete recipe details for cooking
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "cuisine": "string",
  "duration": "string",
  "calories": "string",
  "rating": "string",
  "image_url": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": "string",
      "unit": "string"
    }
  ],
  "instructions": [
    {
      "step": "number",
      "description": "string"
    }
  ],
  "pro_tips": ["string"],
  "nutrition_info": {
    "calories": "number",
    "protein": "string",
    "carbs": "string",
    "fat": "string"
  }
}
```

### 4. `GET /api/testimonials` - Get testimonials for onboarding (optional)
**Purpose**: Fetch dynamic testimonials for the testimonials screen
**Response**:
```json
{
  "testimonials": [
    {
      "id": "string",
      "title": "string",
      "text": "string",
      "userName": "string",
      "userImage": "url"
    }
  ],
  "userStats": {
    "totalUsers": "number",
    "displayText": "LOVED BY 100+ COOKS"
  }
}
```

## Simplified API Flow
1. **Onboarding Screens 1-6**: Collect all user data locally in the app
2. **Submit Onboarding**: `POST /api/user/onboard` with all collected data
3. **Generate Recipes**: `POST /api/recipes/generate` using the onboarded user data
4. **Show Recipes**: Display generated recipes from multiple cuisines
5. **Recipe Details**: `GET /api/recipes/{id}` when user selects a specific recipe

## Success Criteria
- User completes all onboarding steps
- At least 4 ingredients collected
- Recipe successfully generated and displayed
- User preference data stored for future personalization
- Subscription plan presented (conversion optional)
- User successfully navigates to main app experience 