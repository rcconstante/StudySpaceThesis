import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feedback } from '@/types';

const FEEDBACK_STORAGE_KEY = 'study_space_feedback';

// Save new feedback
export const saveFeedback = async (feedback: Feedback): Promise<void> => {
  try {
    // Get existing feedback
    const existingFeedback = await getAllFeedback();
    
    // Add new feedback to the list
    existingFeedback.push(feedback);
    
    // Save back to storage
    await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existingFeedback));
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

// Get all feedback
export const getAllFeedback = async (): Promise<Feedback[]> => {
  try {
    const feedbackString = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
    return feedbackString ? JSON.parse(feedbackString) : [];
  } catch (error) {
    console.error('Error getting all feedback:', error);
    return [];
  }
};

// Get feedback for a specific user (based on student ID)
export const getUserFeedback = async (): Promise<Feedback[]> => {
  try {
    // In a real app, this would filter by the logged-in student ID
    // For this demo, we'll just return all feedback since we're not implementing real auth
    return getAllFeedback();
  } catch (error) {
    console.error('Error getting user feedback:', error);
    return [];
  }
};

// Get feedback for a specific location
export const getLocationFeedback = async (locationId: string): Promise<Feedback[]> => {
  try {
    const allFeedback = await getAllFeedback();
    return allFeedback.filter(feedback => feedback.locationId === locationId);
  } catch (error) {
    console.error('Error getting location feedback:', error);
    return [];
  }
};

// Clear all feedback (for testing)
export const clearAllFeedback = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FEEDBACK_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing feedback:', error);
    throw error;
  }
};