import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

class EnergyForecaster:
    def __init__(self):
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=True,
            seasonality_mode='multiplicative'
        )
        
    def prepare_data(self, df):
        """
        Prepare data for Prophet model.
        Expected input: DataFrame with 'timestamp' and 'consumption' columns
        """
        # Convert to Prophet's required format
        df_prophet = df.rename(columns={
            'timestamp': 'ds',
            'consumption': 'y'
        })
        return df_prophet
        
    def train(self, df):
        """Train the Prophet model"""
        self.model.fit(df)
        
    def predict(self, periods=30):
        """Generate forecasts for specified number of periods"""
        future_dates = self.model.make_future_dataframe(periods=periods)
        forecast = self.model.predict(future_dates)
        return forecast
    
    def evaluate(self, actual, predicted):
        """Calculate error metrics"""
        mae = mean_absolute_error(actual, predicted)
        rmse = np.sqrt(mean_squared_error(actual, predicted))
        mape = np.mean(np.abs((actual - predicted) / actual)) * 100
        return {
            'MAE': mae,
            'RMSE': rmse,
            'MAPE': mape
        }
    
    def plot_forecast(self, forecast, actual_data):
        """Plot the forecast results"""
        plt.figure(figsize=(12, 6))
        
        # Plot actual values
        plt.plot(actual_data['ds'], actual_data['y'], 
                label='Actual', color='blue')
        
        # Plot forecast
        plt.plot(forecast['ds'], forecast['yhat'], 
                label='Forecast', color='red')
        
        # Plot uncertainty intervals
        plt.fill_between(forecast['ds'],
                        forecast['yhat_lower'],
                        forecast['yhat_upper'],
                        color='red', alpha=0.2,
                        label='95% Confidence Interval')
        
        plt.title('Energy Consumption Forecast')
        plt.xlabel('Date')
        plt.ylabel('Energy Consumption')
        plt.legend()
        plt.grid(True)
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        return plt

# Example usage
def main():
    # Generate sample data
    np.random.seed(42)
    dates = pd.date_range(start='2023-01-01', end='2024-01-01', freq='H')
    base_consumption = 100
    
    # Add various patterns to make it realistic
    hourly_pattern = np.sin(np.pi * dates.hour / 12) * 20
    weekly_pattern = (dates.dayofweek < 5).astype(int) * 30
    seasonal_pattern = np.sin(2 * np.pi * dates.dayofyear / 365) * 40
    
    consumption = (base_consumption +
                  hourly_pattern +
                  weekly_pattern +
                  seasonal_pattern +
                  np.random.normal(0, 10, len(dates)))
    
    # Create DataFrame
    df = pd.DataFrame({
        'timestamp': dates,
        'consumption': consumption
    })
    
    # Initialize and train model
    forecaster = EnergyForecaster()
    train_data = forecaster.prepare_data(df)
    forecaster.train(train_data)
    
    # Generate forecast
    forecast = forecaster.predict(periods=168)  # 7 days ahead
    
    # Evaluate model
    actual = train_data['y'].iloc[-168:]
    predicted = forecast['yhat'].iloc[-336:-168]
    metrics = forecaster.evaluate(actual, predicted)
    
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Plot results
    plt = forecaster.plot_forecast(forecast, train_data)
    plt.show()

if __name__ == "__main__":
    main()
