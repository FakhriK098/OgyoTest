import { StyleSheet, View } from 'react-native';
import React from 'react';

const ItemSeparator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 8,
  },
});

export default ItemSeparator;
