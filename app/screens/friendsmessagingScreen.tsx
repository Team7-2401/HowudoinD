import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuthToken, getUserEmail } from '../config/tokenStorage';
import { SERVER_URL } from '../config/constants';

type RootStackParamList = {
  friendsmessagingScreen: {
    friendId: string;
    friendName: string;
  };
};

type MessagingScreenRouteProp = RouteProp<RootStackParamList, 'friendsmessagingScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: MessagingScreenRouteProp;
  navigation: NavigationProp;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
}

const FriendMessagingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { friendName, friendId } = route.params;
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);

  // Fetch messages function
  const fetchMessages = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Token not available');
      }

      const receiverEmail = encodeURIComponent(friendId);
      const response = await fetch(`${SERVER_URL}/messages?email=${receiverEmail}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      const transformedMessages = data.map((msg: any, index: number) => ({
        id: index.toString(),
        text: msg.content || '',
        timestamp: new Date(msg.timestamp || Date.now()),
        isSent: msg.sender?.email === getUserEmail(),
      }));
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to fetch messages');
    }
  };

  // Send message function
  const sendMessage = async () => {
    try {
      const token = await getAuthToken();
      const userEmail = getUserEmail();

      if (!token || !userEmail || !message.trim()) {
        Alert.alert('Error', 'Cannot send empty message');
        return;
      }

      const response = await fetch(`${SERVER_URL}/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          sender: { email: userEmail },
          receivers: [{ email: friendId }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message, server error');
      }

      const responseText = await response.text();
      console.log('Message Response:', responseText);
      if (responseText !== '0') {
        throw new Error('Failed to send message, response text not 0');
      }

      setMessage(''); // Clear input
      await fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  // Fetch messages on mount and set up polling
  React.useEffect(() => {
    let isMounted = true;

    const initMessages = async () => {
      if (isMounted) {
        await fetchMessages();
      }
    };

    initMessages();

    // Poll messages every 3 seconds
    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchMessages();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [friendId]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageWrapper,
        item.isSent ? styles.sentWrapper : styles.receivedWrapper,
      ]}
    >
      <View
        style={[
          styles.messageBox,
          item.isSent ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isSent ? styles.sentMessageText : styles.receivedMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#3E87FE" />
          </TouchableOpacity>
          <Text style={styles.friendName}>{friendName}</Text>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messageContainer}
          contentContainerStyle={styles.messageContentContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  messageContainer: {
    flex: 1,
  },
  messageContentContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3E87FE',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  sentWrapper: {
    justifyContent: 'flex-end',
  },
  receivedWrapper: {
    justifyContent: 'flex-start',
  },
  messageBox: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    backgroundColor: '#3E87FE',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
  },
});

export default FriendMessagingScreen;