import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();

  // SignIn method using credentials provider
  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      redirect: false, // Prevent automatic redirect
      email,
      password,
    });

    // Handle errors during sign-in
    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  };

  // SignOut method
  const signOut = async () => {
    await nextAuthSignOut();
  };

  // If the session is authenticated, make sure to provide user data, including the name.
  return {
    signIn,
    signOut,
    session, // This contains user session data, including the name
    isAuthenticated: !!session, // Boolean flag for authentication
    status, // 'loading', 'authenticated', 'unauthenticated'
    userName: session?.user?.name || "", // Provide userName directly here
  };
};

export default useAuth;
