//import AWS from 'aws-sdk'
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
// import { OtherApi } from '@/api/api';

export const uploadFile = async (file,objectUrl) => {

  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_BUCKET_REGION, // us-east-1
    endpoint: import.meta.env.VITE_AWS_BUCKET_ENDPOINT,// https://sigen.tor1.digitaloceanspaces.com
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,// DO801N7J8ETCLJ3EL7NF
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY, // q2aRO1TVw6X/lbFwPsYkI02Ai1pt0z5eEzSdcEVahLY
    },
    s3ForcePathStyle: true,
  });

  const timestampInMillis = new Date().getTime();
    //let fileExtension = (file.name ? file.name.split('.').pop() : "") ;
  const timestampedFileName = `file_${timestampInMillis}.sfdt`;


  const key = `inputs/${timestampedFileName}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME, // sigen
      Key: key,
      Body: file,
    },
  });

  upload.on('httpUploadProgress', (progress) => {
    const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
    // console.log(percentUploaded);
  });

  return upload.done().then((val) => {
    return {
      Location: val?.Location
    }
  });

  //######################################################################################################################################

};