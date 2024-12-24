import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Replace to avoid going back to splash
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Clean up the timer
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../assets/images/SplashScreen.png')}
        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
      />
    </View>
  );
};

export default SplashScreen;
