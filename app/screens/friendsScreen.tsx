// File: FriendRequestScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Svg, Path } from 'react-native-svg';
import { getAuthToken } from '../config/tokenStorage';
import { SERVER_URL } from '../config/constants';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [acceptEmail, setAcceptEmail] = useState('');

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

  const handleSendFriendRequest = (email) => {

    const token = getAuthToken();
    console.log('Token:', token);

    setIsLoading(true);
    const requestParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    };

    console.log('Sending friend request:', requestParams);

    fetch(`${SERVER_URL}/friends/add`, requestParams)
      .then(async response => {
        const responseText = await response.text();
        if (response.status !== 200) {
          throw new Error(responseText);
        }
        console.log('Response:', responseText);
        
        if (responseText !== 'Friend request sent') {
          throw new Error(responseText);
        }
        
        return responseText;
      })
      .then(result => {
        Alert.alert('Success', 'Friend request sent successfully');
        setEmail('');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAcceptFriendRequest = async (email: string) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${SERVER_URL}/friends/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email })
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        Alert.alert('Success', 'Friend request accepted!');
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        Alert.alert('Success', 'Friend request accepted!');
      }
    
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
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

  const handleFriendSelect = () => {
    navigation.navigate('FriendsDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Howudoin</Text>
          <View style={styles.headerLine} />
          <Text style={styles.subHeader}>Add your friends...</Text>
        </View>
        
        {/* Search section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search by email" 
              placeholderTextColor="#9CA3AF"
              value={searchEmail}
              onChangeText={setSearchEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity 
            style={styles.sendRequestButton}
            onPress={() => handleSendFriendRequest(searchEmail)}
          >
            <Text style={styles.sendRequestButtonText}>Send Friend Request</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {/* Accept Request section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="person-add" size={20} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Accept friend request by email" 
              placeholderTextColor="#9CA3AF"
              value={acceptEmail}
              onChangeText={setAcceptEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity 
            style={styles.sendRequestButton}
            onPress={() => handleAcceptFriendRequest(acceptEmail)}
          >
            <Text style={styles.sendRequestButtonText}>Accept Friend Request</Text>
          </TouchableOpacity>
        </View>

        {/* Rest of your existing code */}
        <FlatList
          data={filteredFriends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          style={styles.friendList}
        />
        <TouchableOpacity 
          style={styles.bigBlueButton} 
          onPress={handleFriendSelect}
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
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E87FE',
    marginVertical: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 3,
  },
  searchSection: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 8,
    width: '90%',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
    color: '#3E87FE',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    padding: 8,
  },
  sendRequestButton: {
    backgroundColor: '#3E87FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  sendRequestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  spacer: {
    height: 60,
  },
});

export default FriendRequestScreen;
