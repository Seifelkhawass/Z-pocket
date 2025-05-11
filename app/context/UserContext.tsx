import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserData {
  username: string;
  email: string;
  phone?: string;
  date_of_birth: string;
  created_at: string;
  // Temporary admin flag for testing - REMOVE IN PRODUCTION
  isAdmin?: boolean;
  progress: {
    completedModules: number;
    totalModules: number;
    averageScore: number;
  };
  achievements: {
    cryptoQuiz?: {
      completed: boolean;
      score: number;
      date: string;
    };
    walletsQuiz?: {
      completed: boolean;
      score: number;
      date: string;
    };
    investmentQuiz?: {
      completed: boolean;
      score: number;
      date: string;
    };
    moneyEarningQuiz?: {
      completed: boolean;
      score: number;
      date: string;
    };
  };
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Load user data from storage when app starts
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      console.log('Loaded user data from storage:', storedData);
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUserData = async (data: UserData) => {
    try {
      console.log('Saving user data to storage:', data);
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const clearUserData = async () => {
    try {
      // Instead of removing the data, we'll just clear the state
      setUserData(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData: updateUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 