import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import LoadingAnimation from '@/components/LoadingAnimation';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  useEffect(() => {
    // Simulate loading and navigate to role selection after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/role-selection');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0d9488', '#0f766e', '#0e7490']}
      style={styles.container}
    >
      <View style={styles.animationContainer}>
        <LoadingAnimation />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});