import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { MapPin, Users, Clock } from 'lucide-react-native';
import { StudyLocation } from '@/types';

interface LocationMetricsCardProps {
  location: StudyLocation;
}

const LocationMetricsCard: React.FC<LocationMetricsCardProps> = ({ location }) => {
  const getStatusColor = () => {
    switch (location.status) {
      case 'Optimal':
        return styles.statusOptimal;
      case 'Moderate':
        return styles.statusModerateHeader;
      case 'Not Optimal':
        return styles.statusNotOptimal;
      default:
        return {};
    }
  };

  // Function to get the correct image source
  const getImageSource = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      // Remote image
      return { uri: imagePath };
    } else {
      // For local images, we need to map the path to the actual image
      if (imagePath.includes('Library1.png')) {
        return require('../../public/images/Library1.png');
      } else if (imagePath.includes('Library2.png')) {
        return require('../../public/images/Library2.png');
      } else if (imagePath.includes('Library3.png')) {
        return require('../../public/images/Library3.png');
      } else if (imagePath.includes('Ayunta1.jpg')) {
        return require('../../public/images/Ayunta1.jpg');
      } else if (imagePath.includes('Ayunta2.jpg')) {
        return require('../../public/images/Ayunta2.jpg');
      } else if (imagePath.includes('Ayunta3.jpg')) {
        return require('../../public/images/Ayunta3.jpg');
      } else if (imagePath.includes('KUBO1.jpg')) {
        return require('../../public/images/KUBO1.jpg');
      } else if (imagePath.includes('KUBO2.jpeg')) {
        return require('../../public/images/KUBO2.jpeg');
      } else if (imagePath.includes('KUBO3.jpg')) {
        return require('../../public/images/KUBO3.jpg');
      } else if (imagePath.includes('LABSPACE1.jpg')) {
        return require('../../public/images/LABSPACE1.jpg');
      } else if (imagePath.includes('LABSPACE2.jpg')) {
        return require('../../public/images/LABSPACE2.jpg');
      } else if (imagePath.includes('LABSPACE3.png')) {
        return require('../../public/images/LABSPACE3.png');
      } else if (imagePath.includes('COS1.png')) {
        return require('../../public/images/COS1.png');
      } else if (imagePath.includes('COS2.jpg')) {
        return require('../../public/images/COS2.jpg');
      } else if (imagePath.includes('COS3.jpg')) {
        return require('../../public/images/COS3.jpg');
      } else {
        // Default fallback if no match
        return require('../../assets/images/icon.png');
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{location.name}</Text>
          <View style={[styles.statusBadge, getStatusColor()]}>
            <Text style={styles.statusText}>{location.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
          contentContainerStyle={styles.imagesContent}
        >
          {location.images.map((image, index) => (
            <Image key={index} source={getImageSource(image)} style={styles.image} />
          ))}
        </ScrollView>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={2}>
              {location.description.substring(0, 100)}
              {location.description.length > 100 ? '...' : ''}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.detailItem}>
              <Users size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                Capacity: {location.details.capacity}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                Hours: {location.details.hours}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Current Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Noise Level</Text>
              <Text style={styles.metricValue}>{location.metrics.noise} dB</Text>
              <View style={getMetricStatusStyle(location.metrics.noise, 'noise')}>
                <Text style={styles.metricStatusText}>
                  {getMetricStatusText(location.metrics.noise, 'noise')}
                </Text>
              </View>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Temperature</Text>
              <Text style={styles.metricValue}>{location.metrics.temp} °C</Text>
              <View style={getMetricStatusStyle(location.metrics.temp, 'temp')}>
                <Text style={styles.metricStatusText}>
                  {getMetricStatusText(location.metrics.temp, 'temp')}
                </Text>
              </View>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Humidity</Text>
              <Text style={styles.metricValue}>{location.metrics.humidity} %</Text>
              <View style={getMetricStatusStyle(location.metrics.humidity, 'humidity')}>
                <Text style={styles.metricStatusText}>
                  {getMetricStatusText(location.metrics.humidity, 'humidity')}
                </Text>
              </View>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Lighting</Text>
              <Text style={styles.metricValue}>{location.metrics.lighting} lux</Text>
              <View style={getMetricStatusStyle(location.metrics.lighting, 'lighting')}>
                <Text style={styles.metricStatusText}>
                  {getMetricStatusText(location.metrics.lighting, 'lighting')}
                </Text>
              </View>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Air Quality</Text>
              <Text style={styles.metricValue}>{location.metrics.airQuality}</Text>
              <View style={getMetricStatusStyle(0, 'air', location.metrics.airQuality)}>
                <Text style={styles.metricStatusText}>
                  {location.metrics.airQuality}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const getMetricStatusStyle = (value: number, metric: string, stringValue?: string) => {
  let status: 'good' | 'moderate' | 'bad' = 'moderate';
  
  if (metric === 'air' && stringValue) {
    if (stringValue === 'Good') status = 'good';
    else if (stringValue === 'Moderate') status = 'moderate';
    else status = 'bad';
  } else if (metric === 'noise') {
    if (value < 40) status = 'good';
    else if (value < 60) status = 'moderate';
    else status = 'bad';
  } else if (metric === 'temp') {
    if (value >= 22 && value <= 26) status = 'good';
    else if ((value >= 18 && value < 22) || (value > 26 && value <= 28)) status = 'moderate';
    else status = 'bad';
  } else if (metric === 'humidity') {
    if (value >= 40 && value <= 60) status = 'good';
    else if ((value >= 30 && value < 40) || (value > 60 && value <= 70)) status = 'moderate';
    else status = 'bad';
  } else if (metric === 'lighting') {
    if (value >= 250 && value <= 500) status = 'good';
    else if ((value >= 150 && value < 250) || (value > 500 && value <= 700)) status = 'moderate';
    else status = 'bad';
  }
  
  switch (status) {
    case 'good':
      return styles.statusGood;
    case 'moderate':
      return styles.statusModerateHeader;
    case 'bad':
      return styles.statusBad;
    default:
      return styles.statusModerateHeader;
  }
};

const getMetricStatusText = (value: number, metric: string) => {
  if (metric === 'noise') {
    if (value < 40) return 'Quiet';
    if (value < 60) return 'Moderate';
    return 'Noisy';
  }
  if (metric === 'temp') {
    if (value >= 22 && value <= 26) return 'Optimal';
    if ((value >= 18 && value < 22) || (value > 26 && value <= 28)) return 'Acceptable';
    return 'Uncomfortable';
  }
  if (metric === 'humidity') {
    if (value >= 40 && value <= 60) return 'Optimal';
    if ((value >= 30 && value < 40) || (value > 60 && value <= 70)) return 'Acceptable';
    return 'Uncomfortable';
  }
  if (metric === 'lighting') {
    if (value >= 250 && value <= 500) return 'Optimal';
    if ((value >= 150 && value < 250) || (value > 500 && value <= 700)) return 'Acceptable';
    return 'Poor';
  }
  return 'Unknown';
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusOptimal: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
  statusModerateHeader: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusNotOptimal: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#1e293b',
  },
  content: {
    padding: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imagesContent: {
    gap: 10,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexShrink: 1,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flexShrink: 1,
  },
  metricsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 8,
  },
  statusGood: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBad: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  metricStatusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#1e293b',
  },
});

export default LocationMetricsCard;