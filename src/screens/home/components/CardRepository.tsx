import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { IRepository } from '../../../types/repository';
import { colors } from '../../../themes/colors';
import { getFullName } from '../../../utils/strings';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProps } from '../../../navigation/types';

const CardRepository = ({ item }: { item: IRepository }) => {
  const { navigate } = useNavigation<RootNavigationProps>();

  const handlePress = () => {
    navigate('Detail', { id: item.full_name });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.name}>{getFullName(item.full_name)}</Text>
    </Pressable>
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
