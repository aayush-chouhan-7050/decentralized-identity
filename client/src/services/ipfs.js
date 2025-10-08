// src/services/ipfs.js
import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const PINATA_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export const uploadProfileToIPFS = async (profileData) => {
  if (!profileData) throw new Error("Profile data is required.");

  try {
    const { data } = await axios.post(PINATA_JSON_URL, profileData, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });
    return data.IpfsHash;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error.response?.data || error.message);
    throw new Error("Failed to upload profile to IPFS.");
  }
};

export const uploadFileToIPFS = async (file) => {
    if (!file) throw new Error("File is required.");

    const formData = new FormData();
    formData.append('file', file);

    try {
        const { data } = await axios.post(PINATA_FILE_URL, formData, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });
        return `${IPFS_GATEWAY}${data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading file to IPFS:", error.response?.data || error.message);
        throw new Error("Failed to upload file to IPFS.");
    }
};