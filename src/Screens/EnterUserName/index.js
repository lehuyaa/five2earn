import React, {useState} from 'react';
import {
  Button,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {sendUserNameAPI} from '../../api/modules/nfc/api-nfc';
import AsyncStorage from '@react-native-async-storage/async-storage';

function InputUserNameSceen(props) {
  const [name, setName] = useState('');
  const {navigation} = props;

  const onSendUserName = async () => {
    const idNfc = await AsyncStorage.getItem('nfcID');
    console.log('idNfc', idNfc);
    let data = {
      data: {
        IdNFC: idNfc,
        Name: name,
        Point: 0,
      },
    };

    const response = await sendUserNameAPI(data);
    if (response?.data) {
      await AsyncStorage.setItem('userName', name);
      navigation.navigate('Game', {
        screen: 'GameHome',
      });
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../../images/Game/bg_pattern.png')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View>
              <Text style={styles.headerText}>
                Please input your name so we can continue to play game.
              </Text>
              <Text style={styles.inputLabel}>Your name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Input your name"
                placeholderTextColor="#A7A7A7"
              />
            </View>

            <View>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={onSendUserName}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  headerText: {
    color: '#77F94C',
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'left',
    fontWeight: '700',
    lineHeight: 34,
  },
  inputLabel: {
    color: '#FFFFFF',
    marginBottom: 5,
    fontWeight: '500',
    lineHeight: 20,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#553EF4',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonConfirm: {
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#553ef4', // Button background color
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },

  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
    paddingVertical: 50,
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default InputUserNameSceen;
