import NfcProxy from '../NfcProxy';
import {Alert} from 'react-native';
export const useScanNFC = () => {
  const scanNFC = async () => {
    try {
    //   const tag = await NfcProxy.readTag();
        const tag = {
          id: '09829013810293810923812',
        };
      if (tag) {
        return tag;
      }
    } catch (error) {
      Alert.alert(
        JSON.stringify(error),
        'My Alert Msg', // <- this part is optional, you can pass an empty string
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return null;
    }
  };

  return {scanNFC};
};
