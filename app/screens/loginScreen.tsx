import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SignUpScreen from './signUpScreen';
import { setAuthToken } from '../config/tokenStorage';

//since we're devevloping using android emulator, we need to use this IP,
//if you're using ios emulator, you can use localhost
import { SERVER_URL } from '../config/constants';

const LoginScreen = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const requestparams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }

    console.log('Logging in with:', requestparams);


    fetch(`${SERVER_URL}/login`, requestparams)
    .then(async response => {
      const responseText = await response.text();
      console.log('Response:', responseText);
      
      if (responseText === 'failed to validate user' || responseText === null || responseText === '') {
        throw new Error('Invalid credentials');
      }
      
      // If not error message, assume it's JWT token
      return responseText;
    })
    .then(token => {
      setAuthToken(token); // Store token globally
      console.log('Token received');
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('Main');
    })
    .catch(error => {
      Alert.alert('Error', error.message);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  if (showSignUp) {
    return <SignUpScreen onBackToLogin={() => setShowSignUp(false)} />;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'LOGGING IN...' : 'LOG IN'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>OR</Text>
        <TouchableOpacity onPress={() => setShowSignUp(true)}>
          <Text style={styles.link}>Don't have an account? SIGN UP</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
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

export default LoginScreen;
