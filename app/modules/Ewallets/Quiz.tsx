import { useUser } from '@/app/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Question {
  question_id: number;
  module_id: number;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export default function Quiz() {
  const router = useRouter();
  const { userData } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrls = [
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://192.168.100.8:8000',
        'http://10.0.2.2:8000'
      ];

      let lastError = null;
      for (const baseUrl of baseUrls) {
        try {
          console.log(`[Quiz] Attempting to connect to ${baseUrl}/api/user/ModuleQuestions/2`);
          const response = await axios.get<{ success: boolean; data: Question[] }>(`${baseUrl}/api/user/ModuleQuestions/2`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          });

          console.log('[Quiz] Response received:', {
            status: response.status,
            data: response.data,
            success: response.data?.success,
            isArray: Array.isArray(response.data?.data)
          });

          if (response.data && response.data.success && response.data.data) {
            console.log('[Quiz] Questions loaded successfully from:', baseUrl);
            setQuestions(response.data.data);
            return;
          } else {
            console.log('[Quiz] Invalid response format:', {
              success: response.data?.success,
              hasData: !!response.data?.data,
              isArray: Array.isArray(response.data?.data)
            });
            lastError = 'Invalid response format from server';
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log(`[Quiz] Failed to connect to ${baseUrl}:`, {
              code: error.code,
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
          } else {
            console.log(`[Quiz] Failed to connect to ${baseUrl}:`, error);
          }
          lastError = error;
          continue;
        }
      }

      throw lastError;
    } catch (error) {
      console.error('[Quiz] Error fetching questions:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading questions...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchQuestions}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (showResults) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Results</Text>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>Your Score: {score} out of {questions.length}</Text>
          <Text style={styles.percentageText}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToVideosButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToVideosText}>Back to Videos</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.noQuestionsContainer}>
          <Text style={styles.noQuestionsText}>No questions available.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchQuestions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ewallets Quiz</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.quizList}>
          {questions.map((question, idx) => (
            <View key={question.question_id} style={styles.quizBox}>
              <Text style={styles.quizTitle}>Question {idx + 1}</Text>
              <Text style={styles.quizDescription}>{question.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    marginTop: 70,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 16,
  },
  backToVideosButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  backToVideosText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuestionsText: {
    color: '#fff',
    marginBottom: 20, 
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  quizList: {
    gap: 16,
    marginTop: 8,
  },
  quizBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quizTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
});