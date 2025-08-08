import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Text>Hello World</Text>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
