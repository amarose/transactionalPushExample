import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import CookieConsent from 'react-cookie-consent';
import Script from 'next/script';

declare global {
  interface Window {
    dataLayer: Array<any>;
    gtag: (...args: any[]) => void;
  }
}

function initializeGA() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', 'G-3FV871C4QN', {
    // Add further configuration to respect user privacy
    send_page_view: true, // Set to true or false as required
    anonymize_ip: true, // Anonymizes the IP address of the user
  });
}

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    const hasConsented = localStorage.getItem('GA_Consent');
    if (hasConsented === 'true') {
      initializeGA();
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
      window.dataLayer.push({
        event: "userLoggedIn",
        userData: userData,
      });
    }
  }, []);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-3FV871C4QN"
        strategy="afterInteractive"
        onLoad={initializeGA}
      />
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="GA_Consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        onAccept={() => {
          localStorage.setItem('GA_Consent', 'true');
          initializeGA(); // Initialize Google Analytics on accept
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      <Component {...pageProps} />
    </>
  );
}
