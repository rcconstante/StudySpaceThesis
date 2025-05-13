import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';
import { Book } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PARTICLE_COUNT = 8;

const LoadingAnimation = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    opacity.value = withTiming(1, { duration: 500 });
  }, []);
  
  const bookStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });
  
  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: interpolate(opacity.value, [0, 1], [20, 0]) }],
    };
  });
  
  const renderParticles = () => {
    return Array(PARTICLE_COUNT).fill(0).map((_, index) => {
      const angle = (index / PARTICLE_COUNT) * 2 * Math.PI;
      const delay = index * 100;
      const translateX = useSharedValue(0);
      const translateY = useSharedValue(0);
      const particleOpacity = useSharedValue(0);
      
      useEffect(() => {
        const radius = 60;
        translateX.value = withDelay(
          delay,
          withRepeat(
            withTiming(radius * Math.cos(angle), { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
          )
        );
        
        translateY.value = withDelay(
          delay,
          withRepeat(
            withTiming(radius * Math.sin(angle), { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
          )
        );
        
        particleOpacity.value = withDelay(
          delay,
          withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            true
          )
        );
      }, []);
      
      const particleStyle = useAnimatedStyle(() => {
        return {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: index % 3 === 0 ? '#14b8a6' : (index % 3 === 1 ? '#0ea5e9' : '#22d3ee'),
          position: 'absolute',
          opacity: particleOpacity.value,
          transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
          ],
        };
      });
      
      return <Animated.View key={index} style={particleStyle} />;
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        {renderParticles()}
        <Animated.View style={[styles.bookContainer, bookStyle]}>
          <Book size={60} color="white" />
        </Animated.View>
      </View>
      
      <Animated.Text entering={FadeIn.delay(500).duration(1000)} style={styles.title}>Study Space</Animated.Text>
      <Animated.Text style={[styles.subtitle, titleStyle]}>
        Optimizing Your Learning Environment
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  animationContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  bookContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(13, 148, 136, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});

export default LoadingAnimation;