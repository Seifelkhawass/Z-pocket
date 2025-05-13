import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useUser } from '../../../context/UserContext';

interface CreateVideoResponse {
  success: boolean;
  message: string;
  data?: {
    video_id: number;
    module_id: number;
    embed_code: string;
    title: string;
  };
}

export default function AdminCreateVideo() {
  const router = useRouter();
  const { userData } = useUser();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const handleCreateVideo = async () => {
    if (!title.trim() || !embedCode.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const baseUrl = 'http://192.168.100.8:8000';
      
      const response = await axios.post<CreateVideoResponse>(
        `${baseUrl}/api/admins/createVideo/7`,
        {
          title: title.trim(),
          embed_code: embedCode.trim(),
          module_id: 7 // Crypto module ID
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Video created successfully', [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setEmbedCode('');
              router.push('/modules/Crypto/videos');
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create video');
      }
    } catch (error) {
      console.error('Error creating video:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to create video. Please try again.'
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToVideos = () => {
    router.push('/modules/Crypto/videos');
  };

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToVideos} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Video</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Video Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter video title"
            placeholderTextColor="#A0AEC0"
          />

          <Text style={styles.label}>Embed Code</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={embedCode}
            onChangeText={setEmbedCode}
            placeholder="Paste video embed code here"
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateVideo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Video</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 