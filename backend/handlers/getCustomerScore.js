const { getScore } = require('../services/dynamodb');

exports.handler = async (event) => {
  try {
    const customerId = event.pathParameters.id;
    const score = await getScore(customerId);
    
    if (!score) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }
    
    // Aggregate risk score (equal weightage)
    const aggregatedRisk = (
      score.health_score * 0.5 +
      score.risk_score * 0.5
    );
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        ...score,
        aggregated_risk: aggregatedRisk
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
