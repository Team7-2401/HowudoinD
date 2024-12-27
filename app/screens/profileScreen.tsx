import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setAuthToken, setUserEmail } from '../config/tokenStorage';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    setAuthToken(null); // Reset token
    setUserEmail(null);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.divider} />

      {/* Profile Content */}
      <View style={styles.profileContent}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.privacyMessage}>
          At Howudoin, we take your privacy seriously. As part of our commitment to data protection, 
          we do not display personal information. Your data remains secure and private.
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'center', // Add vertical centering
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0078FF',
    textAlign: 'left',
    marginBottom: 20, // Add spacing
  },
  divider: {
    height: 1,
    backgroundColor: '#0078FF',
    marginVertical: 10,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flex: 1,
    marginTop: 20, // Add spacing between title and inputs
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0078FF',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0078FF',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Ensures proper alignment for multiline inputs
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#0078FF',
    paddingVertical: 10,
  },
  profileContent: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#0078FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  }
});

export default ProfileScreen;
