import React from 'react';
import {Text, View, Dimensions, Image} from 'react-native';
import {useScanNFC} from '../../hooks/useScanNFC';
import {Button} from 'react-native-paper';
import QuizApp from './QuizApp';
import {checkNFC} from '../../api/modules/nfc/api-nfc';
import ModalError from './ModalError';

const padding = 40;
const width = Dimensions.get('window').width - 2 * padding;
function Game3(props) {
  const {scanNFC} = useScanNFC();
  const [isQuizApp, setIsQuizApp] = React.useState(false);
  const [matchId, setMatchId] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const checkNFCRq = async (nfcId) => {
    try {
      const check = await checkNFC(nfcId);
      return check;
    } catch (error) {
      setModalVisible(true);
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
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          source={require('../../../images/Game/bg_pattern.png')}
        />
        <View style={{paddingHorizontal: 16}}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontWeight: '700',
              marginTop: '30%',
              textAlign: 'left',
            }}>
            Networking Quiz
          </Text>
          <Text
            style={{
              color: '#D1D3D4',
              fontSize: 16,
              fontWeight: '700',
              marginTop: 10,
            }}>
            Rules: Socialize, network and build relationship with your peers,
            scan their NFCs (one per each contact) and answer blockchain-related
            quiz questions. Each correct response will be rewarded 5 points.
          </Text>
        </View>

        <Image
          style={{
            height: 200,
            width: 230,
            marginTop: '20%',
          }}
          source={require('../../../images/Game/01.png')}
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
          style={{width, backgroundColor: '#553EF4', marginTop: '20%'}}>
          Scan another player’s NFC
        </Button>
      </View>
      <ModalError
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
      />
    </View>
  );
}

export default Game3;
