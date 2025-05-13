import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react-native';
import { OptimalPrediction, RecommendationItem } from '@/utils/mlPredictions';

interface MLPredictionCardProps {
  prediction: OptimalPrediction;
  recommendations: RecommendationItem[];
  expanded?: boolean;
  onToggleExpand?: () => void;
  dataSource?: 'trained-model' | 'demo' | 'no-data';
  locationName?: string;
}

const MLPredictionCard: React.FC<MLPredictionCardProps> = ({
  prediction,
  recommendations,
  expanded = false,
  onToggleExpand,
  dataSource = 'trained-model',
  locationName = ''
}) => {
  // Don't render anything for locations with no data
  if (dataSource === 'no-data') {
    return null;
  }

  // Get status color based on optimal score
  const getStatusColor = () => {
    if (prediction.optimalScore >= 80) return styles.optimal;
    if (prediction.optimalScore >= 60) return styles.moderate;
    return styles.notOptimal;
  };

  // Get status text based on optimal score
  const getStatusText = () => {
    if (prediction.optimalScore >= 80) return 'Optimal';
    if (prediction.optimalScore >= 60) return 'Moderate';
    return 'Not Optimal';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>AI Study Space Analysis</Text>
          {dataSource === 'demo' && (
            <View style={styles.demoBadge}>
              <Info size={12} color="#6366f1" />
              <Text style={styles.demoText}>Demo Data</Text>
            </View>
          )}
          {expanded ? (
            <ChevronUp size={20} color="#64748b" />
          ) : (
            <ChevronDown size={20} color="#64748b" />
          )}
        </View>

        <View style={styles.scoreContainer}>
          <View style={[styles.scoreBadge, getStatusColor()]}>
            <Text style={styles.scoreText}>{Math.round(prediction.optimalScore)}</Text>
          </View>
          <View>
            <Text style={styles.scoreLabel}>Optimal Score</Text>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.infoMessage}>
              This is an AI-generated score based on environmental factors of this study space including temperature, humidity, noise level, lighting, and air quality.
              {dataSource === 'demo' && '\n\nNote: This analysis is based on simulated data for demonstration purposes.'}
            </Text>
            
            <View style={styles.scoreExplanation}>
              <CheckCircle size={20} color="#10b981" />
              <Text style={styles.explanationText}>
                {prediction.optimalScore >= 80 
                  ? 'This space currently offers optimal conditions for studying.'
                  : prediction.optimalScore >= 60
                  ? 'This space currently offers moderate conditions for studying.'
                  : 'This space currently offers less than optimal conditions for studying.'
                }
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  demoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#6366f1',
    marginLeft: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
  },
  scoreLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#334155',
  },
  optimal: {
    backgroundColor: '#10b981',
  },
  moderate: {
    backgroundColor: '#f59e0b',
  },
  notOptimal: {
    backgroundColor: '#ef4444',
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  section: {
    marginBottom: 16,
  },
  infoMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  scoreExplanation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  explanationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#10b981',
    marginLeft: 8,
    flex: 1,
  }
});

export default MLPredictionCard; 