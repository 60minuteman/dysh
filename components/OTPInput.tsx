import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export interface OTPInputRef {
  focus: () => void;
  clear: () => void;
}

export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error
}, ref) => {
  const inputRefs = useRef<TextInput[]>([]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRefs.current[0]?.focus();
    },
    clear: () => {
      onChange(Array(length).fill(''));
    }
  }));

  const handleOtpChange = (inputValue: string, index: number) => {
    if (inputValue.length > 1) {
      // Handle paste functionality
      const pastedOtp = inputValue.slice(0, length).split('');
      const newOtp = [...value];
      pastedOtp.forEach((digit, i) => {
        if (i < length && /^\d$/.test(digit)) {
          newOtp[i] = digit;
        }
      });
      onChange(newOtp);
      
      // Focus on the last filled input or the next empty one
      const lastFilledIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
      inputRefs.current[focusIndex]?.focus();
    } else if (/^\d$/.test(inputValue) || inputValue === '') {
      const newOtp = [...value];
      newOtp[index] = inputValue;
      onChange(newOtp);

      // Auto-focus next input
      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if OTP is complete
      const otpString = newOtp.join('');
      if (otpString.length === length && onComplete) {
        onComplete(otpString);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array.from({ length }, (_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.input,
              value[index] && styles.inputFilled,
              error && styles.inputError
            ]}
            value={value[index]}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={length}
            textAlign="center"
            autoFocus={index === 0}
            editable={!disabled}
          />
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
  },
  input: {
    width: 50,
    height: 60,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
  },
  inputFilled: {
    borderColor: '#64D61D',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  error: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
});
