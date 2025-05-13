import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Info, ChevronRight } from 'lucide-react-native';
import { StudyLocation } from '@/types';

interface LocationCardProps {
  location: StudyLocation;
  onPress: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onPress }) => {
  const getStatusColor = () => {
    switch (location.status) {
      case 'Optimal':
        return styles.statusOptimal;
      case 'Moderate':
        return styles.statusModerate;
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
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.97}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={getImageSource(location.images[0])} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={[styles.statusBadge, getStatusColor()]}>
          <Text style={styles.statusText}>{location.status}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{location.name}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              {location.description.substring(0, 40)}...
            </Text>
          </View>
          
          {location.details.hours && (
            <View style={styles.detailItem}>
              <Clock size={14} color="#6b7280" />
              <Text style={styles.detailText}>
                Hours: {location.details.hours}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Noise</Text>
            <Text style={styles.metricValue}>{location.metrics.noise}dB</Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Temp</Text>
            <Text style={styles.metricValue}>{location.metrics.temp}°C</Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Air</Text>
            <Text style={styles.metricValue}>{location.metrics.airQuality}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
            <Info size={16} color="#0d9488" />
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
            <Text style={styles.viewMoreText}>View More</Text>
            <ChevronRight size={16} color="#0d9488" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusOptimal: {
    backgroundColor: 'rgba(22, 163, 74, 0.9)',
  },
  statusModerate: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
  },
  statusNotOptimal: {
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 8,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metric: {
    alignItems: 'center',
    minWidth: 70,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1e293b',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0d9488',
    marginLeft: 6,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0d9488',
    marginRight: 4,
  },
});

export default LocationCard