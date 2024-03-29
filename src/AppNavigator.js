import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import * as React from 'react';
import LandingScreen from './Screens/Landing';
import Toast from 'react-native-toast-message';

import HomeScreen from './Screens/Home';

import Game1 from './Screens/Game1';
import Game2 from './Screens/Game2';
import Game3 from './Screens/Game3';
import GameHome from './Screens/Start';
import NfcPromptAndroid from './Components/NfcPromptAndroid';
// import Toast from './Components/Toast';
import ConfirmJoinGame from './Screens/ConfirmJoinGame';
import WinScreen from './Screens/Win';
import Test from './Screens/Game1/test';
import LoseScreen from './Screens/Lose';
import InputUserNameSceen from './Screens/EnterUserName';

const RootStack = createStackNavigator();
const GameStack = createStackNavigator();

function GameScreen() {
  return (
    <GameStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <GameStack.Screen name="GameHome" component={GameHome} />
      <GameStack.Screen name="Game1" component={Game1} />
      <GameStack.Screen name="Game2" component={Game2} />
      <GameStack.Screen name="Game3" component={Game3} />
      <GameStack.Screen name="ConfirmJoinGame" component={ConfirmJoinGame} />
      <GameStack.Screen name="Win" component={WinScreen} />
      <GameStack.Screen name="Lose" component={LoseScreen} />
      <GameStack.Screen name="Test" component={Test} />
    </GameStack.Navigator>
  );
}

function Root(props) {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}>
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'SCAN TAG'}}
      />

      <RootStack.Screen name="Game" component={GameScreen} />
      <RootStack.Screen name="EnterUserName" component={InputUserNameSceen} />
    </RootStack.Navigator>
  );
}

function AppNavigator(props) {
  return (
    <NavigationContainer>
      <Root />
      <NfcPromptAndroid />
      <Toast />
    </NavigationContainer>
  );
}

export default AppNavigator;
