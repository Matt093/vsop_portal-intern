import { Container, Card, Row, Button } from "react-bootstrap";
import "chartjs-adapter-date-fns";
//import chartTrendline from "chartjs-plugin-trendline";
import { Chart } from "react-chartjs-2";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import axios from "../routes/api/axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  DoughnutController,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  DoughnutController,
  //chartTrendline
);

function NFVDCharts() {
  const [totalFailures, setTotalFailures] = useState("");
  const [failuresAcknowledged, setFailuresAcknowledged] = useState("");
  const [failedOperationsLabels, setFailedOperationsLabels] = useState([]);
  const [failedOperationsNums, setFailedOperationsNums] = useState([]);
  const [failedUsernamesLabels, setFailedUsernamesLabels] = useState([]);
  const [failedUsernamesNums, setFailedUsernamesNums] = useState([]);
  const [failedErrorDescriptionsLabels, setFailedErrorDescriptionsLabels] =
    useState([]);
  const [failedErrorDescriptionsNums, setFailedErrorDescriptionsNums] =
    useState([]);
  const [failedCategoriesLabels, setFailedCategoriesLabels] = useState([]);
  const [failedCategoriesNums, setFailedCategoriesNums] = useState([]);
  const [failedJobNamesLabels, setFailedJobNamesLabels] = useState([]);
  const [failedJobNamesNums, setFailedJobNamesNums] = useState([]);
  const [failedMonthlyData, setFailedMonthlyData] = useState([]);
  const [failedDailyData, setFailedDailyData] = useState([]);
  const [intervTime, setIntervTime] = useState("28 DAY");
  const [intervalTitle, setIntervalTitle] = useState(" in the Last 28 Days");
  const [toggleDay, setToggleDay] = useState(true);
  const [quartOneActive, setQuartOneActive] = useState(false);
  const [quartTwoActive, setQuartTwoActive] = useState(false);
  const [quartThreeActive, setQuartThreeActive] = useState(false);
  const [quartFourActive, setQuartFourActive] = useState(false);
  const [year, setYear] = useState("");
  const [checked, setChecked] = useState(false);
  const [failedMonthlyDataExclusions, setFailedMonthlyDataExclusions] =
    useState([]);
  const [failedDailyDataExclusions, setFailedDailyDataExclusions] = useState(
    []
  );

  const [errorMessages, setErrorMessages] = useState([]);
  const [errorsdMonthlyData, setErrorsMonthlyData] = useState([]);
  const [hideChart, setHideChart] = useState(true);
  const [selectedError, setSelectedError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  useEffect(() => {
    fetchTotalFailures(intervTime);
    fetchTotalFailuresAcknowledged(intervTime);
    fetchFailedOperations(intervTime);
    fetchFailedUsernames(intervTime);
    fetchFailedErrorDescriptions(intervTime);
    fetchFailedCategories(intervTime);
    fetchFailedJobNames(intervTime);
    fetchDailyFailures();
    fetchMonthlyFailures();
    fetchActiveQuarters();
    fetchDailyFailuresExclusions();
    fetchMonthlyFailuresExclusions();
    const year = new Date().getFullYear();
    setYear(year);
    fetchErrorsList();
  }, []);

  let operationsData = {
    labels: failedOperationsLabels,
    datasets: [
      {
        label: "Failures",
        data: failedOperationsNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
          "#006FC1",
          "#00B845",
          "#FFF9DE",
          "#E3F2FD",
        ],
      },
    ],
  };
  let usernamesData = {
    labels: failedUsernamesLabels,
    datasets: [
      {
        label: "Failures",
        data: failedUsernamesNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
          "#006FC1",
          "#00B845",
          "#FFF9DE",
          "#E3F2FD",
        ],
      },
    ],
  };
  let errorDescriptionsData = {
    labels: failedErrorDescriptionsLabels,
    datasets: [
      {
        label: "Failures",
        data: failedErrorDescriptionsNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
          "#006FC1",
          "#00B845",
          "#FFF9DE",
          "#E3F2FD",
        ],
      },
    ],
  };
  let categoriesData = {
    labels: failedCategoriesLabels,
    datasets: [
      {
        label: "Failures",
        data: failedCategoriesNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
          "#006FC1",
          "#00B845",
          "#FFF9DE",
          "#E3F2FD",
        ],
      },
    ],
  };
  let jobNamesData = {
    labels: failedJobNamesLabels,
    datasets: [
      {
        label: "Failures",
        data: failedJobNamesNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
          "#006FC1",
          "#00B845",
          "#FFF9DE",
          "#E3F2FD",
        ],
      },
    ],
  };
  let dailyData = {
    datasets: [
      {
        label: "Failures",
        data: failedDailyData,
        borderColor: "#EE0000",
        backgroundColor: "#EE0000",
        trendlineLinear: {
          style: "rgb(43 ,66 ,255, 0.3)",
          lineStyle: "dotted",
          width: 2,
        },
      },
    ],
  };
  let monthlyData = {
    datasets: [
      {
        label: "Failures",
        data: failedMonthlyData,
        borderColor: "#EE0000",
        backgroundColor: "#EE0000",
        trendlineLinear: {
          style: "rgb(43 ,66 ,255, 0.3)",
          lineStyle: "dotted",
          width: 2,
        },
      },
    ],
  };

  let monthlyErrorsData = {
    datasets: [
      {
        label: "Failures",
        data: errorsdMonthlyData,
        borderColor: "#EE0000",
        backgroundColor: "#EE0000",
        trendlineLinear: {
          style: "rgb(43 ,66 ,255, 0.3)",
          lineStyle: "dotted",
          width: 2,
        },
      },
    ],
  };

  let dailyDataExclusions = {
    datasets: [
      {
        label: "Failures",
        data: failedDailyDataExclusions,
        borderColor: "#EE0000",
        backgroundColor: "#EE0000",
        trendlineLinear: {
          style: "rgb(43 ,66 ,255, 0.3)",
          lineStyle: "dotted",
          width: 2,
        },
      },
    ],
  };
  let monthlyDataExclusions = {
    datasets: [
      {
        label: "Failures",
        data: failedMonthlyDataExclusions,
        borderColor: "#EE0000",
        backgroundColor: "#EE0000",
        trendlineLinear: {
          style: "rgb(43 ,66 ,255, 0.3)",
          lineStyle: "dotted",
          width: 2,
        },
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {},
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            //console.log(context);
            const dataset = context.dataset.data;
            const currentValue = dataset[context.dataIndex];
            let total = 0;
            for (let i = 0; i < dataset.length; i++) {
              total += dataset[i];
            }
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return ` Failures: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  const optionsErrorDesc = {
    plugins: {
      legend: {
        labels: {
          generateLabels: (chart) =>
            chart.data.labels.map((l, i) => ({
              datasetIndex: 0,
              index: i,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
              strokeStyle: chart.data.datasets[0].backgroundColor[i],
              hidden: false,
              text: l.substr(0, 16) + "...",
            })),
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            //console.log(context);
            const dataset = context.dataset.data;
            const currentValue = dataset[context.dataIndex];
            let total = 0;
            for (let i = 0; i < dataset.length; i++) {
              total += dataset[i];
            }
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return ` Failures: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  const dayOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Failures By Week",
      },
    },
  };

  const monthOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Failures By Month",
      },
    },
  };

  const addNewlines = (str) => {
    var result = "";
    while (str.length > 0) {
      result += str.substring(0, 50) + "\n";
      str = str.substring(50);
    }
    return result;
  };

  const fetchActiveQuarters = () => {
    let today = new Date();
    let quarter = Math.floor((today.getMonth() + 3) / 3);
    if (quarter < 2) {
      setQuartOneActive(true);
    } else if (quarter < 3) {
      setQuartOneActive(true);
      setQuartTwoActive(true);
    } else if (quarter < 4) {
      setQuartOneActive(true);
      setQuartTwoActive(true);
      setQuartThreeActive(true);
    } else {
      setQuartOneActive(true);
      setQuartTwoActive(true);
      setQuartThreeActive(true);
      setQuartFourActive(true);
    }
  };

  const fetchFailedOperations = async (intervTime) => {
    try {
      const response = await axios.post(
        "/failed-operations",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFailedOperationsLabels([]);
      setFailedOperationsNums([]);
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedOperationsLabels((oldList) => [...oldList, op.operation]);
        setFailedOperationsNums((oldList) => [...oldList, op.count]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFailedUsernames = async (intervTime) => {
    try {
      const response = await axios.post(
        "/failed-usernames",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFailedUsernamesLabels([]);
      setFailedUsernamesNums([]);
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedUsernamesLabels((oldList) => [...oldList, op.username]);
        setFailedUsernamesNums((oldList) => [...oldList, op.count]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFailedErrorDescriptions = async (intervTime) => {
    try {
      const response = await axios.post(
        "/failed-error-descriptions",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFailedErrorDescriptionsLabels([]);
      setFailedErrorDescriptionsNums([]);
      const operationsList = response.data;
      operationsList.map((op) => {
        let shortenedLabel = addNewlines(op.error_description);
        setFailedErrorDescriptionsLabels((oldList) => [
          ...oldList,
          shortenedLabel,
        ]);
        setFailedErrorDescriptionsNums((oldList) => [...oldList, op.count]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFailedCategories = async (intervTime) => {
    try {
      const response = await axios.post(
        "/failed-categories",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFailedCategoriesLabels([]);
      setFailedCategoriesNums([]);
      const operationsList = response.data;
      operationsList.map((op) => {
        if (op.category === "") {
          setFailedCategoriesLabels((oldList) => [...oldList, "Blank"]);
        } else {
          setFailedCategoriesLabels((oldList) => [...oldList, op.category]);
        }
        setFailedCategoriesNums((oldList) => [...oldList, op.count]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFailedJobNames = async (intervTime) => {
    try {
      const response = await axios.post(
        "/failed-job-names",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFailedJobNamesLabels([]);
      setFailedJobNamesNums([]);
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedJobNamesLabels((oldList) => [...oldList, op.job_name]);
        setFailedJobNamesNums((oldList) => [...oldList, op.count]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalFailures = async (intervTime) => {
    try {
      const response = await axios.post(
        "/total-failures",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTotalFailures("");
      setTotalFailures(response.data[0].count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalFailuresAcknowledged = async (intervTime) => {
    try {
      const response = await axios.post(
        "/failures-acknowledged",
        JSON.stringify({ intervTime }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFailuresAcknowledged("");
      setFailuresAcknowledged(response.data[0].count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDailyFailures = async () => {
    try {
      const response = await axios.get("/daily-failures", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedDailyData((oldList) => [
          ...oldList,
          { x: op.day, y: op.count },
        ]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMonthlyFailures = async () => {
    try {
      const response = await axios.get("/monthly-failures", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedMonthlyData((oldList) => [
          ...oldList,
          { x: op.month, y: op.count },
        ]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDailyFailuresExclusions = async () => {
    try {
      const response = await axios.get("/daily-failures-exclusions", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedDailyDataExclusions((oldList) => [
          ...oldList,
          { x: op.day, y: op.count },
        ]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMonthlyFailuresExclusions = async () => {
    try {
      const response = await axios.get("/monthly-failures-exclusions", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const operationsList = response.data;
      operationsList.map((op) => {
        setFailedMonthlyDataExclusions((oldList) => [
          ...oldList,
          { x: op.month, y: op.count },
        ]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchErrorsList = async () => {
    try {
      const response = await axios.get("/nfvd-errors", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let errorMessagesList = [];
      response.data.map((error) => {
        errorMessagesList.push(error.error_message);
      });
      const removeDupes = fetchDuplicates(errorMessagesList);
      setErrorMessages(removeDupes);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchErrors = async (error) => {
    try {
      const response = await axios.post(
        "/nfvd-error-items",
        JSON.stringify({ error }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const monthsList = response.data;
      monthsList.map((op) => {
        setErrorsMonthlyData((oldList) => [
          ...oldList,
          { x: op.date, y: op.count },
        ]);
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDuplicates = (arr) => {
    const dupes = arr.filter(
      (
        (s) => (v) =>
          s.has(v) || !s.add(v)
      )(new Set())
    );

    let result = dupes.filter(
      (dupe, index) => index === dupes.findIndex((other) => dupe === other)
    );
    return result.sort();
  };

  return (
    <Container>
      <h1 className="mb-3 text-start bannertitle">
        NFVD Job Failures Charts <hr />
      </h1>
      <Row>
        <div style={{ marginTop: "10px", marginLeft: "50px" }}>
          <Button
            style={{ marginRight: "5px" }}
            onClick={() => {
              const time = "1 DAY";
              setIntervalTitle(" in the Last 24 Hours");
              setIntervTime(time);
              fetchTotalFailures(time);
              fetchTotalFailuresAcknowledged(time);
              fetchFailedOperations(time);
              fetchFailedUsernames(time);
              fetchFailedErrorDescriptions(time);
              fetchFailedCategories(time);
              fetchFailedJobNames(time);
            }}
          >
            1 Day
          </Button>
          <Button
            style={{ marginRight: "5px" }}
            onClick={() => {
              const time = "7 DAY";
              setIntervTime(time);
              setIntervalTitle(" in the Last 7 Days");
              fetchTotalFailures(time);
              fetchTotalFailuresAcknowledged(time);
              fetchFailedOperations(time);
              fetchFailedUsernames(time);
              fetchFailedErrorDescriptions(time);
              fetchFailedCategories(time);
              fetchFailedJobNames(time);
            }}
          >
            7 Day
          </Button>
          <Button
            style={{ marginRight: "5px" }}
            onClick={() => {
              const time = "28 DAY";
              setIntervTime(time);
              setIntervalTitle(" in the Last 28 Days");
              fetchTotalFailures(time);
              fetchTotalFailuresAcknowledged(time);
              fetchFailedOperations(time);
              fetchFailedUsernames(time);
              fetchFailedErrorDescriptions(time);
              fetchFailedCategories(time);
              fetchFailedJobNames(time);
            }}
          >
            28 Day
          </Button>
          {quartOneActive ? (
            <Button
              style={{ marginRight: "5px" }}
              onClick={() => {
                const time = "1";
                setIntervTime(time);
                setIntervalTitle(" in Q1 of " + year);
                fetchTotalFailures(time);
                fetchTotalFailuresAcknowledged(time);
                fetchFailedOperations(time);
                fetchFailedUsernames(time);
                fetchFailedErrorDescriptions(time);
                fetchFailedCategories(time);
                fetchFailedJobNames(time);
              }}
            >
              Q1{year}
            </Button>
          ) : (
            ""
          )}
          {quartTwoActive ? (
            <Button
              style={{ marginRight: "5px" }}
              onClick={() => {
                const time = "2";
                setIntervTime(time);
                setIntervalTitle(" in Q2 of " + year);
                fetchTotalFailures(time);
                fetchTotalFailuresAcknowledged(time);
                fetchFailedOperations(time);
                fetchFailedUsernames(time);
                fetchFailedErrorDescriptions(time);
                fetchFailedCategories(time);
                fetchFailedJobNames(time);
              }}
            >
              Q2{year}
            </Button>
          ) : (
            ""
          )}
          {quartThreeActive ? (
            <Button
              style={{ marginRight: "5px" }}
              onClick={() => {
                const time = "3";
                setIntervTime(time);
                setIntervalTitle(" in Q3 of " + year);
                fetchTotalFailures(time);
                fetchTotalFailuresAcknowledged(time);
                fetchFailedOperations(time);
                fetchFailedUsernames(time);
                fetchFailedErrorDescriptions(time);
                fetchFailedCategories(time);
                fetchFailedJobNames(time);
              }}
            >
              Q3{year}
            </Button>
          ) : (
            ""
          )}
          {quartFourActive ? (
            <Button
              style={{ marginRight: "5px" }}
              onClick={() => {
                const time = "4";
                setIntervTime(time);
                setIntervalTitle(" in Q4 of " + year);
                fetchTotalFailures(time);
                fetchTotalFailuresAcknowledged(time);
                fetchFailedOperations(time);
                fetchFailedUsernames(time);
                fetchFailedErrorDescriptions(time);
                fetchFailedCategories(time);
                fetchFailedJobNames(time);
              }}
            >
              Q4{year}
            </Button>
          ) : (
            ""
          )}
          <Button
            style={{ marginRight: "5px" }}
            onClick={() => {
              const time = "YEAR";
              setIntervTime(time);
              setIntervalTitle(" in " + year);
              fetchTotalFailures(time);
              fetchTotalFailuresAcknowledged(time);
              fetchFailedOperations(time);
              fetchFailedUsernames(time);
              fetchFailedErrorDescriptions(time);
              fetchFailedCategories(time);
              fetchFailedJobNames(time);
            }}
          >
            {year}
          </Button>
        </div>
      </Row>

      <Row
        style={{
          marginLeft: "50px",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <Card className="chartCard shadow-sm rounded">
          <Row
            style={{
              justifyContent: "center",
            }}
          >
            <Card className="failuresCard rounded">
              <Card.Body>
                <Card.Title className="failuresCardTitle">
                  Failures Acknowledged<br></br>
                  {intervalTitle}
                </Card.Title>
                <div className="failuresCardCount">
                  <h2 style={{ display: "inline", paddingRight: "5px" }}>
                    {failuresAcknowledged}
                  </h2>{" "}
                  <span style={{ display: "inline", marginBottom: "10px" }}>
                    of
                  </span>{" "}
                  <h2 style={{ display: "inline", paddingLeft: "5px" }}>
                    {totalFailures}
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Row>
          <Card.Body style={{ marginTop: "10px", paddingBottom: "25px" }}>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <InputSwitch
                style={{ float: "right", transform: "scale(.7)" }}
                checked={checked}
                onChange={(e) => setChecked(e.value)}
              />
              <div
                className="toggleText"
                style={{ float: "right", marginTop: "5px", fontSize: "14px" }}
              >
                Exclude NOTIFY
              </div>
            </div>
            <br></br>
            {toggleDay ? (
              <div>
                <Card.Title className="regCardTitle">
                  Failures By Day
                </Card.Title>
                <Chart
                  type="line"
                  data={checked ? dailyDataExclusions : dailyData}
                  options={dayOptions}
                />
              </div>
            ) : (
              <div>
                <Card.Title className="regCardTitle">
                  Failures By Month
                </Card.Title>
                <Chart
                  type="line"
                  data={checked ? monthlyDataExclusions : monthlyData}
                  options={monthOptions}
                />
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <Button
                style={{ marginRight: "5px" }}
                onClick={() => {
                  setToggleDay(true);
                }}
              >
                Day
              </Button>
              <Button
                onClick={() => {
                  setToggleDay(false);
                }}
              >
                Month
              </Button>
            </div>
          </Card.Body>
        </Card>
        <Card className="chartCard shadow-sm rounded">
          <Row style={{ margin: "22px 10px 10px 10px" }}>
            <h4>Monthly Trend for Common NFVD Errors</h4>
          </Row>
          <Row style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Dropdown
              style={{ zIndex: "1100", width: "370px" }}
              value={selectedError}
              options={errorMessages}
              onChange={(e) => setSelectedError(e.target.value)}
              placeholder="Select an error message to view it's trend"
            />
            <Button
              type="button"
              className="btn-small"
              rounded
              onClick={() => {
                //console.log(selectedError);
                setErrorsMonthlyData([]);
                setHideChart(false);
                fetchErrors(selectedError.replace(/'/g, "\\'"));
                setErrorTitle("");
                setErrorTitle(selectedError);
              }}
              style={{ marginLeft: "10px", width: "170px" }}
            >
              View Monthly Trend
            </Button>
          </Row>
          {hideChart ? (
            <div></div>
          ) : (
            <Card.Body style={{ paddingBottom: "25px" }}>
              <div>
                <Card.Title className="regCardTitle">
                  Failures By Month for <b>"{errorTitle}"</b>
                </Card.Title>
                <Chart
                  type="line"
                  data={monthlyErrorsData}
                  options={monthOptions}
                />
              </div>
            </Card.Body>
          )}
        </Card>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "10px", paddingBottom: "25px" }}>
            <Card.Title className="regCardTitle">
              Top 10 Failures by Operation<br></br>
              {intervalTitle}
            </Card.Title>
            <Chart
              type="doughnut"
              data={operationsData}
              options={options}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "10px", paddingBottom: "25px" }}>
            <Card.Title className="regCardTitle">
              Top 10 Failures by Username<br></br>
              {intervalTitle}
            </Card.Title>
            <Chart
              type="doughnut"
              data={usernamesData}
              options={options}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "10px", paddingBottom: "25px" }}>
            <Card.Title className="regCardTitle">
              Failures by Job Name<br></br>
              {intervalTitle}
            </Card.Title>
            <Chart
              type="doughnut"
              data={jobNamesData}
              options={options}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "10px", paddingBottom: "25px" }}>
            <Card.Title className="regCardTitle">
              Failures by Category<br></br>
              {intervalTitle}
            </Card.Title>
            <Chart
              type="doughnut"
              data={categoriesData}
              options={options}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "10px", paddingBottom: "25px" }}>
            <Card.Title className="regCardTitle">
              Top 10 Failures by Error Description<br></br>
              {intervalTitle}
            </Card.Title>
            <Chart
              type="doughnut"
              data={errorDescriptionsData}
              options={optionsErrorDesc}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </Row>

      <br></br>
    </Container>
  );
}
export default NFVDCharts;
