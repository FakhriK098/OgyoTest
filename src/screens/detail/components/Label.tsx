import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ILabelProps } from 'src/types/user';

const Label = ({ title, value }: ILabelProps) => {
  if (!value) return <></>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${title}:`}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default Label;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '90%',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    marginRight: 4,
  },
});
