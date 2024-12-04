import React, { useState, useEffect } from "react";
import { Battery, Zap, Info } from "lucide-react";

import fetchHourlyData from "./route/gethourlyData";
import fetchBattery from "./route/battery";

const data = async () => {
  const fetchedData = await fetchHourlyData();
  console.log({ fetchedData }); // Log the resolved data
  return fetchedData;
};
const batteryData = async () => {
  const fetchedData = await fetchBattery();
  return fetchedData;
};

let dummyPriceData = [
  { time: "00:00", price: 4.5 },
  { time: "01:00", price: 3.6 },
  { time: "02:00", price: 3.0 },
  { time: "03:00", price: 3.3 },
  { time: "04:00", price: 3.9 },
  { time: "05:00", price: 5.4 },
  { time: "06:00", price: 6.6 },
  { time: "07:00", price: 8.4 },
  { time: "08:00", price: 10.5 },
  { time: "09:00", price: 12.0 },
  { time: "10:00", price: 11.4 },
  { time: "11:00", price: 10.5 },
  { time: "12:00", price: 9.6 },
  { time: "13:00", price: 9.0 },
  { time: "14:00", price: 8.4 },
  { time: "15:00", price: 7.5 },
  { time: "16:00", price: 8.1 },
  { time: "17:00", price: 9.6 },
  { time: "18:00", price: 11.4 },
  { time: "19:00", price: 10.5 },
  { time: "20:00", price: 9.0 },
  { time: "21:00", price: 7.5 },
  { time: "22:00", price: 6.0 },
  { time: "23:00", price: 5.4 },
];
let battery = 100;
const main = async () => {
  const dummYPriceData = await data();
  console.log("Dummy Price Data:", dummyPriceData); // Log after assignment
  battery = await batteryData();
  console.log({ battery: battery });
};

main(); // Call the async main function

const equipment = [
  { name: "Lights", canUseOnSolar: true, icon: "💡" },
  { name: "TV", canUseOnSolar: true, icon: "📺" },
  { name: "Refrigerator", canUseOnSolar: true, icon: "❄️" },
  { name: "Washing Machine", canUseOnSolar: false, icon: "🧺" },
  { name: "AC", canUseOnSolar: false, icon: "❄️" },
];

const ElectricityManagement = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isHighPriceState, setIsHighPriceState] = useState(false);
  // Initialize battery level with random value between 50 and 100
  const [solarBatteryLevel, setSolarBatteryLevel] = useState(78);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const currentHour = now.getHours();
      const tempTime = now.getTime();
      const currentTime = new Date(tempTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const currentData = dummyPriceData.find(
        (data) => data.time === currentTime
      );
      // first fetch for the current time, if not available then fetch for the current hour
      const priceData = dummyPriceData[currentHour];
      setCurrentPrice(
        (
          dummyPriceData[currentHour]?.price +
          -0.1 * Math.random() +
          0.1 * Math.random()
        ).toFixed(2)
      );

      // Check next hour's price for notifications
      const nextHour = (currentHour + 1) % 24;
      console.log({ priceData });

      const nextPrice = dummyPriceData[nextHour];
      const currentIsHigh = priceData.price > 8;
      const nextIsHigh = nextPrice.price > 8;

      if (currentIsHigh !== nextIsHigh) {
        setNotification({
          type: nextIsHigh ? "warning" : "success",
          title: nextIsHigh
            ? "High Price Period Approaching"
            : "Low Price Period Approaching",
          message: nextIsHigh
            ? `Electricity prices will increase to ₹${nextPrice.price.toFixed(
                2
              )}/kWh at ${nextPrice.time}`
            : `Electricity prices will decrease to ₹${nextPrice.price.toFixed(
                2
              )}/kWh at ${nextPrice.time}`,
        });
      }

      setIsHighPriceState(currentIsHigh);

      // Only decrease battery level during high price state
      // and decrease at a slower rate (every 3 seconds)
      if (currentIsHigh && now.getSeconds() % 5 === 0) {
        setSolarBatteryLevel((prev) => prev - 0.2);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            Electricity Management System
          </h1>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold mb-2">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xl">
              Current Price:{" "}
              <span
                className={`font-bold ${
                  isHighPriceState ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{currentPrice}/kWh
              </span>
            </div>
          </div>

          {notification && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                notification.type === "warning"
                  ? "bg-amber-50 text-amber-800"
                  : "bg-green-50 text-green-800"
              }`}
            >
              <Info className="h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">{notification.title}</h3>
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          )}

          <div
            className={`rounded-lg p-4 mb-6 ${
              isHighPriceState ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Battery className="w-5 h-5" />
              {isHighPriceState ? "High Price State" : "Low Price State"}
            </h3>
            <p className="text-sm">
              {isHighPriceState
                ? "Using solar energy. High-demand appliances are unavailable."
                : "Using grid electricity. All appliances are available."}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Solar Battery Level</h3>
            <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${solarBatteryLevel}%`,
                  backgroundColor: `${
                    solarBatteryLevel > 50
                      ? "#22c55e"
                      : solarBatteryLevel > 20
                      ? "#f59e0b"
                      : "#ef4444"
                  }`,
                }}
              />
            </div>
            <p className="text-center mt-2">{solarBatteryLevel.toFixed(1)}%</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Available Equipment:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {equipment.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    !isHighPriceState || item.canUseOnSolar
                      ? "border-green-200 bg-green-50 hover:bg-green-100"
                      : "border-red-200 bg-red-50 hover:bg-red-100"
                  }`}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-medium">{item.name}</div>
                  <div
                    className={`text-sm ${
                      !isHighPriceState || item.canUseOnSolar
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {!isHighPriceState || item.canUseOnSolar
                      ? "Available"
                      : "Unavailable"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityManagement;
