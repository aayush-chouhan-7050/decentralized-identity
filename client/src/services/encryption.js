// client/src/services/encryption.js
import { ethers } from 'ethers';

const getSigningKey = async (signer) => {
  const signature = await signer.signMessage('DecentraID_ENCRYPTION_KEY');
  return ethers.keccak256(signature);
};

const getCryptoKey = async (signer) => {
  const signingKey = await getSigningKey(signer);
  const keyData = ethers.toBeArray(signingKey);
  return crypto.subtle.importKey('raw', keyData, 'AES-GCM', true, ['encrypt', 'decrypt']);
};

export const encryptData = async (data, signer) => {
  const key = await getCryptoKey(signer);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );

  const encryptedData = {
    iv: ethers.hexlify(iv),
    data: ethers.hexlify(new Uint8Array(encrypted)),
  };

  return JSON.stringify(encryptedData);
};

export const decryptData = async (encryptedString, signer) => {
  let parsedData;
  try {
    parsedData = JSON.parse(encryptedString);
  } catch (error) {
    console.error("Failed to parse data from IPFS:", error);
    throw new Error("Invalid data format from IPFS.");
  }

  // Check if the data has the structure of an encrypted object.
  if (parsedData && parsedData.iv && parsedData.data) {
    const { iv, data } = parsedData;
    
    if (!iv || !data) {
        throw new Error("Invalid encrypted data structure: missing iv or data fields.");
    }

    try {
        const key = await getCryptoKey(signer);
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: ethers.toBeArray(iv) },
            key,
            ethers.toBeArray(data)
        );
        return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Failed to decrypt profile. The key may be incorrect or data might be corrupt.");
    }
  } else {
    // If it doesn't look encrypted, assume it's old plaintext data and return it directly.
    console.warn("Data does not appear to be encrypted. Treating as plaintext for backward compatibility.");
    return parsedData;
  }
};