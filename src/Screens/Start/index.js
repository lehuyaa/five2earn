import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {checkNFC, getShowGameAPI} from '../../api/modules/nfc/api-nfc';
import {useScanNFC} from '../../hooks/useScanNFC';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

function GameHome(props) {
  const {navigation} = props;
  const {scanNFC} = useScanNFC();
  const [isShowModalInvalid, setIsShowModalInvalid] = useState(false);
  const [userName, setUserName] = useState('');
  const [infoGames, setInfoGames] = useState({
    FindTheSpecialOne: true,
    FindThePassword: true,
    NetworkingQuiz: null,
  });

  useEffect(() => {
    getUserName();
    getInfoGames();
  }, []);

  const getInfoGames = async () => {
    const info = await getShowGameAPI();
    if (info.data?.length > 0) {
      const {FindTheSpecialOne, FindThePassword, NetworkingQuiz} =
        info.data[0].attributes;
      setInfoGames({
        ...infoGames,
        FindTheSpecialOne,
        FindThePassword,
        NetworkingQuiz,
      });
    }
  };

  const getUserName = async () => {
    const name = await AsyncStorage.getItem('userName');
    console.log('name', name);
    setUserName(name);
  };

  const checkNFCRq = async (nfcId) => {
    try {
      const check = await checkNFC(nfcId);
      return check;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  };

  const onJoinGame = async (idGame) => {
    if (idGame === 0) {
      const tag = await scanNFC();
      if (tag.id) {
        const check = await checkNFCRq(tag.id);
        if (check?.meta?.pagination?.total === 1) {
          navigation.navigate('Game', {
            screen: 'ConfirmJoinGame',
            params: {
              idNfcCompetitor: tag.id,
            },
          });
        }
      } else {
        setIsShowModalInvalid(true);
      }
    }

    if (idGame === 1) {
      navigation.navigate('Game', {
        screen: 'Game2',
      });
    }

    if (idGame === 2) {
      const tag = await scanNFC();
      if (tag.id) {
        const check = await checkNFCRq(tag.id);
        if (check?.meta?.pagination?.total === 1) {
          navigation.navigate('Game', {
            screen: 'Game3',
          });
        }
      } else {
        setIsShowModalInvalid(true);
      }
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../images/Game/bg_pattern.png')}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowModalInvalid}
        onRequestClose={() => {
          setIsShowModalInvalid(!isShowModalInvalid);
        }}>
        <View style={styles.centeredView}>
          <ImageBackground
            style={styles.modalView}
            source={require('../../../images/Game/404_bg.png')}>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => setIsShowModalInvalid(false)}>
              <Image source={require('../../../images/Game/close_icon.png')} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
      <View style={styles.info}>
        <Text style={styles.userName}>Hi, Mr. {userName}!</Text>
        <Text style={styles.sub}>
          Please select one game from the list of games provided below.
        </Text>
      </View>
      <View style={styles.btnGroup}>
        {infoGames.FindTheSpecialOne && (
          <TouchableOpacity style={styles.button} onPress={() => onJoinGame(0)}>
            <Image source={require('../../../images/Game/logo_game.png')} />
            <View style={{width: '80%', paddingHorizontal: 15}}>
              <Text style={styles.buttonText}>
                Game 1: Find the Special One
              </Text>
              <Text style={styles.description}>
                Play against an opponent and gain points
              </Text>
            </View>
            <Image source={require('../../../images/Game/arrow_icon.png')} />
          </TouchableOpacity>
        )}

        {infoGames.FindThePassword && (
          <TouchableOpacity style={styles.button} onPress={() => onJoinGame(1)}>
            <Image source={require('../../../images/Game/logo_game.png')} />
            <View style={{width: '80%', paddingHorizontal: 15}}>
              <Text style={styles.buttonText}>Game 2: Find the Password</Text>
              <Text style={styles.description}>
                Collect secret phases hidden in the event
              </Text>
            </View>
            <Image source={require('../../../images/Game/arrow_icon.png')} />
          </TouchableOpacity>
        )}

        {infoGames.NetworkingQuiz && (
          <TouchableOpacity style={styles.button} onPress={() => onJoinGame(2)}>
            <Image source={require('../../../images/Game/logo_game.png')} />
            <View style={{width: '80%', paddingHorizontal: 15}}>
              <Text style={styles.buttonText}>Game 3: Networking Quiz</Text>
              <Text style={styles.description}>
                Test your Phygital knowledge while making new friends
              </Text>
            </View>
            <Image source={require('../../../images/Game/arrow_icon.png')} />
          </TouchableOpacity>
        )}
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
    backgroundColor: '#242731',
    overflow: 'hidden',
  },

  button: {
    flexDirection: 'row',
    backgroundColor: '#242731', // A standard blue color for the button background
    padding: 20,
    alignItems: 'center',
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

  // Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalView: {
    height: 380,
    width: width * 0.9,
    borderRadius: 20,
    alignItems: 'flex-end',
  },

  buttonModal: {
    margin: 20,
  },
});
export default GameHome;
