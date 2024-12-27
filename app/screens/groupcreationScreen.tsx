import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuthToken, getUserEmail } from '../config/tokenStorage';
import { SERVER_URL } from '../config/constants';

type NavigationProp = NativeStackNavigationProp<{
  GroupsList: undefined;
}>;

interface Friend {
  id: string;
  email: string;
  status: 'Send Request' | 'Request Sent' | 'Friends';
}

const GroupCreationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [addedMembers, setAddedMembers] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupIdInput, setGroupIdInput] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const fetchFriends = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${SERVER_URL}/friends`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const result = await response.json();
      if (!result || result.length === 0) {
        setFriends([]);
        return;
      }

      const transformedFriends = result.map((friend: any, index: number) => ({
        id: (index + 1).toString(),
        email: friend.email || 'No email',
        status: friend.status || 'Send Request',
      }));

      setFriends(transformedFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFriends();
  }, []);

  const handleCreateGroup = async () => {
    try {
      const token = await getAuthToken();
      const userEmail = getUserEmail();

      if (!token || !userEmail) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }

      const response = await fetch(`${SERVER_URL}/groups/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          createdby: { email: userEmail },
          groupname: groupName,
          about: groupDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const data = await response.text();
      Alert.alert(
        'Success', 
        `Group created successfully!
         Group ID: ${data}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
    }
  };

  const handleAddToGroup = async () => {
    try {
      const token = await getAuthToken();
      if (!token || !selectedFriend) {
        Alert.alert('Error', 'Invalid request data');
        return;
      }

      const response = await fetch(`${SERVER_URL}/groups/${groupIdInput}/add-member`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedFriend.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add member to group');
      }

      const responseText = await response.text();
      console.log('API Response:', responseText);

      if (responseText === '1') {
        Alert.alert('Error', 'Group not found');
        
      } else if (responseText === '2') {
        Alert.alert('Error', 'You are not in the group, therefore cannot add members');
      } else if (responseText === '3') {
        Alert.alert('Error', 'User not found');
      } else {
        Alert.alert('Success', 'Member added to group successfully!');
      }

      setModalVisible(false);
      setGroupIdInput('');
      setSelectedFriend(null);
    } catch (error) {
      console.error('Error adding member to group:', error);
      Alert.alert('Error', 'Failed to add member to group');
    }
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <Text style={styles.friendEmail}>{item.email}</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setSelectedFriend(item);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="#000000" />
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
        onPress={handleCreateGroup}
      >
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Group ID</Text>
            <TextInput
              style={styles.modalInput}
              value={groupIdInput}
              onChangeText={setGroupIdInput}
              placeholder="Group ID"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddToGroup}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  selectedFriend: {
    backgroundColor: '#E8F0FE',
  },
  friendEmail: {
    fontSize: 18,
    fontWeight: '500',
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default GroupCreationScreen;
