import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const {navigation} = props;
  const [isConfirm, setIsConfirm] = useState(false);
  const [isResponseAfterTimeout, setIsResponseAfterTimeout] = useState(true);

  const [isFetching, setIsFetching] = useState(false);
  const [isWaitCompetitor, setIsWaitCompetitor] = useState(false);

  useEffect(() => {
    if (isWaitCompetitor) {
      // Set up the interval
      const intervalId = setInterval(onWaitCompetitorReply, 500); // 500ms interval

      const timeoutExpired = setTimeout(() => {
        setIsResponseAfterTimeout(false);
        setTimeout(() => {
          props.navigation.navigate('Game', {
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
    if (isFetching) return; // Exit if a fetch is already in progress

    setIsFetching(true); // Set fetching flag
    try {
      const response = await checkCanStartGameAPI({
        'filters[IdNFC][$eq]': '035E2382511330',
        'filters[Status][$eq]': 'PROGRESS',
      });
      // If the competitor has replied, navigate to the game screen
      const {data} = response;
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsFetching(false); // Reset fetching flag
    }
  };

  const onCheckExistPreviousMatch = async () => {
    const checkExistPreviousMatchParams = {
      'filters[IdNFC][$eq]': '035E2382511330',
      'filters[MatchedIdNFC][$eq]': '015E2332541341',
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
    try {
      const checkStatusMatchPendingParams = {
        'filters[Status][$eq]': '035E2382511330',
        'filters[MatchedIdNFC][$eq]': '015E2332541347',
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
    try {
      const checkExistMatchProgressParams = {
        'filters[IdNFC][$eq]': '035E2382511330',
        'filters[MatchedIdNFC][$eq]': '015E2332541341',
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
    const checkMatchCurrentPendingParams = {
      'filters[MatchedIdNFC][$eq]': '015E2332541347',
      'filters[Status][$eq]': 'PENDING',
    };

    const checkMatchCurrentPendingResponse = await checkMatchPendingAPI(
      checkMatchCurrentPendingParams,
    );

    console.log('checkMatchPendingResponse', checkMatchCurrentPendingResponse);

    if (checkMatchCurrentPendingResponse.data?.length > 0) {
      // checkMatchCurrentPendingResponse.data?.length === 0 means this is the person invited to join
      // for player 2
      console.log('Show notification exists next match');
      const {id} = checkMatchCurrentPendingResponse.data[0];
      await updateStatusToProgressAPI({
        data: {
          IdNFC: '035E2382511336',
          Status: 'PROGRESS',
          Point: 0,
          MatchedIdNFC: '015E2332541341',
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
    } else {
      // checkMatchCurrentPendingResponse.data?.length === 0 means this is the person who started the match first
      // for player 1
      await updateStatusToPendingAPI({
        data: {
          IdNFC: '035E2382511338',
          Status: 'PENDING',
          Point: 0,
          MatchedIdNFC: '015E2332541343',
        },
      });

      setIsWaitCompetitor(true);
    }
  };

  const onCheckBeforeJoinMatch = async () => {
    const isUpdateMatchPendingSuccess = await onCheckAndUpdateMatchPending();
    const isUpdateMatchProgressSuccess = await onCheckAndUpdateMatchProgress();

    if (isUpdateMatchPendingSuccess && isUpdateMatchProgressSuccess) {
      const isExistPreviousMatch = await onCheckExistPreviousMatch();
      if (isExistPreviousMatch) return; // Exit if there is an existing match
      onCheckAndUpdateMatchCurrent();
    }
  };

  const onConfirm = async () => {
    setIsConfirm(true);
    await onCheckBeforeJoinMatch();
  };

  return isConfirm ? (
    isResponseAfterTimeout ? (
      // TODO: Wait for the competitor to reply
      <ImageBackground
        source={require('../../../images/Game/onbording2.png')}
        style={styles.container}></ImageBackground>
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
      <TouchableOpacity style={styles.button} onPress={onConfirm}>
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
  button: {
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
});
export default ConfirmJoinGame;
