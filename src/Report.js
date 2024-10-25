import React, { useState } from 'react';
import { 
  Battery, 
  BatteryCharging, 
  ChevronDown, 
  ChevronUp,
  CircleDollarSign,
  Clock, 
  Cloud,
  Download,
  Home,
  Info,
  Laptop,
  Lightbulb,
  Settings,
  ShowerHead,
  Sun,
  Tv,
  Upload,
  Waves,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

const ApplianceRow = ({ icon: Icon, name, power, optimizedPower, savings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentageSaved = ((power - optimizedPower) / power * 100).toFixed(1);
  
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div 
        className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-700">{name}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-gray-500">Current</div>
            <div className="font-semibold">{power} kWh</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Optimized</div>
            <div className="font-semibold text-green-600">{optimizedPower} kWh</div>
          </div>
          <div className="w-8">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 text-sm">
          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <div className="font-medium text-green-800">Optimization Insights</div>
            <div className="text-green-700">
              • Potential savings of ${savings.toFixed(2)} per month ({percentageSaved}% reduction)
            </div>
            <div className="text-green-700">
              • Recommended usage: Off-peak hours (10 PM - 6 AM)
            </div>
            <div className="text-green-700">
              • Consider upgrading to an energy-efficient model
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SolarStats = ({ solarData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Production</span>
          </div>
          <div className="text-2xl font-semibold text-orange-600">{solarData.currentProduction} kW</div>
          <div className="text-sm text-orange-600">Daily: {solarData.dailyProduction} kWh</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Grid Usage</span>
          </div>
          <div className="text-2xl font-semibold text-blue-600">{solarData.gridUsage} kW</div>
          <div className="text-sm text-blue-600">Daily: {solarData.dailyGridUsage} kWh</div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={solarData.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="production" stroke="#f97316" name="Solar Production" />
            <Line type="monotone" dataKey="consumption" stroke="#2563eb" name="Consumption" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [showTips, setShowTips] = useState(false);

  const energyData = {
    currentUsage: 856,
    optimizedUsage: 642,
    monthlySavings: 72.50,
    peakHours: '2 PM - 8 PM',
    offPeakHours: '10 PM - 6 AM',
    carbonFootprint: '320 kg CO2',
    optimizedFootprint: '240 kg CO2'
  };

  const solarData = {
    currentProduction: 4.2,
    dailyProduction: 28.5,
    gridUsage: 1.8,
    dailyGridUsage: 14.2,
    hourlyData: [
      { hour: '6 AM', production: 0.2, consumption: 1.5 },
      { hour: '8 AM', production: 2.1, consumption: 2.2 },
      { hour: '10 AM', production: 3.8, consumption: 2.8 },
      { hour: '12 PM', production: 4.5, consumption: 3.1 },
      { hour: '2 PM', production: 4.2, consumption: 3.4 },
      { hour: '4 PM', production: 3.1, consumption: 3.8 },
      { hour: '6 PM', production: 1.5, consumption: 4.2 },
      { hour: '8 PM', production: 0.3, consumption: 3.5 }
    ]
  };

  const appliances = [
    { icon: Waves, name: 'Washing Machine', power: 2.8, optimizedPower: 1.9, savings: 12.60 },
    { icon: Laptop, name: 'Home Office', power: 3.2, optimizedPower: 2.4, savings: 9.80 },
    { icon: ShowerHead, name: 'Water Heater', power: 4.5, optimizedPower: 3.2, savings: 18.20 },
    { icon: Tv, name: 'Entertainment', power: 2.1, optimizedPower: 1.6, savings: 7.40 },
    { icon: Home, name: 'HVAC System', power: 8.4, optimizedPower: 6.1, savings: 24.50 }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Energy Optimization</h1>
          <button 
            onClick={() => setShowTips(!showTips)}
            className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-600"
          >
            <Info className="w-4 h-4" />
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>

        {showTips && (
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-none mb-6">
            <div className="space-y-3">
              <h3 className="font-medium text-blue-800">Optimization Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  Use appliances during peak solar production
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Settings className="w-4 h-4" />
                  Regular maintenance improves efficiency
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Sun className="w-4 h-4" />
                  Monitor weather forecasts for optimal usage
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">Current Usage</h3>
            </div>
            <span className="text-2xl font-semibold">{energyData.currentUsage} kWh</span>
          </div>
          <div className="text-sm text-gray-500">
            Peak hours: {energyData.peakHours}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-green-500" />
              <h3 className="font-medium">Optimized Usage</h3>
            </div>
            <span className="text-2xl font-semibold text-green-600">{energyData.optimizedUsage} kWh</span>
          </div>
          <div className="text-sm text-gray-500">
            Recommended: {energyData.offPeakHours}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium">Potential Savings</h3>
            </div>
            <span className="text-2xl font-semibold text-purple-600">${energyData.monthlySavings}</span>
          </div>
          <div className="text-sm text-gray-500">
            Per month
          </div>
        </Card>
      </div>

      {/* Solar Production Section */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Solar Energy Tracking</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sun className="w-4 h-4" />
            Real-time monitoring
          </div>
        </div>
        <SolarStats solarData={solarData} />
      </Card>

      {/* Appliance Optimization */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Appliance Optimization</h2>
          <div className="text-sm text-gray-500">Click for details</div>
        </div>
        <div className="divide-y divide-gray-100">
          {appliances.map((appliance, index) => (
            <ApplianceRow 
              key={index}
              icon={appliance.icon}
              name={appliance.name}
              power={appliance.power}
              optimizedPower={appliance.optimizedPower}
              savings={appliance.savings}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;