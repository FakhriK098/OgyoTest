import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const UserScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <Text style={styles.headerSubtitle}>GitHub Users</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#24292e',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
});

export default UserScreen;
