import { StyleSheet, Text, View, Image } from 'react-native';

interface TestimonialProps {
  title: string;
  text: string;
  userName: string;
  userImage?: any; // React Native image source
}

export function Testimonial({ title, text, userName, userImage }: TestimonialProps) {
  return (
    <View style={styles.testimonialContainer}>
      {/* Stars */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>⭐</Text>
        ))}
      </View>

      {/* Testimonial Content */}
      <Text style={styles.testimonialTitle}>{title}</Text>
      <Text style={styles.testimonialText}>{text}</Text>

      {/* User Info */}
      <View style={styles.userContainer}>
        <Image 
          source={userImage || require('../assets/images/placeholder.png')} 
          style={styles.userAvatar}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  testimonialContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 20,
    marginRight: 4,
  },
  testimonialTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  testimonialText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Satoshi-Regular',
    textAlign: 'left',
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
}); 