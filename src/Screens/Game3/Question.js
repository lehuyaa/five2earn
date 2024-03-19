import React from 'react';
import {Text, View, Image, FlatList} from 'react-native';
import Answer from './Answer';

const Question = ({setTick, tick, question, setAnswer}) => {
  return (
    <View
      style={{
        width: '100%',
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
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View style={{marginLeft: 14}}>
            <Text style={{fontSize: 16, fontWeight: '700', color: 'white'}}>
              {question.Content}
            </Text>
            <Text style={{fontSize: 14, fontWeight: '400', color: 'white'}}>
              Question details description.
            </Text>
            <FlatList
              data={[question.Answer1, question.Answer2, question.Answer3]}
              renderItem={({item}) => (
                <Answer
                  tick={tick}
                  item={item}
                  setTick={setTick}
                  setAnswer={setAnswer}
                />
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Question;
