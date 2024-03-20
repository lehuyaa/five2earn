import * as React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import NfcProxy from '../../NfcProxy';
import {useScanNFC} from '../../hooks/useScanNFC';
import {checkFirstScanAPI, checkNFC} from '../../api/modules/nfc/api-nfc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

function HomeScreen(props) {
  const {navigation} = props;
  const [enabled, setEnabled] = React.useState(null);
  const {scanNFC} = useScanNFC();
  const padding = 40;
  const width = Dimensions.get('window').width - 2 * padding;
  const [isShowModalInvalid, setIsShowModalInvalid] = React.useState(false);

  const checkNFCRq = async (nfcId) => {
    try {
      const check = await checkNFC(nfcId);
      return check;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  };

  const checkFirstScan = async (nfcId) => {
    try {
      const response = await checkFirstScanAPI(nfcId);
      if (response.data.length === 0) {
        return true;
      }
      console.log(response);
      if (response.data) {
        await AsyncStorage.setItem('myInfo', JSON.stringify(response.data[0]));
        await AsyncStorage.setItem(
          'userName',
          response.data[0].attributes.Name,
        );
      }

      return false;
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
            if (tag.id) {
              const check = await checkNFCRq(tag.id);
              await AsyncStorage.setItem('nfcID', tag.id);
              const isFirstScan = await checkFirstScan(tag.id);

              if (isFirstScan) {
                navigation.navigate('EnterUserName');
                return;
              }
              if (check?.meta?.pagination?.total === 1) {
                navigation.navigate('Game', {params: {tag}});
              } else {
                setIsShowModalInvalid(true);
              }
            } else {
              setIsShowModalInvalid(true);
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
      <StatusBar barStyle="dark-content" />
      <SafeAreaView />
      <View style={{flex: 1}}>
        {/* {enabled ? renderNfcButtons() : renderNfcNotEnabled()} */}
        {renderNfcButtons()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
export default HomeScreen;
