import MovieCard from "@/components/MovieCard";
import TrendingCrads from "@/components/TrendingCrads";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getCurrentUser, getTrendingMovies } from "@/services/appwrite";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user and movies when screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchAll = async () => {
        setLoading(true);
        setTrendingLoading(true);
        setMoviesLoading(true);
        setError(null);
        try {
          const user = await getCurrentUser();
          if (isActive) setUsername(user?.username || null);

          const trending = await getTrendingMovies();
          if (isActive) setTrendingMovies(trending || []);
          setTrendingLoading(false);

          const allMovies = await fetchMovies({ query: "" });
          if (isActive) setMovies(allMovies || []);
          setMoviesLoading(false);
        } catch (err: any) {
          setError(err?.message || "Failed to load data");
        }
        setLoading(false);
      };
      fetchAll();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const user = await getCurrentUser();
      setUsername(user?.username || null);

      const trending = await getTrendingMovies();
      setTrendingMovies(trending || []);

      const allMovies = await fetchMovies({ query: "" });
      setMovies(allMovies || []);
    } catch (err: any) {
      setError(err?.message || "Failed to refresh data");
    }
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {/* Show username greeting above trending movies */}
        <Text className="text-lg font-bold text-center m-3">
          {username ? (
            <>
              <Text className="text-accent text-xl">Welcome</Text>
              <Text className="text-white text-xl">{` ${username}`}</Text>
            </>
          ) : (
            <Text className="text-white">Welcome Guest</Text>
          )}
        </Text>

        {loading || moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : (
          <View className="flex-1 mt-5">
            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movie
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCrads movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />
              </View>
            )}
            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
              <FlatList
                scrollEnabled={false}
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

