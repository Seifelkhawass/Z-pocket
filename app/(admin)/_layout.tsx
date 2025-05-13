import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen 
        name="dashboard" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="CreateModule" 
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="EditModule" 
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="createVideo" 
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
} 