const { scanScores } = require('../services/dynamodb');

exports.handler = async (event) => {
  try {
    const { limit = 5 } = event.queryStringParameters || {};
    
    let scores = await scanScores();
    
    // Calculate aggregated score (equal weightage)
    scores = scores.map(s => ({
      ...s,
      aggregated_score: ((100 - s.health_score) * 0.5 + s.risk_score * 0.5)
    }));
    
    scores.sort((a, b) => b.aggregated_score - a.aggregated_score);
    
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
