// File path: screens/FriendRequestScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Friend {
  id: string;
  name: string;
  status: 'Send Request' | 'Request Sent' | 'Friends';
}

const FriendRequestScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Carlos Ahmad', status: 'Send Request' },
    { id: '2', name: 'Carlos Ahmad', status: 'Send Request' },
    { id: '3', name: 'Carlos Ahmad', status: 'Request Sent' },
    { id: '4', name: 'Carlos Ahmad', status: 'Friends' },
  ]);

  const handleRequest = (id: string) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === id
          ? {
              ...friend,
              status: friend.status === 'Send Request' ? 'Request Sent' : friend.status,
            }
          : friend
      )
    );
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <Text style={styles.friendName}>{item.name}</Text>
      <TouchableOpacity
        style={[
          styles.actionButton,
          item.status === 'Friends' && styles.friendsButton,
          item.status === 'Request Sent' && styles.sentButton,
        ]}
        onPress={() => handleRequest(item.id)}
        disabled={item.status !== 'Send Request'}
      >
        <Text style={styles.actionText}>{item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your friends...</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or email"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={renderFriend}
        contentContainerStyle={styles.friendList}
      />
      <View style={styles.stats}>
        <Text style={styles.statsText}>Friends: 17</Text>
        <Text style={styles.statsText}>Requests Sent: 22</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  friendList: {
    paddingBottom: 20,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  friendName: {
    fontSize: 16,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  friendsButton: {
    backgroundColor: '#000',
  },
  sentButton: {
    backgroundColor: '#ccc',
  },
  stats: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FriendRequestScreen;
