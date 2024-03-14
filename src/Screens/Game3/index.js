import React from 'react';
import {Text, View} from 'react-native';
import {Appbar} from 'react-native-paper';

function Game3(props) {
  return (
    <View>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Text style={{marginLeft: 10, fontSize: 18}}>Game3</Text>
      </Appbar.Header>
      <Text>Game3</Text>
    </View>
  );
}

export default Game3;
