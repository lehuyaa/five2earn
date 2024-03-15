import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
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
  checkStatusMatchPendingAPI,
  updateMatchStatusToCloseAPI,
  updateMatchStatusToLoseAPI,
  updateMatchStatusToProgressAPI,
  updateStatusToPendingAPI,
  updateStatusToProgressAPI,
} from '../../api/modules/api-app/api_game1';

function GameHome(props) {
  const {navigation} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [isWaitCompetitor, setIsWaitCompetitor] = useState(false);

  useEffect(() => {
    if (isWaitCompetitor) {
      // Set up the interval
      const intervalId = setInterval(onWaitCompetitorReply, 500); // 500ms interval

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
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
      const {data} = response;
      console.log(data);
      // Handle with data here
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
    // const isUpdateMatchPendingSuccess = await onCheckAndUpdateMatchPending();
    // const isUpdateMatchProgressSuccess = await onCheckAndUpdateMatchProgress();

    // if (isUpdateMatchPendingSuccess && isUpdateMatchProgressSuccess) {
    //   const isExistPreviousMatch = await onCheckExistPreviousMatch();
    //   if (isExistPreviousMatch) return; // Exit if there is an existing match
    //   onCheckAndUpdateMatchCurrent();
    // }

    props.navigation.navigate('Game', {
      screen: 'Game1',
    });
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => onCheckBeforeJoinMatch()}>
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View>
            <Text style={styles.buttonText}>Game1</Text>
            <Text style={styles.description}>Game details description.</Text>
          </View>
          <Image source={require('../../../images/Game/arrow_icon.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Game', {
              screen: 'Game2',
            })
          }>
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View>
            <Text style={styles.buttonText}>Game2</Text>
            <Text style={styles.description}>Game details description.</Text>
          </View>
          <Image source={require('../../../images/Game/arrow_icon.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Game', {
              screen: 'Game3',
            })
          }>
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
