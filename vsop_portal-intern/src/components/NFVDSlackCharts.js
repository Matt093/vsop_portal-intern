import React from "react";
import { Container, Card, Row, Button } from "react-bootstrap";
import "chartjs-adapter-date-fns";
//import chartTrendline from "chartjs-plugin-trendline";
import { Chart } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState, useRef } from "react";
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
  BarElement,
  CategoryScale,
  scales,
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
  //chartTrendline,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

function NFVDSlackCharts() {

  // setting vars 
  const [CategoryLabels, setCategoryLabels] = useState([]);
  const [CategoryNums, setCategoryNums] = useState([]);
  const [UrgencyLabels, setUrgencyLabels] = useState([]);
  const [UrgencyNums, setUrgencyNums] = useState([]);
  const [VendorLabels, setVendorLabels] = useState([]);
  const [VendorNums, setVendorNums] = useState([]);
  const [ErrorCategoryLabels, setErrorCategoryLabels] = useState([]);
  const [ErrorCategoryNums, setErrorCategoryNums] = useState([]);
  const [OrgLabels, setOrgLabels] = useState([]);
  const [OrgNums, setOrgNums] = useState([]);
  const [createDateLabels, setcreateDateLabels] = useState([]);
  const [createDateNums, setcreateDateNums] = useState([]);

  const [issues, setIssues] = useState([]);
  const dt = useRef(null);

  // use effect calls the page to re render everytime its loaded then it fetches data from the api that containts the slack issues
  useEffect(() => {
    fetchSlackUrgency();
    fetchSlackCategory();
    fetchSlackVendor();
    fetchSlackErrorCategory();
    fetchSlackOrg();
    fetchSlackcreateDate();
  }, []);

  // getting sample data 
  const fetchSlackCategory = async () => {
    try {
      const response = await axios.get("/api/slack-issues-by-category", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setIssues(response.data);

      let hashMap = {};

      for (var employee of response.data) {
        //if that Category exists
        if (employee.Category in hashMap) {
          //up the prev count
          hashMap[employee.Category] = hashMap[employee.Category] + 1;
        } else {
          hashMap[employee.Category] = 1;
        }
      }

      //now we will iterate through those keys of the Map and format it for Array 2

      let outputArray = [];
      Object.keys(hashMap).forEach((key) => {
        outputArray.push({
          key,
          count: hashMap[key],
        });
      });

      console.log(outputArray);
      let keys = [];
      let count = [];

      for (const i of outputArray) {
        keys.push(i.key);
        count.push(i.count);
      }

      setCategoryLabels(keys);
      console.log(keys);
      setCategoryNums(count);
      console.log(count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSlackUrgency = async () => {
    try {
      const response = await axios.get("/api/slack-issues-by-Urgency", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setIssues(response.data);

      let hashMap = {};

      for (var employee of response.data) {
        //if that Urgency exists
        if (employee.Urgency in hashMap) {
          //up the prev count
          hashMap[employee.Urgency] = hashMap[employee.Urgency] + 1;
        } else {
          hashMap[employee.Urgency] = 1;
        }
      }

      //now we will iterate through those keys of the Map and format it for Array 2

      let outputArray = [];
      Object.keys(hashMap).forEach((key) => {
        outputArray.push({
          key,
          count: hashMap[key],
        });
      });

      console.log(outputArray);
      let keys = [];
      let count = [];

      for (const i of outputArray) {
        keys.push(i.key);
        count.push(i.count);
      }

      setUrgencyLabels(keys);
      setUrgencyNums(count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSlackVendor = async () => {
    try {
      const response = await axios.get("/api/slack-issues-by-Vendor", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setIssues(response.data);

      let hashMap = {};

      for (var employee of response.data) {
        //if that Vendor exists
        if (employee.Vendor in hashMap) {
          //up the prev count
          hashMap[employee.Vendor] = hashMap[employee.Vendor] + 1;
        } else {
          hashMap[employee.Vendor] = 1;
        }
      }

      //now we will iterate through those keys of the Map and format it for Array 2

      let outputArray = [];
      Object.keys(hashMap).forEach((key) => {
        outputArray.push({
          key,
          count: hashMap[key],
        });
      });

      console.log(outputArray);
      let keys = [];
      let count = [];

      for (const i of outputArray) {
        keys.push(i.key);
        count.push(i.count);
      }

      setVendorLabels(keys);
      setVendorNums(count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSlackErrorCategory = async () => {
    try {
      const response = await axios.get("/api/slack-issues", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);
      setIssues(response.data);

      let hashMap = {};

      for (var employee of response.data) {
        //if that ErrorCategory exists
        if (employee.ErrorCategory in hashMap) {
          //up the prev count
          hashMap[employee.ErrorCategory] = hashMap[employee.ErrorCategory] + 1;
        } else {
          hashMap[employee.ErrorCategory] = 1;
        }
      }

      //now we will iterate through those keys of the Map and format it for Array 2

      let outputArray = [];
      Object.keys(hashMap).forEach((key) => {
        outputArray.push({
          key,
          count: hashMap[key],
        });
      });

      console.log(outputArray);
      let keys = [];
      let count = [];

      for (const i of outputArray) {
        keys.push(i.key);
        count.push(i.count);
      }

      setErrorCategoryLabels(keys);
      setErrorCategoryNums(count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSlackOrg = async () => {
    try {
      const response = await axios.get("/api/slack-issues-by-Organization", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setIssues(response.data);

      let hashMap = {};

      for (var employee of response.data) {
        //if that Organization exists
        if (employee.Organization in hashMap) {
          //up the prev count
          hashMap[employee.Organization] = hashMap[employee.Organization] + 1;
        } else {
          hashMap[employee.Organization] = 1;
        }
      }

      //now we will iterate through those keys of the Map and format it for Array 2

      let outputArray = [];
      Object.keys(hashMap).forEach((key) => {
        outputArray.push({
          key,
          count: hashMap[key],
        });
      });

      console.log(outputArray);
      let keys = [];
      let count = [];

      for (const i of outputArray) {
        keys.push(i.key);
        count.push(i.count);
      }

      setOrgLabels(keys);
      setOrgNums(count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSlackcreateDate = async () => {
    try {
      const response = await axios.get("/api/slack-issues-by-createDate", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setIssues(response.data);

      let hashMap = {};

      for (var employee of response.data) {
        //if that Organization exists
        if (employee.createDate in hashMap) {
          //up the prev count
          hashMap[employee.createDate] = hashMap[employee.createDate] + 1;
        } else {
          hashMap[employee.createDate] = 1;
        }
      }

      //now we will iterate through those keys of the Map and format it for Array 2

      let outputArray = [];
      Object.keys(hashMap).forEach((key) => {
        outputArray.push({
          key,
          count: hashMap[key],
        });
      });

      console.log(outputArray);
      let keys = [];
      let count = [];

      var arr = Array(12).fill(0);

      for (const i of outputArray) {
        keys.push(i.key);
        count.push(i.count);

        let Str = i.key.substring(0, 10);
        console.log(Str);

        let date = new Date(Str);
        console.log(date.getMonth() + 1);

        arr[parseInt(date.getMonth())] += 1;

        console.log(arr);

        setcreateDateNums(arr);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let CategoryData = {
    labels: CategoryLabels,
    datasets: [
      {
        label: "Failures",
        data: CategoryNums,
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

  let UrgencyData = {
    labels: UrgencyLabels,
    datasets: [
      {
        label: "Failures",
        data: UrgencyNums,
        backgroundColor: ["#FF8027", "#FFE97A", "Red"],
      },
    ],
  };

  let VendorData = {
    labels: VendorLabels,
    datasets: [
      {
        label: "Failures",
        data: VendorNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
        ],
      },
    ],
  };

  let ErrorCategoryData = {
    labels: ErrorCategoryLabels,
    datasets: [
      {
        label: "Failures",
        data: ErrorCategoryNums,
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

  let OrgData = {
    labels: OrgLabels,
    datasets: [
      {
        label: "Failures",
        data: OrgNums,
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

  let DateData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Failures",
        data: createDateNums,
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

  const Categoryoptions = {
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

  const UrgencyOptions = {
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

  const VendorOptions = {
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

  const ErrorCategoryoptions = {
    scales: {
      y: {
        grace: "5%",
      },
    },
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

  const Orgoptions = {
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

  const Dateoptions = {
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

  return (
    <Container>
      <h1 className="mb-3 text-start bannertitle">
        NFVD Slack charts <hr />
      </h1>
      <div style={{ marginTop: "10px", marginLeft: "50px" }}>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              Create Date <br></br>
            </Card.Title>
            <Bar
              type="Bar"
              data={DateData}
              options={Dateoptions}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </div>

      <div style={{ marginTop: "10px", marginLeft: "50px" }}>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              Error Category <br></br>
            </Card.Title>
            <Bar
              type="Bar"
              data={ErrorCategoryData}
              options={ErrorCategoryoptions}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </div>

      <div style={{ marginTop: "10px", marginLeft: "50px" }}>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              Category <br></br>
            </Card.Title>
            <Chart
              type="doughnut"
              data={CategoryData}
              options={Categoryoptions}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </div>

      <div style={{ marginTop: "10px", marginLeft: "50px" }}>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              Urgency <br></br>
            </Card.Title>
            <Chart
              type="doughnut"
              data={UrgencyData}
              options={UrgencyOptions}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </div>

      <div style={{ marginTop: "10px", marginLeft: "50px" }}>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              Organization <br></br>
            </Card.Title>
            <Chart
              type="doughnut"
              data={OrgData}
              options={Orgoptions}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </div>

      <div style={{ marginTop: "10px", marginLeft: "50px" }}>
        <Card className="chartCard shadow-sm rounded">
          <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              Vendor <br></br>
            </Card.Title>
            <Chart
              type="doughnut"
              data={VendorData}
              options={VendorOptions}
              className="w-full md:w-30rem"
            />
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default NFVDSlackCharts;

/*

    <div style={{ marginTop: "10px", marginLeft: "50px", }}>

    <Card className="chartCard shadow-sm rounded">
    <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
    <Card.Title className="regCardTitle">
      Date <br></br>

      </Card.Title>
    <Bar
    type="Bar"
    data={DateData}
    options={Dateoptions}
    className="w-full md:w-30rem"
      />
</Card.Body>
</Card>
</div>







    const [CategoryLabels, setCategoryLabels] = useState([]);
    const [CategoryNums, setCategoryNums] = useState([]);
    const [issues, setIssues] = useState([]);



    useEffect(() => {
        fetchSlackCharts();

      
    }, []);


    let CategoryData = {
    labels: CategoryLabels,
    datasets: [
      {
        label: "Failures",
        data: CategoryNums,
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
          "#002C4D",
          "#DCF5E6",
          "#FFECE0",
          "#FED60E",
          "#006FC1",
          "#00B845",
        ],
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

  const fetchSlackCharts = async () => {
    try {
      const response = await axios.get("/api/slack-issues", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIssues(response.data);

      setCategoryLabels([]);
      setCategoryNums([]);
      const operationsList = response.data;
      console.log(response.data);
      operationsList.map((op) => {
        // Count for each value 3 - Failure, 2 - Error, 3 - Success
        // Top - (2) Loop through and get top values  -> returns will be category
        
        setCategoryLabels((oldList) => [...oldList, op.operation]);
        setCategoryNums((oldList) => [...oldList, op.count]);
      });
    } catch (err) {
      console.log(err);
    }
  };


    return(
    <Container>
        <h1 className="mb-3 text-start bannertitle">
          NFVD Slack charts <hr />
        </h1>
        <div style={{ marginTop: "10px", marginLeft: "50px" }}>

            <Chart
            type="doughnut"
            data={CategoryData}
            options={options}
            className="w-full md:w-30rem"
          />

        </div>




        </Container>
        )



*/
