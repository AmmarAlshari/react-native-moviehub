// track the searchs made by the user
import { Account, Client, Databases, ID, Query } from "react-native-appwrite";
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_METRICS =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_METRICS!;
const COLLECTION_ID_USERS =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_USERS!;
const COLLECTION_ID_SAVED_MOVIES =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED_MOVIES!;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_METRICS,
      [Query.equal("searchTerm", query)]
    );
    console.log("result", result);
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_METRICS,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_METRICS,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          title: movie.title,
        }
      );
    }
    //check if a record of that search exists
    // if it does, increment the count
    // if it does not, create a new record with count 1
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_METRICS,
      [Query.limit(5), Query.orderDesc("count")]
    );
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

/**
 * Creates a new user account with Appwrite Auth and adds a user document to the users collection.
 * @param email User's email (required by Appwrite Auth)
 * @param password User's password
 * @param username User's username (for your users collection)
 */
export const createUserAccount = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    // 1. Create user in Appwrite Auth
    const user = await account.create(ID.unique(), email, password, username);
    console.log(user);
    if (!user) throw Error;
    await signIn(email, password);

    // 2. Add user document to your users collection
    await databases.createDocument(DATABASE_ID, COLLECTION_ID_USERS, user.$id, {
      username,
    });

    // 3. Create a session for the new user (log them in)

    return user;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
};
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error as any);
  }
}
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    console.log("Auth user after sign up:", user);
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID_USERS,
      user.$id
    );
    return { ...user, username: userDoc.username };
  } catch (error: any) {
    // If user is not authenticated, just return null
    if (error.code === 401 || error.message?.includes("missing scope")) {
      return null;
    }
    console.error("Error fetching current user:", error);
    return null;
  }
};
export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
