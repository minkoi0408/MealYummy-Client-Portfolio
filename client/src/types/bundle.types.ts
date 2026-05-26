export interface BundleDuration {
  durationCode: string; // e.g., '1_MONTH', '3_MONTHS', '1_YEAR'
  durationInDays: number;
  price: number;
  originalPrice?: number; // Optional: To calculate savings
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  features: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  durations: BundleDuration[];
}
