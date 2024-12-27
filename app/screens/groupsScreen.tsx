import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
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
  const [searchGroup, setSearchGroup] = useState('');

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
      <Text style={styles.subHeader}>Find groups...</Text>
      
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search groups by id" 
            placeholderTextColor="#9CA3AF"
            value={searchGroup}
            onChangeText={setSearchGroup}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => handleSearchGroup(searchGroup)}
        >
          <Text style={styles.buttonText}>Search Group</Text>
        </TouchableOpacity>
      </View>

      {/* <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        style={styles.groupList}
      /> */}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 3,
  },
  searchSection: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E87FE',
    borderRadius: 8,
    padding: 8,
    width: '90%',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
    color: '#3E87FE',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    padding: 8,
  },
  searchButton: {
    backgroundColor: '#3E87FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderRadius: 15,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
  },
  createGroupButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    right: -14,
    bottom: -16,
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
  arrowContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  arrowSvg: {
    width: 24,
    height: 24,
  }
});
export default GroupScreen;