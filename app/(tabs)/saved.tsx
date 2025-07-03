import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovieDetails } from "@/services/api";
import { getCurrentUser, getSavedMoviesForUser } from "@/services/appwrite";
import { useFocusEffect } from "@react-navigation/native";
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

export default function Saved() {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchAll = async () => {
        setLoading(true);
        setError(null);
        try {
          const user = await getCurrentUser();
          if (!user) {
            setSavedMovies([]);
            setLoading(false);
            return;
          }

          const savedDocs = await getSavedMoviesForUser(user.$id);

          // Fetch full movie details for each saved movie
          const movies: any[] = [];
          for (const doc of savedDocs) {
            try {
              const details = await fetchMovieDetails(doc.movie_id);
              if (details) movies.push(details);
            } catch (e) {
              // skip if fetch fails
            }
          }
          if (isActive) setSavedMovies(movies);
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
      if (!user) {
        setSavedMovies([]);
        setRefreshing(false);
        return;
      }

      const savedDocs = await getSavedMoviesForUser(user.$id);
      const movies: any[] = [];
      for (const doc of savedDocs) {
        try {
          const details = await fetchMovieDetails(doc.movie_id);
          if (details) movies.push(details);
        } catch (e) {}
      }
      setSavedMovies(movies);
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

        <Text className="text-lg text-white font-bold mt-10">Saved Movies</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : savedMovies.length === 0 ? (
          <Text className=" text-gray-500 text-center mt-10">
            No saved movies yet.
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <FlatList
              scrollEnabled={false}
              data={savedMovies}
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}
