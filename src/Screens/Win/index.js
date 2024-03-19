import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const {width} = Dimensions.get('window');

function WinScreen(props) {
  const handleNext = () => {
    props.navigation.navigate('Game', {
      screen: 'GameHome',
    });
  };

  return (
    <ImageBackground
      style={[styles.container]}
      source={require('../../../images/Game/win_bg.png')}>
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
            Congratulation Cuong!
          </Text>
          <Text
            style={{
              color: '#D1D3D4',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 19,
              marginTop: 10,
            }}>
            You did a awesome match, got 1 point and became the winner for this
            game!
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Back to Select game page</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    // justifyContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#add8e6',
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

export default WinScreen;
