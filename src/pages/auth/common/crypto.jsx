import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

function generateDeviceId() {
  const navigatorInfo = window.navigator.userAgent + window.navigator.platform;
  const pluginsInfo = Array.from(window.navigator.plugins)
    .map((plugin) => {
      return `${plugin.name}${plugin.filename}${plugin.length}`;
    })
    .join("");
  const timezoneOffset = new Date().getTimezoneOffset();
  const screenInfo = `${window.screen.width}${window.screen.height}${window.screen.colorDepth}`;
  const cameraInfo = getCameraInfo();

  const deviceIdData = `${navigatorInfo}${pluginsInfo}${timezoneOffset}${screenInfo}${cameraInfo}`;
  const hash = CryptoJS.SHA256(deviceIdData);
  return hash.toString(CryptoJS.enc.Hex);
}

function getCameraInfo() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return "camera available";
  } else {
    return "camera not available";
  }
}

function Cryptodeviceid() {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    setDeviceId(generateDeviceId());
  }, []);

  useEffect(() => {
    localStorage.setItem("deviceId", deviceId);
  }, [deviceId]);

  return <div></div>;
}

export default Cryptodeviceid;
