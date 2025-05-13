import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModuleDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // The module is passed as a JSON string in params
  const module = params.module ? JSON.parse(params.module as string) : null;

  if (!module) {
    return (
      <View style={styles.centered}><Text>Module not found.</Text></View>
    );
  }

  return (
    <LinearGradient colors={['#4B0082', '#6B46C1', '#805AD5']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.description}>{module.description}</Text>
        <Text style={styles.sectionTitle}>Videos</Text>
        {module.videos && module.videos.length > 0 ? (
          module.videos.map((video: any, idx: number) => (
            <BlurView key={idx} intensity={20} style={styles.videoCard}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDesc}>{video.description}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(video.url)}>
                <Text style={styles.videoLink}>Watch Video</Text>
              </TouchableOpacity>
            </BlurView>
          ))
        ) : (
          <Text style={styles.noVideos}>No videos available.</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  description: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  videoCard: { marginBottom: 15, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  videoTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  videoDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  videoLink: { color: '#6B46C1', fontWeight: 'bold', fontSize: 16 },
  noVideos: { color: '#fff', fontStyle: 'italic' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 