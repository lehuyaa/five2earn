import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkStatusGame,
  createSessionGame,
  getListAnswer,
  updateStatusGame,
} from '../../api/modules/api-app/api_game2';
import {updatePointAPI} from '../../api/modules/nfc/api-nfc';

const {width} = Dimensions.get('window');

function Game2(props) {
  const [statusLevel, setStatusLevel] = useState([]);
  const [listAnswer, setListAnswer] = useState([]);
  const [idGame, setIdGame] = useState();
  const [countLevelCompleted, setCountLevelCompleted] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [listAnswerSended, setListAnswerSended] = useState([]);
  const [result, setResult] = useState([]);
  const [isCompleteGame, setIsCompleteGame] = useState(false);
  const [userName, setUserName] = useState('');
  const progress = ((countLevelCompleted + 1) / 3) * 100;

  useEffect(() => {
    onGetAnswer();
    onGetStatusGame();
  }, [countLevelCompleted]);

  const onGetAnswer = async () => {
    const name = await AsyncStorage.getItem('userName');
    setUserName(name);
    try {
      const response = await getListAnswer();
      console.log('list answer: ', response.data);
      if (response.data?.length > 0) {
        const {Password1, Password2, Password3} = response.data[0].attributes;
        setListAnswer([Password1, Password2, Password3]);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const onGetStatusGame = async () => {
    const myIdNFC = await AsyncStorage.getItem('nfcID');
    try {
      const response = await checkStatusGame({
        'filters[IdNFC][$eq]': myIdNFC,
      });
      console.log('status game: ', response.data);

      if (response.data?.length > 0) {
        const {
          Password1: level1,
          Password2: level2,
          Password3: level3,
          Answer1: answer1,
          Answer2: answer2,
          Answer3: answer3,
        } = response.data[0]?.attributes;

        const numberAnswerSended = [level1, level2, level3].filter(
          (answer) => answer !== null,
        ).length;
        console.log(numberAnswerSended);
        if (numberAnswerSended == 3) {
          setIsCompleteGame(true);
        }
        setResult([level1, level2, level3]);
        setListAnswerSended([answer1, answer2, answer3]);
        setCountLevelCompleted(numberAnswerSended);
        setIdGame(response.data[0].id);
      } else {
        const response = await createSessionGame({
          data: {
            IdNFC: `${myIdNFC}`,
          },
        });
        console.log('create game: ', response.data);
        if (response.data) {
          setResult([null, null, null]);
          setListAnswerSended([null, null, null]);
          setCountLevelCompleted(0);
          setIdGame(response.data?.id);
        }
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const onSubmit = async () => {
    // if input value matches with any of the answer in the list
    const valueSend = inputValue;
    const answerRemaining = listAnswer.filter(
      (element) => !listAnswerSended.includes(element),
    );
    // if answer is correct
    if (answerRemaining.includes(valueSend)) {
      console.log('answer success', answerRemaining);
      const myInfo = JSON.parse(await AsyncStorage.getItem('myInfo'));
      console.log('myInfo: ', myInfo);
      await updateStatusGame(
        {
          data: {
            [`Password${countLevelCompleted + 1}`]: true,
            [`Answer${countLevelCompleted + 1}`]: valueSend,
          },
        },
        idGame,
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
    } else {
      // if answer is incorrect
      console.log(
        'answer incorrect',
        valueSend,
        {
          data: {
            [`Password${countLevelCompleted + 1}`]: false,
            [`Answer${countLevelCompleted + 1}`]: valueSend,
          },
        },
        idGame,
        countLevelCompleted,
      );

      await updateStatusGame(
        {
          data: {
            [`Password${countLevelCompleted + 1}`]: false,
            [`Answer${countLevelCompleted + 1}`]: valueSend,
          },
        },
        idGame,
      );
    }
    setCountLevelCompleted(countLevelCompleted + 1);
    setIsShowConfirmModal(false);
    setInputValue('');
  };

  const onChangeInput = (text) => {
    setInputValue(text);
  };

  return (
    <ImageBackground
      style={styles.grid}
      source={require('../../../images/Game/bg_pattern.png')}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowConfirmModal}
        onRequestClose={() => {
          setIsShowConfirmModal(!isShowConfirmModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure to submit this answer?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={[styles.buttonModal, styles.buttonBack]}
                onPress={() => {
                  setIsShowConfirmModal(false);
                }}>
                <Text style={[styles.textStyle, styles.textStyleButtonBack]}>
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonModal, styles.buttonConfirm]}
                onPress={() => {
                  onSubmit();
                }}>
                <Text style={[styles.textStyle, styles.textStyleButtonConfirm]}>
                  Yes, I'm sure
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            alignItems: 'center',
            paddingBottom: 40,
            justifyContent: 'space-between',
          }}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <View style={styles.infoUserSection}>
              <Image source={require('../../../images/Game/Logo.png')} />
              <View style={{alignItems: 'flex-end'}}>
                <Text>
                  <Text
                    style={{
                      color: '#6d6e71',
                      fontSize: 20,
                      fontWeight: '400',
                      lineHeight: 24,
                    }}>
                    Total point you get:{' '}
                  </Text>
                  <Text
                    style={{
                      color: '#77f94c',
                      fontWeight: '700',
                      fontSize: 16,
                      lineHeight: 19,
                    }}>
                    3 points
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.infoGameSection}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 23,
                  fontWeight: '700',
                  lineHeight: 28.8,
                }}>
                {isCompleteGame ? 'Hi ' + userName : 'Find the Password'}
              </Text>
              <Text
                style={{
                  color: '#D1D3D4',
                  fontSize: 16,
                  fontWeight: '400',
                  lineHeight: 19,
                  marginTop: 10,
                }}>
                {isCompleteGame
                  ? 'Here is your results'
                  : `Rules: 
There are 3 secret phrases hidden around the corners of this event venue. Try to collect them all. Each discovery will be rewarded 3 points. You have only 3 limited attempts, so use them wisely.`}
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
                <Text style={styles.sessionText}>Password</Text>
                <Text style={styles.sessionCount}>{`${
                  countLevelCompleted >= 3 ? 3 : countLevelCompleted + 1
                } of ${3}`}</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, {width: `${progress}%`}]} />
              </View>
            </View>

            {isCompleteGame ? (
              <View style={styles.gameSections}>
                <View style={styles.password}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Password 2</Text>
                    {result[0] ? (
                      <Image
                        source={require('../../../images/Game/v-icon.png')}
                        style={styles.icon}
                      />
                    ) : (
                      <Image
                        source={require('../../../images/Game/x-icon.png')}
                        style={styles.icon}
                      />
                    )}
                  </View>
                  <TextInput
                    editable={false}
                    style={styles.input}
                    value={listAnswerSended[0]}
                  />
                </View>

                <View style={styles.password}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Password 2</Text>
                    {result[1] ? (
                      <Image
                        source={require('../../../images/Game/v-icon.png')}
                        style={styles.icon}
                      />
                    ) : (
                      <Image
                        source={require('../../../images/Game/x-icon.png')}
                        style={styles.icon}
                      />
                    )}
                  </View>
                  <TextInput
                    editable={false}
                    style={styles.input}
                    value={listAnswerSended[1]}
                  />
                </View>
                <View style={styles.password}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Password 2</Text>
                    {result[2] ? (
                      <Image
                        source={require('../../../images/Game/v-icon.png')}
                        style={styles.icon}
                      />
                    ) : (
                      <Image
                        source={require('../../../images/Game/x-icon.png')}
                        style={styles.icon}
                      />
                    )}
                  </View>
                  <TextInput
                    editable={false}
                    style={styles.input}
                    value={listAnswerSended[2]}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.gameSections}>
                <View
                  style={{
                    ...styles.passwordInput,
                    marginBottom: !isCompleteGame ? 150 : 0,
                  }}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      Password {countLevelCompleted + 1}
                    </Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={inputValue}
                    placeholder={
                      'Input your password ' + (countLevelCompleted + 1)
                    }
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    onChangeText={onChangeInput}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Next button */}
          {isCompleteGame ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() =>
                props.navigation.navigate('Game', {
                  screen: 'GameHome',
                })
              }>
              <Text style={styles.nextButtonText}>
                Back to Select Game Page
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setIsShowConfirmModal(true)}>
              <Text style={styles.nextButtonText}>
                {countLevelCompleted > 2 ? 'View your result ' : 'Next'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
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
    width: '90%',
    marginTop: 30,
  },
  infoGameSection: {
    width: '90%',
    marginTop: 30,
  },
  containerProgress: {
    marginTop: 20,
    marginBottom: 20,
    height: '10%',
    width: '90%',
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
  passwordInput: {
    width: '100%',
    padding: 10,
    paddingBottom: 20,
    backgroundColor: '#242731',
    borderRadius: 10,
    alignSelf: 'center',
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

  // Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalView: {
    width: '90%',
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
    color: '#FFFFFF', // White color for the text
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  buttonModal: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    // marginHorizontal: 20,
  },
  buttonBack: {
    backgroundColor: '#553EF4',
    borderWidth: 2,
    borderColor: '#D3FB51',
    borderStyle: 'solid',
    paddingHorizontal: 45,
  },
  buttonConfirm: {
    backgroundColor: '#D3FB51', // Teal
  },
  textStyle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  textStyleButtonBack: {
    color: '#D3FB51', // Dark yellow
  },
  textStyleButtonConfirm: {
    color: '#553EF4', // Teal
  },
});
export default Game2;
