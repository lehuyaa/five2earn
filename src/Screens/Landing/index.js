import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as AppContext from '../../AppContext';
import NfcProxy from '../../NfcProxy';
import request from '../../api/request';
import {checkFirstJoinAPI} from '../../api/modules/api-app/api_game1';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LandingScreen(props) {
  const opacityAnimValue = React.useRef(new Animated.Value(0)).current;
  const scaleAnimValue = React.useRef(new Animated.Value(1)).current;
  const [isNfcSupported, setIsNfcSupported] = React.useState(null);

  React.useEffect(() => {
    async function initialize() {
      Animated.timing(opacityAnimValue, {
        duration: 1000,
        toValue: 1,
        useNativeDriver: true,
      }).start();

      await delay(1000);

      Animated.parallel([
        Animated.timing(opacityAnimValue, {
          duration: 350,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimValue, {
          duration: 350,
          toValue: 6,
          useNativeDriver: true,
        }),
      ]).start();

      await delay(500);

      await AppContext.Actions.initStorage();

      const success = await NfcProxy.init();
      setIsNfcSupported(success);

      if (success) {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    }

    initialize();
  }, [props.navigation, opacityAnimValue, scaleAnimValue]);

  const checkFirstJoinFunc = async () => {
    props.navigation.navigate('Game', {
      screen: 'GameHome',
    });
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../images/nfc-rewriter-icon.png')}
        resizeMode="contain"
        style={[
          styles.image,
          {opacity: opacityAnimValue, transform: [{scale: scaleAnimValue}]},
        ]}
      />
      <TouchableOpacity
        onPress={checkFirstJoinFunc}
        style={{
          width: 100,
          height: 50,
          backgroundColor: 'red',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Check</Text>
      </TouchableOpacity>
      {isNfcSupported === false ? (
        <Text style={{fontSize: 24, padding: 20}}>
          Your device doesn't support NFC
        </Text>
      ) : (
        <ActivityIndicator size="large" style={{marginTop: 50}} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
  },
});

export default LandingScreen;
