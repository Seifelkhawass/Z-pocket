import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { userData } = useUser();

  const menuItems = [
    {
      title: 'Create Module',
      icon: 'add-circle-outline' as const,
      route: '/(admin)/CreateModule' as const
    },
    {
      title: 'Edit Module',
      icon: 'create-outline' as const,
      route: '/(admin)/EditModule' as const
    },
    {
      title: 'Create Video',
      icon: 'videocam-outline' as const,
      route: '/(admin)/createVideo' as const
    },
    {
      title: 'Manage Users',
      icon: 'people-outline' as const,
      route: '/(admin)/Users' as const
    }
  ];
 
  
  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {userData?.username}</Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <Ionicons name={item.icon} size={32} color="#fff" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 24,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 