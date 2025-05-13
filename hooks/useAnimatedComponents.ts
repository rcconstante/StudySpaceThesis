import { useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useAnimatedComponents = () => {
  const studentButtonAnim = new Animated.Value(-200);
  const adminButtonAnim = new Animated.Value(200);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(studentButtonAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(adminButtonAnim, {
        toValue: 0,
        duration: 500,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      // Clean up animations
      studentButtonAnim.setValue(-200);
      adminButtonAnim.setValue(200);
    };
  }, []);

  return {
    studentButtonAnim,
    adminButtonAnim,
  };
};