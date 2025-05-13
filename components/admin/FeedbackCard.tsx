import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, MapPin, Clock } from 'lucide-react-native';
import { Feedback, StudyLocation } from '@/types';

interface FeedbackCardProps {
  feedback: Feedback;
  location?: StudyLocation;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, location }) => {
  const formattedDate = new Date(feedback.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = new Date(feedback.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#0d9488" />
          <Text style={styles.locationName}>
            {location ? location.name : 'Unknown Location'}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={14} color="#6b7280" />
          <Text style={styles.timeText}>{formattedDate}, {formattedTime}</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.ratingStars}>
          {renderStars(feedback.rating)}
          <Text style={styles.ratingValue}>{feedback.rating.toFixed(1)}</Text>
        </View>
      </View>

      {feedback.comment ? (
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>{feedback.comment}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.studentInfo}>
          Student: {feedback.studentName} ({feedback.studentId})
        </Text>
      </View>
    </View>
  );
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
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
    marginLeft: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  ratingContainer: {
    padding: 16,
    paddingBottom: feedback => feedback.comment ? 8 : 16,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
    marginLeft: 4,
  },
  commentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
  },
  footer: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  studentInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6b7280',
  },
});

export default FeedbackCard;