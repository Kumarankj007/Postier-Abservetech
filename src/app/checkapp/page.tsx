'use client'
import React, { useContext, useEffect } from 'react';
import PageContext from "@/app/providers/pagecontext";

function openApp(): void {
  const now = new Date().getTime();
  const timeout = 2000;
  let isAppInstalled = true;

  setTimeout(() => {
    if (new Date().getTime() - now < timeout + 100) {
      isAppInstalled = false; // App is not installed
    }
    if (!isAppInstalled) {
      // Redirect to Play Store if the app is not installed
      window.location.href = "https://play.google.com/store/apps/details?id=com.example.myapp";
    }
  }, timeout);

  // Attempt to open the app using the intent URL scheme
  window.location.href = "intent://open/path#Intent;scheme=myapp;package=com.example.myapp;end";
}

function openiOSApp(): void {
  const now = new Date().getTime();
  const timeout = 2000;
  let isAppInstalled = true;

  setTimeout(() => {
    if (new Date().getTime() - now < timeout + 100) {
      isAppInstalled = false; // App is not installed
    }
    if (!isAppInstalled) {
      // Redirect to App Store if the app is not installed
      window.location.href = "https://apps.apple.com/app/id123456789"; // Replace with your App Store URL
    }
  }, timeout);

  // Attempt to open the app using the custom URL scheme or Universal Link
  window.location.href = "myapp://open/path"; // Replace with your app's custom URL scheme
}

const RedirectToApp: React.FC = () => {
  const { i18 } = useContext(PageContext);
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    const timeoutDuration = 2000;
    let isAppInstalled = false;

    const redirectToStore = (): void => {
      if (/android/i.test(userAgent)) {
        openApp();
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        openiOSApp();
      } else {
        window.location.href = 'https://www.example.com'; // Replace with your fallback URL
      }
    };

    const tryOpeningApp = (urlScheme: string): void => {
      const start = new Date().getTime();
      window.location.href = urlScheme;

      setTimeout(() => {
        const now = new Date().getTime();
        if (now - start < timeoutDuration + 100) {
          redirectToStore();
        }
      }, timeoutDuration);
    };

    if (/android/i.test(userAgent)) {
      tryOpeningApp('myapp://open'); // Replace with your app's custom URL scheme for Android
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      tryOpeningApp('myapp://open'); // Replace with your app's custom URL scheme for iOS
    }
  }, []);

  return (
    <div>
      <h1>{i18?.NEW?.REDIRECTING || "Redirecting"}...</h1>
    </div>
  );
};

export default RedirectToApp;
