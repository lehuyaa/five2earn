import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function Card(props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{rotateY: frontInterpolate}],
  };
  const backAnimatedStyle = {
    transform: [{rotateY: backInterpolate}],
  };

  const flipCard = async () => {
    if (isFlipped) {
      // console.log('isFlipped');
      // Animated.spring(animatedValue, {
      //   toValue: 0,
      //   friction: 8,
      //   tension: 10,
      //   useNativeDriver: true,
      // }).start(() => {
      //   // props.onFlipImage();
      //   console.log('flipped');
      // });
    } else {
      console.log('isFlipped2');

      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        props.onFlipImage();
        console.log('flipped2');
      });
    }
    setIsFlipped(!isFlipped);
    // props.onFlipImage();
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <TouchableOpacity onPress={flipCard}>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
          <Text style={styles.flipText}>{props.value}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.flipCard, backAnimatedStyle, styles.flipCardBack]}>
          <Text style={styles.flipText}>Back</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flipCard: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    backgroundColor: 'blue',
    position: 'absolute',
    top: 0,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#77f94c',
  },
  flipText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Card;
