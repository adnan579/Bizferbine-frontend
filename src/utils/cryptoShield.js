import CryptoJS from 'crypto-js';

// In a production medical app, this key would be derived from a user's master PIN.
// For this implementation, we use a deterministic client-side hash based on their local session.
const getClientKey = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return 'FALLBACK_AEGIS_KEY_2026';
  const user = JSON.parse(userStr);
  return CryptoJS.SHA256(user.id + "AEGIS_MEDICAL_SALT").toString();
};

export const encryptData = (plainText) => {
  if (!plainText) return '';
  const key = getClientKey();
  return CryptoJS.AES.encrypt(plainText, key).toString();
};

export const decryptData = (cipherText) => {
  if (!cipherText) return '';
  try {
    const key = getClientKey();
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || cipherText; // Fallback to cipher if decryption fails (e.g., legacy unencrypted logs)
  } catch (err) {
    return cipherText; 
  }
};