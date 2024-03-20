import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function Test(props) {
  const [myIDNFC, setMyIDNFC] = useState('');
  const [idNfcCompetitor, setIdNfcCompetior] = useState('');

  // handle onChange inputs
  const handleMyIDNFC = (text) => {
    setMyIDNFC(text);
  };
  const handleIdNFCCompetior = (text) => {
    setIdNfcCompetior(text);
  };

  // handle next button send myIDNFC,idNfcCompetitor to next screen use navigation
  const handleNext = async () => {
    // do something
    console.log('myIDNFC', myIDNFC);
    console.log('idNfcCompetitor', idNfcCompetitor);
    await AsyncStorage.setItem('nfcID', myIDNFC);
    props.navigation.navigate('Game', {
      screen: 'ConfirmJoinGame',
      params: {
        myIDNFC,
        idNfcCompetitor,
      },
    });
  };
  return (
    <View style={styles.gameSections}>
      <View style={styles.password}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>myIDNFC</Text>
          <Image
            source={require('../../../images/Game/x-icon.png')}
            style={styles.icon}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Input your password 2"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={myIDNFC}
          onChangeText={handleMyIDNFC}
        />
      </View>

      <View style={styles.password}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>idNfcCompetitor</Text>
          <Image
            source={require('../../../images/Game/x-icon.png')}
            style={styles.icon}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Input your password 3"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          myIDNFC={idNfcCompetitor}
          onChangeText={handleIdNFCCompetior}
        />
      </View>
      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
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
    width: '86%',
    marginTop: 30,
  },
  infoGameSection: {
    width: '86%',
    marginTop: 30,
  },
  containerProgress: {
    marginTop: 20,
    height: '10%',
    width: '86%',
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
export default Test;
