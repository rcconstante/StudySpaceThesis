import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Define interfaces for predictions and recommendations
export interface EnvironmentData {
  timestamp: string;
  temperature: number;
  humidity: number;
  noiseLevel: number;
  lightIntensity: number;
  airQualityIndex: number;
}

export interface OptimalPrediction {
  isOptimal: boolean;
  optimalScore: number; // 0-100
  suboptimalFactors: {
    factor: string;
    currentValue: number;
    optimalRange: {
      min: number;
      max: number;
    };
    impact: number; // 0-100, how much this factor impacts the overall score
  }[];
}

export interface RecommendationItem {
  factor: string;
  issue: string;
  recommendation: string;
  expectedImprovement: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: string;
  locationId?: string;
  locationName?: string;
  isDemoData?: boolean;
}

// Placeholder for model loading and inference
// In real implementation, this would use TensorFlow.js to load the model
// and make predictions, but for now we'll use predefined rules
const optimalRanges = {
  temperature: { min: 21, max: 25, unit: '°C' },
  humidity: { min: 40, max: 60, unit: '%' },
  noiseLevel: { min: 0, max: 40, unit: 'dB' },
  lightIntensity: { min: 300, max: 700, unit: 'lux' },
  airQualityIndex: { min: 0, max: 100, unit: 'AQI' },
};

// Rules-based implementation (simulating model predictions)
export function predictOptimalConditions(data: EnvironmentData): OptimalPrediction {
  const suboptimalFactors = [];
  let totalImpact = 0;
  
  // Check temperature
  if (data.temperature < optimalRanges.temperature.min || 
      data.temperature > optimalRanges.temperature.max) {
    const impact = calculateImpact(
      data.temperature, 
      optimalRanges.temperature.min, 
      optimalRanges.temperature.max
    );
    totalImpact += impact;
    suboptimalFactors.push({
      factor: 'temperature',
      currentValue: data.temperature,
      optimalRange: {
        min: optimalRanges.temperature.min,
        max: optimalRanges.temperature.max
      },
      impact
    });
  }
  
  // Check humidity
  if (data.humidity < optimalRanges.humidity.min || 
      data.humidity > optimalRanges.humidity.max) {
    const impact = calculateImpact(
      data.humidity, 
      optimalRanges.humidity.min, 
      optimalRanges.humidity.max
    );
    totalImpact += impact;
    suboptimalFactors.push({
      factor: 'humidity',
      currentValue: data.humidity,
      optimalRange: {
        min: optimalRanges.humidity.min,
        max: optimalRanges.humidity.max
      },
      impact
    });
  }
  
  // Check noise level
  if (data.noiseLevel < optimalRanges.noiseLevel.min || 
      data.noiseLevel > optimalRanges.noiseLevel.max) {
    const impact = calculateImpact(
      data.noiseLevel, 
      optimalRanges.noiseLevel.min, 
      optimalRanges.noiseLevel.max
    );
    totalImpact += impact;
    suboptimalFactors.push({
      factor: 'noiseLevel',
      currentValue: data.noiseLevel,
      optimalRange: {
        min: optimalRanges.noiseLevel.min,
        max: optimalRanges.noiseLevel.max
      },
      impact
    });
  }
  
  // Check light intensity
  if (data.lightIntensity < optimalRanges.lightIntensity.min || 
      data.lightIntensity > optimalRanges.lightIntensity.max) {
    const impact = calculateImpact(
      data.lightIntensity, 
      optimalRanges.lightIntensity.min, 
      optimalRanges.lightIntensity.max
    );
    totalImpact += impact;
    suboptimalFactors.push({
      factor: 'lightIntensity',
      currentValue: data.lightIntensity,
      optimalRange: {
        min: optimalRanges.lightIntensity.min,
        max: optimalRanges.lightIntensity.max
      },
      impact
    });
  }
  
  // Check air quality
  if (data.airQualityIndex < optimalRanges.airQualityIndex.min || 
      data.airQualityIndex > optimalRanges.airQualityIndex.max) {
    const impact = calculateImpact(
      data.airQualityIndex, 
      optimalRanges.airQualityIndex.min, 
      optimalRanges.airQualityIndex.max
    );
    totalImpact += impact;
    suboptimalFactors.push({
      factor: 'airQualityIndex',
      currentValue: data.airQualityIndex,
      optimalRange: {
        min: optimalRanges.airQualityIndex.min,
        max: optimalRanges.airQualityIndex.max
      },
      impact
    });
  }
  
  // Sort factors by impact (highest impact first)
  suboptimalFactors.sort((a, b) => b.impact - a.impact);
  
  // Calculate overall optimal score (0-100)
  // A perfect environment would have a score of 100
  const optimalScore = Math.max(0, 100 - totalImpact);
  const isOptimal = optimalScore >= 70; // Consider 70+ as optimal
  
  return {
    isOptimal,
    optimalScore,
    suboptimalFactors
  };
}

