import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAuthToken } from '../config/tokenStorage';
import { SERVER_URL } from '../config/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<{
  GroupsList: undefined;
}>;

interface Props {
  route: RouteProp<{
    groupdetailScreen: {
      groupId: string;
    }
  }, 'groupdetailScreen'>;
  navigation: NavigationProp<any>;
}

interface GroupMember {
  email: string;
  name: string;
  lastName: string;
}

const GroupDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }

      const response = await fetch(`${SERVER_URL}/groups/${groupId}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert('Error', 'Failed to fetch group members');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, [groupId]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.headerLine} />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#3E87FE" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* <Text style={styles.groupId}>Group ID: {groupId}</Text> */}

      {/* Group Details */}
      <Text style={styles.subHeader}>Group Details...</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Group ID</Text>
        <TextInput style={styles.inputField} value={`${groupId}`} editable={false} />
      </View>
      {/* <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Creation Time</Text>
        <TextInput 
          style={styles.inputField} 
          value="December 24, 2024, 10:30 AM" 
          editable={false} 
        />
      </View> */}
      {/* <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Group Description</Text>
        <ScrollView style={[styles.inputField, styles.descriptionField]}>
          <Text>
            This group is for planning weekly study sessions and sharing resources for the upcoming exams. 
            Feel free to suggest topics or ask questions! We meet every Wednesday at 7 PM in the library. 
            Our main focus areas include: Database Systems, Operating Systems, and Software Engineering principles.
            We also occasionally organize weekend hackathons and coding challenges.
            Remember to check the pinned messages for important announcements and exam dates.
            Current project deadlines:
            - Database Design Project: December 15
            - OS Memory Management Implementation: December 20
            - Software Testing Framework: January 5
            Please make sure to update your progress on the shared document.
            Feel free to share any useful resources or study materials with the group.
            We're always looking for new ideas and suggestions to improve our study sessions!
          </Text>
        </ScrollView>
      </View> */}

      {/* Group Members */}
      <Text style={styles.subHeader}>Group Members...</Text>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>{item.email}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.membersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E87FE',
    marginVertical: 16,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#3E87FE',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#3E87FE',
    marginLeft: 4,
  },
  subHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E87FE',
    marginBottom: 4,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  descriptionField: {
    height: 120,  // Increased from 80
    textAlignVertical: 'top',
    fontSize: 18,  // Increased from 16
    padding: 16,   // Increased padding
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  membersList: {
    paddingTop: 8,
  },
  memberCard: {
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',  // Center content horizontally
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',  // Center text
  },
  groupId: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
  },
});

export default GroupDetailScreen;
