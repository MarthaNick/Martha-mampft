# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Martha's Meals is a pure client-side meal planning application built with vanilla HTML, CSS, and JavaScript. It helps users generate weekly meal plans with dietary constraints, manage favorites/banned meals, and generate shopping lists.

## Architecture

The application consists of three main files:

### Core Files
- **index.html**: Single-page application structure with meal display, navigation buttons, and multiple views (main, favorites, banned, shopping list)
- **meals.js**: Contains meal data arrays (`meatMeals` and `vegetarianMeals`) with detailed ingredient lists and dietary constraints 
- **script.js**: Main application logic for meal generation, state management, shopping list creation, and user interactions
- **styles.css**: Complete styling including responsive grid layouts, animations, and constraint badge styling
- **fetch_images.js**: Node.js utility script for downloading meal images from Wikipedia and updating image paths

## Key Application Features

### Meal Generation System
- Generates 4 meals per week (1 meat + 3 vegetarian) following strict constraint rules
- Enforces dietary constraints: pasta, green_vegetable, oven, grain, seasonal, salad, beans_lentils, eggs, dairy
- Prevents meal repeats within 4-week windows to ensure variety
- Supports 11 world cuisine regions (mediterranean, eastern_european, scandinavian, germanic, north_american, middle_eastern, latin_american, south_east_asian, east_asian, african, caribbean)

### State Management
The application maintains complex state including:
- `allWeeklyMeals`: Object storing meals for all generated weeks
- `favorites`/`banned`: Arrays for user meal preferences  
- `mealRatings`: Thumbs up/down ratings that automatically update favorites/banned
- `currentWeek`: 0-based week counter for navigation
- `deactivatedMealsByWeek`: Per-week meal toggles for shopping list customization

### Shopping List Generation
- Categorizes ingredients by supermarket sections (Fresh Vegetables & Herbs, Fruits, Meat & Fish, Dairy & Eggs, Grains & Bread, Legumes & Nuts, Pantry & Condiments)
- Supports ingredient aggregation across active meals
- Generates downloadable HTML files and clipboard-ready text lists
- Includes per-meal breakdown tables with ingredient amounts

## Data Structure

Each meal object contains:
```javascript
{
  title: "Meal Name",
  image: "path/to/image.jpg", 
  type: "meat" | "vegetarian",
  constraints: ["constraint1", "constraint2"], // dietary constraints
  region: "cuisine_region",
  approved: "True" | "False", // optional field
  ingredients: {
    "Ingredient Name": "Amount"
  }
}
```

## Development Notes

- No build system or dependencies - runs directly in browser
- Uses localStorage implicitly through save/load state functionality  
- Image management handled by `fetch_images.js` Node.js script
- Responsive design with CSS Grid (4 columns → 2 → 1 on smaller screens)
- All interactions are client-side with smooth CSS transitions and animations

## Common Tasks

- **Adding new meals**: Add to appropriate array in `meals.js` with all required fields
- **Updating constraints**: Modify the `requiredConstraints` array in `generateWeeklyMeals()` function
- **Styling changes**: All styles are in `styles.css` with CSS custom properties and gradients
- **Testing**: Open `index.html` in browser - no build step required
- **Image updates**: Run `node fetch_images.js` to download new meal images from Wikipedia