import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// files: { preview?: string; fileName?: string, isBlob?: boolean }[] 
 
export const UploadFilesToS3 = async (files) => {

  let s3Client;
   
  s3Client = ( import.meta.env.VITE_S3_PROVIDER === "minio" || import.meta.env.VITE_S3_PROVIDER === "digitalOcean" ) ?
    new S3Client({
      region: import.meta.env.VITE_AWS_BUCKET_REGION,
      endpoint: import.meta.env.VITE_MINIO_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY || "minio-access-key",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || "minio-secret-key",
      },
    })
    :
    new S3Client({
      region: import.meta.env.VITE_AWS_BUCKET_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY || "minio-access-key",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || "minio-secret-key",
      },
    })
 
  const uploadPromises = files.map(async ({ preview, fileName, isSfdt }) => {

    // Récupération du contenu réel du Blob
    let blob;

    if (preview instanceof Blob) {
      blob = preview
    } else {
      const response = await fetch(preview || "undefined");
      blob = await response.blob();
    }
 
    const mimeType = blob.type; // Récupération du MIME type
    const fileExtension = mimeType.split("/")[1];

    const timestamp = new Date().getTime();
    const key = `uploads/${timestamp}.${isSfdt ? 'sfdt' : fileExtension}`;
 
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: key,
        Body: blob,
        ContentType: mimeType,
        ACL: "public-read"
      },
    });
 
    upload.on("httpUploadProgress", (progress) => {
      if (progress && progress.loaded && progress.total) {
        const percentUploaded = Math.round(
          (progress.loaded / progress.total) * 100,
        );
      }
    });
 
    return upload.done().then((result) => {
      const endpoint = import.meta.env.VITE_MINIO_ENDPOINT; 
      const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
      const url = `${endpoint}${bucket}/${key}`;
      
      return { url: import.meta.env.VITE_S3_PROVIDER === "minio" ? url : result?.Location, fileName: fileName, type: mimeType };
    });

  });
 
  try {
    const uploadedLocations = await Promise.all(uploadPromises);
    return uploadedLocations;
  } catch (error) {
    throw error;
  }
};