import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SignUpScreen from './signUpScreen';

const LoginScreen = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigation = useNavigation();

  if (showSignUp) {
    return <SignUpScreen onBackToLogin={() => setShowSignUp(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      </View>

      {/* Log In Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      {/* Footer Links */}
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
