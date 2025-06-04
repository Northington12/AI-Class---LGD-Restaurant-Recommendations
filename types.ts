
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  price_range: string;
  image_prompt: string; // For alt text or guiding image selection
}

export interface GeminiRestaurant {
  name: string;
  cuisine: string;
  description: string;
  address: string;
  price_range: string;
  image_prompt: string;
}
