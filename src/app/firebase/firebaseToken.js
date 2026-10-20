'use client';
import { useState, useEffect } from "react";
import { app, getFcmToken } from "./firebase";
import { getMessaging } from 'firebase/messaging';
export const useFcmToken = () => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const messaging = getMessaging(app)
        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          console.log("Notification permission granted.");

          // Ensure messaging instance is available
          if (messaging) {
            // Get the FCM token using the messaging instance and VAPID key
            const token = await getFcmToken(messaging, {
              vapidKey: "BA9F4rejqiZBVim6nAk2t1ZBy4UTDMR8i-1YxOvGHdQ3RMSs8o1902lhkXbCQv00hevRpN1exjk1iZTlV_PNoiA",
            });

            if (token) {
              // console.log("FCM Token:", token);
              setFcmToken(token); // Store the token in state
            } else {
              console.log("No registration token available.");
            }
          }
        } else {
          console.error("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    fetchToken();
  }, []); // Run once on component mount

  return fcmToken; // Return the token for use in your component
};
