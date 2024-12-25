import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<{
  GroupsList: undefined;
}>;

interface Friend {
  id: string;
  name: string;
}

const GroupCreationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Carlos Ahmad' },
    { id: '2', name: 'Carlos Ahmad' },
    { id: '3', name: 'Carlos Ahmad' },
    { id: '4', name: 'Carlos Ahmad' },
    { id: '5', name: 'Carlos Ahmad' },
  ]);

  const [addedMembers, setAddedMembers] = useState<Friend[]>([]);

  const handleAddMember = (friend: Friend) => {
    setAddedMembers((prev) => [...prev, friend]);
    setFriends((prev) => prev.filter((f) => f.id !== friend.id));
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <Text style={styles.friendName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleAddMember(item)}>
        <Ionicons name="add-circle-outline" size={28} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.headerLine} />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#3E87FE" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Group Details Section */}
      <Text style={styles.subHeader}>New Group Details...</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Group Name</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Group Description</Text>
        <TextInput
          style={[styles.inputField, styles.descriptionField]}
          placeholder="Enter group description"
          value={groupDescription}
          onChangeText={setGroupDescription}
          multiline
        />
      </View>

      {/* Friends List */}
      <Text style={styles.subHeader}>Add your friends...</Text>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.friendList}
      />
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => {
          // Handle group creation
          navigation.goBack();
        }}
      >
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
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
    marginBottom: 12,
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
  },
  descriptionField: {
    height: 80,
    textAlignVertical: 'top',
  },
  friendList: {
    paddingTop: 8,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  createButton: {
    backgroundColor: '#3E87FE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GroupCreationScreen;
