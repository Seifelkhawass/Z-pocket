import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

export default function UserProfile() {
  const router = useRouter();
  const navigation = useNavigation();
  const { userData } = useUser();

  useEffect(() => {
    // Only disable gesture navigation
    navigation.setOptions({
      gestureEnabled: false,
      headerBackVisible: false
    });
  }, [navigation]);

  const handleBackPress = () => {
    try {
      router.push('/modules/Modules');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  console.log('User data in profile:', userData);

  if (!userData) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4B0082', '#6B46C1', '#805AD5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInText}>Please log in to view your profile</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-circle" size={80} color="#fff" />
              </View>
              <Text style={styles.username}>@{userData.username}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              
              <View style={styles.card}>
                <View style={styles.cardSection}>
                  <Text style={styles.cardLabel}>Username</Text>
                  <Text style={styles.cardValue}>{userData.username}</Text>
                </View>

                <View style={styles.cardSection}>
                  <Text style={styles.cardLabel}>Email</Text>
                  <Text style={styles.cardValue}>{userData.email}</Text>
                </View>

                <View style={styles.cardSection}>
                  <Text style={styles.cardLabel}>Phone Number</Text>
                  <Text style={styles.cardValue}>{userData.phone || 'Not provided'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notLoggedInText: {
    color: '#fff',
    fontSize: 18,
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  loginButtonText: {
    color: '#4B0082',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardSection: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 50,
    padding: 10,
  },
}); 