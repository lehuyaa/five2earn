import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import * as React from 'react';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTransceiveScreen from './Screens/CustomTransceive';
import HomeScreen from './Screens/Home';
import NdefTypeListScreen from './Screens/NdefTypeList';
import NdefWriteScreen from './Screens/NdefWrite';
import SavedRecordScreen from './Screens/SavedRecord';
import SettingsScreen from './Screens/Settings';
import TagDetailScreen from './Screens/TagDetail';
import ToolKitScreen from './Screens/Toolkit';
import * as Theme from './Theme';
import Game1 from './Screens/Game1';
import Game2 from './Screens/Game2';
import Game3 from './Screens/Game3';
import GameHome from './Screens/Start';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const GameStack = createStackNavigator();
const HomeTabs = createBottomTabNavigator();

function HomeTabNav() {
  return (
    <HomeTabs.Navigator
      screenOptions={({route}) => {
        const focusedName = getFocusedRouteNameFromRoute(route);
        const extraProps = {};
        if (focusedName !== undefined) {
          if (focusedName !== 'Home' && focusedName !== 'Assistant') {
            extraProps.tabBarStyle = {height: 0, display: 'none'};
          }
        }

        return {
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = 'nfc-search-variant';
            } else if (route.name === 'NdefTypeListTab') {
              iconName = 'database-edit';
            } else if (route.name === 'ToolKitTab') {
              iconName = 'tools';
            } else if (route.name === 'MyRecordsTab') {
              iconName = 'archive-star';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: Theme.colors.blue,
          tabBarInactiveTintColor: 'gray',
          ...extraProps,
        };
      }}>
      <HomeTabs.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{tabBarLabel: 'SCAN TAG'}}
      />
      <HomeTabs.Screen
        name="NdefTypeListTab"
        component={NdefTypeListScreen}
        options={{title: 'WRITE NDEF'}}
      />
      <HomeTabs.Screen
        name="ToolKitTab"
        component={ToolKitScreen}
        options={{title: 'TOOLKIT'}}
      />
      <HomeTabs.Screen
        name="MyRecordsTab"
        component={SavedRecordScreen}
        options={{title: 'MY RECORDS'}}
      />
    </HomeTabs.Navigator>
  );
}

function Main(props) {
  return (
    <MainStack.Navigator
      screenOptions={{
        header: (headerProps) => {
          const {navigation, back, options, route} = headerProps;
          const excludedScreens = ['Home', 'NdefWrite', 'CustomTransceive'];

          if (excludedScreens.findIndex((name) => name === route?.name) > -1) {
            return null;
          }

          return (
            <Appbar.Header style={{backgroundColor: 'white'}}>
              {back && (
                <Appbar.BackAction onPress={() => navigation.goBack()} />
              )}
              <Appbar.Content title={options?.title || ''} />
            </Appbar.Header>
          );
        },
      }}>
      <MainStack.Screen
        name="TagDetail"
        options={{title: 'TAG DETAIL'}}
        component={TagDetailScreen}
      />
      <MainStack.Screen
        name="NdefWrite"
        component={NdefWriteScreen}
        options={{title: 'WRITE NDEF'}}
      />
      <MainStack.Screen
        name="CustomTransceive"
        component={CustomTransceiveScreen}
        options={{title: 'CUSTOM TRANSCEIVE'}}
      />
      <MainStack.Screen
        name="SavedRecord"
        component={SavedRecordScreen}
        options={{title: 'MY SAVED RECORDS'}}
      />
    </MainStack.Navigator>
  );
}

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
      <RootStack.Screen name="Game" component={GameScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="Main" component={Main} />
      <RootStack.Screen
        name="MainTabs"
        component={HomeTabNav}
        options={{animationEnabled: false}}
      />
    </RootStack.Navigator>
  );
}

function AppNavigator(props) {
  return (
    <NavigationContainer>
      <Root />
      {/* <NfcPromptAndroid />
      <Toast /> */}
    </NavigationContainer>
  );
}

export default AppNavigator;
