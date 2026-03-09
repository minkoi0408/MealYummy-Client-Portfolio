export interface Price {
  minPrice: number;
  maxPrice: number;
}

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
  id: string;
  name: string;
  value: number;
  unitDesc: string;
}

export interface Meal {
  id: string;
  name: string;
  price: Price;
  nutrition: Nutrition;
  description: String;
  categories: Category[];
  tags: Tag[];
  ingredients: MealIngredient[];
}