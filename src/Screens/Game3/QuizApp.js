import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import CustomButton from './CustomButton';

function QuizApp() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.gameContainer}>
        <Text style={styles.title}>Question 1</Text>
        <Text style={styles.question}>
          What is the meaning of UI UX Design ?
        </Text>
        <View style={styles.buttonContainer}>
          {true &&
            [1, 2, 3, 4].map((answer, index) => (
              <CustomButton
                key={`${answer}-${index}`}
                buttonText={answer}
                onPress={() => null}
                type="primary"
                fullWidth
              />
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const palette = {
  primary: '#3a8d71',
  accent: '#a2b965',
  secondary: '#FF6347',
  background: '#fdf9d9',
  offBlack: '#171717',
  offWhite: '#fcfcfc',
  grey: '#b0b0b0',
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  gameContainer: {
    width: '80%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: palette.primary,
  },
  question: {
    fontSize: 16,
    color: palette.offBlack,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default QuizApp;
