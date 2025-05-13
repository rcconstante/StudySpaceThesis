import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AlertTriangle, Thermometer, Volume2, Wind, Sun, Droplets, CheckCircle, XCircle, Clock, DollarSign, Info } from 'lucide-react-native';
import { RecommendationItem } from '@/utils/mlPredictions';

interface MLRecommendationCardProps {
  recommendation: RecommendationItem;
  onImplement?: (recommendation: RecommendationItem) => void;
  onDismiss?: (recommendation: RecommendationItem) => void;
}

const MLRecommendationCard: React.FC<MLRecommendationCardProps> = ({ 
  recommendation,
  onImplement,
  onDismiss
}) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<'pending' | 'implementing' | 'dismissed'>('pending');

  const getIconByType = () => {
    switch (recommendation.factor.toLowerCase()) {
      case 'temperature':
        return <Thermometer size={24} color="#ef4444" />;
      case 'noise level':
        return <Volume2 size={24} color="#ef4444" />;
      case 'air quality':
        return <Wind size={24} color="#ef4444" />;
      case 'light intensity':
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

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
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

  const handleImplement = () => {
    Alert.alert(
      "Implement Recommendation",
      "Do you want to implement this recommendation and create a maintenance task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Implement",
          onPress: () => {
            setStatus('implementing');
            if (onImplement) {
              onImplement(recommendation);
            }
          }
        }
      ]
    );
  };

  const handleDismiss = () => {
    Alert.alert(
      "Dismiss Recommendation",
      "Are you sure you want to dismiss this recommendation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Dismiss",
          style: "destructive",
          onPress: () => {
            setStatus('dismissed');
            if (onDismiss) {
              onDismiss(recommendation);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.card, status === 'dismissed' && styles.dismissedCard]}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          {getIconByType()}
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{recommendation.factor}</Text>
            {recommendation.isDemoData && (
              <View style={styles.demoBadge}>
                <Info size={12} color="#6366f1" />
                <Text style={styles.demoText}>Demo</Text>
              </View>
            )}
          </View>
          <View style={[styles.priorityBadge, getPriorityStyle()]}>
            <Text style={[styles.priorityText, { color: getPriorityColor() }]}>{getPriorityText()}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.issue}>{recommendation.issue}</Text>
        {expanded && (
          <>
            <Text style={styles.recommendation}>{recommendation.recommendation}</Text>
            
            <View style={styles.benefitContainer}>
              <View style={styles.benefitIcon}>
                <CheckCircle size={16} color="#10b981" />
              </View>
              <Text style={styles.benefitText}>{recommendation.expectedImprovement}</Text>
            </View>
            
            {recommendation.estimatedCost && (
              <View style={styles.costContainer}>
                <View style={styles.costIcon}>
                  <DollarSign size={16} color="#6b7280" />
                </View>
                <Text style={styles.costText}>Estimated cost: {recommendation.estimatedCost}</Text>
              </View>
            )}

            <View style={styles.timelineContainer}>
              <View style={styles.timelineIcon}>
                <Clock size={16} color="#6b7280" />
              </View>
              <Text style={styles.timelineText}>
                {recommendation.priority === 'high' 
                  ? 'Recommended timeline: Within 1 month'
                  : recommendation.priority === 'medium'
                  ? 'Recommended timeline: Within 3 months'
                  : 'Recommended timeline: Within 6 months'
                }
              </Text>
            </View>
          </>
        )}
      </View>

      {status === 'pending' && expanded && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.implementButton}
            onPress={handleImplement}
            activeOpacity={0.8}
          >
            <CheckCircle size={16} color="white" />
            <Text style={styles.implementText}>Implement</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.8}
          >
            <XCircle size={16} color="#ef4444" />
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'implementing' && (
        <View style={styles.statusBanner}>
          <CheckCircle size={16} color="#10b981" />
          <Text style={styles.statusText}>Being implemented</Text>
        </View>
      )}

      {status === 'dismissed' && (
        <View style={styles.statusBanner}>
          <XCircle size={16} color="#ef4444" />
          <Text style={styles.statusText}>Dismissed</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  dismissedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginRight: 8,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  demoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#6366f1',
    marginLeft: 2,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  priorityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  priorityMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  priorityLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  priorityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  issue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 8,
  },
  recommendation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  benefitIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#10b981',
    flex: 1,
  },
  costContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  costIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  costText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  timelineContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  timelineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  implementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  implementText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  dismissText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 8,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f1f5f9',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
});

export default MLRecommendationCard; 