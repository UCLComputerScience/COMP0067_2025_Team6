"use client";

import React from "react";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider from NextAuth.js

import createTheme from "@/theme";
import { ThemeProvider } from "@/contexts/ThemeContext";
import useTheme from "@/hooks/useTheme";
import { store } from "@/redux/store";

import { AuthProvider } from "@/contexts/JWTContext";
// import { AuthProvider } from "@/contexts/FirebaseAuthContext";
// import { AuthProvider } from "@/contexts/Auth0Context";
// import { AuthProvider } from "@/contexts/CognitoContext";

// Note: Remove the following line if you want to disable the API mocks.
import "@/mocks";

// Global CSS imports
import "@/vendor/perfect-scrollbar.css";
import "animate.css/animate.min.css";
import "@/i18n";

// Initialize Chart.js
import "chart.js/auto";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <html lang="en">
      <body className={inter.variable}>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MuiThemeProvider theme={createTheme(theme)}>
                {/* Add the SessionProvider here to provide session context to the entire app */}
                <SessionProvider>{children}</SessionProvider>
              </MuiThemeProvider>
            </LocalizationProvider>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

const withThemeProvider = (Component: React.ComponentType<any>) => {
  const AppWithThemeProvider = (props: any) => {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };
  AppWithThemeProvider.displayName = "AppWithThemeProvider";
  return AppWithThemeProvider;
};

export default withThemeProvider(RootLayout);
