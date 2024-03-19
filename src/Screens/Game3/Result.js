import React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Answer from './Answer';

const result = {
  Answer1: 0,
  Answer2: 1,
  Answer3: 2,
};

const padding = 15;
const width = Dimensions.get('window').width - 2 * padding;

const Result = ({answer, question}) => {
  return (
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
          <Image source={require('../../../images/Game/logo_game.png')} />
          <View style={{marginLeft: 14}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: 'white',
                width: 250,
              }}>
              {question.Content}
            </Text>
            <Text style={{fontSize: 14, fontWeight: '400', color: 'white'}}>
              Question details description.
            </Text>
            <FlatList
              data={[question.Answer1, question.Answer2, question.Answer3]}
              renderItem={({item, index}) => (
                <TouchableOpacity disabled>
                  <View style={{marginTop: 12, flexDirection: 'row'}}>
                    {result[question.CorrectAnswer] === index ? (
                      <Image
                        style={{width: 24, height: 24}}
                        source={require('../../../images/Game/result_true.png')}
                      />
                    ) : answer === item ? (
                      <Image
                        style={{width: 24, height: 24}}
                        source={require('../../../images/Game/result_false.png')}
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
                        color:
                          result[question.CorrectAnswer] === index
                            ? '#77F94C'
                            : answer === item
                            ? 'red'
                            : 'white',
                        marginLeft: 8,
                      }}>
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Result;
