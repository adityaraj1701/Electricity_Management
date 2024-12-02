const fetchBattery = async () => {
  const data = await fetch(
    "https://electricity-management-n46q.onrender.com/battery"
  );
  const jsonData = await data.json();
  const battery = jsonData.battery;
  console.log({ battery });

  return battery;
};

export default fetchBattery;
