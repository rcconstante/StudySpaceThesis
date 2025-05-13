import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  RefreshControl,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LineChart } from 'react-native-chart-kit';
import { getStudyLocations, getLocationMetricsHistory } from '@/utils/mockData';
import LocationMetricsCard from '@/components/admin/LocationMetricsCard';
import { RefreshCw, Info } from 'lucide-react-native';
import { StudyLocation } from '@/types';

const { width } = Dimensions.get('window');

export default function MetricsScreen() {
  const [locations, setLocations] = useState<StudyLocation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadMetricsHistory(selectedLocation);
    }
  }, [selectedLocation]);

  const loadData = () => {
    const data = getStudyLocations();
    setLocations(data);
    
    // Set first location as selected by default
    if (data.length > 0 && !selectedLocation) {
      setSelectedLocation(data[0].id);
    }
  };

  const loadMetricsHistory = (locationId: string) => {
    const history = getLocationMetricsHistory(locationId);
    setMetricsHistory(history);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const renderCharts = () => {
    if (!metricsHistory || !selectedLocation) return null;

    const location = locations.find(loc => loc.id === selectedLocation);
    if (!location) return null;

    return (
      <View style={styles.chartsSection}>
        <Text style={styles.chartTitle}>
          5-Day Trends (8AM - 5PM) for {location.name}
        </Text>

        <Text style={styles.chartSubtitle}>Noise Level (dB)</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ data: metricsHistory.noise }],
          }}
          width={width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#0d9488',
            },
          }}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartSubtitle}>Temperature (°C)</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ data: metricsHistory.temperature }],
          }}
          width={width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#dc2626',
            },
          }}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartSubtitle}>Humidity (%)</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ data: metricsHistory.humidity }],
          }}
          width={width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#2563eb',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
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
        <View style={styles.header}>
          <Text style={styles.title}>Environment Metrics</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} activeOpacity={0.7}>
            <RefreshCw size={16} color="#0d9488" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prototypeContainer}>
          <Info size={20} color="#6366f1" />
          <Text style={styles.prototypeText}>
            ADMIN PROTOTYPE: This is a demonstration of the admin dashboard functionality.
            Data visualizations and metrics are simulated for presentation purposes.
          </Text>
        </View>

        <View style={styles.locationTabs}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {locations.map((location, index) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationTab,
                  selectedLocation === location.id && styles.selectedLocationTab
                ]}
                onPress={() => handleLocationSelect(location.id)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.locationTabText,
                    selectedLocation === location.id && styles.selectedLocationTabText
                  ]}
                >
                  {location.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.metricsContainer}>
          {locations.map((location, index) => (
            <Animated.View 
              key={location.id} 
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={{ display: selectedLocation === location.id ? 'flex' : 'none' }}
            >
              <LocationMetricsCard location={location} />
            </Animated.View>
          ))}
        </View>

        {renderCharts()}
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
  locationTabs: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  tabsContent: {
    paddingHorizontal: 15,
  },
  locationTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#e5e7eb',
  },
  selectedLocationTab: {
    backgroundColor: '#0d9488',
  },
  locationTabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4b5563',
  },
  selectedLocationTabText: {
    color: 'white',
  },
  metricsContainer: {
    padding: 15,
  },
  chartsSection: {
    padding: 20,
    paddingTop: 0,
  },
  chartTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 20,
  },
  chartSubtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 10,
    marginTop: 20,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
    paddingRight: 20,
  },
});