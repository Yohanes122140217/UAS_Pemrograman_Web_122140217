// src/components/ImageUploader.jsx
import React from 'react'
import { IKContext, IKUpload } from 'imagekitio-react'

export default function ImageUploader({ onUploadSuccess }) {
  return (
    <IKContext
      publicKey="your_public_key"
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id/"
      authenticationEndpoint="http://localhost:6543/api/imagekit/auth"
    >
      <div className="my-4">
        <IKUpload
          fileName="my_upload.jpg"
          // optional: you can pass transformations here
          onError={(err) => console.error("Upload error:", err)}
          onSuccess={(res) => {
            console.log("Upload success:", res)
            // e.g. { filePath: "...", url: "...", fileId: "..."}
            onUploadSuccess(res.url)
          }}
        />
      </div>
    </IKContext>
  )
}
