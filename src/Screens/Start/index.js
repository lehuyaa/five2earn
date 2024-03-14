import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function GameHome(props) {
  const {navigation} = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Game', {
            screen: 'Game1',
          })
        }>
        <Text style={styles.buttonText}>Game1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Game', {
            screen: 'Game2',
          })
        }>
        <Text style={styles.buttonText}>Game2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Game', {
            screen: 'Game3',
          })
        }>
        <Text style={styles.buttonText}>Game3</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#add8e6', // A lighter blue color for the background
  },
  button: {
    backgroundColor: '#0000ff', // A standard blue color for the button background
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    width: '60%', // Set the width to 60% of the screen width
    alignItems: 'center', // Center-align text within the button
  },
  buttonText: {
    color: '#ffffff', // White color for the text
    fontSize: 18,
  },
});
export default GameHome;
