'use client';
import { initializeApp, getApps } from "firebase/app";
import { getToken as getFcmToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKETID,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDERID,
  appId: process.env.NEXT_PUBLIC_FB_APPID,
  measurementId: process.env.NEXT_PUBLIC_FB_MESSUREMENT_ID,
};

// const app = initializeApp(firebaseConfig);
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
if (typeof window!=='undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      // console.log(process.env.NEXT_PUBLIC_FB_APIKEY, 'Service Worker registered successfully:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

export { getFcmToken };
