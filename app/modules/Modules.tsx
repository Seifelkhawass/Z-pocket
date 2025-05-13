import { useUser } from '@/app/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const API_BASE_URL = Platform.select({
  web: 'http://127.0.0.1:8000',
  default: 'http://192.168.100.8:8000' // This is your computer's IP address
});

interface Module {
  module_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ModuleScore {
  module_id: number;
  module_name: string;
  score: number;
  total_questions: number;
}

interface ModuleData {
  success: boolean;
  data: Module[];
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role?: string;
  token?: string;
}

export default function Modules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [moduleScores, setModuleScores] = useState<ModuleScore[]>([]);
  const router = useRouter();
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    email: userData?.email || '',
    username: userData?.username || ''
  });
  const [showProfile, setShowProfile] = useState(false);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/api/admin/getModules`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        timeout: 5000
      });

      if (response.data && response.data.success && response.data.data) {
        const sortedModules = response.data.data.sort((a: Module, b: Module) => a.module_id - b.module_id);
        setModules(sortedModules);
      } else {
        setError('No modules data received');
      }
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('Request timed out. Please check your internet connection and try again.');
        } else if (error.code === 'ECONNREFUSED') {
          setError('Server is not running. Please start your Laravel server with "php artisan serve" and try again.');
        } else if (error.response) {
          setError(`Server error (${error.response.status}): ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError('Server is not responding. Please check if your Laravel server is running and try again.');
        } else {
          setError('Error setting up request: ' + error.message);
        }
      } else {
        setError('An unexpected error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleScores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/scores`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.success) {
        setModuleScores(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching module scores:', error);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchModuleScores();
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleModulePress = (moduleId: number) => {
    console.log('Clicked moduleId:', moduleId);
    switch (moduleId) {
      case 9: // Crypto
        router.push('/modules/Crypto/videos');
        break;
      case 10: // Ewallets
        router.push('/modules/Ewallets/videos');
        break;
      case 11: // Investment
        router.push('/modules/Investment/videos');
        break;
      case 12: // Money earning
        router.push('/modules/Money earning/videos');
        break;
      default:
        router.push(`/modules/${moduleId}/videos` as any);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserProfile({
      email: userData?.email || '',
      username: userData?.username || ''
    });
  };

  const handleProfilePress = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>Loading modules...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchModules}
            style={{
              backgroundColor: '#EF4444',
              padding: 12,
              borderRadius: 8,
              minWidth: 100,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Modules</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.moduleList}>
          {modules && Array.isArray(modules) && modules.length > 0 ? (
            modules.map((module) => (
              <TouchableOpacity
                key={module.module_id}
                style={styles.moduleBox}
                onPress={() => handleModulePress(module.module_id)}
              >
                <View style={styles.moduleContent}>
                  <Text style={styles.moduleTitle}>
                    {module.name || 'Untitled Module'}
                  </Text>
                  <Text style={styles.moduleDescription} numberOfLines={2}>
                    {module.description || 'No description available'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noModulesContainer}>
              <Text style={styles.noModulesText}>No modules available</Text>
              <Text style={[styles.noModulesText, { fontSize: 14, marginTop: 10 }]}>
                Please create some modules first
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sidebar */}
      {isSidebarOpen && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: width * 0.8,
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 20,
          padding: 20,
          paddingTop: 60
        }}>
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Ionicons name="person-circle" size={80} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
              {userData?.username || 'User'}
            </Text>
          </View>

          <View style={{ gap: 20 }}>
            {/* Achievements Section */}
            <View style={styles.achievementsSection}>
              <Text style={styles.achievementsTitle}>Achievements</Text>
              <ScrollView style={styles.achievementsList}>
                {moduleScores.map((score) => (
                  <TouchableOpacity
                    key={score.module_id}
                    style={[styles.achievementItem, styles.clickableAchievement]}
                    onPress={() => {
                      handleModulePress(score.module_id);
                      setIsSidebarOpen(false); // Close sidebar after navigation
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.achievementContent}>
                      <Text style={styles.moduleName}>{score.module_name}</Text>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>
                          {score.score}/{score.total_questions}
                        </Text>
                        <Text style={styles.percentageText}>
                          {Math.round((score.score / score.total_questions) * 100)}%
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {userData?.role === 'admin' && (
              <>
                <TouchableOpacity
                  onPress={() => router.push('/(admin)/createVideo')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: 15,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 10
                  }}
                >
                  <Ionicons name="videocam" size={24} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    Create Video
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(admin)/CreateModule')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: 15,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 10
                  }}
                >
                  <Ionicons name="add-circle" size={24} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    Create Module
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 'auto',
                padding: 15,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 10
              }}
            >
              <Ionicons name="log-out" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 15
          }}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  moduleList: {
    gap: 16,
  },
  moduleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleContent: {
    flex: 1,
    marginRight: 12,
  },
  moduleTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  moduleDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 22,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleCategory: {
    color: '#10B981',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  moduleId: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  noModulesContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noModulesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  achievementsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  achievementsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  achievementsList: {
    maxHeight: 200,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  moduleName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  percentageText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  clickableAchievement: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 