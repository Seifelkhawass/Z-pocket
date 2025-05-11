import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../../context/UserContext';

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

// Mock API URL
const API_URL = 'https://api.example.com/quiz';

export default function CryptoQuiz() {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Mock API response
        const mockQuestions: Question[] = [
          {
            id: 1,
            question: "What is cryptocurrency?",
            answers: [
              "A digital or virtual currency that uses cryptography for security",
              "A type of bank account",
              "A physical coin",
              "A type of credit card"
            ],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "What is blockchain?",
            answers: [
              "A type of bank",
              "A distributed ledger technology",
              "A type of cryptocurrency",
              "A type of wallet"
            ],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "What is mining in cryptocurrency?",
            answers: [
              "Digging for physical coins",
              "The process of validating transactions and adding them to the blockchain",
              "A type of wallet",
              "A type of exchange"
            ],
            correctAnswer: 1
          }
        ];

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set the mock data
        setQuestions(mockQuestions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, []);

  // Redirect to login if not authenticated
  if (!userData) {
    router.replace('/(auth)/login');
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4B0082' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading questions...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4B0082' }}>
        <Text style={{ color: '#fff', textAlign: 'center', margin: 20 }}>{error}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginTop: 10
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#4B0082', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check if questions are loaded and current question exists
  if (!questions.length || !questions[currentQuestion]) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4B0082' }}>
        <Text style={{ color: '#fff', textAlign: 'center', margin: 20 }}>No questions available</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginTop: 10
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#4B0082', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
      // Save achievements when quiz is completed
      if (userData) {
        const percentage = (score / questions.length) * 100;
        const newUserData = {
          ...userData,
          achievements: {
            ...userData.achievements,
            cryptoQuiz: {
              completed: percentage >= 50,
              score: percentage,
              date: new Date().toISOString()
            }
          }
        };
        setUserData(newUserData);
      }
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  const handleBackToVideos = () => {
    router.push('/modules/Modules');
  };

  const calculatePercentage = () => {
    return Math.min((score / questions.length) * 100, 100);
  };

  const getScoreFeedback = (percentage: number) => {
    if (percentage >= 90) return "Excellent! You're a crypto expert!";
    if (percentage >= 75) return "Great job! You know your crypto!";
    if (percentage >= 60) return "Good work! Keep learning!";
    if (percentage >= 50) return "You passed! Keep practicing!";
    return "Keep studying! You can do better!";
  };

  const handleContinueToWallets = () => {
    router.push('/modules/E Wallets/video');
  };

  if (showScore) {
    const percentage = calculatePercentage();
    const feedback = getScoreFeedback(percentage);
    
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              padding: 30, 
              borderRadius: 20,
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              Quiz Complete!
            </Text>
            
            <View style={{ 
              width: 150, 
              height: 150, 
              borderRadius: 75, 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold' }}>
                {percentage.toFixed(0)}%
              </Text>
            </View>

            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
              {feedback}
            </Text>

            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 30 }}>
              You got {score} out of {questions.length} questions correct
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  minWidth: 120,
                  alignItems: 'center'
                }}
                onPress={handleRetake}
              >
                <Text style={{ color: '#4B0082', fontWeight: 'bold' }}>Retake Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  minWidth: 120,
                  alignItems: 'center'
                }}
                onPress={handleContinueToWallets}
              >
                <Text style={{ color: '#4B0082', fontWeight: 'bold' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 64, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={handleBackToVideos}
          style={{ position: 'absolute', left: 20, zIndex: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 }}>
          Crypto Quiz
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View>
          <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>

          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            {questions[currentQuestion].question}
          </Text>

          <View style={{ gap: 12 }}>
            {questions[currentQuestion].answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(index)}
                style={{
                  backgroundColor: selectedAnswer === index ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: selectedAnswer === index ? '#fff' : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>{answer}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedAnswer !== null && (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                backgroundColor: '#10B981',
                padding: 16,
                borderRadius: 12,
                marginTop: 20,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
} 