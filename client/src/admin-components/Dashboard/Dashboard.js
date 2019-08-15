import React from "react";

import OrdersLatest from "../OrdersLatest/OrdersLatest";
import OrderAnalytics from "../OrderAnalytics/OrderAnalytics";

const Dashboard = ({ flashErrorMessage, ...props }) => {
  return (
    <div>
      <OrderAnalytics flashErrorMessage={flashErrorMessage} />
      <OrdersLatest flashErrorMessage={flashErrorMessage} {...props} />
    </div>
  );
};

export default Dashboard;
