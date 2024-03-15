import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useScanNFC} from '../../hooks/useScanNFC';
import {Button} from 'react-native-paper';
import QuizApp from './QuizApp';

const padding = 40;
const width = Dimensions.get('window').width - 2 * padding;
function Game3(props) {
  const {scanNFC} = useScanNFC();
  const [isQuizApp, setIsQuizApp] = React.useState(false);

  if (isQuizApp) {
    return (
      <>
        <Appbar.Header style={{backgroundColor: 'white'}}>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
          <Text style={{marginLeft: 10, fontSize: 18}}>Game3</Text>
        </Appbar.Header>
        <QuizApp />
      </>
    );
  }

  return (
    <View>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Text style={{marginLeft: 10, fontSize: 18}}>Game3</Text>
      </Appbar.Header>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Button
          mode="contained"
          onPress={async () => {
            const tag = await scanNFC();
            if (tag) {
              setIsQuizApp(true);
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
