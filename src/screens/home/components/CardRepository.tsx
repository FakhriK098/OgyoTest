import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IRepository } from '../../../types/repository';
import { colors } from '../../../themes/colors';
import { getFullName } from '../../../utils/strings';

const CardRepository = ({ item }: { item: IRepository }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.name}>{getFullName(item.full_name)}</Text>
    </View>
  );
};

export default CardRepository;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'medium',
    color: colors.black,
  },
  name: {
    fontSize: 8,
    fontWeight: 'light',
    color: colors.shade800,
    marginTop: 4,
  },
});
