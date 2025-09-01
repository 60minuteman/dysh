import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, StyleSheet, ImageBackground } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

const navImages = {
  Home: require('@/assets/nav/Home.png'),
  'active-Home': require('@/assets/nav/Home-active.png'),
  Ingredients: require('@/assets/nav/Ingredients.png'),
  'active-Ingredients': require('@/assets/nav/Ingredients-active.png'),
  Explore: require('@/assets/nav/Explore.png'),
  'active-Explore': require('@/assets/nav/Explore-active.png'),
  'Cook-book': require('@/assets/nav/Cook-book.png'),
  'active-Cook-book': require('@/assets/nav/Cook-book-active.png'),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  icon: {
    width: 34,
    height: 34,
    marginHorizontal: 24, // 48px total spacing between icons (24px on each side)
  }
});

export default function TabLayout() {
  return (
    <ImageBackground
      source={require('@/assets/images/Home-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#64D61D',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => <TabBarBackground />,
          tabBarShowLabel: false,
          tabBarStyle: Platform.select({
            ios: {
              height: 88,
              paddingBottom: 32,
              paddingTop: 12,            
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0'
            },
            default: {
              height: 64,
              paddingBottom: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0'
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            href: '/(tabs)',
            tabBarIcon: ({ focused }) => (
              <Image 
                source={focused ? navImages['active-Home'] : navImages.Home}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ingredients"
          options={{
            href: '/(tabs)/ingredients',
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? navImages['active-Ingredients'] : navImages.Ingredients}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: '/(tabs)/explore',
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? navImages['active-Explore'] : navImages.Explore}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cookbook"
          options={{
            href: '/(tabs)/cookbook',
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? navImages['active-Cook-book'] : navImages['Cook-book']}
                style={styles.icon}
              />
            ),
          }}
        />
      </Tabs>
    </ImageBackground>
  );
}
