import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RefreshCw, Brain, AlertCircle, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MLRecommendationCard from '@/components/admin/MLRecommendationCard';
import { 
  loadHistoricalData, 
  predictOptimalConditions, 
  generateRecommendations,
  EnvironmentData,
  RecommendationItem
} from '@/utils/mlPredictions';
import { getRecommendations } from '@/utils/mockData';

// Mock study spaces for all locations
const studySpaces = [
  { id: '1', name: 'Library', dataSource: 'no-data' },
  { id: '2', name: 'Ayuntamiento de Gonzalez Building', dataSource: 'no-data' },
  { id: '3', name: 'KUBO Huts', dataSource: 'demo' },
  { id: '4', name: 'ICT Open Lab Space', dataSource: 'no-data' },
  { id: '5', name: 'COS Classrooms', dataSource: 'demo' },
];

export default function MLRecommendationsScreen() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load mock recommendations from mockData.ts
      const mockRecommendations = getRecommendations();
      
      // Convert the mock recommendations to RecommendationItem format
      const formattedRecommendations: RecommendationItem[] = mockRecommendations.map(rec => ({
        factor: rec.type.charAt(0).toUpperCase() + rec.type.slice(1),
        issue: rec.issue,
        recommendation: rec.suggestion,
        expectedImprovement: rec.expectedBenefit,
        priority: rec.priority as 'high' | 'medium' | 'low',
        locationId: rec.locationId,
        locationName: rec.locationName,
        isDemoData: ['3', '5'].includes(rec.locationId) // Mark KUBO and COS Classrooms as demo data
      }));
      
      // Sort recommendations by priority (high to low)
      formattedRecommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      
      setRecommendations(formattedRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      Alert.alert('Error', 'Failed to load ML recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleImplementRecommendation = (recommendation: RecommendationItem) => {
    // In a real app, this would create a maintenance task
    console.log('Implementing recommendation:', recommendation);
  };

  const handleDismissRecommendation = (recommendation: RecommendationItem) => {
    // In a real app, this would mark the recommendation as dismissed in the database
    console.log('Dismissing recommendation:', recommendation);
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
          <Text style={styles.title}>AI Recommendations</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} activeOpacity={0.7}>
            <RefreshCw size={16} color="#0d9488" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prototypeContainer}>
          <Info size={20} color="#6366f1" />
          <Text style={styles.prototypeText}>
            This is a prototype view. ML functionality is not implemented yet.
          </Text>
        </View>

        <View style={styles.aiHeaderContainer}>
          <View style={styles.aiIconContainer}>
            <Brain size={24} color="#0d9488" />
          </View>
          <Text style={styles.description}>
            Our AI has analyzed environmental data from study spaces and generated the following 
            recommendations to improve study conditions:
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </View>
        ) : recommendations.length > 0 ? (
          <View style={styles.recommendationsContainer}>
            {/* Group recommendations by location */}
            {studySpaces.map((space) => {
              // For locations with no data, show a special message
              if (space.dataSource === 'no-data') {
                return (
                  <View key={space.id} style={styles.locationGroup}>
                    <Text style={styles.locationTitle}>{space.name}</Text>
                    <View style={styles.noDataContainer}>
                      <AlertCircle size={20} color="#9ca3af" />
                      <Text style={styles.noDataText}>No data available</Text>
                    </View>
                  </View>
                );
              }
              
              const spaceRecommendations = recommendations.filter(
                rec => rec.locationId === space.id
              );
              
              if (spaceRecommendations.length === 0) {
                return null;
              }
              
              return (
                <View key={space.id} style={styles.locationGroup}>
                  <View style={styles.locationHeader}>
                    <Text style={styles.locationTitle}>{space.name}</Text>
                    {space.dataSource === 'demo' && (
                      <View style={styles.demoBadge}>
                        <Text style={styles.demoText}>Demo Data</Text>
                      </View>
                    )}
                  </View>
                  
                  {spaceRecommendations.map((recommendation, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInDown.delay(200 + index * 100).duration(400)}
                    >
                      <MLRecommendationCard 
                        recommendation={recommendation}
                        onImplement={handleImplementRecommendation}
                        onDismiss={handleDismissRecommendation}
                      />
                    </Animated.View>
                  ))}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <AlertCircle size={40} color="#9ca3af" />
            <Text style={styles.emptyText}>No recommendations found</Text>
            <Text style={styles.emptySubtext}>
              All study spaces are currently optimal or there is insufficient data for analysis
            </Text>
          </View>
        )}
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
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    margin: 20,
    marginBottom: 10,
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
  aiHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  aiIconContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#0d9488',
    flex: 1,
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 50,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6b7280',
  },
  recommendationsContainer: {
    padding: 15,
  },
  locationGroup: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#0d9488',
    paddingHorizontal: 4,
  },
  demoBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  demoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6366f1',
  },
  noDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  noDataText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#4b5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
}); 