// Helper function to calculate how far a value is from the optimal range
function calculateImpact(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 0;
  
  const belowDistance = value < min ? min - value : 0;
  const aboveDistance = value > max ? value - max : 0;
  const distance = belowDistance + aboveDistance;
  
  // Calculate range width for normalization
  const rangeWidth = max - min;
  
  // Calculate normalized impact (0-100)
  // The further from the optimal range, the higher the impact
  const normalizedImpact = Math.min(100, (distance / rangeWidth) * 100);
  
  return normalizedImpact;
}

// Generate recommendations based on the prediction
export function generateRecommendations(prediction: OptimalPrediction): RecommendationItem[] {
  const recommendations: RecommendationItem[] = [];
  
  // Only generate recommendations for suboptimal factors
  prediction.suboptimalFactors.forEach(factor => {
    let recommendation: RecommendationItem | null = null;
    
    switch (factor.factor) {
      case 'temperature':
        if (factor.currentValue < factor.optimalRange.min) {
          recommendation = {
            factor: 'Temperature',
            issue: `Temperature is too low (${factor.currentValue.toFixed(1)}°C)`,
            recommendation: 'Increase heating or adjust thermostat settings. Consider installing smart thermostats to maintain optimal temperature ranges.',
            expectedImprovement: 'Increasing temperature to optimal range (21-25°C) would improve student comfort and cognitive performance by up to 15%.',
            priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
            estimatedCost: 'Low to Medium'
          };
        } else {
          recommendation = {
            factor: 'Temperature',
            issue: `Temperature is too high (${factor.currentValue.toFixed(1)}°C)`,
            recommendation: 'Improve cooling systems or adjust air conditioning. Consider installing ceiling fans for better air circulation.',
            expectedImprovement: 'Decreasing temperature to optimal range (21-25°C) would improve concentration and reduce discomfort by up to 20%.',
            priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
            estimatedCost: 'Medium'
          };
        }
        break;
        
      case 'humidity':
        if (factor.currentValue < factor.optimalRange.min) {
          recommendation = {
            factor: 'Humidity',
            issue: `Humidity is too low (${factor.currentValue.toFixed(1)}%)`,
            recommendation: 'Install humidifiers or place water containers in the room to increase ambient humidity levels.',
            expectedImprovement: 'Increasing humidity to optimal range (40-60%) would reduce respiratory issues and eye strain by up to 25%.',
            priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
            estimatedCost: 'Low'
          };
        } else {
          recommendation = {
            factor: 'Humidity',
            issue: `Humidity is too high (${factor.currentValue.toFixed(1)}%)`,
            recommendation: 'Install dehumidifiers or improve ventilation systems to reduce moisture levels.',
            expectedImprovement: 'Decreasing humidity to optimal range (40-60%) would improve comfort and reduce mold risk by up to 30%.',
            priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
            estimatedCost: 'Medium'
          };
        }
        break;
        
      case 'noiseLevel':
        recommendation = {
          factor: 'Noise Level',
          issue: `Noise level is too high (${factor.currentValue.toFixed(1)}dB)`,
          recommendation: 'Install sound-absorbing panels on walls and ceilings. Consider implementing noise policies and creating designated quiet zones.',
          expectedImprovement: 'Reducing noise to optimal levels (below 40dB) would improve concentration and reduce stress by up to 40%.',
          priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
          estimatedCost: 'Medium to High'
        };
        break;
        
      case 'lightIntensity':
        if (factor.currentValue < factor.optimalRange.min) {
          recommendation = {
            factor: 'Light Intensity',
            issue: `Light intensity is too low (${factor.currentValue.toFixed(1)} lux)`,
            recommendation: 'Increase natural light by rearranging furniture or install additional lighting fixtures with adjustable brightness.',
            expectedImprovement: 'Increasing light intensity to optimal range (300-700 lux) would reduce eye strain and increase alertness by up to 35%.',
            priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
            estimatedCost: 'Low to Medium'
          };
        } else {
          recommendation = {
            factor: 'Light Intensity',
            issue: `Light intensity is too high (${factor.currentValue.toFixed(1)} lux)`,
            recommendation: 'Install window blinds or shades to control natural light. Consider using anti-glare filters on light sources.',
            expectedImprovement: 'Decreasing light intensity to optimal range (300-700 lux) would reduce headaches and eye fatigue by up to 30%.',
            priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
            estimatedCost: 'Low'
          };
        }
        break;
        
      case 'airQualityIndex':
        recommendation = {
          factor: 'Air Quality',
          issue: `Air quality is poor (AQI: ${factor.currentValue.toFixed(1)})`,
          recommendation: 'Install air purifiers with HEPA filters and improve ventilation systems. Consider adding indoor plants to naturally improve air quality.',
          expectedImprovement: 'Improving air quality to optimal levels would enhance cognitive function by up to 15% and reduce respiratory issues.',
          priority: factor.impact > 50 ? 'high' : factor.impact > 20 ? 'medium' : 'low',
          estimatedCost: 'Medium to High'
        };
        break;
    }
    
    if (recommendation) {
      recommendations.push(recommendation);
    }
  });
  
  return recommendations;
}

