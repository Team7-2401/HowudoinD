import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<{
  groupdetailScreen: { groupId: string; groupName: string };
  groupmessagingScreen: { groupId: string; groupName: string };
  groupcreationScreen: undefined;
}>;

interface Group {
  id: string;
  name: string;
}

const GroupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [groups, setGroups] = React.useState<Group[]>([
    { id: '1', name: 'Group 1' },
    { id: '2', name: 'Group 1' },
    { id: '3', name: 'Group 1' },
    { id: '4', name: 'Group 1' },
    { id: '5', name: 'Group 1' },
    { id: '6', name: 'Group 1' },
  ]);

  const renderGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupCard}>
      <Text style={styles.groupName}>{item.name}</Text>
      <View style={styles.groupActions}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('groupdetailScreen', {
            groupId: item.id,
            groupName: item.name
          })}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => navigation.navigate('groupmessagingScreen', {
            groupId: item.id,
            groupName: item.name
          })}
        >
          <Ionicons name="chatbox-outline" size={20} color="#3E87FE" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Howudoin</Text>
      <View style={styles.headerLine} />
      <Text style={styles.subHeader}>Groups List...</Text>
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        style={styles.groupList}
      />
      <TouchableOpacity 
        style={[styles.createGroupButton, styles.buttonShadow]}
        onPress={() => navigation.navigate('groupcreationScreen')}
      >
        <Text style={styles.createGroupButtonText}>Create New Group</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={45} color="#FFFFFF" />
          <View style={styles.plusIconWrapper}>
            <Ionicons name="add-circle" size={35} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E87FE',
    marginVertical: 16,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#3E87FE',
    marginTop: 4,
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: -10,
    marginBottom: 16,
  },
  groupList: {
    paddingBottom: 16,
  },
  groupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailsButton: {
    backgroundColor: '#3E87FE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8, // Added margin
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  createGroupButton: {
    backgroundColor: '#3E87FE',
    paddingVertical: 100,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIconWrapper: {
    position: 'absolute',
    right: -12,
    bottom: -12,
  },
  createGroupBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3E87FE',
  },
  createGroupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E87FE',
  },
});
export default GroupScreen;