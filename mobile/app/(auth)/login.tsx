import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function validate(): boolean {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: integrate with backend auth
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace("/");
    } catch {
      setErrors({ email: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        contentContainerClassName="px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-2xl bg-emerald-500 items-center justify-center mb-4">
            <Ionicons name="heart-half" size={40} color="#0F172A" />
          </View>
          <Text className="text-3xl font-bold text-white tracking-tight">
            HealthMate
          </Text>
          <Text className="text-slate-400 text-base mt-2">
            Your daily wellness companion
          </Text>
        </View>

        {/* Form */}
        <View className="gap-5">
          {/* Email */}
          <View>
            <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">
              Email
            </Text>
            <View
              className={`flex-row items-center bg-slate-800 rounded-xl px-4 border ${
                errors.email ? "border-red-500" : "border-slate-700"
              }`}
            >
              <Ionicons name="mail-outline" size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 text-white text-base py-4 ml-3"
                placeholder="you@example.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text className="text-red-400 text-xs mt-1 ml-1">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password */}
          <View>
            <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">
              Password
            </Text>
            <View
              className={`flex-row items-center bg-slate-800 rounded-xl px-4 border ${
                errors.password ? "border-red-500" : "border-slate-700"
              }`}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 text-white text-base py-4 ml-3"
                placeholder="Enter your password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-400 text-xs mt-1 ml-1">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="self-end">
            <Text className="text-emerald-400 text-sm font-medium">
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-2 ${
              isLoading ? "bg-emerald-700" : "bg-emerald-500"
            }`}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <Text className="text-slate-900 text-base font-bold">
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-10">
          <Text className="text-slate-400 text-sm">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-emerald-400 text-sm font-bold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
