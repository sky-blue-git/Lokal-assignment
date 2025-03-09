import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function JobDetailsScreen() {
  const { id, company_name, title, place, salary, jobType, experience, qualification, whatsapp_no } =
    useLocalSearchParams();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: 'Job Description',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.companyName}>{company_name}</Text>
        <Text style={styles.jobTitle}>{title}</Text>

        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={styles.detailText}>{place || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={20} color="#666" />
          <Text style={styles.detailText}>{salary || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="work" size={20} color="#666" />
          <Text style={styles.detailText}>{jobType || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={20} color="#666" />
          <Text style={styles.detailText}>{experience || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="school" size={20} color="#666" />
          <Text style={styles.detailText}>{qualification || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={20} color="#666" />
          <Text style={styles.detailText}>{whatsapp_no || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});