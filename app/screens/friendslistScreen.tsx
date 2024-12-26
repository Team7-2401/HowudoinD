import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAuthToken } from '../config/tokenStorage';
import { SERVER_URL } from '../config/constants';

type NavigationProp = NativeStackNavigationProp<{
  friendsmessagingScreen: { friendId: string; friendName: string };
}>;

interface Friend {
  id: string;
  email: string;
  status: 'Send Request' | 'Request Sent' | 'Friends';
}

const removeDuplicateFriends = (friends: Friend[]): Friend[] => {
  const uniqueEmails = new Set();
  return friends.filter(friend => {
    const isDuplicate = uniqueEmails.has(friend.email);
    uniqueEmails.add(friend.email);
    return !isDuplicate;
  });
};

const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentId, setCurrentId] = React.useState(1);
  const navigation = useNavigation<NavigationProp>();

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
      console.log('API Response:', result);

      if (!result || result.length === 0) {
        setFriends([]);
        return;
      }

      let tempId = currentId;
      const transformedFriends = result.map((friend: any) => ({
        id: (tempId++).toString(),
        email: friend.email || 'No email',
        status: friend.status || 'Send Request',
      }));

      const uniqueFriends = removeDuplicateFriends(transformedFriends);
      setCurrentId(tempId);
      setFriends(uniqueFriends);
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

  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredFriends = React.useMemo(() => {
    return friends.filter((friend) =>
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const requestsFriends = React.useMemo(() => {
    return friends.filter((friend) => friend.status === 'Request Sent');
  }, [friends]);

  const handleMessagePress = (friend: Friend) => {
    navigation.navigate('friendsmessagingScreen', {
      friendId: friend.id,
      friendName: friend.email
    });
  };

  const handleAcceptRequest = (id: string) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === id
          ? { ...friend, status: 'Friends' }
          : friend
      )
    );
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <View style={styles.textContainer}>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => handleMessagePress(item)}
        >
          <Ionicons name="chatbox-outline" size={20} color="#3E87FE" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRequestItem = ({ item }: { item: Friend }) => (
    <View style={styles.requestCard}>
      <Text style={styles.friendName}>{`${item.firstName} ${item.lastName}`}</Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptRequest(item.id)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
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
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        style={styles.friendList}
      />
      {/* <Text style={styles.subHeader}>Requests Received...</Text>
      <FlatList
        data={requestsFriends}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        style={styles.requestList}
        We can't have this because of the way the backend is designed
      /> */}
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  friendEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E87FE',
  },
  requestList: {
    marginBottom: 40, // Space for tab bar
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
    height: 50, // Fixed height for consistent card size
  },
  requestReceivedIndicator: {
    backgroundColor: '#000000',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestReceivedIndicatorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  acceptButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 24, // Increased horizontal padding
    minWidth: 70, // Added minimum width
    minHeight: 40, // Added minimum height
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FriendsScreen;
