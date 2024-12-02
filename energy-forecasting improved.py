import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import holidays

class EnhancedEnergyForecaster:
    def __init__(self, country_holidays='US'):
        """
        Initialize the forecaster with advanced features
        
        Parameters:
        country_holidays (str): Country code for holidays
        """
        self.holidays_df = self.get_holidays(country_holidays)
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=True,
            seasonality_mode='multiplicative',
            holidays=self.holidays_df,
            interval_width=0.95
        )
        
    def get_holidays(self, country_code):
        """Generate holiday dataframe for specified country"""
        country_holidays = holidays.CountryHoliday(country_code)
        holiday_dates = []
        for date in pd.date_range(start='2020-01-01', end='2025-12-31'):
            if date in country_holidays:
                holiday_dates.append({
                    'holiday': country_holidays.get(date),
                    'ds': date,
                    'lower_window': -1,
                    'upper_window': 1
                })
        return pd.DataFrame(holiday_dates)
    
    def add_weather_regressors(self, df, temperature, humidity):
        """Add weather-related additional regressors"""
        df['temperature'] = temperature
        df['humidity'] = humidity
        self.model.add_regressor('temperature')
        self.model.add_regressor('humidity')
        return df
        
    def prepare_data(self, df, include_weather=False, temp_data=None, humidity_data=None):
        """
        Prepare data with optional weather features
        """
        df_prophet = df.rename(columns={
            'timestamp': 'ds',
            'consumption': 'y'
        })
        
        if include_weather and temp_data is not None and humidity_data is not None:
            df_prophet = self.add_weather_regressors(df_prophet, temp_data, humidity_data)
            
        return df_prophet
        
    def train(self, df):
        """Train the Prophet model"""
        self.model.fit(df)
        
    def predict(self, periods=30, future_weather=None):
        """Generate forecasts with optional weather data"""
        future_dates = self.model.make_future_dataframe(periods=periods)
        
        if future_weather is not None:
            future_dates['temperature'] = future_weather['temperature']
            future_dates['humidity'] = future_weather['humidity']
            
        forecast = self.model.predict(future_dates)
        return forecast
    
    def perform_cv(self, df, initial='365 days', period='30 days', horizon='90 days'):
        """Perform cross validation"""
        cv_results = cross_validation(
            self.model,
            initial=initial,
            period=period,
            horizon=horizon,
            parallel="processes"
        )
        cv_metrics = performance_metrics(cv_results)
        return cv_results, cv_metrics
    
    def evaluate(self, actual, predicted):
        """Calculate comprehensive error metrics"""
        metrics = {
            'MAE': mean_absolute_error(actual, predicted),
            'RMSE': np.sqrt(mean_squared_error(actual, predicted)),
            'MAPE': np.mean(np.abs((actual - predicted) / actual)) * 100,
            'R2': r2_score(actual, predicted),
            'Bias': np.mean(predicted - actual),
            'NMAE': mean_absolute_error(actual, predicted) / np.mean(actual),
            'CV_RMSE': np.sqrt(mean_squared_error(actual, predicted)) / np.mean(actual)
        }
        return metrics
    
    def plot_components(self, forecast):
        """Plot trend, seasonality, and holiday components"""
        fig = self.model.plot_components(forecast)
        plt.tight_layout()
        return fig
    
    def plot_forecast(self, forecast, actual_data, include_components=True):
        """Enhanced plotting with multiple subplots"""
        sns.set_style("whitegrid")
        plt.rcParams['figure.figsize'] = [15, 10]
        
        if include_components:
            fig, (ax1, ax2) = plt.subplots(2, 1, height_ratios=[2, 1])
        else:
            fig, ax1 = plt.subplots(1, 1)
            
        # Main forecast plot
        ax1.plot(actual_data['ds'], actual_data['y'], 
                label='Actual', color='#2C3E50', linewidth=2)
        ax1.plot(forecast['ds'], forecast['yhat'], 
                label='Forecast', color='#E74C3C', linewidth=2)
        
        # Uncertainty intervals
        ax1.fill_between(forecast['ds'],
                        forecast['yhat_lower'],
                        forecast['yhat_upper'],
                        color='#E74C3C', alpha=0.2,
                        label='95% Confidence Interval')
        
        # Styling
        ax1.set_title('Energy Consumption Forecast', pad=20, fontsize=16)
        ax1.set_xlabel('Date', fontsize=12)
        ax1.set_ylabel('Energy Consumption', fontsize=12)
        ax1.legend(fontsize=10)
        ax1.grid(True, alpha=0.3)
        
        if include_components:
            # Residuals plot
            residuals = actual_data['y'].values - forecast['yhat'][:len(actual_data)]
            ax2.scatter(actual_data['ds'], residuals, 
                       color='#2980B9', alpha=0.5, s=20)
            ax2.axhline(y=0, color='#E74C3C', linestyle='--')
            ax2.set_title('Forecast Residuals', pad=20, fontsize=16)
            ax2.set_xlabel('Date', fontsize=12)
            ax2.set_ylabel('Residual', fontsize=12)
            ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        return fig

# Example usage with enhanced features
def main():
    # Generate sample data with more realistic patterns
    np.random.seed(42)
    dates = pd.date_range(start='2023-01-01', end='2024-01-01', freq='H')
    base_consumption = 100
    
    # Enhanced patterns
    hourly_pattern = np.sin(np.pi * dates.hour / 12) * 20
    weekly_pattern = (dates.dayofweek < 5).astype(int) * 30
    seasonal_pattern = np.sin(2 * np.pi * dates.dayofyear / 365) * 40
    
    # Add temperature and humidity effects
    temperature = 20 + 10 * np.sin(2 * np.pi * dates.dayofyear / 365) + np.random.normal(0, 2, len(dates))
    humidity = 60 + 20 * np.sin(2 * np.pi * dates.dayofyear / 365) + np.random.normal(0, 5, len(dates))
    
    # Temperature effect on consumption
    temp_effect = 0.5 * (temperature - 20)**2
    humidity_effect = 0.2 * humidity
    
    consumption = (base_consumption +
                  hourly_pattern +
                  weekly_pattern +
                  seasonal_pattern +
                  temp_effect +
                  humidity_effect +
                  np.random.normal(0, 10, len(dates)))
    
    # Create DataFrame
    df = pd.DataFrame({
        'timestamp': dates,
        'consumption': consumption
    })
    
    # Initialize and train model
    forecaster = EnhancedEnergyForecaster()
    train_data = forecaster.prepare_data(
        df,
        include_weather=True,
        temp_data=temperature,
        humidity_data=humidity
    )
    forecaster.train(train_data)
    
    # Perform cross-validation
    cv_results, cv_metrics = forecaster.perform_cv(train_data)
    print("\nCross-Validation Metrics:")
    print(cv_metrics[['horizon', 'mae', 'rmse', 'mape']].round(2))
    
    # Generate forecast
    forecast = forecaster.predict(
        periods=168,  # 7 days ahead
        future_weather=pd.DataFrame({
            'temperature': temperature[-168:],
            'humidity': humidity[-168:]
        })
    )
    
    # Evaluate model
    actual = train_data['y'].iloc[-168:]
    predicted = forecast['yhat'].iloc[-336:-168]
    metrics = forecaster.evaluate(actual, predicted)
    
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Generate plots
    forecaster.plot_forecast(forecast, train_data, include_components=True)
    plt.show()
    
    # Plot components
    forecaster.plot_components(forecast)
    plt.show()

if __name__ == "__main__":
    main()
