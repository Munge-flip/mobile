import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: fullName,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.data.success) {
        router.replace('/login');
      } else {
        Alert.alert('Registration Failed', response.data.message || 'Please check your information');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred during registration. Please try again.';
      Alert.alert('Error', message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>GET STARTED</Text>
            <Text style={styles.subtitle}>Start your journey with us.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'fullName' && styles.inputFocused,
                ]}
                placeholder="John Doe"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput('fullName')}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocused,
                ]}
                placeholder="john@example.com"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'phone' && styles.inputFocused,
                ]}
                placeholder="+63 900 000 0000"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedInput('phone')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'password' && styles.inputFocused,
                  ]}
                  placeholder="••••"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.label}>Confirm</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'confirm' && styles.inputFocused,
                  ]}
                  placeholder="••••"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedInput('confirm')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]} 
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signUpButtonText}>SIGN UP</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171D',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#A38141',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A38141',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
    paddingHorizontal: 24,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#A38141',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  signUpButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#A38141',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A38141',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
    marginTop: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  signInText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A38141',
  },
});
