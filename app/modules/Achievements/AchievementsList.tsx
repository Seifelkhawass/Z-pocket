import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

type ModuleIcon = 'logo-bitcoin' | 'wallet' | 'trending-up' | 'cash';

interface ModuleAchievement {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  completedDate?: string;
  icon: ModuleIcon;
  color: string;
}

export default function AchievementsList() {
  const router = useRouter();
  const { userData } = useUser();

  // Get achievements from user data
  const achievements: ModuleAchievement[] = [
    {
      id: 'crypto',
      name: 'Cryptocurrency Basics',
      score: Math.min(Math.round(userData?.achievements?.cryptoQuiz?.score || 0), 100),
      totalQuestions: 3,
      completedDate: userData?.achievements?.cryptoQuiz?.date,
      icon: 'logo-bitcoin',
      color: '#F59E0B'
    },
    {
      id: 'e-wallets',
      name: 'E Wallets',
      score: Math.min(Math.round(userData?.achievements?.walletsQuiz?.score || 0), 100),
      totalQuestions: 3,
      completedDate: userData?.achievements?.walletsQuiz?.date,
      icon: 'wallet',
      color: '#4B0082'
    },
    {
      id: 'investment',
      name: 'Investment',
      score: Math.min(Math.round(userData?.achievements?.investmentQuiz?.score || 0), 100),
      totalQuestions: 3,
      completedDate: userData?.achievements?.investmentQuiz?.date,
      icon: 'trending-up',
      color: '#3B82F6'
    },
    {
      id: 'money-earning',
      name: 'Money Earning',
      score: Math.min(Math.round(userData?.achievements?.moneyEarningQuiz?.score || 0), 100),
      totalQuestions: 3,
      completedDate: userData?.achievements?.moneyEarningQuiz?.date,
      icon: 'cash',
      color: '#EC4899'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 75) return '#3B82F6'; // Blue
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 50) return '#EC4899'; // Pink
    return '#EF4444'; // Red
  };

  const getScoreFeedback = (score: number) => {
    if (score >= 90) return "Outstanding! You've mastered this module!";
    if (score >= 75) return "Great progress! You're doing really well!";
    if (score >= 60) return "Good effort! Keep up the good work!";
    if (score >= 50) return "You've passed! Keep learning and improving!";
    return "Don't give up! Review the material and try again!";
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4B0082', '#6B46C1', '#805AD5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 2 }}
          style={styles.gradient}
        >
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInText}>Please log in to view your achievements</Text>
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 2 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/modules/Modules')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Achievements
              </Text>
            </View>

            <View style={styles.achievementsContainer}>
              {achievements.map((achievement) => {
                const scoreColor = getScoreColor(achievement.score);
                const feedback = getScoreFeedback(achievement.score);
                
                return (
                  <View 
                    key={achievement.id} 
                    style={styles.achievementCard}
                  >
                    <View 
                      style={[styles.iconContainer, { backgroundColor: achievement.color }]}
                    >
                      <Ionicons name={achievement.icon} size={24} color="#fff" />
                    </View>
                    
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementName}>
                        {achievement.name}
                      </Text>
                      <Text style={[styles.achievementScore, { color: scoreColor }]}>
                        {feedback}
                      </Text>
                    </View>

                    <View style={styles.scoreContainer}>
                      <Text style={[styles.scoreValue, { color: scoreColor }]}>
                        {achievement.score}
                      </Text>
                      <Text style={[styles.scorePercent, { color: scoreColor }]}>%</Text>
                    </View>
                  </View>
                );
              })}
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 50,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementScore: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scorePercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notLoggedInText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  loginButtonText: {
    color: '#4B0082',
    fontWeight: 'bold',
  },
}); 