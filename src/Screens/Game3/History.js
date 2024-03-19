import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  AsyncStorage,
  FlatList,
  Dimensions,
} from 'react-native';
import {getHistory} from '../../api/modules/nfc/api-nfc';
import Toast from 'react-native-toast-message';

const padding = 15;
const width = Dimensions.get('window').width - 2 * padding;
function History() {
  const [history, setHistory] = useState([]);

  const getHistoryReq = async () => {
    try {
      const nfcID = await AsyncStorage.getItem('nfcID');

      const res = await getHistory(nfcID);
      setHistory(res.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Have some errors',
      });
    }
  };
  useEffect(() => {
    getHistoryReq();
  }, []);
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
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '400',
              textAlign: 'left',
              marginTop: '20%',
            }}>
            Here is your result
          </Text>
          <FlatList
            data={history}
            renderItem={({item}) => (
              <View
                style={{
                  width: width,
                  backgroundColor: '#242731',
                  marginTop: 20,
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../../images/Game/logo_game.png')}
                    />
                    <View style={{marginLeft: 14}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          paddingRight: 20,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color:
                              item.attributes.Point === 0 ? 'red' : '#77F94C',
                            width: 220,
                          }}>
                          {item.attributes.Question}
                        </Text>
                        {item.attributes.Point !== 0 && (
                          <Image
                            style={{width: 50, height: 20}}
                            source={require('../../../images/Game/point.png')}
                          />
                        )}
                      </View>

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '400',
                          color: 'white',
                        }}>
                        Question details description.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

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

export default History;
