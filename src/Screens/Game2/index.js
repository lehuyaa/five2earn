import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');

function Game2(props) {
  const progress = (1 / 5) * 100;

  return (
    <ImageBackground
      style={styles.grid}
      source={require('../../../images/Game/bg_pattern.png')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            alignItems: 'center',
            paddingBottom: 40,
          }}>
          <View style={styles.infoUserSection}>
            <Image source={require('../../../images/Game/Logo.png')} />
            <View style={{alignItems: 'flex-end'}}>
              <Text>
                <Text
                  style={{
                    color: '#6d6e71',
                    fontSize: 20,
                    fontWeight: '400',
                    lineHeight: 24,
                  }}>
                  Total point you get:{' '}
                </Text>
                <Text
                  style={{
                    color: '#77f94c',
                    fontWeight: '700',
                    fontSize: 16,
                    lineHeight: 19,
                  }}>
                  3 points
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoGameSection}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 23,
                fontWeight: '700',
                lineHeight: 28.8,
              }}>
              Choose your correct password
            </Text>
            <Text
              style={{
                color: '#D1D3D4',
                fontSize: 16,
                fontWeight: '400',
                lineHeight: 19,
                marginTop: 10,
              }}>
              You are allowed 3 passwords for this game
            </Text>
          </View>

          <View style={styles.containerProgress}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Text style={styles.sessionText}>Password</Text>
              <Text style={styles.sessionCount}>{`${1} of ${3}`}</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, {width: `${progress}%`}]} />
            </View>
          </View>

          <View style={styles.gameSections}>
            <View style={styles.password}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Password 1</Text>
                <Image
                  source={require('../../../images/Game/x-icon.png')}
                  style={styles.icon}
                />
              </View>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Input your password 1"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={styles.password}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Password 2</Text>
                <Image
                  source={require('../../../images/Game/x-icon.png')}
                  style={styles.icon}
                />
              </View>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Input your password 2"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={styles.password}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Password 3</Text>
                <Image
                  source={require('../../../images/Game/x-icon.png')}
                  style={styles.icon}
                />
              </View>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Input your password 3"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
          </View>
          {/* Next button */}
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    height: '100%',
  },
  infoUserSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.86,
    marginTop: 30,
  },
  infoGameSection: {
    width: width * 0.86,
    marginTop: 30,
  },
  containerProgress: {
    marginTop: 20,
    height: '10%',
    width: width * 0.86,
  },
  sessionText: {
    color: '#D3FB51', // Text color for the 'Session' label
    marginRight: 5,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  progressBarContainer: {
    flex: 1,
    maxHeight: 10,
    backgroundColor: 'grey', // Background color of the full progress bar
    borderRadius: 10,
    overflow: 'hidden', // Ensure the inner bar does not exceed the container's rounded corners
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D3FB51', // Color for the progress indicator
  },
  sessionCount: {
    color: '#D3FB51', // Text color for the '1 of 5' label
    marginLeft: 5,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
  },
  gameSections: {
    width: '90%',
    marginBottom: 20,
  },
  password: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 30,
    backgroundColor: '#242731',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#553ef4',
    color: '#fff',
    fontSize: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  icon: {
    width: 36,
    height: 36,
  },
  nextButton: {
    backgroundColor: '#D3FB51',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '90%',
  },
  nextButtonText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 24,
  },
});
export default Game2;
