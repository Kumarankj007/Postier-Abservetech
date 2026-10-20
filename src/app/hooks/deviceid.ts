'use client'
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { API } from "../tools/apitools";

// Function to generate a unique device ID
function generateDeviceId(): string {
  const navigatorInfo: string = window.navigator.userAgent + window.navigator.platform;
  const pluginsInfo: string = Array.from(window.navigator.plugins)
    .map((plugin) => `${plugin.name}${plugin.filename}${plugin.length}`)
    .join("");
  const timezoneOffset: number = new Date().getTimezoneOffset();
  const screenInfo: string = `${window.screen.width}${window.screen.height}${window.screen.colorDepth}`;
  const cameraInfo: string = getCameraInfo();

  const deviceIdData: string = `${navigatorInfo}${pluginsInfo}${timezoneOffset}${screenInfo}${cameraInfo}`;
  const hash: CryptoJS.lib.WordArray = CryptoJS.SHA256(deviceIdData);
  return hash.toString(CryptoJS.enc.Hex);
}

// Function to check if camera is available
function getCameraInfo(): string {
  // @ts-ignore
  if (navigator?.mediaDevices?.getUserMedia) {
    return "camera available";
  } else {
    return "camera not available";
  }
}

// Function to encrypt the device ID
function encryptDeviceId(deviceId: string): string {
  const secretKey: string = 'my-secret-key'; // Use a more secure key in production
  return CryptoJS.AES.encrypt(deviceId, secretKey).toString();
}

// Function to decrypt the device ID


// React component to handle device ID encryption and storage
function UseCryptodeviceid(): string | null {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Check if the device ID already exists in localStorage
    let storedDeviceId = window.localStorage.getItem("deviceId");
     API.deviceId = storedDeviceId
    if (!storedDeviceId) {
      // If it doesn't exist, generate and encrypt a new device ID
      const generatedDeviceId: string = generateDeviceId();
      const encryptedDeviceId: string = encryptDeviceId(generatedDeviceId);
      window.localStorage.setItem("deviceId", encryptedDeviceId);
      API.deviceId = encryptedDeviceId
      storedDeviceId = encryptedDeviceId;
    }

    setDeviceId(storedDeviceId);
  }, []);

  return deviceId;
}

export default UseCryptodeviceid;