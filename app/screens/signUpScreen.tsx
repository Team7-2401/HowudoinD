import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SERVER_URL } from '../config/constants';

interface SignUpScreenProps {
  onBackToLogin: () => void;
}

const SignUpScreen = ({ onBackToLogin }: SignUpScreenProps) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          lastName, 
          email,
          password,
          friends: [],
          aboutme: null
        }),
      });

      const result = await response.text();
      
      if (result === '0') {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: onBackToLogin }
        ]);
      } else {
        console.log('Registration failed:', result);
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={name}
          onChangeText={setName}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Last Name" 
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>OR</Text>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.link}>Already a user? LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0078FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    paddingLeft: 40,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#0078FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
