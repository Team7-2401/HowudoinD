import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SERVER_URL } from '../config/constants';
import { getAuthToken } from '../config/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  friendsmessagingScreen: {
    friendId: string; // Friend's email
    friendName: string; // Friend's name or email
  };
  loginScreen: undefined; // Add login screen to navigation types
};

type MessagingScreenRouteProp = RouteProp<
  RootStackParamList,
  'friendsmessagingScreen'
>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: MessagingScreenRouteProp;
  navigation: NavigationProp;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

const FriendMessagingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { friendId, friendName } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [senderEmail, setSenderEmail] = useState<string>('');

  // Fetch sender email from AsyncStorage
  useEffect(() => {
    const getUserEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        navigation.navigate('loginScreen');
        return;
      }
      setSenderEmail(email);
    };
    getUserEmail();
  }, []);

  // Commenting out fetchMessages as requested
  /*
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) throw new Error('Unauthorized access. Please log in.');

      const response = await fetch(`${SERVER_URL}/messages`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: friendId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch messages: ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched messages:', data);

      setMessages(
        data.map((msg: any, index: number) => ({
          id: `${index}`,
          text: msg.content,
          timestamp: msg.timestamp,
          isSent: msg.sender.email !== senderEmail,
        }))
      );
    } catch (error) {
      console.error('Fetch Messages Error:', error);
      Alert.alert('Error', error.message || 'Unable to fetch messages.');
    } finally {
      setIsLoading(false);
    }
  };
  */

  // Send a message
  const handleSend = async () => {
    if (!message.trim() || !senderEmail) return;

    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) throw new Error('Unauthorized access. Please log in.');

      const newMessage = {
        content: message.trim(),
        sender: { email: senderEmail },
        receivers: [{ email: friendId }],
        timestamp: new Date().toISOString(),
        status: true,
      };

      console.log('Sending message:', newMessage);
      const response = await fetch(`${SERVER_URL}/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
      }

      console.log('Message sent successfully');
      setMessage('');
      
      // Update the state with the new message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${prevMessages.length}`,
          text: newMessage.content,
          timestamp: newMessage.timestamp,
          isSent: true, // Message is sent by the logged-in user
        },
      ]);
    } catch (error) {
      console.error('Send Message Error:', error);
      Alert.alert('Error', error.message || 'Unable to send message.');
    } finally {
      setIsLoading(false);
    }
  };

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
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  const MessageList = () => {
    return (
      <>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3E87FE" />
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start a conversation!</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageContainer}
            contentContainerStyle={styles.messageContentContainer}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#3E87FE" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{friendName}</Text>
      </View>

      <MessageList />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#3E87FE', marginLeft: 4 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  messageContainer: { flex: 1 },
  inputContainer: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20 },
  sendButton: { backgroundColor: '#3E87FE', padding: 10, borderRadius: 20 },
  messageWrapper: { flexDirection: 'row', margin: 8 },
  sentWrapper: { justifyContent: 'flex-end' },
  receivedWrapper: { justifyContent: 'flex-start' },
  messageBox: { padding: 12, borderRadius: 10 },
  sentMessage: { backgroundColor: '#3E87FE' },
  receivedMessage: { backgroundColor: '#F3F4F6' },
  messageText: { fontSize: 16, padding: 8 },
  sentMessageText: { color: '#FFFFFF' },
  receivedMessageText: { color: '#000000' },
  timestamp: { fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 16 },
  messageContentContainer: { padding: 16 },
});

export default FriendMessagingScreen;
