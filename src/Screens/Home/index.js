import * as React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import NfcProxy from '../../NfcProxy';
import {useScanNFC} from '../../hooks/useScanNFC';
import {checkNFC} from '../../api/modules/nfc/api-nfc';

function HomeScreen(props) {
  const {navigation} = props;
  const [enabled, setEnabled] = React.useState(null);
  const {scanNFC} = useScanNFC();
  const padding = 40;
  const width = Dimensions.get('window').width - 2 * padding;

  const checkNFCRq = async (nfcId) => {
    try {
      const check = await checkNFC(nfcId);
      return check;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  };

  function renderNfcButtons() {
    return (
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
              console.log('check', check?.meta?.pagination?.total);
              if (check?.meta?.pagination?.total === 1) {
                navigation.navigate('Game', {params: {tag}});
              }
            }
          }}
          style={{width, backgroundColor: '#553EF4', marginTop: '15%'}}>
          SCAN NFC
        </Button>
      </View>
    );
  }

  function renderNfcNotEnabled() {
    return (
      <View
        style={{
          alignItems: 'stretch',
          alignSelf: 'center',
          width,
        }}>
        <Text style={{textAlign: 'center', marginBottom: 10}}>
          Your NFC is not enabled. Please first enable it and hit CHECK AGAIN
          button
        </Text>

        <Button
          mode="contained"
          onPress={() => NfcProxy.goToNfcSetting()}
          style={{marginBottom: 10}}>
          GO TO NFC SETTINGS
        </Button>

        <Button
          mode="outlined"
          onPress={async () => {
            setEnabled(await NfcProxy.isEnabled());
          }}>
          CHECK AGAIN
        </Button>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView />
      <View style={{flex: 1}}>
        {/* {enabled ? renderNfcButtons() : renderNfcNotEnabled()} */}
        {renderNfcButtons()}
      </View>
    </>
  );
}

export default HomeScreen;
