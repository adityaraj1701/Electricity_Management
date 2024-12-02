import React, { useState } from 'react';
import { Sun, Cloud, Zap, DollarSign, Lightbulb, ThermometerSun, Info, Clock } from 'lucide-react';

const CustomSelect = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="w-48 p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Card = ({ icon: Icon, title, value, color, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-gray-600 font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

const Forecasting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('next-hour');
  const [showTips, setShowTips] = useState(false);

  const periodOptions = [
    { value: 'next-hour', label: 'Next Hour' },
    { value: 'next-day', label: 'Next Day' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'next-month', label: 'Next Month' }
  ];

  const data = {
    'next-hour': {
      consumption: '2.5 kWh',
      weather: 'Partly Cloudy',
      temperature: '22°C',
      solarProduction: '1.2 kWh',
      tariffs: '£0.15/kWh',
      recommendations: 'Consider running high-consumption appliances after sunset',
    },
    'next-day': {
      consumption: '45 kWh',
      weather: 'Sunny',
      temperature: '24°C',
      solarProduction: '15.5 kWh',
      tariffs: '£0.18/kWh peak, £0.12/kWh off-peak',
      recommendations: 'Optimal day for laundry during solar peak hours',
    },
    'next-week': {
      consumption: '315 kWh',
      weather: 'Mixed',
      temperature: '23°C',
      solarProduction: '95.5 kWh',
      tariffs: '£0.17/kWh average',
      recommendations: 'Plan high-energy activities for forecasted sunny days',
    },
    'next-month': {
      consumption: '1,250 kWh',
      weather: 'Seasonal',
      temperature: '21°C',
      solarProduction: '380 kWh',
      tariffs: '£0.16/kWh average',
      recommendations: 'Consider scheduling maintenance for optimal efficiency',
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Energy Dashboard</h1>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <CustomSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={periodOptions}
            />
          </div>
          
          <button 
            onClick={() => setShowTips(!showTips)}
            className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Info className="w-4 h-4" />
            {showTips ? 'Hide Tips' : 'Show Energy Tips'}
          </button>
        </div>
      </div>

      {/* Tips Section */}
      {showTips && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Energy Saving Tips</h2>
          <div className="space-y-3 text-blue-700">
            <p className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Solar panels work best when clean - schedule regular cleaning
            </p>
            <p className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Charge devices during peak solar production
            </p>
            <p className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4" />
              Every degree of cooling increases energy use by 3-5%
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          icon={Zap}
          title="Expected Consumption"
          value={data[selectedPeriod].consumption}
          color="bg-yellow-500"
        />
        
        <Card 
          icon={Cloud}
          title="Expected Weather"
          value={data[selectedPeriod].weather}
          color="bg-blue-500"
        />
        
        <Card 
          icon={ThermometerSun}
          title="Expected Temperature"
          value={data[selectedPeriod].temperature}
          color="bg-red-500"
        />
        
        <Card 
          icon={Sun}
          title="Expected Solar Production"
          value={data[selectedPeriod].solarProduction}
          color="bg-orange-500"
        />
        
        <Card 
          icon={DollarSign}
          title="Expected Tariffs"
          value={data[selectedPeriod].tariffs}
          color="bg-green-500"
        />
        
        <Card 
          icon={Lightbulb}
          title="Recommendations"
          value={data[selectedPeriod].recommendations}
          color="bg-purple-500"
          className="lg:col-span-3"
        />
      </div>
    </div>
  );
};

export default Forecasting;