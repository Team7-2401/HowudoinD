import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
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
  return friends.filter((friend) => {
    const isDuplicate = uniqueEmails.has(friend.email);
    uniqueEmails.add(friend.email);
    return !isDuplicate;
  });
};

const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<NavigationProp>();

  // Fetch friends from the server
  const fetchFriends = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch(`${SERVER_URL}/friends`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const result = await response.json();
      console.log('API Response:', result);

      const transformedFriends = result.map((friend: any) => ({
        id: friend.email || 'No email', // Use email as the unique ID
        email: friend.email || 'No email',
        status: friend.status || 'Send Request',
      }));

      const uniqueFriends = removeDuplicateFriends(transformedFriends);
      setFriends(uniqueFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to fetch friends');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Filtered friends based on search query
  const filteredFriends = useMemo(() => {
    return friends.filter((friend) =>
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  // Navigate to the FriendMessagingScreen with email as friendId
  const handleMessagePress = (friend: Friend) => {
    console.log(`Navigating to messaging screen with friendId: ${friend.email}`);
    navigation.navigate('friendsmessagingScreen', {
      friendId: friend.email, // Pass email as friendId
      friendName: friend.email, // Use email as a fallback for the name
    });
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <View style={styles.textContainer}>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => handleMessagePress(item)}
      >
        <Ionicons name="chatbox-outline" size={20} color="#3E87FE" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={filteredFriends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            style={styles.friendList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
    marginTop: Platform.OS === 'ios' ? 0 : 16, // Adjust top margin for iOS
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
  messageButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E87FE',
  },
});

export default FriendsScreen;
