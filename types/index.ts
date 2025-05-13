// Type definitions for the Study Space app

// Study location data structure
export interface StudyLocation {
  id: string;
  name: string;
  status: 'Optimal' | 'Moderate' | 'Not Optimal';
  description: string;
  details: {
    hours?: string;
    amenities: string[];
    capacity?: number;
  };
  metrics: {
    noise: number; // in dB
    temp: number; // in °C
    humidity: number; // in %
    lighting: number; // in lux
    airQuality: 'Good' | 'Moderate' | 'Poor';
  };
  images: string[];
  averageRating: number;
}

// Feedback data structure
export interface Feedback {
  id: string;
  locationId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

// Recommendation data structure
export interface Recommendation {
  id: string;
  locationId: string;
  locationName: string;
  type: 'temperature' | 'noise' | 'humidity' | 'lighting' | 'air';
  issue: string;
  suggestion: string;
  expectedBenefit: string;
  priority: 'high' | 'medium' | 'low';
}