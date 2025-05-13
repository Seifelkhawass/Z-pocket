import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../context/UserContext';

// Predefined crypto videos
const cryptoVideos = [
  {
    title: "What is Cryptocurrency?",
    url: "https://youtu.be/1YyAzVmP9xQ"
  },
  {
    title: "How Bitcoin Works",
    url: "https://youtu.be/41JCpzvnn_0"
  },
  {
    title: "Blockchain Technology Explained",
    url: "https://youtu.be/SSo_EIwHSd4"
  },
  {
    title: "Cryptocurrency Trading Basics",
    url: "https://youtu.be/8NgVGnX4KOw"
  }
];

export default function CreateVideo() {
  const router = useRouter();
  const { moduleId } = useLocalSearchParams();
  const { userData } = useUser();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [existingVideos, setExistingVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Redirect to login if not authenticated
  if (!userData) {
    router.replace('/(auth)/login');
    return null;
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const createVideo = async (title: string, url: string) => {
    try {
      const embedUrl = getYouTubeEmbedUrl(url);
      const response = await axios.post(`http://127.0.0.1:8000/api/admins/createVideo/${moduleId}`, {
        title: title.trim(),
        embed_code: embedUrl,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 201) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating video:', error);
      return false;
    }
  };

  const handleCreateAllVideos = async () => {
    setLoading(true);
    setProgress(0);

    for (let i = 0; i < cryptoVideos.length; i++) {
      const video = cryptoVideos[i];
      const success = await createVideo(video.title, video.url);
      
      if (success) {
        setProgress(((i + 1) / cryptoVideos.length) * 100);
      } else {
        Alert.alert('Error', `Failed to create video: ${video.title}`);
        setLoading(false);
        return;
      }
    }

    Alert.alert('Success', 'All videos created successfully', [
      {
        text: 'OK',
        onPress: () => {
          router.back();
        }
      }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/admins/showVideo/${moduleId}`);
        if (response.data && response.data.success && response.data.data) {
          setExistingVideos(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, [moduleId]);

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 64, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ position: 'absolute', left: 20, zIndex: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 }}>
          Create Crypto Videos
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1, marginTop: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Existing Crypto Videos
          </Text>
          {loadingVideos ? (
            <ActivityIndicator color="#fff" />
          ) : existingVideos.length === 0 ? (
            <Text style={{ color: '#fff' }}>No videos found for this module.</Text>
          ) : (
            existingVideos.map((video: any, idx: number) => (
              <View key={video.id || idx} style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: 12,
                borderRadius: 8,
                marginBottom: 10
              }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{video.title}</Text>
                <Text style={{ color: '#fff', fontSize: 12 }}>{video.embed_code}</Text>
              </View>
            ))
          )}
        </View>
        <Animated.View
          entering={FadeInDown.duration(1000)}
          style={{ padding: 20 }}
        >
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
            Create educational videos for the Crypto module
          </Text>

          <View style={{ gap: 16 }}>
            {cryptoVideos.map((video, index) => (
              <View 
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                  {video.title}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                  {video.url}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleCreateAllVideos}
              disabled={loading}
              style={{
                backgroundColor: '#10B981',
                padding: 16,
                borderRadius: 12,
                marginTop: 20,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <View style={{ alignItems: 'center' }}>
                  <ActivityIndicator color="#fff" />
                  <Text style={{ color: '#fff', marginTop: 8 }}>
                    Creating videos... {Math.round(progress)}%
                  </Text>
                </View>
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  Create All Videos
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
} 