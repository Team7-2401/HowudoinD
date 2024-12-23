import React from 'react';
import { View, Text, Button } from 'react-native';

const SignupScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Signup Screen</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.goBack()} // Go back to Login
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.replace('Main')} // Replace to prevent going back to signup
      />
    </View>
  );
};

export default SignupScreen;
