import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

interface Video {
  id: number;
  title: string;
  embed_code: string;
  description: string;
  isWatched?: boolean;
}

const API_BASE_URL = Platform.select({
  web: 'http://127.0.0.1:8000',
  default: 'http://192.168.100.8:8000' // Replace with your computer's actual local IP if different
});

// Separate VideoItem component
const VideoItem = React.memo(({ 
  video, 
  onVideoPress, 
  onMarkWatched 
}: { 
  video: Video; 
  onVideoPress: (video: Video) => void;
  onMarkWatched: (id: number) => void;
}) => {
  const [isWatched, setIsWatched] = useState(video.isWatched || false);

  const handleMarkWatched = () => {
    setIsWatched(true);
    onMarkWatched(video.id);
  };

  return (
    <View style={styles.videoBox}>
      <TouchableOpacity 
        style={styles.videoMainContent}
        onPress={() => onVideoPress(video)}
        activeOpacity={0.7}
      >
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {video.description}
          </Text>
        </View>
        
        <View style={styles.playButton}>
          <Ionicons name="play-circle" size={24} color="#fff" />
          <Text style={styles.playText}>Play</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.videoStatusBox}>
        {isWatched ? (
          <View style={styles.watchedStatus}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.watchedText}>Watched</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.markWatchedButton}
            onPress={handleMarkWatched}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
            <Text style={styles.markWatchedText}>Mark</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default function Videos() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showQuizButton, setShowQuizButton] = useState(false);
  const [currentWatchingVideo, setCurrentWatchingVideo] = useState<number | null>(null);
  const [watchedCount, setWatchedCount] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/admins/showVideo/12`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      if (response.data && response.data.success && response.data.data) {
        setVideos(response.data.data);
      } else {
        setVideos([]);
        setError('No videos found for this module.');
      }
    } catch (error: any) {
      setError('Error fetching videos.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (video: Video) => {
    console.log('[Videos] Video pressed:', video.id);
    setSelectedVideo(video);
    setCurrentWatchingVideo(video.id);
  };

  const handleMarkAsWatched = (videoId: number) => {
    console.log('[Videos] Marking video as watched:', videoId);
    
    setVideos(prevVideos => {
      const updatedVideos = prevVideos.map(video => 
        video.id === videoId 
          ? { ...video, isWatched: true }
          : video
      );
      
      // Update watched count
      const newWatchedCount = watchedCount + 1;
      setWatchedCount(newWatchedCount);
      
      // Show quiz button when three videos are watched
      if (newWatchedCount >= 4) {
        console.log('[Videos] Three videos watched, showing quiz button');
        setShowQuizButton(true);
      }
      
      return updatedVideos;
    });

    // Clear the current watching video
    setCurrentWatchingVideo(null);
  };

  const handleStartQuiz = () => {
    console.log('[Videos] Starting quiz');
    router.push('/modules/Crypto/Quiz');
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setCurrentWatchingVideo(null);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#4B0082', '#6B46C1', '#805AD5']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#4B0082', '#6B46C1', '#805AD5']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Money Earning Videos</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.videoList}>
          {videos.map((video, index) => (
            <VideoItem
              key={`video-${video.id}-${index}`}
              video={video}
              onVideoPress={handleVideoPress}
              onMarkWatched={handleMarkAsWatched}
            />
          ))}
        </View>

        {showQuizButton && (
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleStartQuiz}
          >
            <Ionicons name="help-circle" size={24} color="#fff" style={styles.quizIcon} />
            <Text style={styles.quizButtonText}>Proceed to Quiz</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseVideo}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedVideo && (
              <>
                <WebView
                  source={{ html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                        <style>
                          html, body {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            background-color: black;
                            overflow: hidden;
                          }
                          iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                          }
                        </style>
                      </head>
                      <body>
                        <iframe
                          src="${selectedVideo.embed_code.replace(/<[^>]*>/g, '')}?playsinline=1&enablejsapi=1&origin=*"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                          style="width: 100%; height: 100%;"
                          id="videoPlayer"
                        ></iframe>
                      </body>
                    </html>
                  `}}
                  style={styles.videoPlayer}
                  allowsFullscreenVideo={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  mediaPlaybackRequiresUserAction={false}
                  allowsInlineMediaPlayback={true}
                />
                <View style={styles.modalVideoInfo}>
                  <Text style={styles.modalVideoTitle}>{selectedVideo.title}</Text>
                  <Text style={styles.modalVideoDescription}>{selectedVideo.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseVideo}
                >
                  <Ionicons name="close-circle" size={32} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  videoList: {
    gap: 16,
  },
  videoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoMainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  videoInfo: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  playText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  videoStatusBox: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchedStatus: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  watchedText: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  markWatchedButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  markWatchedText: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 60,
  },
  videoPlayer: {
    width: '100%',
    height: '70%',
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  quizIcon: {
    marginRight: 8,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalVideoInfo: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalVideoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalVideoDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
}); 