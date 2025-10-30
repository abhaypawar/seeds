import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import numpy as np

# Load data
train_df = pd.read_csv('train_data.csv')
test_df = pd.read_csv('test_data.csv')

# Features
feature_cols = ['usage_drop', 'open_tickets', 'failed_payments', 
                'contract_length', 'login_frequency', 'feature_adoption', 
                'support_interactions']

X_train = train_df[feature_cols]
X_test = test_df[feature_cols]

# Model 1: Health Score
y_train_health = train_df['health_score']
y_test_health = test_df['health_score']

model_health = RandomForestRegressor(n_estimators=100, random_state=42)
model_health.fit(X_train, y_train_health)

pred_health = model_health.predict(X_test)
r2_health = r2_score(y_test_health, pred_health)
print(f"✅ Health Score Model R² Score: {r2_health:.3f} ({r2_health*100:.1f}% accuracy)")

# Model 2: Risk Score
y_train_risk = train_df['risk_score']
y_test_risk = test_df['risk_score']

model_risk = RandomForestRegressor(n_estimators=100, random_state=42)
model_risk.fit(X_train, y_train_risk)

pred_risk = model_risk.predict(X_test)
r2_risk = r2_score(y_test_risk, pred_risk)
print(f"✅ Risk Score Model R² Score: {r2_risk:.3f} ({r2_risk*100:.1f}% accuracy)")

# Save models
with open('model_health_score.pkl', 'wb') as f:
    pickle.dump(model_health, f)

with open('model_risk_score.pkl', 'wb') as f:
    pickle.dump(model_risk, f)

print("✅ Models saved!")
