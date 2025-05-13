import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { X, Star } from 'lucide-react-native';
import { saveFeedback } from '@/utils/storage';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { generateId } from '@/utils/helpers';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  locationId: string;
  locationName: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  locationId,
  locationName,
}) => {
  const [step, setStep] = useState(1); // 1: Authentication, 2: Feedback
  const [studentId, setStudentId] = useState('');
  const [section, setSection] = useState('');
  const [studentName, setStudentName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const shakeAnimation = useSharedValue(0);
  
  const authenticateStudent = () => {
    if (!studentId || !studentName || !section) {
      setError('Please enter Student ID, Section, and Name');
      shakeForm();
      return;
    }
    
    setError('');
    setStep(2);
  };
  
  const shakeForm = () => {
    shakeAnimation.value = withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    };
  });
  
  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      shakeForm();
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const feedback = {
        id: generateId(),
        locationId,
        studentId,
        section,
        studentName,
        rating,
        comment,
        timestamp: new Date().toISOString(),
      };
      
      await saveFeedback(feedback);
      setSuccess(true);
      
      // Reset and close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError('Failed to save feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setStep(1);
    setStudentId('');
    setSection('');
    setStudentName('');
    setRating(0);
    setComment('');
    setError('');
    setSuccess(false);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.overlay}>
            <Animated.View 
              style={[styles.modalContent, animatedStyle]}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
            >
              <View style={styles.header}>
                <Text style={styles.title}>
                  {step === 1 ? 'Student Authentication' : `Rate ${locationName}`}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              {step === 1 ? (
                // Authentication Step
                <View style={styles.formContainer}>
                  <Text style={styles.label}>Student ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 202232023"
                    placeholderTextColor="#9ca3af"
                    value={studentId}
                    onChangeText={setStudentId}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    maxLength={9}
                  />
                  
                  <Text style={styles.label}>Section</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., BCS33"
                    placeholderTextColor="#9ca3af"
                    value={section}
                    onChangeText={setSection}
                    autoCapitalize="characters"
                  />
                  
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Juan Dela Cruz"
                    placeholderTextColor="#9ca3af"
                    value={studentName}
                    onChangeText={setStudentName}
                  />
                  
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                  
                  <TouchableOpacity
                    style={styles.button}
                    onPress={authenticateStudent}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Feedback Step
                <View style={styles.formContainer}>
                  <Text style={styles.ratingLabel}>Rate your experience</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        style={styles.starButton}
                      >
                        <Star
                          size={32}
                          color="#f59e0b"
                          fill={star <= rating ? "#f59e0b" : "transparent"}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <Text style={styles.label}>Comments (optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share your thoughts about this study space..."
                    placeholderTextColor="#9ca3af"
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                  
                  {success ? (
                    <View style={styles.successContainer}>
                      <Text style={styles.successText}>
                        Feedback submitted successfully!
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSubmit}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.buttonText}>Submit Feedback</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  ratingLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 5,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0d9488',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  successContainer: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  successText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#16a34a',
  },
});

export default FeedbackModal;