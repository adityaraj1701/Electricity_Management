const fetchBattery = async () => {
  const data = await fetch("http://localhost:5000/battery");
  const jsonData = await data.json();
  const battery = jsonData.battery;
  console.log({ battery });

  return battery;
};

export default fetchBattery;
