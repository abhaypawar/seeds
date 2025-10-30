import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)


def generate_customer_data(n=1500):
    data = []
    for i in range(n):
        customer_id = f"CUST_{i+1:05d}"
        
        # Features
        usage_drop = np.random.uniform(0, 100)
        open_tickets = np.random.randint(0, 20)
        failed_payments = np.random.randint(0, 10)
        contract_length = np.random.randint(1, 60)
        login_frequency = np.random.randint(0, 90)
        feature_adoption = np.random.uniform(0, 100)
        support_interactions = np.random.randint(0, 50)
        
        # Target: Health Score (0-100, higher is better)
        health_score = (
            (100 - usage_drop) * 0.3 +
            (100 - open_tickets * 5) * 0.2 +
            (100 - failed_payments * 10) * 0.2 +
            login_frequency * 0.15 +
            feature_adoption * 0.15
        ) + np.random.normal(0, 10)
        health_score = np.clip(health_score, 0, 100)
        
        # Target: Risk Score (0-100, higher is riskier)
        risk_score = (
            usage_drop * 0.35 +
            open_tickets * 3 +
            failed_payments * 6 +
            (100 - login_frequency) * 0.15
        ) + np.random.normal(0, 8)
        risk_score = np.clip(risk_score, 0, 100)
        
        data.append({
            'customer_id': customer_id,
            'usage_drop': usage_drop,
            'open_tickets': open_tickets,
            'failed_payments': failed_payments,
            'contract_length': contract_length,
            'login_frequency': login_frequency,
            'feature_adoption': feature_adoption,
            'support_interactions': support_interactions,
            'region': np.random.choice(['US-East', 'US-West', 'EU', 'APAC']),
            'segment': np.random.choice(['Enterprise', 'SMB', 'Startup']),
            'health_score': health_score,
            'risk_score': risk_score
        })
    
    return pd.DataFrame(data)

# Generate data
df = generate_customer_data(1500)

# Split
train_df = df.iloc[:1000]
test_df = df.iloc[1000:]

train_df.to_csv('train_data.csv', index=False)
test_df.to_csv('test_data.csv', index=False)
print("✅ Generated 1000 training + 500 test records")
