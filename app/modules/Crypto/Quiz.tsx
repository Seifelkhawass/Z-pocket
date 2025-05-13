import { useUser } from '@/app/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  answers: Array<{
    answer_id: number;
    answer_text: string;
    is_correct: number;
  }>;
}

interface Answer {
  question_id: number;
  answer: string;
}

interface QuizResponse {
  success: boolean;
  module_id: string;
  count: number;
  data: Question[];
}

export default function Quiz() {
  const router = useRouter();
  const { userData } = useUser();
  const { moduleId } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const MODULE_ID = 9; // Crypto module ID

  const postQuestions = async (questionsToPost: any[]) => {
    try {
      const baseUrls = [
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://192.168.100.8:8000',
        'http://10.0.2.2:8000'
      ];

      for (const baseUrl of baseUrls) {
        try {
          for (const question of questionsToPost) {
            const response = await axios.post(
              `${baseUrl}/api/questions/9`,
              {
                content: question.content,
                type: question.type
              },
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                timeout: 5000,
              }
            );

            if (response.data && response.data.success) {
              console.log(`[Quiz] Question posted successfully to ${baseUrl}`);
            } else {
              console.log('[Quiz] Failed to post question:', response.data);
            }
          }
          return; // If we get here, all questions were posted successfully
        } catch (error) {
          console.log(`[Quiz] Failed to post questions to ${baseUrl}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error('[Quiz] Error posting questions:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://127.0.0.1:8000/api/admins/ModuleAnswers/9', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (data.success && Array.isArray(data.data)) {
        setQuestions(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    setLoading(true);
    setError(null);
    
    const baseUrls = [
      'http://127.0.0.1:8000',
      'http://localhost:8000',
      'http://192.168.100.8:8000',
      'http://10.0.2.2:8000',
      'http://192.168.1.100:8000',
      'http://192.168.0.100:8000'
    ];

    for (const baseUrl of baseUrls) {
      try {
        const response = await fetch(`${baseUrl}/api/admins/ModuleAnswers/${moduleId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QuizResponse = await response.json();
        if (data.success) {
          setQuestions(data.data);
          // Create an answer map from the response data
          const answerMap: { [key: number]: any } = {};
          data.data.forEach((question) => {
            answerMap[question.question_id] = {
              content: question.content,
              type: question.type,
              answers: question.answers
            };
          });
          setSelectedAnswers(answerMap);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${baseUrl}:`, err);
        continue;
      }
    }

    setError('Failed to fetch answers from all available URLs');
    setLoading(false);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    console.log('Selected answer:', { questionId, answer }); // Debug log
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    try {
      let correctCount = 0;
      
      // Calculate score
      for (const question of questions) {
        const correctAnswer = question.answers.find(a => a.is_correct === 1)?.answer_text;
        const isCorrect = selectedAnswers[question.question_id] === correctAnswer;
        
        if (isCorrect) {
          correctCount++;
        }
      }

      // Calculate percentage
      const percentage = (correctCount / questions.length) * 100;
      const passed = percentage >= 50;

      // Update UI
      setScore(correctCount);
      setShowScore(true);

      // Show appropriate alert based on pass/fail
      if (passed) {
        Alert.alert(
          "Congratulations! 🎉",
          `You passed with ${Math.round(percentage)}%!\nYou can now proceed to the next module.`,
          [
            { 
              text: "Go to Next Module",
              onPress: () => router.push('/modules/Investment/videos' as any)
            },
            {
              text: "Stay Here",
              style: "cancel"
            }
          ]
        );
      } else {
        Alert.alert(
          "Try Again",
          `Your score is ${Math.round(percentage)}%. You need at least 50% to proceed to the next module.`,
          [
            { 
              text: "Try Again",
              onPress: () => {
                setSelectedAnswers({});
                setShowScore(false);
                setScore(0);
              }
            }
          ]
        );
      }

    } catch (error) {
      console.error('Error calculating score:', error);
      Alert.alert(
        "Error",
        "There was an error calculating your score. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const isAllQuestionsAnswered = () => {
    return questions.every(question => 
      selectedAnswers[question.question_id] !== undefined
    );
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

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crypto Quiz</Text>
        <Text style={styles.moduleId}>Module ID: 9</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.quizList}>
          {questions.map((question, idx) => (
            <View key={question.question_id} style={styles.quizBox}>
              <View style={styles.questionHeader}>
                <Text style={styles.quizTitle}>Question {idx + 1}</Text>
                <Text style={styles.questionId}>ID: {question.question_id}</Text>
              </View>
              <Text style={styles.quizDescription}>{question.content}</Text>
              <View style={styles.answersContainer}>
                {question.answers.map((answer) => (
                  <TouchableOpacity
                    key={answer.answer_id}
                    style={[
                      styles.answerItem,
                      selectedAnswers[question.question_id] === answer.answer_text && styles.selectedAnswer
                    ]}
                    onPress={() => handleAnswerSelect(question.question_id, answer.answer_text)}
                  >
                    <Text style={[
                      styles.answerText,
                      selectedAnswers[question.question_id] === answer.answer_text && styles.selectedAnswerText
                    ]}>{answer.answer_text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {showScore && (
                <View style={styles.questionResult}>
                  <Text style={styles.resultText}>
                    {selectedAnswers[question.question_id] === question.answers.find(a => a.is_correct === 1)?.answer_text 
                      ? '✓ Correct' 
                      : '✗ Incorrect'}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {!showScore && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              !isAllQuestionsAnswered() && styles.submitButtonDisabled
            ]}
            onPress={calculateScore}
            disabled={!isAllQuestionsAnswered()}
          >
            <Text style={styles.submitButtonText}>
              {isAllQuestionsAnswered() ? 'Show Score' : 'Answer All Questions'}
            </Text>
          </TouchableOpacity>
        )}

        {showScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.finalScoreText}>
              Your Score: {score} out of {questions.length}
            </Text>
            <Text style={styles.finalPercentageText}>
              {Math.round((score / questions.length) * 100)}%
            </Text>
            {Math.round((score / questions.length) * 100) >= 50 ? (
              <TouchableOpacity
                style={styles.nextModuleButton}
                onPress={() => router.push('/modules/Investment/videos' as any)}
              >
                <Text style={styles.nextModuleButtonText}>Go to Next Module</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setSelectedAnswers({});
                  setShowScore(false);
                  setScore(0);
                }}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finalScoreText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  finalPercentageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionResult: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  submitButtonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
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
  answersContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  answersTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerItem: {
    marginVertical: 4,
  },
  answerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  correctAnswer: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  selectedAnswer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#fff',
    borderWidth: 1,
  },
  selectedAnswerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionId: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  moduleId: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 16,
    marginTop: 70,
  },
  nextModuleButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextModuleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});