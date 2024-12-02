import React, { useState } from "react";
import { Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
);

// Custom Select Components
const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm w-full cursor-pointer flex items-center justify-between"
      >
        <span>{value}</span>
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onSelect: (value) => {
                onValueChange(value);
                setIsOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ value, children, onSelect }) => (
  <div
    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
    onClick={() => onSelect(value)}
  >
    {children}
  </div>
);

const EnergyAnalytics = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Dummy data generators for different time periods
  const generateDailyData = (year, month) => {
    const days = new Date(year, month, 0).getDate();
    const currentHourNum = new Date().getHours();
    return Array.from({ length: 24 }, (_, i) => ({
      day: `${i + 1}`,
      gridEnergy:
        i >= currentHourNum ? null : Math.floor(5 + Math.random() * 2.5),
      solarEnergy:
        i >= currentHourNum ? null : Math.floor(3.75 + Math.random() * 3.75),
    }));
  };

  const generateMonthlyData = (year) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => ({
      month,
      gridEnergy: Math.floor(125 + Math.random() * 75),
      solarEnergy: Math.floor(100 + Math.random() * 100),
    }));
  };

  const generateYearlyData = () => {
    return ["2020", "2021", "2022", "2023", "2024"].map((year) => ({
      year,
      gridEnergy: Math.floor(1500 + Math.random() * 500),
      solarEnergy: Math.floor(1250 + Math.random() * 750),
    }));
  };

  // Data mapping based on selected time range
  const dataMapping = {
    daily: generateDailyData(2024, 3),
    monthly: generateMonthlyData(selectedYear),
    yearly: generateYearlyData(),
  };

  const energyData = dataMapping[timeRange];

  // Calculate costs and metrics
  const costData = energyData.map((entry) => {
    const timeKey = entry.day || entry.month || entry.year;
    // console.log({gridEnergy:entry.gridEnergy});

    const gridOnlyCost =
      entry.gridEnergy && entry.solarEnergy
        ? (entry.gridEnergy + entry.solarEnergy) * 10
        : null;
    const hybridCost = entry.gridEnergy * 10;
    const savings = gridOnlyCost - hybridCost;

    return entry.gridEnergy && entry.solarEnergy
      ? {
          timeKey,
          gridOnlyCost,
          hybridCost,
          savings,
        }
      : { timeKey };
  });

  // Calculate summary statistics
  const totalSolarEnergy = energyData.reduce(
    (sum, entry) => sum + entry.solarEnergy,
    0
  );
  const excessSolar = totalSolarEnergy * 0.1;
  const currentSolarRate = 5.25;
  const gridSellbackRate = 3.5;
  const potentialProfit = excessSolar * gridSellbackRate;

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)} ${
                entry.name.includes("Cost") ? "₹" : "kWh"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 bg-gray-50">
      {/* Time Range Controls */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </Select>
        </div>

        {timeRange === "monthly" && (
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            {["2020", "2021", "2022", "2023", "2024"].map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </Select>
        )}
      </div>

      {/* Energy Usage Graph */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardTitle className="text-xl font-bold">
            Energy Usage Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={
                    timeRange === "daily"
                      ? "day"
                      : timeRange === "monthly"
                      ? "month"
                      : "year"
                  }
                  tick={{ fill: "#666" }}
                />
                <YAxis
                  label={{
                    value: "Energy (kWh)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#666",
                  }}
                  tick={{ fill: "#666" }}
                />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Line
                  type="monotone"
                  dataKey="gridEnergy"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Grid Energy"
                  dot={{ stroke: "#6366f1", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="solarEnergy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Solar Energy"
                  dot={{ stroke: "#22c55e", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Comparison Graph */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
          <CardTitle className="text-xl font-bold">
            Cost Comparison Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="timeKey" tick={{ fill: "#666" }} />
                <YAxis
                  label={{
                    value: "Cost (₹)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#666",
                  }}
                  tick={{ fill: "#666" }}
                />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Line
                  type="monotone"
                  dataKey="gridOnlyCost"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Grid Only Cost"
                  dot={{ stroke: "#f97316", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="hybridCost"
                  stroke="#059669"
                  strokeWidth={2}
                  name="Hybrid System Cost"
                  dot={{ stroke: "#059669", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Savings"
                  dot={{ stroke: "#2563eb", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg">Excess Solar Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {excessSolar.toFixed(2)} kWh
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Available for grid sellback
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader>
            <CardTitle className="text-lg">Current Solar Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              ₹{currentSolarRate.toFixed(2)}/kWh
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Current generation cost
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader>
            <CardTitle className="text-lg">Grid Sellback Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              ₹{gridSellbackRate.toFixed(2)}/kWh
            </p>
            <p className="text-sm text-gray-600 mt-1">Current buyback rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-emerald-50 to-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Potential Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ₹{potentialProfit.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              From excess energy sales
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnergyAnalytics;
