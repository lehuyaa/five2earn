import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from './components/Card';
import JiggleCard from './components/JiggleCard';

const {width} = Dimensions.get('window');

const MARGIN_PERCENT = 2;
const squareMargin = (width * MARGIN_PERCENT) / 100;
const squareWidth = (width * 0.9 - squareMargin * 6) / 5;

function Game1(props) {
  const [boardImages, setBoardImages] = useState([]);
  const [countLevelCompleted, setCountLevelCompleted] = useState(0);
  const [imageCorrect, setImageCorrect] = useState();
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    setBoardImages(shuffleAndPickImages(images));
  }, [countLevelCompleted]);

  // Imagine these are your images imported from your assets
  const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // 13 represents the unique image

  function shuffleAndPickImages(images) {
    // Randomly select a unique image
    const uniqueIndex = Math.floor(Math.random() * images.length);
    const uniqueImage = images[uniqueIndex];

    // Duplicate images except for the unique one
    let duplicatedImages = images.flatMap((image, index) =>
      index === uniqueIndex ? [] : [image, image],
    );

    // Add the unique image
    duplicatedImages.push(uniqueImage);
    setImageCorrect(uniqueImage);

    // Shuffle and return the images
    return shuffleArray(duplicatedImages);
  }

  function shuffleArray(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const handlePress = (image) => {
    console.log('image choose: ', image, imageCorrect);
    if (imageCorrect == image) {
      // Correct selection, handle victory
      // Here you might reset the game or progress to the next level
      setResultText('Correct!');
      setCountLevelCompleted(countLevelCompleted + 1);
    } else {
      // Incorrect selection, provide feedback or hint
      setResultText('Incorrect!');
    }
  };
  const progress = (1 / 5) * 100;

  return (
    <View style={styles.grid}>
      <View style={styles.infoUserSection}>
        <Image source={require('../../../images/Game/Logo.png')} />
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={{
              color: '#77F94C',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: 24,
            }}>
            Cuong
          </Text>
          <Text>
            <Text
              style={{
                color: '#6d6e71',
                fontSize: 20,
                fontWeight: '400',
                lineHeight: 24,
              }}>
              Time left:{' '}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 20,
                fontWeight: '400',
                lineHeight: 24,
              }}>
              00:00:15 s
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.infoGameSection}>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 28.8,
          }}>
          Choose your correct answer
        </Text>
        <Text
          style={{
            color: '#D1D3D4',
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 19,
            marginTop: 10,
          }}>
          You are allowed a maximum of 5 numbers for this game
        </Text>
      </View>

      <View style={styles.containerProgress}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={styles.sessionText}>Session</Text>
          <Text style={styles.sessionCount}>{`${1} of ${5}`}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
        </View>
      </View>

      <View style={styles.gameSections}>
        {boardImages.map((image, index) => (
          <TouchableOpacity
            onPress={() => handlePress(image)}
            style={styles.box}>
            {image == imageCorrect ? (
              <Card value={image} onFlipImage={() => handlePress(image)} />
            ) : (
              <JiggleCard
                value={image}
                onFlipImage={() => handlePress(image)}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#151515',
  },
  infoUserSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.86,
    marginTop: 30,
  },
  infoGameSection: {
    width: width * 0.86,
    marginTop: 30,
  },
  gameSections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: squareMargin,
  },
  box: {
    width: squareWidth,
    height: squareWidth,
    justifyContent: 'center',
    alignItems: 'center',
    margin: squareMargin / 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  containerProgress: {
    marginTop: 20,
    height: '10%',
    width: width * 0.86,
  },
  sessionText: {
    color: '#D3FB51', // Text color for the 'Session' label
    marginRight: 5,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  progressBarContainer: {
    flex: 1,
    maxHeight: 10,
    backgroundColor: 'grey', // Background color of the full progress bar
    borderRadius: 10,
    overflow: 'hidden', // Ensure the inner bar does not exceed the container's rounded corners
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D3FB51', // Color for the progress indicator
  },
  sessionCount: {
    color: '#D3FB51', // Text color for the '1 of 5' label
    marginLeft: 5,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
  },
});

export default Game1;
