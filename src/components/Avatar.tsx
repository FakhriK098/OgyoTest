import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '@themes/colors';
import { IAvatarProps } from 'src/types/profile';

const Avatar = ({ url, width, height }: IAvatarProps) => {
  return (
    <View style={styles.containerAvatar}>
      <Image source={{ uri: url }} style={[styles.avatar, { width, height }]} />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  containerAvatar: {
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: colors.white,
    borderRadius: 50,
  },
  avatar: {
    borderRadius: 50,
  },
});
