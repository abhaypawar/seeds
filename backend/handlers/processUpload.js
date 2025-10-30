const AWS = require('aws-sdk');
const { putScore } = require('../services/dynamodb');
const { predictHealthScore, predictRiskScore, identifyKeyDriver } = require('../services/model');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    
    // Get CSV from S3
    const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const csvContent = data.Body.toString('utf-8');
    
    // Parse CSV (simple implementation)
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim();
      });
      
      const features = {
        usage_drop: parseFloat(row.usage_drop),
        open_tickets: parseInt(row.open_tickets),
        failed_payments: parseInt(row.failed_payments),
        login_frequency: parseInt(row.login_frequency),
        feature_adoption: parseFloat(row.feature_adoption)
      };
      
      const healthScore = predictHealthScore(features);
      const riskScore = predictRiskScore(features);
      const keyDriver = identifyKeyDriver(features);
      
      await putScore({
        customer_id: row.customer_id,
        ...features,
        region: row.region,
        segment: row.segment,
        health_score: healthScore,
        risk_score: riskScore,
        key_driver: keyDriver,
        timestamp: new Date().toISOString()
      });
    }
    
    return { statusCode: 200, body: 'Processed' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
};
