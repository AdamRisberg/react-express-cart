import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

import { Bar } from "react-chartjs-2";

import styles from "./OrderAnalytics.module.css";

class OrderAnalytics extends Component {
  state = {
    data: [],
    graphRange: "Month",
    chartContent: "orders"
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.graphRange !== this.state.graphRange) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  fetchData() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/orders/analytics?by=" + this.state.graphRange.toLowerCase(),
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        res.data.sort((a, b) => a._id.month - b._id.month);
        this.setState(() => ({ data: res.data }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  handleRangeChange = e => {
    const value = e.target.value;

    this.setState(() => ({ graphRange: value }));
  };

  handleChartContentChange = e => {
    const value = e.target.value;

    this.setState(() => ({ chartContent: value }));
  };

  createYearData() {
    let counter = 0;

    return new Array(12).fill(0).map((_, i) => {
      if (
        this.state.data[counter] &&
        this.state.data[counter]._id.month === i
      ) {
        const count = this.state.data[counter].count;
        const totalPrice = this.state.data[counter].totalPrice;
        counter++;

        return {
          count,
          totalPrice
        };
      }
      return {
        count: 0,
        totalPrice: 0
      };
    });
  }

  createMonthData() {
    let counter = 0;

    const days = [];
    const numDays = generateLabels()[new Date().getMonth()].length;

    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }

    return days.map(d => {
      if (
        this.state.data[counter] &&
        this.state.data[counter]._id.dayOfMonth === d
      ) {
        const count = this.state.data[counter].count;
        const totalPrice = this.state.data[counter].totalPrice;
        counter++;

        return {
          count,
          totalPrice
        };
      }
      return {
        count: 0,
        totalPrice: 0
      };
    });
  }

  createWeekData() {
    let counter = 0;

    const days = [];
    const numDays = generateLabels()[new Date().getMonth()].length;

    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }

    return weekLabels.map((d, i) => {
      if (
        this.state.data[counter] &&
        this.state.data[counter]._id.dayOfWeek === i + 1
      ) {
        const count = this.state.data[counter].count;
        const totalPrice = this.state.data[counter].totalPrice;
        counter++;

        return {
          count,
          totalPrice
        };
      }
      return {
        count: 0,
        totalPrice: 0
      };
    });
  }

  render() {
    let fullData;
    let labels;

    switch (this.state.graphRange) {
      case "Year":
        fullData = this.createYearData();
        labels = generateLabels().map(m => m.name);
        break;
      case "Month":
        fullData = this.createMonthData();
        labels = fullData.map((_, i) => i + 1);
        break;
      default:
        fullData = this.createWeekData();
        labels = weekLabels;
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Orders",
          data: fullData.map(d => {
            if (this.state.chartContent === "orders") {
              return d.count;
            }
            return d.totalPrice.toFixed(2);
          }),
          backgroundColor: "rgba(50, 80, 255, .8)",
          hoverBackgroundColor: "rgba(50, 80, 255, 1)"
        }
      ]
    };

    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Dashboard</div>
        </div>
        <div className={styles.TitleBox}>SALES ANALYTICS</div>
        <div className={styles.AnalyticsBox}>
          <label className={styles.ChartSelectLabel}>
            Show:
            <select
              className={styles.RangeSelect}
              onChange={this.handleChartContentChange}
              value={this.state.chartContent}
            >
              <option value="orders">Orders</option>
              <option value="sales">Total Sales</option>
            </select>
          </label>
          <label className={styles.ChartSelectLabel}>
            Range:
            <select
              className={styles.RangeSelect}
              onChange={this.handleRangeChange}
              value={this.state.graphRange}
            >
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>
          </label>
          <Bar data={data} width={100} height={200} options={chartOptions} />
        </div>
      </React.Fragment>
    );
  }
}

const chartOptions = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  onResize: (chart, size) => {
    chart.canvas.height = 200;
    let width = chart.canvas.style.width;
    chart.canvas.width = width.substring(0, width.length - 2);
    chart.canvas.style.height = "200px";
    chart.height = 200;
  },
  scales: {
    yAxes: [
      {
        ticks: {
          suggestedMax: 5
        }
      }
    ]
  },
  tooltips: {
    displayColors: false,
    xPadding: 10,
    callbacks: {
      title: () => ""
    }
  }
};

const daysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const generateLabels = () => {
  const year = new Date().getFullYear();

  return [
    { name: "January", length: daysInMonth(0, year) },
    { name: "February", length: daysInMonth(1, year) },
    { name: "March", length: daysInMonth(2, year) },
    { name: "April", length: daysInMonth(3, year) },
    { name: "May", length: daysInMonth(4, year) },
    { name: "June", length: daysInMonth(5, year) },
    { name: "July", length: daysInMonth(6, year) },
    { name: "August", length: daysInMonth(7, year) },
    { name: "September", length: daysInMonth(8, year) },
    { name: "October", length: daysInMonth(9, year) },
    { name: "November", length: daysInMonth(10, year) },
    { name: "December", length: daysInMonth(11, year) }
  ];
};

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default OrderAnalytics;
