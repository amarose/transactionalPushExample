import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import CookieConsent from 'react-cookie-consent';

declare global {
  interface Window {
    dataLayer: Array<any>;
    gtag: (...args: any[]) => void;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    const hasConsented = localStorage.getItem('GA_Consent');
    if (hasConsented === 'true') {
      // Enable page views tracking after consent
      window.gtag('js', new Date());
      window.gtag('config', 'G-3FV871C4QN', {
        send_page_view: true
      });
    }

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
      window.dataLayer.splice(0, 0, {
        event: "userLoggedIn",
        userData: userData,
      });
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('GA_Consent', 'true');
    window.gtag('js', new Date());
    window.gtag('config', 'G-3FV871C4QN', {
      send_page_view: true  // Now send page view upon consent
    });
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="GA_Consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        onAccept={handleAccept}
      >
        This website uses cookies to enhance the user experience!
      </CookieConsent>
      <Component {...pageProps} />
    </>
  );
}
