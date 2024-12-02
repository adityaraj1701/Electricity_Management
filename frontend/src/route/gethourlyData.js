// const baseUrl = "process.env.BASE_URL";
// console.log(baseUrl);

const fetchHourlyData = async () => {
  const data = await fetch(
    "https://electricity-management-n46q.onrender.com/hourlydata"
  );
  const jsonData = await data.json();
  const hourlyData = jsonData.hourlyData;
  console.log(hourlyData);

  return hourlyData;
};

export default fetchHourlyData;
