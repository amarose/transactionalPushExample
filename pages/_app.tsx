import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Array<any>;
  }
}

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => console.log('scope is: ', registration.scope));
    }

    // Initialize window.dataLayer if it doesn't exist
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    
    // Retrieve user data from localStorage
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null; // Parse user data to an object

    // Check if a 'userData' event already exists in the dataLayer
    const existingUserDataEventIndex = window.dataLayer.findIndex(
      (event: any) => event.event === "userLoggedIn"
    );

    if (existingUserDataEventIndex !== -1) {
      // If the event exists, update it with the new user data
      window.dataLayer[existingUserDataEventIndex].userData = userData;
    } else {
      // If the event doesn't exist, push a new 'userData' event to the dataLayer
      window.dataLayer.push({
        event: "userLoggedIn",
        userData: userData,
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
