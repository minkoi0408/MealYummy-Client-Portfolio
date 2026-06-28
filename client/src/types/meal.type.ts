export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface MealIngredient {
  id?: string;
  name: string;
  value: number;
  unit: string;
  unitDesc?: string;
}

export interface Meal {
  id: string;
  name: string;
  nutrition: Nutrition;
  description: string;
  categories: string[];
  tags: string[];
  ingredients: MealIngredient[];
}