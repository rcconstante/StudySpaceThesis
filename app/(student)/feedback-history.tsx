import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { getUserFeedback } from '@/utils/storage';
import { getStudyLocationById } from '@/utils/mockData';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Star, MapPin } from 'lucide-react-native';
import { Feedback } from '@/types';

export default function FeedbackHistoryScreen() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    setLoading(true);
    try {
      const userFeedback = await getUserFeedback();
      setFeedback(userFeedback.reverse()); // Show most recent first
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            color="#f59e0b" 
            fill={star <= rating ? "#f59e0b" : "transparent"} 
          />
        ))}
      </View>
    );
  };

  const renderFeedbackItem = ({ item }: { item: Feedback }) => {
    const location = getStudyLocationById(item.locationId);
    const locationName = location ? location.name : 'Unknown Location';
    
    const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <Animated.View entering={FadeIn.duration(400)}>
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <View style={styles.locationInfo}>
              <MapPin size={16} color="#0d9488" />
              <Text style={styles.locationName}>{locationName}</Text>
            </View>
            <Text style={styles.feedbackDate}>{formattedDate}</Text>
          </View>

          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>

          {item.comment && (
            <Text style={styles.feedbackComment}>{item.comment}</Text>
          )}

          <View style={styles.studentInfoContainer}>
            <Text style={styles.studentInfo}>
              Submitted as: {item.studentName} ({item.studentId})
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Feedback</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadFeedbackData}
          >
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0d9488" />
          </View>
        ) : feedback.length > 0 ? (
          <FlatList
            data={feedback}
            renderItem={renderFeedbackItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't provided any feedback yet.</Text>
            <Text style={styles.emptySubtext}>
              Visit study locations and share your experience to help improve campus study spaces.
            </Text>
          </View>
        )}
      </View>
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
    backgroundColor: '#f9fafb',
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
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0d9488',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    paddingTop: 5,
    paddingBottom: 30,
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 6,
  },
  feedbackDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
  },
  feedbackComment: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 22,
  },
  studentInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  studentInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});