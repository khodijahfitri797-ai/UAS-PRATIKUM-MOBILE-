import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors } from '../../constants/colors';
import { BorderWidth, Radius } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.black,
        tabBarActiveBackgroundColor: Colors.black,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: BorderWidth.thick,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.bodyBold,
          fontSize: FontSize.xs,
          textTransform: 'uppercase',
        },
        tabBarItemStyle: {
          borderRadius: Radius.sm,
          marginHorizontal: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
