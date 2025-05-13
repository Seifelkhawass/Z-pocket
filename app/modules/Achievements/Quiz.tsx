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
import { useUser } from '../../context/UserContext';

interface Answer {
  answer_id: number;
  answer_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: number;
  module_id: number;
  content: string;
  type: 'mcq' | 'true_false';
  answers: Answer[];
}

interface ApiResponse {
  success: boolean;
  module_id: number;
  count: number;
  data: Question[];
}

export default function AchievementsQuiz() {
  const router = useRouter();
  const { userData } = useUser();
  const [firstQuestions, setFirstQuestions] = useState<Question[]>([]);
  const [secondQuestions, setSecondQuestions] = useState<Question[]>([]);
  const [thirdQuestions, setThirdQuestions] = useState<Question[]>([]);
  const [fourthQuestions, setFourthQuestions] = useState<Question[]>([]);
  const [fifthQuestions, setFifthQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchQuestions = async (moduleId: number) => {
    try {
      console.log(`Fetching questions for module ${moduleId}...`);

      // Try multiple possible server URLs
      const baseUrls = [
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://192.168.100.8:8000',
        'http://10.0.2.2:8000'  // For Android emulator
      ];

      let lastError = null;
      for (const baseUrl of baseUrls) {
        try {
          console.log(`Trying to connect to ${baseUrl}...`);
          const response = await axios.get<ApiResponse>(`${baseUrl}/api/user/ModuleQuestions/${moduleId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          });

          if (response.data.success && response.data.data && response.data.data.length > 0) {
            console.log(`Questions loaded successfully for module ${moduleId}:`, response.data.data.length);
            return response.data.data;
          } else {
            console.log(`No questions in data for module ${moduleId}:`, response.data);
            lastError = 'No questions available for this module.';
          }
        } catch (error) {
          console.log(`Failed to connect to ${baseUrl}:`, error);
          lastError = error;
          continue; // Try next URL
        }
      }

      // If we get here, all URLs failed
      throw lastError;
    } catch (error) {
      console.error(`Error fetching questions for module ${moduleId}:`, error);
      throw error;
    }
  };

  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [module1Data, module6Data, module5Data, module4Data, module2Data] = await Promise.all([
        fetchQuestions(1),
        fetchQuestions(6),
        fetchQuestions(5),
        fetchQuestions(4),
        fetchQuestions(2)
      ]);

      setFirstQuestions(module1Data);
      setSecondQuestions(module6Data);
      setThirdQuestions(module5Data);
      setFourthQuestions(module4Data);
      setFifthQuestions(module2Data);
      setError(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          setError('Could not connect to the server. Please check if the server is running and try these URLs:\n' +
            '- http://127.0.0.1:8000\n' +
            '- http://localhost:8000\n' +
            '- http://192.168.100.8:8000\n' +
            '- http://10.0.2.2:8000 (for Android emulator)\n\n' +
            'Also check:\n' +
            '1. Is your backend server running?\n' +
            '2. Is the port 8000 correct?\n' +
            '3. Are you using the correct IP address?\n' +
            '4. Is there any firewall blocking the connection?');
        } else if (error.response) {
          setError(`Server error (${error.response.status}): ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError('No response received from server. Please check:\n' +
            '1. Is your backend server running?\n' +
            '2. Is the port 8000 correct?\n' +
            '3. Are you using the correct IP address?\n' +
            '4. Is there any firewall blocking the connection?');
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

  const handleBackToVideos = () => {
    router.push('/modules/Achievements/videos');
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading quiz...</Text>
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
            onPress={handleBackToVideos}
            style={{
              backgroundColor: '#EF4444',
              padding: 12,
              borderRadius: 8,
              minWidth: 100,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Go Back</Text>
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
        <Text style={styles.headerTitle}>Questions Display</Text>
        <TouchableOpacity onPress={fetchAllQuestions} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* First Display - Module 1 */}
        <View style={styles.moduleContainer}>
          {firstQuestions.length > 0 && (
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{firstQuestions[0].content}</Text>
              
              <View style={styles.optionsContainer}>
                {firstQuestions[0].answers?.slice(0, 4).map((answer, index) => (
                  <View 
                    key={answer.answer_id}
                    style={[
                      styles.optionBox,
                      answer.is_correct && styles.correctOption
                    ]}
                  >
                    <Text style={styles.optionText}>{`${String.fromCharCode(65 + index)}. ${answer.answer_text}`}</Text>
                    {answer.is_correct && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Second Display - Module 6 */}
        <View style={styles.moduleContainer}>
          {secondQuestions.length > 0 && (
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{secondQuestions[0].content}</Text>
              
              <View style={styles.optionsContainer}>
                {secondQuestions[0].answers?.slice(0, 4).map((answer, index) => (
                  <View 
                    key={answer.answer_id}
                    style={[
                      styles.optionBox,
                      answer.is_correct && styles.correctOption
                    ]}
                  >
                    <Text style={styles.optionText}>{`${String.fromCharCode(65 + index)}. ${answer.answer_text}`}</Text>
                    {answer.is_correct && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Third Display - Module 5 */}
        <View style={styles.moduleContainer}>
          {thirdQuestions.length > 0 && (
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{thirdQuestions[0].content}</Text>
              
              <View style={styles.optionsContainer}>
                {thirdQuestions[0].answers?.slice(0, 4).map((answer, index) => (
                  <View 
                    key={answer.answer_id}
                    style={[
                      styles.optionBox,
                      answer.is_correct && styles.correctOption
                    ]}
                  >
                    <Text style={styles.optionText}>{`${String.fromCharCode(65 + index)}. ${answer.answer_text}`}</Text>
                    {answer.is_correct && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Fourth Display - Module 4 */}
        <View style={styles.moduleContainer}>
          {fourthQuestions.length > 0 && (
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{fourthQuestions[0].content}</Text>
              
              <View style={styles.optionsContainer}>
                {fourthQuestions[0].answers?.slice(0, 4).map((answer, index) => (
                  <View 
                    key={answer.answer_id}
                    style={[
                      styles.optionBox,
                      answer.is_correct && styles.correctOption
                    ]}
                  >
                    <Text style={styles.optionText}>{`${String.fromCharCode(65 + index)}. ${answer.answer_text}`}</Text>
                    {answer.is_correct && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Fifth Display - Module 2 */}
        <View style={styles.moduleContainer}>
          {fifthQuestions.length > 0 && (
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{fifthQuestions[0].content}</Text>
              
              <View style={styles.optionsContainer}>
                {fifthQuestions[0].answers?.slice(0, 4).map((answer, index) => (
                  <View 
                    key={answer.answer_id}
                    style={[
                      styles.optionBox,
                      answer.is_correct && styles.correctOption
                    ]}
                  >
                    <Text style={styles.optionText}>{`${String.fromCharCode(65 + index)}. ${answer.answer_text}`}</Text>
                    {answer.is_correct && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
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
    flex: 1,
  },
  moduleContainer: {
    marginBottom: 32,
  },
  questionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  refreshButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 