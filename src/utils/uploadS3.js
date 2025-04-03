//import AWS from 'aws-sdk'
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
// import { OtherApi } from '@/api/api';

export const uploadFile = async (file,objectUrl) => {

  // let credentials = await OtherApi.getAwsKey();
  // console.log(credentials.data);

  // const S3_BUCKET = credentials.data.bucketName;
  // const REGION = credentials.data.region;

  /* AWS.config.update({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY ,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
  });

  const s3 = new AWS.S3({
    params: { Bucket: import.meta.env.VITE_AWS_BUCKET_NAME },
    region: import.meta.env.VITE_AWS_BUCKET_REGION,
  });

  const params = {
    Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
    Key: file.name,
    Body: file,
  };

  return new Promise((resolve, reject) => {

      // const options = {
      //     partSize: 10 * 1024 * 1024, // 10 MB parts for large files
      //     queueSize: 1, // Number of concurrent uploads
      // };
      // const upload = s3.upload(params, options);
      const upload = s3.upload(params);

      upload.on('httpUploadProgress', (progress) => {
        const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
        console.log(percentUploaded);
      });

      upload.send((err, data) => {
        if (err) {
          reject(err);
        } else {
          // console.log('File uploaded successfully: ', data);
          // Vous pouvez ajouter des actions supplémentaires ici après un téléchargement réussi
          resolve(data);
        }
      })

  }) */


  //############################################# Version Prince ##############################################################

  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    },
  });

  const timestampInMillis = new Date().getTime();
  let fileExtension = (file.name ? file.name.split('.').pop() : "") ;
  const timestampedFileName = `file_${timestampInMillis}.${fileExtension}`;

  const key = `inputs/${timestampedFileName}`;
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
    // console.log(val);
    return {
      Location: val?.Location
    }
  });

  //######################################################################################################################################

};