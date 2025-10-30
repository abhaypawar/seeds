const { scanScores } = require('../services/dynamodb');

exports.handler = async (event) => {
  try {
    const { segment, region, limit = 10 } = event.queryStringParameters || {};
    
    let scores = await scanScores({ segment, region });
    
    // Sort by risk score descending
    scores.sort((a, b) => b.risk_score - a.risk_score);
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        customers: scores.slice(0, parseInt(limit))
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
