import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import apiService from '../../src/services/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await apiService.forgotPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  if (emailSent) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={isDark 
            ? ['#0f0f0f', '#1a1a2e', '#16213e']
            : ['#f5f7fa', '#c3cfe2', '#667eea']
          }
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={[styles.decorativeOrb1, {
          backgroundColor: isDark 
            ? 'rgba(48,209,88,0.15)' 
            : 'rgba(52,199,89,0.2)',
        }]} />

        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            <Animated.View
              entering={FadeInUp.duration(1000).springify()}
              style={styles.successContainer}
            >
              <LinearGradient
                colors={['#30D158', '#28A745']}
                style={styles.successIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="checkmark-circle" size={64} color="#FFFFFF" />
              </LinearGradient>
              
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Check Your Email
              </Text>
              
              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                We've sent a password reset link to
              </Text>
              
              <BlurView
                intensity={isDark ? 15 : 25}
                tint={isDark ? 'dark' : 'light'}
                style={[
                  styles.emailBadge,
                  {
                    borderColor: isDark 
                      ? 'rgba(255,255,255,0.08)' 
                      : 'rgba(255,255,255,0.5)',
                  }
                ]}
              >
                <Text style={[styles.emailText, { color: colors.text }]}>{email}</Text>
              </BlurView>
              
              <Text style={[styles.instructionsText, { color: colors.textSecondary }]}>
                Please check your email and click on the link to reset your password.
                The link will expire in 10 minutes.
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace('/(auth)/login')}
              >
                <LinearGradient
                  colors={isDark ? ['#0A84FF', '#0066CC'] : ['#667eea', '#764ba2']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buttonText}>Back to Login</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                <Text style={[styles.resendButtonText, { color: colors.primary }]}>
                  Didn't receive email? Try again
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark 
          ? ['#0f0f0f', '#1a1a2e', '#16213e']
          : ['#f5f7fa', '#c3cfe2', '#667eea']
        }
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.decorativeOrb1, {
        backgroundColor: isDark 
          ? 'rgba(10,132,255,0.15)' 
          : 'rgba(102,126,234,0.2)',
      }]} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <Animated.View entering={FadeInUp.duration(600).springify()}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButtonWrapper}
            >
              <BlurView
                intensity={isDark ? 15 : 25}
                tint={isDark ? 'dark' : 'light'}
                style={[
                  styles.backButton,
                  {
                    borderColor: isDark 
                      ? 'rgba(255,255,255,0.08)' 
                      : 'rgba(255,255,255,0.5)',
                  }
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={styles.iconContainer}
          >
            <LinearGradient
              colors={isDark ? ['#0A84FF', '#0066CC'] : ['#667eea', '#764ba2']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="lock-closed" size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={[styles.title, { color: colors.text }]}
          >
            Forgot Password?
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(500).duration(1000).springify()}
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            Enter the email associated with your account and we'll send an email with
            instructions to reset your password.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            style={styles.inputContainer}
          >
            <BlurView
              intensity={isDark ? 15 : 25}
              tint={isDark ? 'dark' : 'light'}
              style={[
                styles.inputWrapper,
                {
                  borderColor: isDark 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(255,255,255,0.5)',
                }
              ]}
            >
              <View style={[styles.inputIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </BlurView>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(700).duration(1000).springify()}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendEmail}
              disabled={loading}
            >
              <LinearGradient
                colors={isDark ? ['#0A84FF', '#0066CC'] : ['#667eea', '#764ba2']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Send Reset Email</Text>
                    <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backToLoginContainer}>
              <Text style={[styles.backToLogin, { color: colors.primary }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  decorativeOrb1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    top: -100,
    right: -100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  backButtonWrapper: {
    marginBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 60,
    overflow: 'hidden',
  },
  inputIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backToLoginContainer: {
    alignItems: 'center',
  },
  backToLogin: {
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  emailBadge: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  emailText: {
    fontSize: 17,
    fontWeight: '600',
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  resendButton: {
    marginTop: 16,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});