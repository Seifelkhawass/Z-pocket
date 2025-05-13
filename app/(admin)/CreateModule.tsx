import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateModuleData {
  name: string;
  description: string;
}

export default function CreateModule() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [moduleData, setModuleData] = useState<CreateModuleData>({
    name: '',
    description: ''
  });

  const handleCreateModule = async () => {
    try {
      if (!moduleData.name.trim() || !moduleData.description.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setLoading(true);

      const response = await axios.post('http://127.0.0.1:8000/api/admin/createModule', moduleData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Module created successfully!');
        // Clear form
        setModuleData({
          name: '',
          description: ''
        });
        // Navigate back to modules list
        router.push('/modules/Modules');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create module');
      }
    } catch (error: any) {
      console.error('Error creating module:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create module. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Module</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Module Name</Text>
            <TextInput
              style={[styles.input, { color: '#fff' }]}
              value={moduleData.name}
              onChangeText={(text) => setModuleData(prev => ({ ...prev, name: text }))}
              placeholder="Enter module name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { color: '#fff' }]}
              value={moduleData.description}
              onChangeText={(text) => setModuleData(prev => ({ ...prev, description: text }))}
              placeholder="Enter module description"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreateModule}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Creating...</Text>
            ) : (
              <Text style={styles.buttonText}>Create Module</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 