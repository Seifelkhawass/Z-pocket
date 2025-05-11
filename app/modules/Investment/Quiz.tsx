import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../../context/UserContext';

export default function InvestmentQuiz() {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);

  // Redirect to login if not authenticated
  if (!userData) {
    router.replace('/(auth)/login');
    return null;
  }

  const questions = [
    {
      question: "What is the main purpose of crypto investment?",
      answers: [
        "To make quick profits",
        "To build long-term wealth",
        "To avoid taxes",
        "To hide money"
      ],
      correctAnswer: 1
    },
    {
      question: "What is portfolio diversification?",
      answers: [
        "Putting all money in one coin",
        "Spreading investments across different assets",
        "Only investing in Bitcoin",
        "Trading frequently"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a good investment strategy?",
      answers: [
        "Buy high, sell low",
        "Invest only in new coins",
        "Research before investing",
        "Follow social media trends"
      ],
      correctAnswer: 2
    }
  ];

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
            investmentQuiz: {
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
    router.back();
  };

  const calculatePercentage = () => {
    return (score / questions.length) * 100;
  };

  const handleContinueToMoneyEarning = () => {
    router.push('/modules/Money earning/video');
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
          onPress={handleBackToVideos}
          style={{ position: 'absolute', left: 20, zIndex: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 }}>
          Investment Quiz
        </Text>
      </View>

      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        {!showScore ? (
          <View style={{ padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>
                Question {currentQuestion + 1} of {questions.length}
              </Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                {questions[currentQuestion].question}
              </Text>
            </View>

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
                  marginTop: 20,
                  backgroundColor: '#3B82F6',
                  padding: 16,
                  borderRadius: 12
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Animated.View
              entering={FadeInDown.duration(1000)}
              style={{ alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
                Quiz Complete!
              </Text>
              <Text style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>
                Your Score: {score}/{questions.length}
              </Text>
              <Text style={{ color: '#fff', fontSize: 24, marginBottom: 40 }}>
                Percentage: {calculatePercentage()}%
              </Text>

              {calculatePercentage() >= 50 ? (
                <>
                  <Text style={{ color: '#10B981', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                    Congratulations! You passed!
                  </Text>
                  <TouchableOpacity
                    onPress={handleContinueToMoneyEarning}
                    style={{
                      backgroundColor: '#10B981',
                      padding: 16,
                      borderRadius: 12,
                      width: '100%',
                      marginBottom: 16
                    }}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                      Continue to Money Earning
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={{ color: '#EF4444', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                  You need at least 50% to proceed to the next module
                </Text>
              )}
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
} 