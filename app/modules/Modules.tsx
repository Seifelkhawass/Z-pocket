import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

type Module = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
};

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  route: string;
};

type ModuleRoute = 
  | '/modules/Crypto/video'
  | '/modules/Crypto/Quiz'
  | '/modules/E Wallets/video'
  | '/modules/E Wallets/Quiz'
  | '/modules/Investment/video'
  | '/modules/Investment/Quiz'
  | '/modules/Money earning/video'
  | '/modules/Money earning/Quiz';
type MenuRoute = '/modules/User/UserProfile' | '/modules/Achievements/AchievementsList' | 'logout';

export default function Modules() {
  const router = useRouter();
  const navigation = useNavigation();
  const { userData, clearUserData } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    try {
      // Only disable gesture navigation
      navigation.setOptions({
        gestureEnabled: false,
        headerBackVisible: false
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Navigation setup error:', error);
      setIsLoading(false);
    }
  }, [navigation]);

  // Add navigation listener to prevent going back to auth
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent going back to auth screens
      if (e.data.action.source === 'back' && e.target?.startsWith('/(auth)')) {
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const menuItems: MenuItem[] = [
    {
      id: 'user',
      title: 'User Profile',
      icon: 'person',
      route: '/modules/User/UserProfile'
    },
    {
      id: 'achievements',
      title: 'Achievements',
      icon: 'trophy',
      route: '/modules/Achievements/AchievementsList'
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out',
      route: 'logout'
    }
  ];

  const modules: Module[] = [
    {
      id: 'crypto',
      name: 'Crypto',
      description: 'Learn the fundamentals of cryptocurrency and how it works',
      icon: 'logo-bitcoin',
      color: '#F59E0B',
      route: '/modules/Crypto/video'
    },
    {
      id: 'wallets',
      name: 'E Wallets',
      description: 'Learn about different types of crypto wallets and how to use them securely.',
      icon: 'wallet-outline',
      color: '#4B0082',
      route: '/modules/E Wallets/video'
    },
    {
      id: 'investment',
      name: 'Investment',
      description: 'Learn about investment strategies and portfolio management',
      icon: 'trending-up',
      color: '#3B82F6',
      route: '/modules/Investment/video'
    },
    {
      id: 'earn',
      name: 'Money Earning',
      description: 'Discover ways to earn passive income through crypto',
      icon: 'cash',
      color: '#EC4899',
      route: '/modules/Money earning/video'
    }
  ];

  const handleModulePress = (route: ModuleRoute) => {
    try {
      if (!userData) {
        router.replace('/(auth)/login');
        return;
      }
      router.push(route as any);
    } catch (error) {
      console.error('Module navigation error:', error);
    }
  };

  const handleMenuPress = async (route: MenuRoute) => {
    try {
      setIsMenuOpen(false);
      if (route === 'logout') {
        // First navigate to login screen
        router.replace('/(auth)/login');
        // Then clear user data after navigation
        setTimeout(() => {
          clearUserData();
        }, 100);
        return;
      }
      if (!userData) {
        router.replace('/(auth)/login');
        return;
      }
      router.push(route);
    } catch (error) {
      console.error('Menu navigation error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#4B0082', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#4B0082' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'ios' ? 0 : 20,
            height: 60
          }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: '#fff' 
            }}>
              Modules
            </Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {isMenuOpen && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80%',
              height: windowHeight,
              backgroundColor: 'rgba(79, 70, 229, 0.95)',
              zIndex: 50,
              borderRightWidth: 1,
              borderRightColor: 'rgba(255, 255, 255, 0.2)',
              paddingTop: Platform.OS === 'ios' ? 60 : 80
            }}>
              <View style={{ padding: 20 }}>
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 20
                }}>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: '#fff' 
                  }}>
                    Menu
                  </Text>
                  <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleMenuPress(item.route as MenuRoute)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      marginBottom: 12
                    }}
                  >
                    <Ionicons name={item.icon as any} size={24} color="#fff" style={{ marginRight: 12 }} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              paddingHorizontal: 20,
              paddingBottom: Platform.OS === 'ios' ? 40 : 20,
              paddingTop: 10
            }}
            showsVerticalScrollIndicator={false}
          >
            {modules.map((module) => (
              <TouchableOpacity
                key={module.id}
                onPress={() => handleModulePress(module.route as ModuleRoute)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16
                }}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center'
                }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: module.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12
                    }}
                  >
                    <Ionicons name={module.icon as any} size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: '#fff', 
                      fontSize: 20, 
                      fontWeight: 'bold',
                      marginBottom: 4
                    }}>
                      {module.name}
                    </Text>
                    <Text style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: 14 
                    }}>
                      {module.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
} 