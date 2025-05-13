import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Switch,
  Image,
  Alert,
  Modal,
  BackHandler
} from 'react-native';
import { router } from 'expo-router';
import { Bell, Moon, Info, Shield, LogOut, RefreshCw, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  
  const handleAboutPress = () => {
    Alert.alert(
      "About Study Space",
      "Version 1.0.0\n\nStudy Space is an application designed to help students find optimal study environments on campus. This app monitors and provides real-time data on noise levels, temperature, humidity, and other environmental factors that affect studying conditions.",
      [{ text: "OK" }]
    );
  };
  
  const handlePrivacyPress = () => {
    setPrivacyModalVisible(true);
  };
  
  const handleChangeMode = () => {
    Alert.alert(
      "Change Mode",
      "Are you sure you want to change user mode?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Change",
          style: "default",
          onPress: () => {
            router.replace("/role-selection");
          }
        }
      ]
    );
  };
  
  const handleExitApp = () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit the app?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Exit",
          style: "destructive",
          onPress: () => {
            BackHandler.exitApp();
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity 
                onPress={() => setPrivacyModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.policyTitle}>Study Space Privacy Policy</Text>
              <Text style={styles.policyDate}>Last Updated: June 15, 2023</Text>
              
              <Text style={styles.policySection}>1. Introduction</Text>
              <Text style={styles.policyText}>
                Welcome to Study Space. We are committed to protecting your privacy and providing a safe experience. 
                This Privacy Policy explains how we collect, use, and share information about you when you use our 
                app and related services.
              </Text>
              
              <Text style={styles.policySection}>2. Information We Collect</Text>
              <Text style={styles.policyText}>
                We collect information you provide directly, such as when you create an account, provide feedback,
                or contact customer support. This may include your name, email, and student ID.
              </Text>
              
              <Text style={styles.policySection}>3. How We Use Your Information</Text>
              <Text style={styles.policyText}>
                We use your information to provide and improve our services, communicate with you, and ensure security.
                Your feedback helps us enhance study spaces on campus.
              </Text>
              
              <Text style={styles.policySection}>4. Data Security</Text>
              <Text style={styles.policyText}>
                We implement appropriate security measures to protect your personal information from unauthorized
                access, alteration, or disclosure.
              </Text>
              
              <Text style={styles.policySection}>5. Contact Us</Text>
              <Text style={styles.policyText}>
                If you have questions about this Privacy Policy, please contact us at privacy@studyspace.edu.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Study Space</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={22} color="#0d9488" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Moon size={22} color="#0d9488" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  setDarkMode(value);
                  Alert.alert(
                    "Dark Mode",
                    "Dark mode will be available in the next update!",
                    [{ text: "OK" }]
                  );
                }}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              activeOpacity={0.7}
              onPress={handleAboutPress}
            >
              <View style={styles.settingInfo}>
                <Info size={22} color="#0d9488" />
                <Text style={styles.settingText}>About</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              activeOpacity={0.7}
              onPress={handlePrivacyPress}
            >
              <View style={styles.settingInfo}>
                <Shield size={22} color="#0d9488" />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <TouchableOpacity 
            style={styles.changeModeButton} 
            activeOpacity={0.8}
            onPress={handleChangeMode}
          >
            <RefreshCw size={20} color="#3b82f6" />
            <Text style={styles.changeModeText}>Change Mode</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <TouchableOpacity 
            style={styles.exitButton} 
            activeOpacity={0.8}
            onPress={handleExitApp}
          >
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.exitText}>Exit App</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1e293b',
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  section: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
  },
  changeModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  changeModeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3b82f6',
    marginLeft: 10,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  exitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ef4444',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: '90%',
  },
  policyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 8,
  },
  policyDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  policySection: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  policyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  }
}); 