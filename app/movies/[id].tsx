import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import {
  getCurrentUser,
  isMovieSavedForUser,
  removeSavedMovieForUser,
  saveMovieForUser,
} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );
  const [saved, setSaved] = useState(false);

  // Check if the movie is already saved for this user
  useEffect(() => {
    const checkSaved = async () => {
      const user = await getCurrentUser();
      if (user && movie) {
        const alreadySaved = await isMovieSavedForUser(
          user.$id,
          String(movie.id)
        );
        setSaved(alreadySaved);
      }
    };
    checkSaved();
  }, [movie]);

  const handleSave = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !movie) return;

      if (saved) {
        // Unsave logic
        await removeSavedMovieForUser(user.$id, String(movie.id));
        setSaved(false);
        console.log("Movie unsaved!");
      } else {
        // Save logic
        const alreadySaved = await isMovieSavedForUser(
          user.$id,
          String(movie.id)
        );
        if (alreadySaved) {
          setSaved(true);
          return;
        }
        await saveMovieForUser(
          user.$id,
          String(movie.id),
          `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        );
        setSaved(true);
        console.log("Movie saved!");
      }
    } catch (error) {
      console.error("Failed to toggle save movie:", error);
    }
  };

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex-row items-center justify-between w-full">
            <Text className="text-white font-bold text-xl flex-1">
              {movie?.title}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-row items-center ml-2"
            >
              {saved ? (
                <>
                  <Image
                    source={icons.check}
                    className="w-6 h-6"
                    style={{ tintColor: "#4ade80" }}
                  />
                  <Text className="text-accent font-semibold ml-1">
                    Movie Saved
                  </Text>
                </>
              ) : (
                <>
                  <Image
                    source={icons.save}
                    className="w-6 h-6"
                    style={{ tintColor: "#ab8bff" }}
                  />
                  <Text className="text-accent font-semibold ml-1">Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.vote_count} votes
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${movie?.budget / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor={"#fff"}
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
