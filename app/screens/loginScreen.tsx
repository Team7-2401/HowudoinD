import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button
        title="Go to Signup"
        onPress={() => navigation.navigate('Signup')} // Navigate to Signup
      />
      <Button
        title="Login"
        onPress={() => navigation.replace('Main')} // Replace to prevent going back to login
      />
    </View>
  );
};

export default LoginScreen;
