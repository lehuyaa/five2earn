import React from 'react';
import {Text, View, Dimensions, Image} from 'react-native';
import {useScanNFC} from '../../hooks/useScanNFC';
import {Button} from 'react-native-paper';
import QuizApp from './QuizApp';
import {checkNFC} from '../../api/modules/nfc/api-nfc';
import Toast from 'react-native-toast-message';

const padding = 40;
const width = Dimensions.get('window').width - 2 * padding;
function Game3(props) {
  const {scanNFC} = useScanNFC();
  const [isQuizApp, setIsQuizApp] = React.useState(false);
  const [matchId, setMatchId] = React.useState('');

  const checkNFCRq = async (nfcId) => {
    try {
      const check = await checkNFC(nfcId);
      return check;
    } catch (error) {
      console.log(JSON.stringify(error));
      Toast.show({
        type: 'error',
        text1: 'Wrong NFC',
      });
      return null;
    }
  };

  if (isQuizApp) {
    return (
      <>
        <QuizApp navigation={props.navigation} matchId={matchId} />
      </>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          source={require('../../../images/Game/bg_pattern.png')}
        />
        <Text
          style={{
            color: '#77F94C',
            fontSize: 28,
            fontWeight: '700',
            marginTop: '40%',
          }}>
          Choose the correct answer and become the winner!{' '}
        </Text>
        <Image
          style={{
            height: 300,
            marginTop: '10%',
          }}
          source={require('../../asstes/images/group.png')}
        />
        <Button
          mode="contained"
          onPress={async () => {
            const tag = await scanNFC();
            if (tag) {
              const check = await checkNFCRq(tag.id);
              if (check?.meta?.pagination?.total === 1) {
                setIsQuizApp(true);
                setMatchId(tag.id);
              }
            }
          }}
          style={{width, backgroundColor: '#553EF4', marginTop: '15%'}}>
          SCAN NFC
        </Button>
      </View>
    </View>
  );
}

export default Game3;
