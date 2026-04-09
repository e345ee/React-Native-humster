import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import StockListScreen from '../screens/StockListScreen';
import { usePalette } from '../theme/usePalette';
import { AreaChartIcon, BarChartIcon, PersonIcon } from '../components/Icons';
import { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type Props = {
  route: RouteProp<RootStackParamList, 'Main'>;
};

export default function MainTabs({ route }: Props) {
  const palette = usePalette();
  const username = route.params?.username;

  return (
    <Tab.Navigator
      screenOptions={({ route: tabRoute }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.secondaryText,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
        tabBarStyle: {
          position: 'absolute',
          left: 32,
          right: 32,
          bottom: 16,
          borderRadius: 22,
          height: 68,
          paddingTop: 8,
          backgroundColor: palette.tabBar,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        },
        tabBarIcon: ({ color }) => {
          if (tabRoute.name === 'Профиль') return <PersonIcon color={color} />;
          if (tabRoute.name === 'Статистика') return <AreaChartIcon color={color} />;
          return <BarChartIcon color={color} />;
        },
      })}
    >
      <Tab.Screen name="Профиль" component={ProfileScreen} initialParams={{ username }} />
      <Tab.Screen name="Статистика" component={StatisticsScreen} />
      <Tab.Screen name="Акции" component={StockListScreen} />
    </Tab.Navigator>
  );
}
