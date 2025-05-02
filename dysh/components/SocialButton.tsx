import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  TouchableOpacityProps,
  View,
  ActivityIndicator,
} from 'react-native';

interface SocialButtonProps extends TouchableOpacityProps {
  variant: 'google' | 'apple';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  loading?: boolean;
}

const BUTTON_ICONS = {
  google: require('../assets/icons/google-icon.png'),
  apple: require('../assets/icons/apple-icon.png'),
};

const BUTTON_TEXT = {
  google: 'Continue With Google',
  apple: 'Continue With Apple',
};

export function SocialButton({
  variant,
  containerStyle,
  textStyle,
  onPress,
  loading = false,
  ...props
}: SocialButtonProps) {
  const isGoogle = variant === 'google';

  return (
    <View style={[styles.buttonContainer, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          isGoogle ? styles.googleButton : styles.appleButton,
        ]}
        {...props}
        onPress={onPress}
        disabled={loading}
      >
        <View style={styles.innerShadow} />
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Image
                source={BUTTON_ICONS[variant] as ImageSourcePropType}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.text,
                  isGoogle ? styles.googleText : styles.appleText,
                  textStyle,
                ]}
              >
                {BUTTON_TEXT[variant]}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 60,
    overflow: 'hidden',
  },
  button: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 60,
    overflow: 'hidden',
  },
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
  },
  googleButton: {
    backgroundColor: '#64D61D',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  appleButton: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
  },
  googleText: {
    color: '#FFFFFF',
  },
  appleText: {
    color: '#FFFFFF',
  },
});
