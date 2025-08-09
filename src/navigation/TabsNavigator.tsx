import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import { colors } from '../themes/colors';
import ProfileScreen from '@screens/profile/ProfileScreen';
import { Image, View } from 'react-native';
import images from '@assets/images';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const RenderIcon = ({
    icon,
    focused,
  }: {
    icon: number;
    focused: boolean;
  }) => {
    return (
      <View>
        <Image
          source={icon}
          style={{
            tintColor: focused ? colors.shade800 : colors.shade100,
          }}
        />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.shade800,
        tabBarInactiveTintColor: colors.shade100,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.shade75,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => {
            return <RenderIcon icon={images.home} focused={focused} />;
          },
        }}
      />
      <Tab.Screen
        name="User"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ focused }) => {
            return <RenderIcon icon={images.user} focused={focused} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
