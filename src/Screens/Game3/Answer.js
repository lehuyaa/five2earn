import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';

const Answer = ({tick, item, setTick, setAnswer}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setTick(item);
        setAnswer(item);
      }}>
      <View style={{marginTop: 12, flexDirection: 'row'}}>
        {tick === item ? (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../../images/Game/tick.png')}
          />
        ) : (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../../images/Game/unTick.png')}
          />
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: 'white',
            marginLeft: 8,
          }}>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Answer;
