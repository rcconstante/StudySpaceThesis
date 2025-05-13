import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Lock, User } from 'lucide-react-native';
import Animated, { FadeIn, useSharedValue, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const shakeAnimation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    };
  });
  
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      shakeForm();
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Mock authentication - in a real app, this would call an API
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes, accept any non-empty credentials
      if (username && password) {
        router.replace('/(admin)/dashboard');
      } else {
        setError('Invalid credentials');
        shakeForm();
      }
    }, 1500);
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
  
  const handleBackPress = () => {
    router.replace("/role-selection");
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#0d9488', '#0f766e', '#0e7490']}
        style={styles.background}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            
            <Animated.View 
              entering={FadeIn.delay(200).duration(500)}
              style={styles.headerContainer}
            >
              <Text style={styles.title}>Admin Login</Text>
              <Text style={styles.subtitle}>
                Enter your credentials to access the admin dashboard
              </Text>
            </Animated.View>
            
            <Animated.View 
              entering={FadeIn.delay(400).duration(500)}
              style={[styles.formContainer, animatedStyle]}
            >
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <User size={20} color="#0d9488" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#94a3b8"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Lock size={20} color="#0d9488" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
              
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>
              
              <Text style={styles.demoNote}>
                For demo purposes, enter any non-empty username and password
              </Text>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginHorizontal: 30,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginBottom: 16,
    height: 55,
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#0d9488',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  demoNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
  },
});