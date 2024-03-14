import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native';
import {Appbar} from 'react-native-paper';

function Game2(props) {
  return (
    <View>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Text style={{marginLeft: 10, fontSize: 18}}>Game2</Text>
      </Appbar.Header>
      <Text>Game2</Text>
    </View>
  );
}

export default Game2;
