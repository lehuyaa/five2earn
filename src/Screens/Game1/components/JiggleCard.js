import React, {useRef} from 'react';
import {View, StyleSheet, Animated, TouchableOpacity, Text} from 'react-native';

function JiggleCard(props) {
  // Use Animated.Value to track the degree of rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // The function to start the jiggle animation
  const startJiggle = () => {
    // Reset the animation value to 0 (no rotation)
    rotateAnim.setValue(0);

    // Sequence of animations to create the jiggle effect
    Animated.sequence([
      // Rotate the card to -5 degrees
      Animated.timing(rotateAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true,
      }),
      // Rotate back to 5 degrees
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      // Rotate to -5 degrees again
      Animated.timing(rotateAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true,
      }),
      // Return to the initial position (0 degrees)
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Interpolating the rotation value for transform
  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  // Animated style with interpolated rotation
  const animatedStyle = {
    transform: [{rotate: rotation}],
  };

  return (
    <View>
      <TouchableOpacity onPress={startJiggle}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.cardText}>{props.value}</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    backfaceVisibility: 'hidden',
  },
  cardText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default JiggleCard;
