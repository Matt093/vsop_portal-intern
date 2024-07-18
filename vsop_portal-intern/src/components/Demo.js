import React from "react";
import { Container, Card, Row, Button } from "react-bootstrap";
import "chartjs-adapter-date-fns";
import chartTrendline from "chartjs-plugin-trendline";
import { Chart } from "react-chartjs-2";
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
  chartTrendline
);


function NFVDSlackCharts(){

    const [CategoryLabels, setCategoryLabels] = useState([]);
    const [CategoryNums, setCategoryNums] = useState([]);
    const [issues, setIssues] = useState([]);
    const dt = useRef(null);
  
    // use effect calls the page to re render everytime its loaded then it fetches data from the api that containts the slack issues
    useEffect(() => {
      fetchSlackIssues();
    }, []);
  
    
    const fetchSlackIssues = async () => {
      try {
        const response = await axios.get("/api/slack-issues", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setIssues(response.data);
      } catch (err) {
        console.log(err);
      }
    };


    let CategoryData = {
    labels: ['yes', 'no'],
    datasets: [
      {
        label: "Failures",
        data: [3,2],
        backgroundColor: [
          "#FF8027",
          "#FFE97A",
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



    return(
    <Container>
        <h1 className="mb-3 text-start bannertitle">
          NFVD Slack charts <hr />
        </h1>
        <div style={{ marginTop: "10px", marginLeft: "50px" }}>

            <Card className="SMchartCard shadow-sm rounded">
            <Card.Body style={{ marginTop: "-12px", paddingBottom: "35px" }}>
            <Card.Title className="regCardTitle">
              yes and no<br></br>

            </Card.Title>
            <Chart
            type="doughnut"
            data={CategoryData}
            options={options}
            className="w-full md:w-30rem"
          />
          
          </Card.Body>
            </Card>

        </div>


        </Container>
        )

}

export default NFVDSlackCharts;

/*

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