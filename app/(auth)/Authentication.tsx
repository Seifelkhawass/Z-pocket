import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');
 
export default function Register() {
  const router = useRouter();
  const { setUserData } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Content animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    rePassword: '',
  };

  const validationSchema = yup.object().shape({
    name: yup.string()
      .required('Name is required')
      .min(3, 'Name should be at least 3 characters')
      .max(12, 'Name should be at most 12 characters'),
    email: yup.string()
      .required('Email is required')
      .email('Email should be valid'),
    phone: yup.string()
      .required('Phone is required')
      .matches(/^(20)?01[0125][0-9]{8}$/, 'Phone should start with 01 and contain 11 digits'),
    password: yup.string()
      .required('Password is required')
      .min(6, 'Password should be at least 6 characters')
      .max(12, 'Password should be at most 12 characters'),
    rePassword: yup.string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password')], 'Passwords should match'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Registration values:', values); // Debug log
        const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', values);
        
        // Create user data object
        const userData = {
          username: values.name,
          email: values.email,
          phone: values.phone,
          date_of_birth: new Date().toISOString(),
          created_at: new Date().toISOString(),
          progress: {
            completedModules: 0,
            totalModules: 4,
            averageScore: 0
          },
          achievements: {
            cryptoQuiz: {
              completed: false,
              score: 0,
              date: ''
            },
            walletsQuiz: {
              completed: false,
              score: 0,
              date: ''
            },
            blockchainsQuiz: {
              completed: false,
              score: 0,
              date: ''
            },
            memeCoinsQuiz: {
              completed: false,
              score: 0,
              date: ''
            }
          }
        };

        console.log('User data being saved:', userData); // Debug log
        // Save user data to context
        setUserData(userData);
        
        setSuccessMessage(true);
        setTimeout(() => {
          router.push('/(auth)/login');
        }, 2000);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || 'Registration failed');
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      }
    },
  });

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.headerContainer,
                {
                  transform: [{ scale: logoScale }]
                }
              ]}
            >
              <BlurView intensity={20} style={styles.logoContainer}>
                <Text style={styles.logoText}>Z</Text>
              </BlurView>
              <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                Create Account
              </Animated.Text>
              <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                Sign up to get started
              </Animated.Text>
            </Animated.View>

            {successMessage && (
              <Animated.View 
                style={[
                  styles.messageContainer,
                  styles.successContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <Text style={styles.successText}>Registration successful!</Text>
              </Animated.View>
            )}
            
            {errorMessage && (
              <Animated.View 
                style={[
                  styles.messageContainer,
                  styles.errorContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <Text style={styles.errorText}>{errorMessage}</Text>
              </Animated.View>
            )}

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={formik.values.name}
                  onChangeText={formik.handleChange('name')}
                  onBlur={formik.handleBlur('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <Text style={styles.errorText}>{formik.errors.name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={formik.values.email}
                  onChangeText={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {formik.touched.email && formik.errors.email && (
                  <Text style={styles.errorText}>{formik.errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={formik.values.phone}
                  onChangeText={formik.handleChange('phone')}
                  onBlur={formik.handleBlur('phone')}
                  keyboardType="phone-pad"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <Text style={styles.errorText}>{formik.errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={formik.values.password}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  secureTextEntry
                />
                {formik.touched.password && formik.errors.password && (
                  <Text style={styles.errorText}>{formik.errors.password}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={formik.values.rePassword}
                  onChangeText={formik.handleChange('rePassword')}
                  onBlur={formik.handleBlur('rePassword')}
                  secureTextEntry
                />
                {formik.touched.rePassword && formik.errors.rePassword && (
                  <Text style={styles.errorText}>{formik.errors.rePassword}</Text>
                )}
              </View>

              <Animated.View 
                style={[
                  styles.buttonContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: buttonScale }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => formik.handleSubmit()}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#fff', '#f0f0f0']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.buttonText}>Create Account</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.loginButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: width - 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  successContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  successText: {
    color: '#10B981',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
}); 