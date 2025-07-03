import FormField from "@/components/FormField";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  createUserAccount,
  getCurrentUser,
  signIn,
  signOut,
} from "@/services/appwrite";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignIn, setIsSignIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      await createUserAccount(form.email, form.password, form.username);
      const user = await getCurrentUser();
      setCurrentUser(user);
      router.replace("/");
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      const user = await getCurrentUser();
      setCurrentUser(user);
      router.replace("/");
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
      setForm({ email: "", username: "", password: "" });
      setIsSignIn(false);
    } catch (err: any) {
      setError("Failed to log out");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-black flex-1">
      <Image
        source={images.bg}
        className="absolute w-full h-full top-0 left-0 z-0"
        resizeMode="cover"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={60}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={icons.logo} className="w-12 h-10 mt-10 mx-auto" />
          <View className="w-full justify-center min-h-[70vh] px-4 ">
            {currentUser ? (
              <>
                <Text className="text-2xl text-white font-bold mt-10 text-center">
                  Account Details
                </Text>
                <View className="bg-black/80 rounded-2xl p-6 mt-7">
                  <Text className="text-white text-lg font-bold mb-2">
                    Username:{" "}
                    <Text className="text-accent">{currentUser.username}</Text>
                  </Text>
                  <Text className="text-white text-lg font-bold mb-2">
                    Email:{" "}
                    <Text className="text-accent">{currentUser.email}</Text>
                  </Text>
                  <Text className="text-white text-lg font-bold mb-2">
                    Created:{" "}
                    <Text className="text-accent">
                      {new Date(currentUser.$createdAt).toLocaleString()}
                    </Text>
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-accent rounded-xl min-h-[62px] justify-center items-center mt-7"
                  onPress={handleSignOut}
                  disabled={loading}
                >
                  <Text className="text-white font-bold text-lg">
                    {loading ? "Logging Out..." : "Log Out"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="text-2xl text-white font-semibold mt-10">
                  {isSignIn ? (
                    <>
                      Log In to{" "}
                      <Text className="text-accent font-bold">Movie App</Text>
                    </>
                  ) : (
                    <>
                      Create Account in{" "}
                      <Text className="text-accent font-bold">Movie App</Text>
                    </>
                  )}
                </Text>
                {error && (
                  <Text className="text-red-400 mb-2 text-center">{error}</Text>
                )}
                {!isSignIn && (
                  <FormField
                    label="Username"
                    value={form.username}
                    onChangeText={(e) => setForm({ ...form, username: e })}
                    otherStyles="mt-7"
                    placeholder=""
                  />
                )}
                <FormField
                  label="Email"
                  value={form.email}
                  onChangeText={(e) => setForm({ ...form, email: e })}
                  otherStyles="mt-7"
                  placeholder=""
                  keyboardType="email-address"
                />
                <FormField
                  label="Password"
                  value={form.password}
                  onChangeText={(e) => setForm({ ...form, password: e })}
                  otherStyles="mt-7"
                  placeholder=""
                  secureTextEntry={true}
                />
                <TouchableOpacity
                  className="bg-accent rounded-xl min-h-[62px] justify-center items-center mt-7"
                  onPress={isSignIn ? handleSignIn : handleSignUp}
                  disabled={loading}
                >
                  <Text className="text-white font-bold text-lg">
                    {loading
                      ? isSignIn
                        ? "Signing In..."
                        : "Signing Up..."
                      : isSignIn
                        ? "Sign In"
                        : "Sign Up"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="mt-4"
                  onPress={() => setIsSignIn((prev) => !prev)}
                >
                  <Text className="text-center text-white font-bold">
                    {isSignIn
                      ? "Don't have an account? Sign Up"
                      : "Have an account? Sign In"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
