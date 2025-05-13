import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { getAllFeedback } from '@/utils/storage';
import { getStudyLocations } from '@/utils/mockData';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RefreshCw, Filter } from 'lucide-react-native';
import { Feedback, StudyLocation } from '@/types';
import FeedbackCard from '@/components/admin/FeedbackCard';

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [locations, setLocations] = useState<StudyLocation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const feedbackData = await getAllFeedback();
      const locationsData = getStudyLocations();
      
      setFeedback(feedbackData.reverse()); // Show newest first
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadData();
  };

  const handleFilterPress = (locationId: string | null) => {
    setSelectedLocation(locationId === selectedLocation ? null : locationId);
  };

  const filteredFeedback = selectedLocation 
    ? feedback.filter(item => item.locationId === selectedLocation)
    : feedback;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Student Feedback</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} activeOpacity={0.7}>
            <RefreshCw size={16} color="#0d9488" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterHeader}>
            <Filter size={18} color="#0d9488" />
            <Text style={styles.filterTitle}>Filter by Location</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedLocation === null && styles.activeFilterChip
              ]}
              onPress={() => handleFilterPress(null)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  selectedLocation === null && styles.activeFilterChipText
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.filterChip,
                  selectedLocation === location.id && styles.activeFilterChip
                ]}
                onPress={() => handleFilterPress(location.id)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    selectedLocation === location.id && styles.activeFilterChipText
                  ]}
                >
                  {location.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.feedbackContainer}>
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <FeedbackCard feedback={item} location={locations.find(loc => loc.id === item.locationId)} />
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedLocation ? 'No feedback available for this location.' : 'No feedback available.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#1e293b',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  refreshText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0d9488',
    marginLeft: 6,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 6,
  },
  filtersList: {
    paddingVertical: 5,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: '#0d9488',
  },
  filterChipText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4b5563',
  },
  activeFilterChipText: {
    color: 'white',
  },
  feedbackContainer: {
    padding: 15,
    gap: 15,
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});