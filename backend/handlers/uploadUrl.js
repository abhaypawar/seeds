const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async (event) => {
  try {
    const fileName = `uploads/${uuidv4()}.csv`;
    
    const uploadURL = s3.getSignedUrl('putObject', {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Expires: 300,
      ContentType: 'text/csv'
    });
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        uploadURL,
        fileName
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