// For loading the historical data from CSV
export async function loadHistoricalData(): Promise<EnvironmentData[]> {
  try {
    // In a real implementation, this would load the CSV file and parse it
    // For now, we'll return a subset of data for the current implementation
    return [
      {
        timestamp: '2025-05-09 08:00:00',
        temperature: 24.6,
        humidity: 62.0,
        noiseLevel: 38.6,
        lightIntensity: 640.4,
        airQualityIndex: 91.7
      },
      {
        timestamp: '2025-05-09 09:00:00',
        temperature: 24.1,
        humidity: 63.0,
        noiseLevel: 39.1,
        lightIntensity: 501.3,
        airQualityIndex: 91.3
      },
      {
        timestamp: '2025-05-09 10:00:00',
        temperature: 26.2,
        humidity: 59.6,
        noiseLevel: 35.6,
        lightIntensity: 561.9,
        airQualityIndex: 110.4
      },
      {
        timestamp: '2025-05-09 11:00:00',
        temperature: 21.5,
        humidity: 50.3,
        noiseLevel: 37.8,
        lightIntensity: 700.7,
        airQualityIndex: 104.3
      },
      {
        timestamp: '2025-05-09 12:00:00',
        temperature: 26.7,
        humidity: 49.0,
        noiseLevel: 43.8,
        lightIntensity: 582.1,
        airQualityIndex: 97.4
      }
    ];
  } catch (error) {
    console.error('Error loading historical data:', error);
    return [];
  }
}

// Future implementation: Use TensorFlow.js to load the model and make predictions
// This would replace the rules-based approach above
export async function loadModel() {
  // Placeholder for future implementation
  // In a full implementation, this would:
  // 1. Load the model using TensorFlow.js
  // 2. Load the imputer and scaler using appropriate methods
  // 3. Provide a predict method to run actual model inference
  
  console.log('Model loading is a placeholder. Using rules-based approach instead.');
  return null;
} 