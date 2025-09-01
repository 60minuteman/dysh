import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

interface EmailInputProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

export function EmailInput({ onSubmit, loading = false }: EmailInputProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!isValidEmail(email) || loading) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!isValidEmail(email) || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>→</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#525252',
    borderRadius: 64,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 0,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  input: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Satoshi-Regular',
    paddingVertical: 12,
  },
  submitButton: {
    backgroundColor: '#68D431',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#525252',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});
