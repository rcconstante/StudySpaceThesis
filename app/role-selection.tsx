import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimatedComponents } from '@/hooks/useAnimatedComponents';
import { GraduationCap, LayoutDashboard } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const { studentButtonAnim, adminButtonAnim } = useAnimatedComponents();

  const navigateToStudentDashboard = () => {
    router.replace("/(student)");
  };

  const navigateToAdminLogin = () => {
    router.replace("/(admin)/login");
  };

  return (
    <LinearGradient
      colors={['#0d9488', '#0f766e', '#0e7490']}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Study Space</Text>
        <Text style={styles.subtitle}>
          Select your role to continue
        </Text>
        
        <View style={styles.buttonsContainer}>
          <Animated.View style={[styles.buttonWrapper, { transform: [{ translateX: studentButtonAnim }] }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToStudentDashboard}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <GraduationCap size={36} color="#0d9488" />
                <Text style={styles.buttonText}>Student</Text>
                <Text style={styles.buttonSubtext}>
                  Find optimal study spaces around campus
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.buttonWrapper, { transform: [{ translateX: adminButtonAnim }] }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToAdminLogin}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <LayoutDashboard size={36} color="#0d9488" />
                <Text style={styles.buttonText}>Admin</Text>
                <Text style={styles.buttonSubtext}>
                  Manage study environments and view analytics
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
  contentContainer: {
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  buttonWrapper: {
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  buttonSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});