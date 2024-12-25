import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const { friendName } = route.params;
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    { id: '1', text: 'Hey there!', timestamp: new Date(), isSent: true },
    { id: '2', text: 'Hi! How are you?', timestamp: new Date(), isSent: false },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date(),
        isSent: true,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageWrapper,
      item.isSent ? styles.sentWrapper : styles.receivedWrapper
    ]}>
      <View style={[
        styles.messageBox,
        item.isSent ? styles.sentMessage : styles.receivedMessage
      ]}>
        <Text style={[
          styles.messageText,
          item.isSent ? styles.sentMessageText : styles.receivedMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

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
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#3E87FE',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To offset the back button width
  },
  messageContainer: {
    flex: 1,
  },
  messageContentContainer: {
    paddingBottom: 20, // Add space between last message and input
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