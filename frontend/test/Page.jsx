import React from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';

const publicKey = "public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=";
const urlEndpoint = "https://ik.imagekit.io/wc6bpahhv/";

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:6543/api/imagekit/auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.error("Authentication request failed:", error);
    throw error;
  }
};

const onError = (err) => {
  console.error("Upload Error:", err);
  alert("Upload failed! " + JSON.stringify(err));
};

const onSuccess = (res) => {
  console.log("Upload Success:", res);
  alert("Upload successful! URL: " + res.url);
};

export default function AddProductForm() {
  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}  // async function that fetches fresh auth params
    >
      <div>
        <h2>Upload an Image</h2>
        <IKUpload
          fileName={`test-upload-${Date.now()}`}
          onError={onError}
          onSuccess={onSuccess}
          className="cursor-pointer px-4 py-2 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 hover:border-red-600 hover:text-red-600 transition-colors"
        />
      </div>
    </IKContext>
  );
}
