import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, Thermometer, Volume2, Wind, Sun, Droplets } from 'lucide-react-native';
import { Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getIconByType = () => {
    switch (recommendation.type) {
      case 'temperature':
        return <Thermometer size={24} color="#ef4444" />;
      case 'noise':
        return <Volume2 size={24} color="#ef4444" />;
      case 'air':
        return <Wind size={24} color="#ef4444" />;
      case 'lighting':
        return <Sun size={24} color="#ef4444" />;
      case 'humidity':
        return <Droplets size={24} color="#ef4444" />;
      default:
        return <AlertTriangle size={24} color="#ef4444" />;
    }
  };

  const getPriorityStyle = () => {
    switch (recommendation.priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const getPriorityText = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Medium Priority';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIconByType()}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.locationName}>{recommendation.locationName}</Text>
          <View style={[styles.priorityBadge, getPriorityStyle()]}>
            <Text style={styles.priorityText}>{getPriorityText()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.issue}>{recommendation.issue}</Text>
        <Text style={styles.suggestion}>{recommendation.suggestion}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.benefitLabel}>Expected Benefits:</Text>
        <Text style={styles.benefitText}>{recommendation.expectedBenefit}</Text>
      </View>
    </View>
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
  header: {
    flexDirection: 'row',
    backgroundColor: '#fee2e2',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  locationName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  priorityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  priorityMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  priorityLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  priorityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#1e293b',
  },
  content: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  issue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 8,
  },
  suggestion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  benefitLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default RecommendationCard;