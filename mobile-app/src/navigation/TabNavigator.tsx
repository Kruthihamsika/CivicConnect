import { Text } from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ComplaintListScreen from '../screens/ComplaintListScreen';
import CreateComplaintScreen from '../screens/CreateComplaintScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab =
  createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,

          elevation: 10,
        },

        tabBarActiveTintColor:
          '#1A3A5C',

        tabBarInactiveTintColor:
          '#999',

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',

          tabBarIcon: ({
            color,
          }) => (
            <TabIcon
              emoji="🏠"
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ComplaintsTab"
        component={
          ComplaintListScreen
        }
        options={{
          title: 'Complaints',

          tabBarIcon: ({
            color,
          }) => (
            <TabIcon
              emoji="📋"
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CreateTab"
        component={
          CreateComplaintScreen
        }
        options={{
          title: 'Create',

          tabBarIcon: ({
            color,
          }) => (
            <TabIcon
              emoji="➕"
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',

          tabBarIcon: ({
            color,
          }) => (
            <TabIcon
              emoji="👤"
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({
  emoji,
  color,
}: {
  emoji: string;
  color: string;
}) {
  return (
    <Text
      style={{
        fontSize: 20,
        color,
      }}
    >
      {emoji}
    </Text>
  );
}