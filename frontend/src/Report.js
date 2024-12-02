import React, { useState } from "react";
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
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

const ApplianceRow = ({ icon: Icon, name, power, optimizedPower, savings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentageSaved = (((power - optimizedPower) / power) * 100).toFixed(1);

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
            <div className="font-semibold text-green-600">
              {optimizedPower} kWh
            </div>
          </div>
          <div className="w-8">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 text-sm">
          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <div className="font-medium text-green-800">
              Optimization Insights
            </div>
            <div className="text-green-700">
              • Potential savings of ₹{savings.toFixed(2)} per month (
              {percentageSaved}% reduction)
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
            <span className="text-sm font-medium text-orange-800">
              Production
            </span>
          </div>
          <div className="text-2xl font-semibold text-orange-600">
            {solarData.currentProduction} kW
          </div>
          <div className="text-sm text-orange-600">
            Daily: {solarData.dailyProduction} kWh
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Consumption
            </span>
          </div>
          <div className="text-2xl font-semibold text-blue-600">
            {solarData.gridUsage} kW
          </div>
          <div className="text-sm text-blue-600">
            Daily: {solarData.dailyGridUsage} kWh
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={solarData.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#f97316"
              name="Solar Production"
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#2563eb"
              name="Consumption"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("overview");
  const [showTips, setShowTips] = useState(false);

  const energyData = {
    currentUsage: 321,
    optimizedUsage: 249,
    monthlySavings: 576,
    peakHours: "2 PM - 8 PM",
    offPeakHours: "10 PM - 6 AM",
    carbonFootprint: "320 kg CO2",
    optimizedFootprint: "240 kg CO2",
  };

  let solarData = {
    currentProduction: 234,
    dailyProduction: 7.8,
    gridUsage: 72,
    dailyGridUsage: 2.4,
    hourlyData: [
      { hour: "00:00", production: 0.1, consumption: 1.2 },
      { hour: "02:00", production: 0.3, consumption: 1.4 },
      { hour: "04:00", production: 0.1, consumption: 1.3 },
      { hour: "06:00", production: 0.2, consumption: 1.5 },
      { hour: "08:00", production: 2.1, consumption: 2.2 },
      { hour: "10:00", production: 3.8, consumption: 2.8 },
      { hour: "12:00", production: 4.5, consumption: 3.1 },
      { hour: "14:00", production: 4.2, consumption: 3.4 },
      { hour: "16:00", production: 3.1, consumption: 3.8 },
      { hour: "18:00", production: 1.5, consumption: 4.2 },
      { hour: "20:00", production: 0.3, consumption: 3.5 },
      { hour: "22:00", production: 0.2, consumption: 2.9 },
    ],
  };

  function getCurrentHourlyData(solarData) {
    // Get current time
    const now = new Date();
    const currentHourNum = now.getHours();

    // Convert time strings to comparable format
    const filteredHourlyData = solarData.hourlyData.map((entry) => {
      // Convert both times to comparable numbers
      console.log({ entry });

      const entryHourNum = parseInt(entry.hour.split(":")[0]);
      // const currentHourNum = parseInt(currentHour.split(":")[0]);
      console.log({ entryHourNum, currentHourNum });

      if (entryHourNum < currentHourNum) {
        return entry;
      } else {
        return { hour: entry.hour};
      }
    });
    console.log({ filteredHourlyData });

    return {
      ...solarData,
      hourlyData: filteredHourlyData,
    };
  }
  solarData = getCurrentHourlyData(solarData);
  console.log({ solarData });

  const appliances = [
    {
      icon: Waves,
      name: "Washing Machine",
      power: 15.2,
      optimizedPower: 10.3,
      savings: 589,
    },
    {
      icon: Laptop,
      name: "Air Conditioner",
      power: 93,
      optimizedPower: 69.7,
      savings: 2790,
    },
    {
      icon: ShowerHead,
      name: "Water Heater",
      power: 17.6,
      optimizedPower: 12.5,
      savings: 612,
    },
    {
      icon: Tv,
      name: "Entertainment",
      power: 27.6,
      optimizedPower: 21,
      savings: 792,
    },
    {
      icon: Home,
      name: "HVAC System",
      power: 80.5,
      optimizedPower: 58.4,
      savings: 7013,
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Energy Optimization
          </h1>
          <button
            onClick={() => setShowTips(!showTips)}
            className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-600"
          >
            <Info className="w-4 h-4" />
            {showTips ? "Hide Tips" : "Show Tips"}
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
            <span className="text-2xl font-semibold">
              {energyData.currentUsage} kWh
            </span>
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
            <span className="text-2xl font-semibold text-green-600">
              {energyData.optimizedUsage} kWh
            </span>
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
            <span className="text-2xl font-semibold text-purple-600">
              ₹{energyData.monthlySavings}
            </span>
          </div>
          <div className="text-sm text-gray-500">Per month</div>
        </Card>
      </div>

      {/* Solar Production Section */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Solar Energy Tracking
          </h2>
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
          <h2 className="text-lg font-semibold text-gray-800">
            Appliance Optimization
          </h2>
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
