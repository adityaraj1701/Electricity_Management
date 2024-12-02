// const baseUrl = "process.env.BASE_URL";
// console.log(baseUrl);

const fetchHourlyData = async () => {
  const data = await fetch("http://localhost:5000/hourlydata");
  const jsonData = await data.json();
  const hourlyData=jsonData.hourlyData;
  console.log(hourlyData);

  return hourlyData;
};

export default fetchHourlyData;
