import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getStatisticsByHomestay } from "services/statistics";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const optionsPie = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dataPie = {
  labels,
  datasets: [
    {
      label: "# of Votes",
      data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgb(152, 239, 171)",
        "rgb(216, 251, 187)",
        "rgb(210, 145, 188)",
        "rgb(195, 250, 232)",
        "rgb(195, 200, 237)",
        "rgb(195, 165, 237)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const dataQuarter = {
  labels: ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
  datasets: [
    {
      label: "Money",
      data: [0, 0, 0, 0],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};
const dataQuarterPie = {
  labels: ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
  datasets: [
    {
      label: "Money",
      data: [1, 0, 0, 0],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgb(195, 165, 237)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const Statistics = () => {
  const [year, setYear] = useState("2022");
  const [type, setType] = useState("Money");
  const [homestay, setHomeStay] = useState(null);
  const [list, setList] = useState({
    labels,
    datasets: [
      {
        label: "Money",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [listPie, setListPie] = useState(dataPie);
  const [quarterList, setQuarterList] = useState(dataQuarter);
  const [quarterListPie, setQuarterListPie] = useState(dataQuarterPie);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [cookies, setCookie, removeCookie] = useCookies([
    "userid",
  ]);

  useEffect(() => {
    setLoading(true);
    async function getData() {
      let query = process.env.REACT_APP_API_URL + "/statistics/" + cookies.userid;
      if (year) {
        query = query + "?year=" + year;
      }
      if (type) {
        query = query + "&&type=" + type;
      }
      const response = await getStatisticsByHomestay(query);

      if (response.status >= 400) {
      }

      if (response.status === 200) {
        setHomeStay(response.data.homestay);
        setTotal(response.data.total);
        //set column
        setList({
          labels,
          datasets: [
            {
              label: type,
              data: response.data.list,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        setQuarterList({
          labels: ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
          datasets: [
            {
              label: type,
              data: response.data.quarterList,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        //set pie
        const datasetsPie = {
          ...dataPie.datasets[0],
          data: response.data.list,
        };
        setListPie({ ...dataPie, label: type, datasets: [datasetsPie] });
        const datasetsQuarterPie = {
          ...dataQuarterPie.datasets[0],
          data: response.data.quarterList,
        };

        setQuarterListPie({
          ...dataQuarterPie,
          label: type,
          datasets: [datasetsQuarterPie],
        });
        setLoading(false);
      }
    }
    getData();
  }, [year, type]);

  return (
    <>
      <div className="container">
        <Link to={"/homestays/" + homestay?._id}>
          <h1 className="text-center" style={{ margin: "20px" }}>
            {homestay?.name}
          </h1>
        </Link>
        <div
          className="row"
          style={{ marginLeft: "38%", marginTop: "15px", marginBottom: "15px" }}
        >
          <select
            name="year"
            style={{ width: "20%", padding: "5px" }}
            onChange={(e) => setYear(e.target.value)}
            value={year}
          >
            <option value="2020">Year: 2020</option>
            <option value="2021">Year: 2021</option>
            <option value="2022">Year: 2022</option>
          </select>
          <select
            name="type"
            style={{ width: "20%", padding: "5px" }}
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="Money">Money</option>
            <option value="Guests">Guests</option>
          </select>
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div>
            <div className="row" style={{ marginTop: "30px" }}>
              <div className="col-md-8">
                <Bar data={list} />
              </div>
              <div className="col-md-4">
                <Pie options={optionsPie} data={listPie} />
              </div>
            </div>
            <p className="text-center" style={{ margin: "15px" }}>
              Monthly Statistics
            </p>
            <div className="row" style={{ marginTop: "30px" }}>
              <div className="col-md-8">
                <Bar data={quarterList} />
              </div>
              <div className="col-md-4">
                <Pie options={optionsPie} data={quarterListPie} />
              </div>
            </div>
            <p className="text-center" style={{ margin: "15px" }}>
              Quarterly Statistics
            </p>
          </div>
        )}

        <h4
          className="text-center"
          style={{ marginTop: "60px", marginBottom: "60px" }}
        >
          Total: {total}
        </h4>
      </div>
    </>
  );
};

export default Statistics;
