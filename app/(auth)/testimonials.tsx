import { StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Testimonial } from '../../components/Testimonial';
import { Button } from '../../components/Button';

export default function Testimonials() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.push('/(auth)/dietary-preferences');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.lovedByText}>
          LOVED BY <Text style={styles.highlight}>100+ COOKS</Text>
        </Text>

        {/* User Avatars */}
        <View style={styles.avatarsContainer}>
          <Image 
            source={require('../../assets/images/placeholder.png')} 
            style={[styles.avatar, { left: '30%' }]}
          />
          <Image 
            source={require('../../assets/images/placeholder.png')} 
            style={[styles.avatar, { left: '45%' }]}
          />
          <Image 
            source={require('../../assets/images/placeholder.png')} 
            style={[styles.avatar, { left: '60%' }]}
          />
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            Real people. <Text style={styles.greenText}>Real{'\n'}kitchens.</Text> <Text style={styles.orangeText}>Real flavor.</Text>
          </Text>
        </View>

        {/* Testimonial Component with White Background */}
        <View style={styles.testimonialContainer}>
          <Testimonial 
            title="No more boring meals"
            text="I used to rotate the same 3 meals. Now I get something new every day, using ingredients I already have."
            userName="Anita K."
            userImage={require('../../assets/images/placeholder.png')}
          />
        </View>
      </View>

      {/* Continue Button */}
      <Button
        onPress={handleContinue}
        label="Continue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 30,
  },
  lovedByText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
  },
  highlight: {
    color: '#7842F5',
  },
  avatarsContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  taglineContainer: {
    width: '100%',
  },
  tagline: {
    fontSize: 32,
    fontFamily: 'Satoshi-Black',
    textAlign: 'center',
    lineHeight: 36,
  },
  greenText: {
    color: '#64D61D',
  },
  orangeText: {
    color: '#FE802C',
  },
  testimonialContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  }
}); 