// src/services/ipfs.js
import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export const uploadProfileToIPFS = async (profileData) => {
  if (!profileData) throw new Error("Profile data is required.");

  try {
    const { data } = await axios.post(PINATA_URL, profileData, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });
    return data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error.response?.data || error.message);
    throw new Error("Failed to upload profile to IPFS.");
  }
};