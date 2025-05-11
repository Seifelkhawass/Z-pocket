import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import { useUser } from '../../context/UserContext';

export default function MoneyEarningVideo() {
  const router = useRouter();
  const { userData } = useUser();
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showQuizButton, setShowQuizButton] = useState(false);

  // Redirect to login if not authenticated
  if (!userData) {
    router.replace('/(auth)/login');
    return null;
  }

  useEffect(() => {
    loadWatchedVideos();
  }, [userData?.username]); // Reload when user changes

  useEffect(() => {
    // Show quiz button when all videos are watched
    if (watchedVideos.size === videos.length) {
      setShowQuizButton(true);
    }
  }, [watchedVideos]);

  const loadWatchedVideos = async () => {
    try {
      const key = `watchedVideos_Money_Earning_${userData?.username}`;
      const savedVideos = await AsyncStorage.getItem(key);
      if (savedVideos) {
        setWatchedVideos(new Set(JSON.parse(savedVideos)));
      } else {
        // Initialize empty set for new users
        setWatchedVideos(new Set());
      }
    } catch (error) {
      console.error('Error loading watched videos:', error);
    }
  };

  const markVideoAsWatched = async (videoId: string) => {
    try {
      const newWatchedVideos = new Set(watchedVideos);
      newWatchedVideos.add(videoId);
      setWatchedVideos(newWatchedVideos);
      
      const key = `watchedVideos_Money_Earning_${userData?.username}`;
      await AsyncStorage.setItem(key, JSON.stringify([...newWatchedVideos]));
    } catch (error) {
      console.error('Error saving watched video:', error);
    }
  };

  const videos = [
    {
      id: 'money_earning_1',
      title: 'Crypto Mining Basics',
      duration: '14:00',
      url: 'https://www.youtube.com/watch?v=example1',
    },
    {
      id: 'money_earning_2',
      title: 'Staking and Yield Farming',
      duration: '16:00',
      url: 'https://www.youtube.com/watch?v=example2',
    },
    {
      id: 'money_earning_3',
      title: 'Trading Strategies for Profit',
      duration: '20:00',
      url: 'https://www.youtube.com/watch?v=example3',
    },
  ];

  const handleVideoPress = (video: typeof videos[0]) => {
    setSelectedVideo(video.url);
  };

  const handleVideoEnd = () => {
    if (selectedVideo) {
      const videoId = videos.find(v => v.url === selectedVideo)?.id;
      if (videoId) {
        markVideoAsWatched(videoId);
      }
    }
  };

  const handleBackToModules = () => {
    router.push('/modules/Modules');
  };

  const handleStartQuiz = () => {
    router.push('/modules/Money earning/Quiz');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&rel=0`;
  };

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 64, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={handleBackToModules}
          style={{ position: 'absolute', left: 20, zIndex: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 }}>
          Money Earning Videos
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1, marginTop: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.duration(1000)}
          style={{ padding: 20 }}
        >
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
            Watch these videos to learn about different ways to earn money in crypto. Mark them as watched when you're done.
          </Text>

          <View style={{ gap: 16 }}>
            {videos.map((video, index) => (
              <Animated.View
                key={video.id}
                entering={FadeInDown.delay(index * 100)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: 16
                }}
              >
                <TouchableOpacity
                  onPress={() => handleVideoPress(video)}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
                      {video.title}
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Duration: {video.duration}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {!watchedVideos.has(video.id) && (
                      <TouchableOpacity
                        onPress={() => markVideoAsWatched(video.id)}
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          padding: 8,
                          borderRadius: 8
                        }}
                      >
                        <Text style={{ color: '#10B981', fontSize: 12 }}>Mark as Watched</Text>
                      </TouchableOpacity>
                    )}
                    {watchedVideos.has(video.id) && (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {showQuizButton && (
            <Animated.View
              entering={FadeInDown.delay(300)}
              style={{ marginTop: 32 }}
            >
              <TouchableOpacity
                onPress={handleStartQuiz}
                style={{
                  backgroundColor: '#10B981',
                  padding: 16,
                  borderRadius: 12
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  Proceed to Quiz
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <Modal
        visible={!!selectedVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedVideo(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '100%', height: '33%', backgroundColor: '#000' }}>
            {selectedVideo && (
              <WebView
                source={{ uri: getYouTubeEmbedUrl(selectedVideo) }}
                style={{ flex: 1 }}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('WebView error: ', nativeEvent);
                }}
                onNavigationStateChange={(navState) => {
                  if (navState.url.includes('about:blank')) {
                    handleVideoEnd();
                    setSelectedVideo(null);
                  }
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 8,
              borderRadius: 20
            }}
            onPress={() => setSelectedVideo(null)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
} 