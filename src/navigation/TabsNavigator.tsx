import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import UserScreen from '../screens/UserScreen';
import { colors } from '../themes/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.shade800,
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.shade75,
          height: 60,
        },
        headerShown: false,
        tabBarIcon: () => null,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarLabel: 'Users',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
