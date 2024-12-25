import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from './screens/splashScreen'; // Import the SplashScreen component
import LoginScreen from './screens/loginScreen'; // Import the proper LoginScreen component
import FriendsScreen from './screens/friendsScreen';
import ProfileScreen from './screens/profileScreen';
import FriendsListScreen from './screens/friendslistScreen';
import FriendMessagingScreen from './screens/friendsmessagingScreen';

// Define the types for your stack navigator routes
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  FriendsList: undefined;
  FriendsDetail: undefined;
  friendsmessagingScreen: undefined
};

const GroupsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Groups Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const FriendsStack = createStackNavigator();

const FriendsStackNavigator = () => (
  <FriendsStack.Navigator screenOptions={{ headerShown: false }}>
    <FriendsStack.Screen name="FriendsList" component={FriendsScreen} />
    <FriendsStack.Screen name="FriendsDetail" component={FriendsListScreen} />
  </FriendsStack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator 
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Friends') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Groups') {
          iconName = focused ? 'people-circle' : 'people-circle-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0078FF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Friends" component={FriendsStackNavigator} />
    <Tab.Screen name="Groups" component={GroupsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="friendsmessagingScreen" component={FriendMessagingScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default App;
