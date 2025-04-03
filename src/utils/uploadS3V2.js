  //import AWS from 'aws-sdk'
  import { S3Client } from "@aws-sdk/client-s3";
  import { Upload } from "@aws-sdk/lib-storage";
  // import { OtherApi } from '@/api/api';

  export const uploadBlobToS3 = async (file,objectUrl) => {

    const s3Client = new S3Client({
      region: import.meta.env.VITE_AWS_BUCKET_REGION,
      endpoint: import.meta.env.VITE_MINIO_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
      },
    });

    const timestampInMillis = new Date().getTime();
      //let fileExtension = (file.name ? file.name.split('.').pop() : "") ;
    const timestampedFileName = `uploads/file_${timestampInMillis}.sfdt`;


    const key = `${timestampedFileName}`;
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: key,
        Body: file,
      },
    });

    upload.on('httpUploadProgress', (progress) => {
      const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
      // console.log(percentUploaded);
    });

    return upload.done().then((val) => {
      console.log(val);
      
      return {
        Location: val?.Location
      }
    });

    //######################################################################################################################################

  };

