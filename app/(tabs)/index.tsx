import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface Job {
  id: number;
  company_name: string;
  title: string;
  primary_details: {
    Place?: string;
    Salary?: string;
    Job_Type?: string;
    Experience?: string;
    Fees_Charged?: string;
    Qualification?: string;
  };
  whatsapp_no?: string;
}

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const router = useRouter();

  const fetchJobs = useCallback(async () => {
    if (fetchingMore || !hasMore) return;

    setFetchingMore(true);
    try {
      const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const newJobs = response.data?.results || [];

      if (newJobs.length === 0) {
        setHasMore(false);
      } else {
        setJobs((prevJobs) => [...prevJobs, ...newJobs]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [page, fetchingMore, hasMore]);

  const fetchBookmarks = async () => {
    const stored = await AsyncStorage.getItem('bookmarks');
    if (stored) setBookmarks(JSON.parse(stored));
  };

  const toggleBookmark = async (job: Job) => {
    let updated = bookmarks.some((b) => b.id === job.id)
      ? bookmarks.filter((b) => b.id !== job.id)
      : [...bookmarks, job];

    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
    setBookmarks(updated);
  };

  useEffect(() => {
    fetchJobs();
    fetchBookmarks();
  }, []);

  const renderItem = ({ item }: { item: Job }) => {
    const isBookmarked = bookmarks.some((b) => b.id === item.id);

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: `/job/${item.id}`,
            params: {
              company_name: item.company_name || 'No Name',
              id: item.id,
              title: item.title || 'No Title',
              place: item.primary_details?.Place || 'N/A',
              salary: item.primary_details?.Salary || 'N/A',
              jobType: item.primary_details?.Job_Type || 'N/A',
              experience: item.primary_details?.Experience || 'N/A',
              qualification: item.primary_details?.Qualification || 'N/A',
              whatsapp_no: item.whatsapp_no || 'N/A',
            },
          })
        }
        style={styles.jobCard}
      >
        <View style={styles.jobDetails}>
          <Text style={styles.companyName} numberOfLines={1} ellipsizeMode="tail">
            {item.company_name || 'No Name'}
          </Text>
          <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title || 'No Title'}
          </Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
              {item.primary_details?.Place || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
              {item.primary_details?.Salary || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
              {item.whatsapp_no || 'N/A'}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => toggleBookmark(item)} style={styles.bookmarkIcon}>
          <MaterialIcons
            name={isBookmarked ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={isBookmarked ? 'grey' : '#666'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading && jobs.length === 0 ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          onEndReached={fetchJobs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={fetchingMore ? <ActivityIndicator size="small" color="#666" /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobDetails: {
    marginRight: 16, 
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, 
  },
  jobTitle: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    marginTop: 4,
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flexShrink: 1, 
  },
  bookmarkIcon: {
    position: "absolute",
    right: 16,
  },
});