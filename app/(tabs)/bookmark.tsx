import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface Bookmark {
  id: number;
  company_name: string;
  title: string;
  primary_details: {
    Place?: string;
    Salary?: string;
  };
  whatsapp_no?: string;
}

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarks');
      if (storedBookmarks) {
        const parsedBookmarks: Bookmark[] = JSON.parse(storedBookmarks);
        if (Array.isArray(parsedBookmarks)) {
          setBookmarks(parsedBookmarks);
        } else {
          console.warn('Bookmarks data is not an array:', parsedBookmarks);
        }
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const renderItem = ({ item }: { item: Bookmark }) => {
    if (!item) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.companyName}>{item.company_name || 'No Name'}</Text>
        <Text style={styles.jobTitle}>{item.title || 'No Title'}</Text>

        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.detailText}>{item.primary_details?.Place || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color="#666" />
          <Text style={styles.detailText}>{item.primary_details?.Salary || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={16} color="#666" />
          <Text style={styles.detailText}>{item.whatsapp_no || 'N/A'}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookmarks found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});