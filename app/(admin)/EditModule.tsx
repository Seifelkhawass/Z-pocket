import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Video {
  title: string;
  url: string;
  description: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  category: string;
  videos: Video[];
  questions: Question[];
}

interface ModuleData {
  name: string;
  description: string;
}

export default function EditModule() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [moduleData, setModuleData] = useState<ModuleData>({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchModule();
  }, [id]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/getModule/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setModuleData({
          name: response.data.data.name,
          description: response.data.data.description
        });
      }
    } catch (error: any) {
      console.error('Error fetching module:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch module details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModule = async () => {
    try {
      if (!moduleData.name.trim() || !moduleData.description.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setLoading(true);

      const response = await axios.put(`http://127.0.0.1:8000/api/admin/updateModule/${id}`, moduleData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Module updated successfully!');
        router.push('/modules/Modules');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update module');
      }
    } catch (error: any) {
      console.error('Error updating module:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update module. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    Alert.alert(
      'Delete Module',
      'Are you sure you want to delete this module? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.delete(`http://127.0.0.1:8000/api/admin/deleteModule/${id}`, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
              });

              if (response.data.success) {
                Alert.alert('Success', 'Module deleted successfully!');
                router.push('/modules/Modules');
              }
            } catch (error: any) {
              console.error('Error deleting module:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete module. Please try again.'
              );
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Edit Module</Text>
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

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.updateButton, loading && styles.buttonDisabled]}
              onPress={handleUpdateModule}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>Updating...</Text>
              ) : (
                <Text style={styles.buttonText}>Update Module</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, loading && styles.buttonDisabled]}
              onPress={handleDeleteModule}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Delete Module</Text>
            </TouchableOpacity>
          </View>
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
  buttonGroup: {
    gap: 12,
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 