import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkExistMatchProgressAPI,
  checkProgressionCompetitorAPI,
  updateMatchStatusToLoseAPI,
} from '../../api/modules/api-app/api_game1';
import {updatePointAPI} from '../../api/modules/nfc/api-nfc';
import Card from './components/Card';
import JiggleCard from './components/JiggleCard';

const {width} = Dimensions.get('window');

const MARGIN_PERCENT = 2;
const squareMargin = (width * MARGIN_PERCENT) / 100;
const squareWidth = (width * 0.9 - squareMargin * 6) / 5;

function Game1(props) {
  const {navigation, route} = props;
  const [boardImages, setBoardImages] = useState([]);
  const [countLevelCompleted, setCountLevelCompleted] = useState(0);
  const [imageCorrect, setImageCorrect] = useState();
  const [isShowModalNotEnough, setIsShowModalNotEnough] = useState(false);
  const [timer, setTimer] = useState(15);
  const [isClearTimeoutSoWin, setIsClearTimeoutSoWin] = useState(false);
  const progress = ((countLevelCompleted + 1) / 5) * 100;
  const {idNfcCompetitor} = route.params;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getUserName();
  }, []);

  const getUserName = async () => {
    const name = await AsyncStorage.getItem('userName');
    console.log('name', name);
    setUserName(name);
  };

  // TODO: count down time
  useEffect(() => {
    // If the timer is 0, return early to stop the countdown
    if (timer === 0) {
      // handle loser
      setIsShowModalNotEnough(true);
      handleLose();
      return;
    }

    // Create a timeout to decrease the timer value by 1 every second
    const interval = setTimeout(() => {
      setTimer(timer - 1);
    }, 2000);

    if (isClearTimeoutSoWin || isShowModalNotEnough) {
      clearTimeout(interval);
    }
    // Clear the timeout if the component is unmounted or timer reaches 0
    return () => clearTimeout(interval);
  }, [timer]);

  useEffect(() => {
    setBoardImages(shuffleAndPickImages(images));
  }, [countLevelCompleted]);

  // Imagine these are your images imported from your assets
  const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // 13 represents the unique image

  function shuffleAndPickImages(images) {
    // Randomly select a unique image
    const uniqueIndex = Math.floor(Math.random() * images.length);
    const uniqueImage = images[uniqueIndex];

    // Duplicate images except for the unique one
    let duplicatedImages = images.flatMap((image, index) =>
      index === uniqueIndex ? [] : [image, image],
    );

    // Add the unique image
    duplicatedImages.push(uniqueImage);
    setImageCorrect(uniqueImage);

    // Shuffle and return the images
    return shuffleArray(duplicatedImages);
  }

  function shuffleArray(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const handlePress = async (image) => {
    console.log('image choose: ', image, imageCorrect);
    if (imageCorrect == image) {
      // first check progress of competitor
      const isCompetitorWin = await onCheckResultOfMatch();

      // if competitor win -> show lose notification
      if (isCompetitorWin) {
        await handleLose();
        setIsClearTimeoutSoWin(true);
        navigation.navigate('Game', {
          screen: 'Lose',
        });
      } else {
        // if competitor no win -> continue -> if countLevelCompleted == 4 -> show winner notification
        if (countLevelCompleted == 4) {
          // handle winner
          await handleWin();
          setIsClearTimeoutSoWin(true);
          navigation.navigate('Game', {
            screen: 'Win',
          });
        } else {
          setCountLevelCompleted(countLevelCompleted + 1);
          setTimer(15);
        }
      }
    }
  };

  const onCheckResultOfMatch = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    try {
      const responseCheckProgressionCompetitor =
        await checkProgressionCompetitorAPI({
          'filters[IdNFC][$eq]': idNfcCompetitor,
          'filters[MatchedIdNFC][$eq]': myIDNFC,
          'filters[Status][$eq]': 'WIN',
        });
      console.log(
        'responseCheckProgressionCompetitor: ',
        responseCheckProgressionCompetitor,
      );
      if (responseCheckProgressionCompetitor.data.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('error of responseCheckProgressionCompetitor: ', error);
    }
  };

  // handle okay button navigation to game home
  const handleNext = () => {
    navigation.navigate('Game', {
      screen: 'GameHome',
    });
  };

  // handle lose
  const handleLose = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    const infoCurrentMatch = await checkExistMatchProgressAPI({
      'filters[IdNFC][$eq]': myIDNFC,
      'filters[MatchedIdNFC][$eq]': idNfcCompetitor,
      'filters[Status][$eq]': 'PROGRESS',
    });
    const {id} = infoCurrentMatch.data[0];
    await updateMatchStatusToLoseAPI(
      {
        data: {
          Status: 'LOSE',
        },
      },
      id,
    );
  };

  const handleWin = async () => {
    const myIDNFC = await AsyncStorage.getItem('nfcID');
    const infoCurrentMatch = await checkExistMatchProgressAPI({
      'filters[IdNFC][$eq]': myIDNFC,
      'filters[MatchedIdNFC][$eq]': idNfcCompetitor,
      'filters[Status][$eq]': 'PROGRESS',
    });

    const myInfo = JSON.parse(await AsyncStorage.getItem('myInfo'));
    const {id} = infoCurrentMatch.data[0];
    await updateMatchStatusToLoseAPI(
      {
        data: {
          Status: 'WIN',
        },
      },
      id,
    );

    const response = await updatePointAPI(
      {
        data: {
          Point: myInfo.attributes?.Point + 1,
        },
      },
      myInfo.id,
    );

    if (response.data)
      await AsyncStorage.setItem('myInfo', JSON.stringify(response?.data));
  };
  return (
    <View style={styles.grid}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowModalNotEnough}
        onRequestClose={() => {
          setIsShowModalNotEnough(!isShowModalNotEnough);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Sorry, you will get NO points for this match. Please find other
              opponents to continue the game
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.textStyle}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.infoUserSection}>
        <Image source={require('../../../images/Game/Logo.png')} />
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={{
              color: '#77F94C',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: 24,
            }}>
            {userName || ''}
          </Text>
          <Text>
            <Text
              style={{
                color: '#6d6e71',
                fontSize: 20,
                fontWeight: '400',
                lineHeight: 24,
              }}>
              Time left:{' '}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 20,
                fontWeight: '400',
                lineHeight: 24,
              }}>
              00:00:{timer} s
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.infoGameSection}>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 28.8,
          }}>
          Choose your correct answer
        </Text>
        <Text
          style={{
            color: '#D1D3D4',
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 19,
            marginTop: 10,
          }}>
          You are allowed a maximum of 5 numbers for this game
        </Text>
      </View>

      <View style={styles.containerProgress}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={styles.sessionText}>Session</Text>
          <Text style={styles.sessionCount}>{`${
            countLevelCompleted + 1
          } of ${5}`}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
        </View>
      </View>

      <View style={styles.gameSections}>
        {boardImages.map((image, index) => (
          <TouchableOpacity
            onPress={() => handlePress(image)}
            style={styles.box}>
            {image == imageCorrect ? (
              <Card value={image} onFlipImage={() => handlePress(image)} />
            ) : (
              <JiggleCard
                value={image}
                onFlipImage={() => handlePress(image)}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#151515',
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
  gameSections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: squareMargin,
  },
  box: {
    width: squareWidth,
    height: squareWidth,
    justifyContent: 'center',
    alignItems: 'center',
    margin: squareMargin / 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  containerProgress: {
    marginTop: 20,
    height: '10%',
    width: width * 0.86,
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

export default Game1;
