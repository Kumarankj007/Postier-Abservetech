export function getStoredDeviceId(): string | null {

    function decryptDeviceId(encryptedDeviceId: string): string {
        const secretKey: string = 'my-secret-key'; // Use the same key as used for encryption
        const bytes: any = CryptoJS.AES.decrypt(encryptedDeviceId, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
      }
      
    const encryptedDeviceId: string | null | false = typeof window !== "undefined" && localStorage.getItem("deviceId");
    if (encryptedDeviceId) {
      return decryptDeviceId(encryptedDeviceId);
    }
    return null;
  }