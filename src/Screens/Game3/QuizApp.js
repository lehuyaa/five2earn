import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Question from './Question';
import Result from './Result';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ConfirmModal from './ConfirmModal';
import {requestAnswer} from '../../api/modules/nfc/api-nfc';
const padding = 16;
const width = Dimensions.get('window').width - 2 * padding;
import {AsyncStorage} from 'react-native';
import History from './History';
import {getIndexQuestion, getQuestion} from '../../api/modules/nfc/api-nfc';

function QuizApp(props) {
  const [tick, setTick] = React.useState('');
  const [question, setQuestion] = React.useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const [answer, setAnswer] = React.useState('');
  const [isResult, setIsResult] = React.useState(false);
  const [isHistory, setIsHistory] = React.useState(false);
  const getIndex = async () => {
    try {
      const nfcID = await AsyncStorage.getItem('nfcID');

      const res = await getIndexQuestion(nfcID);
      const index = res?.meta?.pagination?.total + 1;
      const resQuestion = await getQuestion(index);
      // const resQuestion = null;
      setQuestion(
        resQuestion?.data[0].attributes || {
          Content: 'On which blockchain is AN1 based?',
          Answer1: 'A - Binance Chain',
          Answer2: 'B - Ethereum',
          Answer3: 'C - Polygon',
          createdAt: '2024-03-18T16:25:09.225Z',
          updatedAt: '2024-03-18T16:41:12.425Z',
          publishedAt: '2024-03-18T16:26:46.673Z',
          CorrectAnswer: 'Answer1',
          STT: 2,
        },
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Have some errors',
      });
    }
  };

  useEffect(() => {
    getIndex();
  }, []);

  if (isHistory) {
    return <History />;
  }

  const submit = async () => {
    try {
      const nfcID = await AsyncStorage.getItem('nfcID');
      const res = await requestAnswer({
        data: {
          IdNFC: nfcID,
          MatchedIdNFC: props.matchId,
          Question: question.Content,
          Answer: answer,
          Point: answer === question[question.CorrectAnswer] ? 5 : 0,
        },
      });
      setIsResult(true);
      setModalVisible(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Have some errors',
      });
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          source={require('../../../images/Game/bg_pattern.png')}
        />
        <View style={{paddingHorizontal: 16, width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: '20%',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 28,
                fontWeight: '700',
                textAlign: 'left',
              }}>
              Hi, Mr. Cuong!
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('ehheee');
                setIsHistory(true);
              }}
              style={{height: '100%'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: '700',
                  marginTop: '20%',
                  marginRight: 15,
                }}>
                View History
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '400',
              textAlign: 'left',
            }}>
            Choose the best answer to the question below. Each question might
            have more than 1 correct answer
          </Text>
          {isResult ? (
            <Result question={question} answer={answer} />
          ) : (
            <Question
              setTick={setTick}
              tick={tick}
              question={question}
              setAnswer={setAnswer}
            />
          )}

          <View
            style={{
              height: 200,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (isResult) {
                  props.navigation.navigate('GameHome', {
                    params: {tag: 'hehe'},
                  });
                  return;
                }
                setModalVisible(true);
              }}
              disabled={!tick}
              style={{
                width,
                backgroundColor: '#D3FB51',
                marginTop: '15%',
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 8,
              }}>
              <Text style={{color: 'black', textAlign: 'center'}}>
                {isResult ? 'Next' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
          <ConfirmModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            submit={submit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const palette = {
  primary: '#3a8d71',
  accent: '#a2b965',
  secondary: '#FF6347',
  background: '#fdf9d9',
  offBlack: '#171717',
  offWhite: '#fcfcfc',
  grey: '#b0b0b0',
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default QuizApp;
