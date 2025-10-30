const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'CustomerScores';

async function putScore(item) {
  await dynamodb.put({
    TableName: TABLE_NAME,
    Item: item
  }).promise();
}

async function getScore(customerId) {
  const result = await dynamodb.get({
    TableName: TABLE_NAME,
    Key: { customer_id: customerId }
  }).promise();
  return result.Item;
}

async function scanScores(filters = {}) {
  const params = { TableName: TABLE_NAME };
  
  if (filters.segment || filters.region) {
    params.FilterExpression = [];
    params.ExpressionAttributeValues = {};
    
    if (filters.segment) {
      params.FilterExpression.push('segment = :segment');
      params.ExpressionAttributeValues[':segment'] = filters.segment;
    }
    if (filters.region) {
      params.FilterExpression.push('region = :region');
      params.ExpressionAttributeValues[':region'] = filters.region;
    }
    
    params.FilterExpression = params.FilterExpression.join(' AND ');
  }
  
  const result = await dynamodb.scan(params).promise();
  return result.Items;
}

module.exports = { putScore, getScore, scanScores };
