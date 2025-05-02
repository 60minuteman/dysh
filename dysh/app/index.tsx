import { Redirect } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Redirect href="/splash" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  }
});
