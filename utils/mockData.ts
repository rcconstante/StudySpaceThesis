import { StudyLocation, Recommendation } from '@/types';

// Sample location images from local and remote sources
const libraryImages = [
  '/images/Library1.png',
  '/images/Library2.png',
  '/images/Library3.png',
];

const ayuntamientoImages = [
  '/images/Ayunta1.jpg',
  '/images/Ayunta2.jpg',
  '/images/Ayunta3.jpg',
];

const kubosImages = [
  '/images/KUBO1.jpg',
  '/images/KUBO2.jpeg',
  '/images/KUBO3.jpg',
];

const labImages = [
  '/images/LABSPACE1.jpg',
  '/images/LABSPACE2.jpg',
  '/images/LABSPACE3.png',
];

const cosImages = [
  '/images/COS1.png',
  '/images/COS2.jpg',
  '/images/COS3.jpg',
];

// Create mock data
const mockLocations: StudyLocation[] = [
  {
    id: '1',
    name: 'Library',
    status: 'Optimal',
    description: 'Located at the main building, 2nd floor, offering quiet study areas and access to resources.',
    details: {
      hours: '8 AM - 4 PM',
      amenities: ['Wi-Fi', 'power outlets', 'air conditioning'],
      capacity: 50,
    },
    metrics: {
      noise: 30,
      temp: 23,
      humidity: 45,
      lighting: 300,
      airQuality: 'Good',
    },
    images: libraryImages,
    averageRating: 4.2,
  },
  {
    id: '2',
    name: 'Ayuntamiento de Gonzalez Building',
    status: 'Moderate',
    description: 'Located at the center of the campus, offers semi-quiet study spaces with modern facilities.',
    details: {
      hours: '8 AM - 4 PM',
      amenities: ['Wi-Fi', 'power outlets', 'air conditioning'],
      capacity: 75,
    },
    metrics: {
      noise: 45,
      temp: 25,
      humidity: 50,
      lighting: 250,
      airQuality: 'Good',
    },
    images: ayuntamientoImages,
    averageRating: 3.8,
  },
  {
    id: '3',
    name: 'KUBO Huts',
    status: 'Not Optimal',
    description: 'Outdoor huts offering a natural environment for group study sessions, close to cafeteria.',
    details: {
      hours: '8 AM - 4 PM',
      amenities: ['Wi-Fi', 'natural lighting'],
      capacity: 30,
    },
    metrics: {
      noise: 60,
      temp: 28,
      humidity: 70,
      lighting: 800,
      airQuality: 'Moderate',
    },
    images: kubosImages,
    averageRating: 3.2,
  },
  {
    id: '4',
    name: 'ICT Open Lab Space',
    status: 'Moderate',
    description: 'Modern computer lab with high-speed internet, perfect for tech projects and online research.',
    details: {
      hours: '8 AM - 4 PM',
      amenities: ['Wi-Fi', 'power outlets', 'computers', 'air conditioning'],
      capacity: 40,
    },
    metrics: {
      noise: 50,
      temp: 22,
      humidity: 40,
      lighting: 400,
      airQuality: 'Good',
    },
    images: labImages,
    averageRating: 4.0,
  },
  {
    id: '5',
    name: 'COS Classrooms',
    status: 'Not Optimal',
    description: 'Repurposed classrooms in the College of Science building available for studying during non-class hours.',
    details: {
      hours: '9 AM - 5 PM',
      amenities: ['Wi-Fi', 'power outlets', 'whiteboard'],
      capacity: 35,
    },
    metrics: {
      noise: 55,
      temp: 27,
      humidity: 65,
      lighting: 350,
      airQuality: 'Moderate',
    },
    images: cosImages,
    averageRating: 3.5,
  },
];

// Mock recommendations based on metrics
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    locationId: '3',
    locationName: 'KUBO Huts',
    type: 'noise',
    issue: 'High noise levels (60dB) detected, well above the optimal range for studying.',
    suggestion: 'Install sound-absorbing panels on surrounding walls or implement noise-monitoring systems that notify nearby staff when levels exceed thresholds.',
    expectedBenefit: 'Potential 40% reduction in ambient noise, creating a more conducive study environment that would improve student focus and productivity.',
    priority: 'high',
  },
  {
    id: '2',
    locationId: '5',
    locationName: 'COS Classrooms',
    type: 'temperature',
    issue: 'Temperature consistently above optimal range (current: 27°C, optimal: 22-25°C).',
    suggestion: 'Adjust air conditioning settings and install programmable thermostats that maintain temperatures within the optimal range throughout the day.',
    expectedBenefit: 'Consistent comfortable temperature would increase study duration by an estimated 30% and improve cognitive performance.',
    priority: 'medium',
  },
  {
    id: '3',
    locationId: '3',
    locationName: 'KUBO Huts',
    type: 'humidity',
    issue: 'Humidity levels consistently exceed 70%, creating an uncomfortable study environment.',
    suggestion: 'Install dehumidifiers and improve ventilation to maintain humidity between 40-60%.',
    expectedBenefit: 'Reduced humidity would improve comfort, prevent mold growth, and protect electronic devices used by students.',
    priority: 'medium',
  },
  {
    id: '4',
    locationId: '4',
    locationName: 'ICT Open Lab Space',
    type: 'lighting',
    issue: 'Some areas have insufficient lighting (below 300 lux) while others experience glare on computer screens.',
    suggestion: 'Install adjustable task lighting and anti-glare screens, and rearrange workstations to optimize natural light distribution.',
    expectedBenefit: 'Proper lighting would reduce eye strain by approximately 35% and improve visual comfort during long study sessions.',
    priority: 'low',
  },
  {
    id: '5',
    locationId: '5',
    locationName: 'COS Classrooms',
    type: 'air',
    issue: 'Air quality readings show moderate levels with increased CO2 concentrations during peak usage hours.',
    suggestion: 'Improve ventilation systems and install air purifiers with CO2 sensors that trigger increased air circulation.',
    expectedBenefit: 'Enhanced air quality would improve cognitive function by up to 15% and reduce drowsiness during study sessions.',
    priority: 'high',
  },
];

// Export functions to access mock data
export const getStudyLocations = (): StudyLocation[] => {
  return mockLocations;
};

export const getStudyLocationById = (id: string): StudyLocation | null => {
  const location = mockLocations.find(loc => loc.id === id);
  return location || null;
};

export const getRecommendations = (): Recommendation[] => {
  return mockRecommendations;
};

export const getLocationMetricsHistory = (locationId: string) => {
  // Generate random historical data for charts
  const generateRandomData = (min: number, max: number, count: number) => {
    return Array(count).fill(0).map(() => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const location = getStudyLocationById(locationId);
  
  if (!location) return null;
  
  // Generate mock historical data for 5 days (Mon-Fri) from 8AM-5PM
  const noise = generateRandomData(location.metrics.noise - 10, location.metrics.noise + 10, 5);
  const temperature = generateRandomData(location.metrics.temp - 3, location.metrics.temp + 3, 5);
  const humidity = generateRandomData(location.metrics.humidity - 10, location.metrics.humidity + 10, 5);
  
  return {
    noise,
    temperature,
    humidity,
  };
};