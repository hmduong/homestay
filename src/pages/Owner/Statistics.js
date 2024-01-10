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
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice";
import { useTranslation } from "react-i18next";

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



const Statistics = ({ homestayId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const labels = [
    t('statistic.month.january'),
    t('statistic.month.february'),
    t('statistic.month.march'),
    t('statistic.month.april'),
    t('statistic.month.may'),
    t('statistic.month.june'),
    t('statistic.month.july'),
    t('statistic.month.aug'),
    t('statistic.month.sep'),
    t('statistic.month.oct'),
    t('statistic.month.nov'),
    t('statistic.month.dec'),
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
    labels: [
      t('statistic.quater') + " 1",
      t('statistic.quater') + " 2",
      t('statistic.quater') + " 3",
      t('statistic.quater') + " 4"
    ],
    datasets: [
      {
        label: t('money'),
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataQuarterPie = {
    labels: [
      t('statistic.quater') + " 1",
      t('statistic.quater') + " 2",
      t('statistic.quater') + " 3",
      t('statistic.quater') + " 4"
    ],
    datasets: [
      {
        label: t('money'),
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




  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState("Money");
  const [homestay, setHomeStay] = useState(null);
  const [list, setList] = useState({
    labels,
    datasets: [
      {
        label: t('money'),
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

  useEffect(() => {
    setLoading(true);
    async function getData() {
      let query = process.env.REACT_APP_API_URL + "/statistics/" + homestayId;
      if (year) {
        query = query + "?year=" + year;
      }
      if (type) {
        query = query + "&&type=" + type;
      }
      const response = await getStatisticsByHomestay(query);

      if (response.status < 299) {
        setHomeStay(response.data.homestay);
        setTotal(response.data.total);
        setList({
          labels,
          datasets: [
            {
              label: t(`${type.toLowerCase()}`),
              data: response.data.list,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        setQuarterList({
          labels: [
            t('statistic.quater') + " 1",
            t('statistic.quater') + " 2",
            t('statistic.quater') + " 3",
            t('statistic.quater') + " 4"
          ],
          datasets: [
            {
              label: t(`${type.toLowerCase()}`),
              data: response.data.quarterList,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        const datasetsPie = {
          ...dataPie.datasets[0],
          data: response.data.list,
        };
        setListPie({ ...dataPie, label: t(`${type.toLowerCase()}`), datasets: [datasetsPie] });
        const datasetsQuarterPie = {
          ...dataQuarterPie.datasets[0],
          data: response.data.quarterList,
        };

        setQuarterListPie({
          ...dataQuarterPie,
          label: t(`${type.toLowerCase()}`),
          datasets: [datasetsQuarterPie],
        });
      } else {
        dispatch(
          actions.createAlert({
            message: t('alert.error'),
            type: "error"
          })
        );
      }
      setLoading(false);
    }
    getData();
  }, [year, type]);

  const years = (() => {
    var ys = []
    var thisYear = new Date().getFullYear()
    for (let i = thisYear - 3; i <= thisYear; i++) {
      ys.push(i)
    }
    return ys
  })()

  return (
    <>
      <div className="container" style={{ marginTop: 24 }}>
        <h2>{t('statistic.title')}</h2>
        <Link to={"/homestays/" + homestay?._id}>
          <h1 className="text-center" style={{ margin: "20px" }}>
            {homestay?.name}
          </h1>
        </Link>
        <div
          className="row"
          style={{ justifyContent: 'center' }}
        >
          <select
            name="year"
            style={{ width: "30%", padding: "5px", margin: "5px" }}
            onChange={(e) => setYear(e.target.value)}
            value={year}
          >
            {
              years.map((y, idx) => <option key={idx} value={y}>{t('year')} {y}</option>)
            }
          </select>
          <select
            name="type"
            style={{ width: "30%", padding: "5px", margin: "5px" }}
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="Money">{t('money')}</option>
            <option value="Guests">{t('guests')}</option>
          </select>
        </div>
        {loading ? <Loading /> : (
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
              {t('statistic.monthlyStatistics')}
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
              {t('statistic.quarterlyStatistics')}
            </p>
          </div>
        )}

        <h4
          className="text-center"
          style={{ marginTop: "60px", marginBottom: "60px" }}
        >
          {t('total')}: {total}
        </h4>
      </div>
    </>
  );
};

export default Statistics;
