import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../hooks/ThemeContext";
import { RootStackParamList } from "../../types/navigation";
import { createLoginStyles } from "./LoginScreen.styles";
import * as LocalAuthentication from "expo-local-authentication";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, biometricLogin, guestLogin } = useAuth();
  const { colors, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    const checkBiometric = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isFaceIdAvailable = supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      );
      setIsBiometricAvailable(hasHardware && isFaceIdAvailable);
    };
    checkBiometric();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const styles = createLoginStyles(colors, theme);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // Navigation will be handled by the auth state change in App.tsx
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Face ID",
        fallbackLabel: "Use Password",
      });
      if (result.success) {
        await biometricLogin();
      } else {
        Alert.alert(
          "Biometric Authentication Failed",
          "Please use password login.",
        );
      }
    } catch {
      Alert.alert("Error", "Biometric authentication is not available.");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await guestLogin();
      // Navigation will be handled by the auth state change in App.tsx
    } catch (error: any) {
      Alert.alert("Guest Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const bgImage = require("../../assets/images/bfphotonew.jpg");

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.card}>
          <View style={styles.cardOverlay} pointerEvents="none" />
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.email && styles.inputError,
                      focusedField === "email" && styles.inputFocused,
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(128,128,128,0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={() => {
                      onBlur();
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField("email")}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.password && styles.inputError,
                      focusedField === "password" && styles.inputFocused,
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(128,128,128,0.5)"
                    secureTextEntry
                    onBlur={() => {
                      onBlur();
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField("password")}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {isBiometricAvailable && (
              <TouchableOpacity
                style={[styles.button, styles.biometricButton]}
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Login with Face ID</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.card} />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.guestButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleGuestLogin}
              disabled={isLoading}
            >
              <Text style={styles.guestButtonText}>Enter as Guest</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default LoginScreen;
