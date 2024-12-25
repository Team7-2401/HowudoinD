import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Friend {
  id: string;
  name: string;
  status: 'Send Request' | 'Request Sent' | 'Friends';
}

const FriendsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [friends, setFriends] = React.useState<Friend[]>([
    { id: '1', name: 'Carlos Ahmad', status: 'Send Request' },
    { id: '2', name: 'Ali Khan', status: 'Send Request' },
    { id: '3', name: 'John Doe', status: 'Send Request' },
    { id: '4', name: 'Jane Smith', status: 'Send Request' },
    { id: '5', name: 'Maria Garcia', status: 'Request Sent' },
    { id: '6', name: 'Ahmed Ali', status: 'Request Sent' },
    { id: '7', name: 'Emily Davis', status: 'Request Sent' },
    { id: '8', name: 'Chris Brown', status: 'Friends' },
    { id: '9', name: 'Anna Johnson', status: 'Friends' },
    { id: '10', name: 'Michael Jordan', status: 'Friends' },
    { id: '11', name: 'Emma Watson', status: 'Send Request' },
    { id: '12', name: 'David Beckham', status: 'Request Sent' },
    { id: '13', name: 'Sophia Loren', status: 'Friends' },
    { id: '14', name: 'James Bond', status: 'Send Request' },
    { id: '15', name: 'Tony Stark', status: 'Request Sent' },
    { id: '16', name: 'Bruce Wayne', status: 'Friends' },
    { id: '17', name: 'Clark Kent', status: 'Send Request' },
    { id: '18', name: 'Diana Prince', status: 'Friends' },
    { id: '19', name: 'Steve Rogers', status: 'Request Sent' },
    { id: '20', name: 'Natasha Romanoff', status: 'Send Request' },
  ]);

  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredFriends = React.useMemo(() => {
    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const handleProfilePress = (friend: Friend) => {
    console.log(`Viewing profile of ${friend.name}`);
  };

  const handleMessagePress = (friend: Friend) => {
    console.log(`Messaging ${friend.name}`);
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <Text style={styles.friendName}>{item.name}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.profileButton} onPress={() => handleProfilePress(item)}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
        {item.status === 'Send Request' && (
          <TouchableOpacity style={styles.messageButton} onPress={() => handleMessagePress(item)}>
            <Ionicons name="chatbox-outline" size={20} color="#3E87FE" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderRequestItem = ({ item }: { item: Friend }) => (
    <View style={styles.requestCard}>
      <Text style={styles.friendName}>{item.name}</Text>
      <View style={styles.requestSentIndicator}>
        <Text style={styles.requestSentIndicatorText}>Request Sent</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.headerLine} />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#3E87FE" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.subHeader}>Find your friends...</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredFriends.filter((f) => f.status === 'Send Request')}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        style={styles.friendList}
      />
      <Text style={styles.subHeader}>Requests Sent...</Text>
      <FlatList
        data={filteredFriends.filter((f) => f.status === 'Request Sent')}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        style={styles.requestList}
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
    paddingLeft: 0,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#3E87FE',
    marginLeft: 4,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderColor: '#3E87FE',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  friendList: {
    marginBottom: 16,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  profileButton: {
    backgroundColor: '#3E87FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E87FE',
  },
  requestList: {
    marginBottom: 80, // Space for tab bar
    minHeight: 200, // Minimum height for 3 cards (approx)
    paddingBottom: 16,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6, // Consistent spacing between cards
    height: 56, // Fixed height for consistent card size
  },
  requestSentIndicator: {
    backgroundColor: '#9CA3AF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestSentIndicatorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default FriendsScreen;
