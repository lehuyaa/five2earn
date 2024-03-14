import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import JiggleCard from './components/JiggleCard';
import Card from './components/Card';
import {Appbar} from 'react-native-paper';

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

  return (
    <View>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Text style={{marginLeft: 10, fontSize: 18}}>Game1</Text>
      </Appbar.Header>
      <View style={styles.grid}>
        {boardImages.map((image, index) => (
          <TouchableOpacity
            key={index}
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
      <Text>{resultText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  box: {
    width: 60,
    height: 60,
    margin: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Game1;
