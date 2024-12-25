import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For bottom navigation icons

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.divider} />

      {/* Profile Title */}
      <Text style={styles.profileTitle}>Profile</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} placeholder="Ahmad" />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} placeholder="Carlos Ahmad" />

        <Text style={styles.label}>About Me</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Hello, my name is..."
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0078FF',
    textAlign: 'left',
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
});

export default ProfileScreen;
