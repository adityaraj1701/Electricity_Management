import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

class SolarEnergyPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            random_state=42
        )
        self.scaler = StandardScaler()
        
    def prepare_features(self, df):
        """
        Prepare features from raw data
        
        Expected columns:
        - timestamp: datetime
        - temperature: float (Celsius)
        - cloud_cover: float (percentage)
        - radiation: float (W/m²)
        - humidity: float (percentage)
        - wind_speed: float (m/s)
        - production: float (kWh) - target variable
        """
        # Create time-based features
        df['hour'] = df['timestamp'].dt.hour
        df['month'] = df['timestamp'].dt.month
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Calculate moving averages for weather features
        weather_features = ['temperature', 'cloud_cover', 'radiation', 
                          'humidity', 'wind_speed']
        
        for feature in weather_features:
            df[f'{feature}_ma_3h'] = df[feature].rolling(window=3).mean()
            df[f'{feature}_ma_24h'] = df[feature].rolling(window=24).mean()
        
        # Create interaction features
        df['temp_radiation'] = df['temperature'] * df['radiation']
        df['cloud_radiation'] = df['cloud_cover'] * df['radiation']
        
        # Drop rows with NaN values (from rolling averages)
        df = df.dropna()
        
        # Select features for model training
        feature_columns = (
            weather_features +
            [col for col in df.columns if '_ma_' in col] +
            ['hour', 'month', 'day_of_week', 'temp_radiation', 'cloud_radiation']
        )
        
        return df[feature_columns], df['production']
    
    def train(self, train_data):
        """
        Train the model on historical data
        """
        # Prepare features
        X, y = self.prepare_features(train_data)
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        train_pred = self.model.predict(X_train_scaled)
        val_pred = self.model.predict(X_val_scaled)
        
        metrics = {
            'train_rmse': np.sqrt(mean_squared_error(y_train, train_pred)),
            'val_rmse': np.sqrt(mean_squared_error(y_val, val_pred)),
            'train_r2': r2_score(y_train, train_pred),
            'val_r2': r2_score(y_val, val_pred)
        }
        
        return metrics
    
    def predict(self, data):
        """
        Make predictions on new data
        """
        X, _ = self.prepare_features(data)
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def save_model(self, path):
        """
        Save the trained model and scaler
        """
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler
        }, path)
    
    @classmethod
    def load_model(cls, path):
        """
        Load a trained model
        """
        predictor = cls()
        saved_objects = joblib.load(path)
        predictor.model = saved_objects['model']
        predictor.scaler = saved_objects['scaler']
        return predictor

# Example usage
if __name__ == "__main__":
    # Sample data creation (replace with your actual data)
    dates = pd.date_range(start='2023-01-01', end='2023-12-31', freq='H')
    sample_data = pd.DataFrame({
        'timestamp': dates,
        'temperature': np.random.normal(20, 5, len(dates)),
        'cloud_cover': np.random.uniform(0, 100, len(dates)),
        'radiation': np.random.uniform(0, 1000, len(dates)),
        'humidity': np.random.uniform(30, 90, len(dates)),
        'wind_speed': np.random.uniform(0, 10, len(dates)),
        'production': np.random.uniform(0, 500, len(dates))
    })
    
    # Initialize and train model
    predictor = SolarEnergyPredictor()
    metrics = predictor.train(sample_data)
    
    print("Model Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")
    
    # Make predictions for the next 24 hours
    future_data = sample_data.tail(24).copy()
    future_data['timestamp'] = future_data['timestamp'] + pd.Timedelta(days=1)
    predictions = predictor.predict(future_data)
    
    print("\nPredicted solar energy production for next 24 hours:")
    print(predictions)
