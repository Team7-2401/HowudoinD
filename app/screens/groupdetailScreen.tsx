import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<{
  GroupsList: undefined;
}>;

interface GroupMember {
  id: string;
  name: string;
}

const GroupDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [members] = React.useState([
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Miguel Rodriguez' },
    { id: '4', name: 'Aisha Khan' },
    { id: '5', name: 'Chen Wei' },
    { id: '6', name: 'Emma Wilson' },
    { id: '7', name: 'Ahmed Hassan' },
    { id: '8', name: 'Sofia Garcia' },
    { id: '9', name: 'Liam O\'Connor' },
    { id: '10', name: 'Priya Patel' }
  ]);

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

      {/* Group Details */}
      <Text style={styles.subHeader}>Group Details...</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Group Name</Text>
        <TextInput style={styles.inputField} value="Group 1" editable={false} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Creation Time</Text>
        <TextInput 
          style={styles.inputField} 
          value="December 24, 2024, 10:30 AM" 
          editable={false} 
        />
      </View>
      <View style={styles.inputContainer}>
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
      </View>

      {/* Group Members */}
      <Text style={styles.subHeader}>Group Members...</Text>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',  // Center text
  },
});

export default GroupDetailScreen;
