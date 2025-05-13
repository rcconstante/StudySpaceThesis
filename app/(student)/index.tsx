import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { RefreshCw, Info } from 'lucide-react-native';
import { getStudyLocations } from '@/utils/mockData';
import LocationCard from '@/components/student/LocationCard';
import { StudyLocation } from '@/types';

export default function StudentDashboard() {
  const [locations, setLocations] = useState<StudyLocation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getStudyLocations();
    setLocations(data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleLocationPress = (locationId: string) => {
    router.push({
      pathname: "/study-location",
      params: { id: locationId }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
        }
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.header}>
            <Text style={styles.title}>Study Spaces</Text>
          </View>
          <Text style={styles.subtitle}>Find the perfect environment for studying</Text>
        </Animated.View>

        <View style={styles.prototypeContainer}>
          <Info size={20} color="#6366f1" />
          <Text style={styles.prototypeText}>
            STUDENT PROTOTYPE: This is a demonstration of the student app functionality.
            All study space data and recommendations are simulated for presentation.
          </Text>
        </View>

        <View style={styles.refreshContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} activeOpacity={0.7}>
            <RefreshCw size={16} color="#0d9488" />
            <Text style={styles.refreshText}>Refresh Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationsContainer}>
          {locations.map((location, index) => (
            <Animated.View 
              key={location.id}
              entering={SlideInUp.delay(300 + index * 100).duration(400)}
            >
              <LocationCard
                location={location}
                onPress={() => handleLocationPress(location.id)}
              />
            </Animated.View>
          ))}
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
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#1e293b',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  prototypeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    margin: 20,
    marginTop: 0,
    padding: 12,
    borderRadius: 8,
  },
  prototypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 8,
    flex: 1,
  },
  refreshContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  refreshText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0d9488',
    marginLeft: 8,
  },
  locationsContainer: {
    padding: 15,
    gap: 15,
  },
});