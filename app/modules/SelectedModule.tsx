import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Video {
  title: string;
  url: string;
  description: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Module {
  module_id: number;
  title: string;
  description: string;
  category: string;
  videos: Video[];
  questions: Question[];
}

interface SelectedModuleProps {
  module: Module;
}

export default function SelectedModule({ module }: SelectedModuleProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{module.title}</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{module.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Videos ({module.videos.length})</Text>
          {module.videos.map((video, index) => (
            <View key={index} style={styles.videoItem}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>{video.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions ({module.questions.length})</Text>
          {module.questions.map((question, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionText}>{question.question}</Text>
              <View style={styles.optionsList}>
                {question.options.map((option, optIndex) => (
                  <Text 
                    key={optIndex} 
                    style={[
                      styles.optionText,
                      optIndex === question.correctAnswer && styles.correctOption
                    ]}
                  >
                    {option}
                  </Text>
                ))}
              </View>
            </View>
          ))}
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
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 24,
  },
  videoItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  questionItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionsList: {
    gap: 8,
  },
  optionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  correctOption: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
}); 