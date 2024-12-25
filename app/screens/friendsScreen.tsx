// File: FriendRequestScreen.tsx

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Svg, Path } from 'react-native-svg';

type RootStackParamList = {
  'Friends List': undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: NavigationProp;
}

interface Friend {
  id: string;
  name: string;
  status: 'Send Request' | 'Request Sent' | 'Friends';
}

const FriendRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [friends, setFriends] = React.useState<Friend[]>([
    { id: '1', name: 'Carlos Ahmad', status: 'Send Request' },
    { id: '2', name: 'Carlos Ahmad', status: 'Send Request' },
    { id: '3', name: 'Carlos Ahmad', status: 'Request Sent' },
    { id: '4', name: 'Carlos Ahmad', status: 'Friends' },
    { id: '5', name: 'Ali Ahmad', status: 'Friends' }
  ]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredFriends = React.useMemo(() => {
    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const handleButtonPress = (id: string, currentStatus: string) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === id
          ? { ...friend, status: currentStatus === 'Send Request' ? 'Request Sent' : currentStatus }
          : friend
      )
    );
  };

  const renderFriendItem = ({ item }: { item: Friend }) => {
    return (
      <View style={styles.friendCard}>
        <Text style={styles.friendName}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.status === 'Send Request' && styles.sendRequest,
            item.status === 'Request Sent' && styles.requestSent,
            item.status === 'Friends' && styles.friends,
          ]}
          disabled={item.status !== 'Send Request'}
          onPress={() => handleButtonPress(item.id, item.status)}
        >
          <Text
            style={[
              styles.actionText,
              item.status === 'Send Request' && styles.sendRequestText,
              item.status === 'Request Sent' && styles.requestSentText,
              item.status === 'Friends' && styles.friendsText,
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.headerLine} />
      <Text style={styles.subHeader}>Add your friends...</Text>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search by name or email" 
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        style={styles.friendList}
      />
      <TouchableOpacity 
        style={styles.bigBlueButton} 
        onPress={() => navigation.navigate('Friends List')}
      >
        <Text style={styles.bigButtonText}>Check your friends list</Text>
        <View style={styles.arrowContainer}>
          <Svg height="40" width="40" viewBox="0 0 24 24" style={styles.arrowSvg}>
            <Path
              d="M10 19l7-7-7-7"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
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
    marginVertical: 16, // Fixed by adding numeric value
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
    color: '#000000',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  friendList: {
    flex: 1,
    marginVertical: 8,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sendRequest: {
    backgroundColor: '#3E87FE',
  },
  requestSent: {
    backgroundColor: '#9CA3AF',
  },
  friends: {
    backgroundColor: '#000000',
  },
  sendRequestText: {
    color: '#FFFFFF',
  },
  requestSentText: {
    color: '#FFFFFF',
  },
  friendsText: {
    color: '#FFFFFF',
  },
  bigBlueButton: {
    backgroundColor: '#3E87FE',
    borderRadius: 15,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  arrowSvg: {
    width: 24,
    height: 24,
  },
  bigButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#3E87FE',
    marginTop: 4,
    marginBottom: 16,
  },
});

export default FriendRequestScreen;
