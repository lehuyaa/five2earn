import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ImageBackground} from 'react-native';
import {Text} from 'react-native';

function LoseScreen() {
  const handleNext = () => {
    props.navigation.navigate('Game', {
      screen: 'GameHome',
    });
  };

  return (
    <View style={[styles.container]}>
      <View>
        <View style={styles.infoUserSection}>
          <Image source={require('../../../images/Game/Logo.png')} />
        </View>

        <View style={styles.infoGameSection}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: '700',
              lineHeight: 28.8,
            }}>
            Hey Cuong!
          </Text>
          <Text
            style={{
              color: '#D1D3D4',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 19,
              marginTop: 10,
            }}>
            I'm sorry to inform you that you have lost the game and did not earn
            any points. However, I hope you still had a fun time playing.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Back to Select game page</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    // justifyContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151515',
  },
  infoUserSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '86%',
    marginTop: 30,
  },
  infoGameSection: {
    width: '86%',
    marginTop: 30,
  },
  nextButton: {
    backgroundColor: '#553EF4',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '90%',
    marginBottom: 50,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 24,
  },
});
export default LoseScreen;
