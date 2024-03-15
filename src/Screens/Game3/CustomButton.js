import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const CustomButton = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Game1</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0000ff', // A standard blue color for the button background
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    width: '60%', // Set the width to 60% of the screen width
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 14,
    color: 'white',
  },
});

const palette = {
  primary: '#3a8d71',
  accent: '#a2b965',
  secondary: '#FF6347',
  background: '#fdf9d9',
  offBlack: '#171717',
  offWhite: '#fcfcfc',
  grey: '#b0b0b0',
};

export default CustomButton;
