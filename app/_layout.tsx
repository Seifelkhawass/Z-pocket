import { Stack } from "expo-router";
import React from 'react';
import { useColorScheme } from "react-native";
import { UserProvider } from './context/UserContext';
import './global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(app)" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen 
          name="(admin)" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: false,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: false,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/User/UserProfile" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Achievements/AchievementsList" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Crypto/video" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Crypto/videos" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Crypto/Quiz" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="(admin)/createVideo" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/E Wallets/video" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/E Wallets/Quiz" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Investment/video" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Investment/Quiz" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Money earning/video" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="modules/Money earning/Quiz" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
            headerShown: false
          }} 
        />
      </Stack>
    </UserProvider>
  );
}
