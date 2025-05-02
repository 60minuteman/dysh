import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreTabs } from '../../components/explore/explore-tabs';
import { RecipeStack, RecipeStackRef } from '../../components/explore/recipe-stack';
import CardStack from 'react-native-card-stack-swiper';

export default function Explore() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const stackRef = useRef<RecipeStackRef>(null);

  const handleUndo = () => {
    stackRef.current?.goBackFromLeft();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: width * 0.05 }]}>
        <Text style={[styles.title, { fontSize: width * 0.08 }]}>Explore</Text>
        <TouchableOpacity onPress={handleUndo}>
          <Image 
            source={require('../../assets/icons/undo.png')}
            style={styles.undoIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ExploreTabs />
      </View>
      
      <View style={{ height: height * 0.7, width: width }}>
        <RecipeStack ref={stackRef} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    marginBottom: '6%',
    marginTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Satoshi-Black',
    color: '#000000',
  },
  tabsContainer: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  undoIcon: {
    width: 32,
    height: 32,
  },
});
