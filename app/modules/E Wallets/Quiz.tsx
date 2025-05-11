import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../../context/UserContext';

export default function WalletsQuiz() {
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
      question: "What is a crypto wallet?",
      answers: [
        "A physical device to store cryptocurrency",
        "A software program that stores private and public keys",
        "A bank account for cryptocurrency",
        "A type of cryptocurrency"
      ],
      correctAnswer: 1
    },
    {
      question: "What are the two main types of crypto wallets?",
      answers: [
        "Hot and Cold wallets",
        "Digital and Physical wallets",
        "Online and Offline wallets",
        "Private and Public wallets"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the most important security feature of a crypto wallet?",
      answers: [
        "The wallet's color",
        "The wallet's size",
        "The private key",
        "The wallet's name"
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
            walletsQuiz: {
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
    return (score / questions.length) * 100;
  };

  const handleContinueToInvestment = () => {
    router.push('/modules/Investment/video');
  };

  if (showScore) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
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
                  onPress={handleContinueToInvestment}
                  style={{
                    backgroundColor: '#10B981',
                    padding: 16,
                    borderRadius: 12,
                    width: '100%',
                    marginBottom: 16
                  }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                    Continue to Investment
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={{ color: '#EF4444', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                You need at least 50% to proceed to the next module
              </Text>
            )}

            <TouchableOpacity
              onPress={handleRetake}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 16,
                borderRadius: 12,
                width: '100%'
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                Retake Quiz
              </Text>
            </TouchableOpacity>
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
          E Wallets Quiz
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