import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Detail: { id: string; title: string; data?: any };
};

export type HomeStackParamList = {
  Detail: { id: string };
};

export type MainTabParamList = {
  Home: undefined;
  User: undefined;
};
