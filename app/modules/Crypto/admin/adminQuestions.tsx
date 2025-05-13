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
import { useUser } from '../../../context/UserContext';

interface Question {
  question_id: number;
  module_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Question[];
}

export default function AdminQuestions() {
  const router = useRouter();
  const { userData } = useUser();
  const [module1Questions, setModule1Questions] = useState<Question[]>([]);
  const [module2Questions, setModule2Questions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchQuestions = async (moduleId: number) => {
    try {
      const baseUrl = 'http://127.0.0.1:8000';
      console.log(`Fetching questions for module ${moduleId}...`);
      
      const response = await axios.get<ApiResponse>(`${baseUrl}/api/admins/questions/${moduleId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log(`API Response for module ${moduleId}:`, response.data);

      if (response.data && response.data.success) {
        if (response.data.data && response.data.data.length > 0) {
          console.log(`Questions found for module ${moduleId}:`, response.data.data.length);
          return response.data.data;
        } else {
          console.log(`No questions in response data for module ${moduleId}`);
          return [];
        }
      } else {
        console.log(`API response not successful for module ${moduleId}:`, response.data);
        throw new Error(response.data?.message || 'Failed to fetch questions from the server.');
      }
    } catch (error) {
      console.error(`Error fetching questions for module ${moduleId}:`, error);
      throw error;
    }
  };

  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch questions for both modules in parallel
      const [module1Data, module2Data] = await Promise.all([
        fetchQuestions(1),
        fetchQuestions(2)
      ]);

      setModule1Questions(module1Data);
      setModule2Questions(module2Data);
      setError(null);
    } catch (error) {
      console.error('Error fetching all questions:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          setError('Cannot connect to server. Please check:\n\n' +
            '1. Laravel server is running (php artisan serve --host=0.0.0.0)\n' +
            '2. Try accessing http://127.0.0.1:8000 in your browser\n' +
            '3. Make sure your device is on the same network\n' +
            '4. Check if your firewall allows port 8000\n\n' +
            'Error: ' + error.message
          );
        } else if (error.response?.status === 405) {
          setError('Server endpoint not configured correctly. Please check the API endpoint.');
        } else if (error.response?.status === 404) {
          setError('Module not found. Please check if the module ID is correct.');
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToVideos = () => {
    router.push('/modules/Crypto/videos');
  };

  const renderQuestions = (questions: Question[], moduleId: number) => (
    <View style={styles.moduleContainer}>
      <Text style={styles.moduleTitle}>Module {moduleId} Questions</Text>
      {questions.map((question, index) => (
        <View key={question.question_id} style={styles.questionBox}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <Text style={styles.questionText}>{question.question_text}</Text>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, optionIndex) => (
              <View 
                key={optionIndex}
                style={[
                  styles.optionBox,
                  option === question.correct_answer && styles.correctOption
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
                {option === question.correct_answer && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

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
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchAllQuestions}
            style={{
              backgroundColor: '#10B981',
              padding: 12,
              borderRadius: 8,
              marginTop: 10
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
        <TouchableOpacity onPress={handleBackToVideos} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Module Questions</Text>
      </View>

      <ScrollView style={styles.container}>
        {renderQuestions(module1Questions, 1)}
        {renderQuestions(module2Questions, 2)}
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
    flex: 1,
  },
  moduleContainer: {
    marginBottom: 32,
  },
  moduleTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  questionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionNumber: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  optionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
}); 