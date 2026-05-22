import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { signIn } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const setAuthenticated =
    useAuthStore(
      (state) =>
        state.setAuthenticated
    );

  async function handleLogin() {
    try {
      setLoading(true);

      await signIn(
        email,
        password
      );

      setAuthenticated(true);
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.logo}>
          🏛️
        </Text>

        <Text style={styles.title}>
          CivicConnect
        </Text>

        <Text style={styles.subtitle}>
          Smart City Grievance
          Platform
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.welcome}>
          Welcome Back
        </Text>

        <Text style={styles.helper}>
          Login to continue
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text
              style={styles.buttonText}
            >
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    padding: 24,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logo: {
    fontSize: 54,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1A3A5C',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  welcome: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },

  helper: {
    color: '#666',
    marginBottom: 28,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },

  button: {
    backgroundColor: '#1A3A5C',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});