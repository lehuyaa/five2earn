import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkCanStartGameAPI,
  checkExistMatchPendingAPI,
  checkExistMatchProgressAPI,
  checkExistPreviousMatchAPI,
  checkMatchPendingAPI,
  updateMatchStatusToCloseAPI,
  updateMatchStatusToLoseAPI,
  updateMatchStatusToProgressAPI,
  updateStatusToPendingAPI,
  updateStatusToProgressAPI,
} from '../../api/modules/api-app/api_game1';

const {width} = Dimensions.get('window');

function ConfirmJoinGame(props) {
  const {navigation, route} = props;
  const [isConfirm, setIsConfirm] = useState(false);
  const [isResponseAfterTimeout, setIsResponseAfterTimeout] = useState(true);

  const [isFetching, setIsFetching] = useState(false);
  const [isWaitCompetitor, setIsWaitCompetitor] = useState(false);
  const [isExistPreviousMatch, setIsExistPreviousMatch] = useState(false);
  const {idNfcCompetitor} = route.params;

  useEffect(() => {
    if (isWaitCompetitor) {
      // Set up the interval
      const intervalId = setInterval(onWaitCompetitorReply, 1000); // 1000ms interval

      const timeoutExpired = setTimeout(() => {
        setIsResponseAfterTimeout(false);
        setIsWaitCompetitor(false);
        setTimeout(() => {
          navigation.navigate('Game', {
            screen: 'GameHome',
          });
        }, 3000);
      }, 15000);

      // Clean up the interval on component unmount
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutExpired);
      };
    }
  }, [isWaitCompetitor]);

  const onWaitCompetitorReply = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    if (isFetching) return; // Exit if a fetch is already in progress

    setIsFetching(true); // Set fetching flag
    try {
      const response = await checkCanStartGameAPI({
        'filters[IdNFC][$eq]': myIDNFC,
        'filters[Status][$eq]': 'PROGRESS',
      });
      // If the competitor has replied, navigate to the game screen
      const {data} = response;
      if (data?.length > 0) {
        console.log('Competitor has replied');
        setIsWaitCompetitor(false);
        navigation.navigate('Game', {
          screen: 'Game1',
          params: {
            idNfcCompetitor,
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsFetching(false); // Reset fetching flag
    }
  };

  const onCheckExistPreviousMatch = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    const checkExistPreviousMatchParams = {
      'filters[IdNFC][$eq]': myIDNFC,
      'filters[MatchedIdNFC][$eq]': idNfcCompetitor,
      'filters[$or][0][Status][$eq]': 'WIN',
      'filters[$or][1][Status][$eq]': 'LOSE',
    };

    const checkExistPreviousMatchResponse = await checkExistPreviousMatchAPI(
      checkExistPreviousMatchParams,
    );

    console.log(
      'checkExistPreviousMatchResponse',
      checkExistPreviousMatchResponse,
    );

    if (checkExistPreviousMatchResponse.data?.length > 0) {
      console.log('Show notification exists previous match');
      return true;
    } else {
      return false;
    }
  };

  const onCheckAndUpdateMatchPending = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    try {
      const checkStatusMatchPendingParams = {
        'filters[IdNFC][$eq]': myIDNFC,
        'filters[Status][$eq]': 'PENDING',
      };
      const checkExistMatchPendingResponse = await checkExistMatchPendingAPI(
        checkStatusMatchPendingParams,
      );

      console.log(
        'checkExistMatchPendingResponse',
        checkExistMatchPendingResponse,
      );

      if (checkExistMatchPendingResponse.data?.length > 0) {
        console.log('Exist MatchPending');
        const {id} = checkExistMatchPendingResponse.data[0];
        await updateMatchStatusToCloseAPI(
          {
            data: {
              Status: 'CLOSE',
            },
          },
          id,
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const onCheckAndUpdateMatchProgress = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    try {
      const checkExistMatchProgressParams = {
        'filters[IdNFC][$eq]': myIDNFC,
        'filters[MatchedIdNFC][$eq]': idNfcCompetitor,
        'filters[Status][$eq]': 'PROGRESS',
      };
      const checkExistMatchProgressResponse = await checkExistMatchProgressAPI(
        checkExistMatchProgressParams,
      );

      console.log(
        'checkExistMatchProgressResponse',
        checkExistMatchProgressResponse,
      );

      if (checkExistMatchProgressResponse.data?.length > 0) {
        console.log('Exist MatchProgress');
        const {id} = checkExistMatchProgressResponse.data[0];
        await updateMatchStatusToLoseAPI(
          {
            data: {
              Status: 'LOSE',
            },
          },
          id,
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const onCheckAndUpdateMatchCurrent = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    const checkMatchCurrentPendingParams = {
      'filters[MatchedIdNFC][$eq]': myIDNFC,
      'filters[Status][$eq]': 'PENDING',
    };

    const checkMatchCurrentPendingResponse = await checkMatchPendingAPI(
      checkMatchCurrentPendingParams,
    );

    console.log('checkMatchPendingResponse', checkMatchCurrentPendingResponse);

    if (checkMatchCurrentPendingResponse.data?.length > 0) {
      // checkMatchCurrentPendingResponse.data?.length === 0 means this is the person invited to join
      // for player 2
      const {id} = checkMatchCurrentPendingResponse.data[0];
      await updateStatusToProgressAPI({
        data: {
          IdNFC: myIDNFC,
          Status: 'PROGRESS',
          Point: 0,
          MatchedIdNFC: idNfcCompetitor,
        },
      });
      await updateMatchStatusToProgressAPI(
        {
          data: {
            Status: 'PROGRESS',
          },
        },
        id,
      );
      navigation.navigate('Game', {
        screen: 'Game1',
        params: {
          myIDNFC,
          idNfcCompetitor,
        },
      });
    } else {
      // checkMatchCurrentPendingResponse.data?.length === 0 means this is the person who started the match first
      // for player 1
      await updateStatusToPendingAPI({
        data: {
          IdNFC: myIDNFC,
          Status: 'PENDING',
          Point: 0,
          MatchedIdNFC: idNfcCompetitor,
        },
      });

      setIsWaitCompetitor(true);
    }
  };

  const onCheckBeforeJoinMatch = async () => {
    const isUpdateMatchPendingSuccess = await onCheckAndUpdateMatchPending();
    const isUpdateMatchProgressSuccess = await onCheckAndUpdateMatchProgress();

    if (isUpdateMatchPendingSuccess && isUpdateMatchProgressSuccess) {
      console.log('Update match pending and progress success');
      // after update match pending and progress success -> check exist previous match
      const isExistPreviousMatch = await onCheckExistPreviousMatch();

      if (isExistPreviousMatch) {
        setIsExistPreviousMatch(true);
        return;
      } // isExistPreviousMatch = true means exist previous match -> show notification
      await onCheckAndUpdateMatchCurrent();
    }
  };

  const onConfirm = async () => {
    setIsConfirm(true);
    await onCheckBeforeJoinMatch();
  };

  // handle okay button navigation to game home
  const handleNext = () => {
    navigation.navigate('Game', {
      screen: 'GameHome',
    });
  };

  return isConfirm ? (
    isResponseAfterTimeout ? (
      // TODO: Wait for the competitor to reply
      <ImageBackground
        source={require('../../../images/Game/onbording2.png')}
        style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isExistPreviousMatch}
          onRequestClose={() => {
            setIsShowModalNotEnough(!isExistPreviousMatch);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                You already played against this opponent. We encourage you to
                find a new opponent for a new game.
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.textStyle}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    ) : (
      // TODO: competitor no reply
      <ImageBackground
        source={require('../../../images/Game/onbording4.png')}
        style={styles.container}></ImageBackground>
    )
  ) : (
    <ImageBackground
      source={require('../../../images/Game/onbording.png')}
      style={styles.container}>
      <TouchableOpacity style={styles.buttonConfirm} onPress={onConfirm}>
        <Text style={styles.buttonText}>Yes, I confirm</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000080', // Adjust the background color to match your theme
    padding: 20,
  },
  buttonConfirm: {
    width: 0.9 * width,
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#553ef4', // Button background color
    borderRadius: 5,
    marginBottom: 80,
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },

  // Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalView: {
    margin: 20,
    backgroundColor: '#553EF4', // Match your color
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF', // White color for the text
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
  },
  modalTextSmall: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF', // White color for the smaller text
    fontSize: 14,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    elevation: 2,
    backgroundColor: '#D3FB51', // Yellow color for the button
    minWidth: '90%',
  },
  textStyle: {
    color: '#553EF4', // Black color for the button text
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
});
export default ConfirmJoinGame;
