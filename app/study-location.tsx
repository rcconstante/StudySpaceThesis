import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Wifi, Power, Coffee, Info } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { getStudyLocationById } from '@/utils/mockData';
import ImageCarousel from '@/components/student/ImageCarousel';
import MetricCard from '@/components/student/MetricCard';
import FeedbackModal from '@/components/student/FeedbackModal';
import MLPredictionCard from '@/components/student/MLPredictionCard';
import { StudyLocation } from '@/types';
import { 
  predictOptimalConditions, 
  generateRecommendations, 
  EnvironmentData, 
  OptimalPrediction, 
  RecommendationItem 
} from '@/utils/mlPredictions';

const { width } = Dimensions.get('window');

export default function StudyLocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<StudyLocation | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [mlExpanded, setMlExpanded] = useState(false);
  const [prediction, setPrediction] = useState<OptimalPrediction | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [dataSource, setDataSource] = useState<'trained-model' | 'demo' | 'no-data'>('demo');

  useEffect(() => {
    if (id) {
      const locationData = getStudyLocationById(id);
      setLocation(locationData);
      
      // For the prototype, set all locations to have AI scores
      // Vary the data source type for visual distinction
      if (id === '1') {
        // Library
        setDataSource('trained-model');
      } else if (id === '3') {
        // KUBO Huts
        setDataSource('demo');
      } else {
        // All other locations now show demo data too
        setDataSource('demo');
      }
      
      if (locationData) {
        // Convert the location metrics to the format expected by the ML prediction
        const environmentData: EnvironmentData = {
          timestamp: new Date().toISOString(),
          temperature: locationData.metrics.temp,
          humidity: locationData.metrics.humidity,
          noiseLevel: locationData.metrics.noise,
          lightIntensity: locationData.metrics.lighting,
          airQualityIndex: locationData.metrics.airQuality === 'Good' ? 80 : 
                          locationData.metrics.airQuality === 'Moderate' ? 110 : 150,
        };
        
        // Generate predictions and recommendations for the prototype
        const pred = predictOptimalConditions(environmentData);
        setPrediction(pred);
        setRecommendations(generateRecommendations(pred));
      }
    }
  }, [id]);

  if (!location) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        locationId={location.id}
        locationName={location.name}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(student)')}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#0d9488" />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeIn.duration(600)}>
          <ImageCarousel images={location.images} />
        </Animated.View>

        <View style={styles.contentContainer}>
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{location.name}</Text>
              <View style={[styles.statusBadge, getStatusColor(location.status)]}>
                <Text style={styles.statusText}>{location.status}</Text>
              </View>
            </View>

            <Text style={styles.description}>{location.description}</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Capacity</Text>
                <Text style={styles.detailValue}>{location.details.capacity} students</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Hours</Text>
                <Text style={styles.detailValue}>{location.details.hours}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Rating</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.detailValue}>{location.averageRating.toFixed(1)}</Text>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <View style={styles.prototypeContainer}>
              <Info size={20} color="#6366f1" />
              <Text style={styles.prototypeText}>
                Prototype: AI analysis for study spaces is in development.
              </Text>
            </View>
          </Animated.View>

          {prediction && (
            <Animated.View entering={FadeInDown.delay(350).duration(500)}>
              <MLPredictionCard
                prediction={prediction}
                recommendations={recommendations}
                expanded={mlExpanded}
                onToggleExpand={() => setMlExpanded(!mlExpanded)}
                dataSource={dataSource}
                locationName={location.name}
              />
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Environment Metrics</Text>
              <View style={styles.metricsContainer}>
                <MetricCard
                  label="Noise Level"
                  value={`${location.metrics.noise} dB`}
                  status={getMetricStatus(location.metrics.noise, 'noise')}
                  icon="volume-2"
                />
                <MetricCard
                  label="Temperature"
                  value={`${location.metrics.temp}°C`}
                  status={getMetricStatus(location.metrics.temp, 'temp')}
                  icon="thermometer"
                />
                <MetricCard
                  label="Humidity"
                  value={`${location.metrics.humidity}%`}
                  status={getMetricStatus(location.metrics.humidity, 'humidity')}
                  icon="droplets"
                />
                <MetricCard
                  label="Lighting"
                  value={`${location.metrics.lighting} lux`}
                  status={getMetricStatus(location.metrics.lighting, 'lighting')}
                  icon="sun"
                />
                <MetricCard
                  label="Air Quality"
                  value={location.metrics.airQuality}
                  status={location.metrics.airQuality === 'Good' ? 'good' : (location.metrics.airQuality === 'Moderate' ? 'moderate' : 'bad')}
                  icon="wind"
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(500)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {location.details.amenities.includes('Wi-Fi') && (
                  <View style={styles.amenityItem}>
                    <Wifi size={20} color="#0d9488" />
                    <Text style={styles.amenityText}>Wi-Fi Available</Text>
                  </View>
                )}
                {location.details.amenities.includes('power outlets') && (
                  <View style={styles.amenityItem}>
                    <Power size={20} color="#0d9488" />
                    <Text style={styles.amenityText}>Power Outlets</Text>
                  </View>
                )}
                {location.details.amenities.includes('vending machines') && (
                  <View style={styles.amenityItem}>
                    <Coffee size={20} color="#0d9488" />
                    <Text style={styles.amenityText}>Vending Machines Nearby</Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).duration(500)}>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => setFeedbackVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.feedbackButtonText}>Provide Feedback</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Optimal':
      return { backgroundColor: 'rgba(22, 163, 74, 0.1)' };
    case 'Moderate':
      return { backgroundColor: 'rgba(245, 158, 11, 0.1)' };
    case 'Not Optimal':
      return { backgroundColor: 'rgba(220, 38, 38, 0.1)' };
    default:
      return { backgroundColor: 'rgba(107, 114, 128, 0.1)' };
  }
};

const getMetricStatus = (value: number, metric: string) => {
  if (metric === 'noise') {
    if (value < 40) return 'good';
    if (value < 60) return 'moderate';
    return 'bad';
  }
  if (metric === 'temp') {
    if (value >= 22 && value <= 26) return 'good';
    if ((value >= 18 && value < 22) || (value > 26 && value <= 28)) return 'moderate';
    return 'bad';
  }
  if (metric === 'humidity') {
    if (value >= 40 && value <= 60) return 'good';
    if ((value >= 30 && value < 40) || (value > 60 && value <= 70)) return 'moderate';
    return 'bad';
  }
  if (metric === 'lighting') {
    if (value >= 250 && value <= 500) return 'good';
    if ((value >= 150 && value < 250) || (value > 500 && value <= 700)) return 'moderate';
    return 'bad';
  }
  return 'moderate';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    zIndex: 10,
    top: 10,
    left: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#0f766e',
  },
  prototypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  prototypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  amenitiesContainer: {
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  amenityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#334155',
    marginLeft: 12,
  },
  feedbackButton: {
    backgroundColor: '#0d9488',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  feedbackButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  }
}); 