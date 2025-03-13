import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  };

  const signOut = async () => {
    await nextAuthSignOut();
  };

  const resetPassword = async (email: string) => {
    const response = await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
  };

  return {
    signIn,
    signOut,
    resetPassword,
    session,
    isAuthenticated: !!session,
    status,
    userName: session?.user?.name || "",
  };
};

export default useAuth;

