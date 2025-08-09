import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Detail: { id: string };
};

export type HomeStackParamList = {
  Detail: { id: string };
};

export type MainTabParamList = {
  Home: undefined;
  User: undefined;
};

export type RootNavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type DetailNavigationParams = RouteProp<RootStackParamList, 'Detail'>;
