import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function GameHome(props) {
  const {navigation} = props;

  const onJoinGame = async (idGame) => {
    if (idGame === 0) {
      navigation.navigate('Game', {
        screen: 'ConfirmJoinGame',
      });
    }
    if (idGame === 1) {
      navigation.navigate('Game', {
        screen: 'Game2',
      });
    }
    if (idGame === 2) {
      navigation.navigate('Game', {
        screen: 'Game3',
      });
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../images/Game/bg_pattern.png')}>
      <View style={styles.info}>
        <Text style={styles.userName}>Hi, Mr. Dat!</Text>
        <Text style={styles.sub}>
          Please select one game from the list of games provided below.
        </Text>
      </View>
      <View style={styles.btnGroup}>
        <TouchableOpacity style={styles.button} onPress={() => onJoinGame(0)}>
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View>
            <Text style={styles.buttonText}>Game1</Text>
            <Text style={styles.description}>Game details description.</Text>
          </View>
          <Image source={require('../../../images/Game/arrow_icon.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => onJoinGame(1)}>
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View>
            <Text style={styles.buttonText}>Game2</Text>
            <Text style={styles.description}>Game details description.</Text>
          </View>
          <Image source={require('../../../images/Game/arrow_icon.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => onJoinGame(2)}>
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View>
            <Text style={styles.buttonText}>Game3</Text>
            <Text style={styles.description}>Game details description.</Text>
          </View>
          <Image source={require('../../../images/Game/arrow_icon.png')} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#add8e6',
  },

  info: {
    width: '85%',
    paddingBottom: 40,
  },
  userName: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 48,
  },
  sub: {
    fontSize: 20,
    fontWeight: '400',
    color: '#D1D3D4',
    lineHeight: 24,
  },
  btnGroup: {
    display: 'flex',
    borderRadius: 10,
    width: '85%',
    backgroundColor: '#242731',
    overflow: 'hidden',
  },

  button: {
    flexDirection: 'row',
    backgroundColor: '#242731', // A standard blue color for the button background
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between', // Center-align text within the button
  },

  buttonText: {
    color: '#FFFFFF', // White color for the text
    fontSize: 18,
    fontWeight: '700',
  },

  description: {
    fontSize: 14,
    lineHeight: 16.8,
    color: '#D1D3D4',
  },
});
export default GameHome;
