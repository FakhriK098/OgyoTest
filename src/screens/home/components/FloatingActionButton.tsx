import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { IFloatingActionButtonProps } from '../../../types/home';

const FloatingActionButton: React.FC<IFloatingActionButtonProps> = ({
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Filter Sort</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    borderRadius: 28,
    width: 100,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    padding: 8,
  },
  text: {
    fontSize: 16,
    color: colors.black,
  },
  container: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingActionButton;
