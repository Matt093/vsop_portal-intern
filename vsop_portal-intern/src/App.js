import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Login from "./components/Login";
import SidebarLayout from "./components/SidebarLayout";

import NFVDCharts from "./components/NFVDCharts";
import "./App.css";

//import "/node_modules/primereact/resources/primereact.min.css";
//import "/node_modules/primeflex/primeflex.css";
//import "/node_modules/vz-react/scss/vzprime.scss";

import UserContext from "./context/UserContext";
import { useState } from "react";
import NFVDJobFailures from "./components/NFVDJobFailures";
import NFVDErrorManagement from "./components/NFVDErrorManagement";
import NFVDSlackIssues from "./components/NFVDSlackIssues";
import NFVDSlackCharts from "./components/NFVDSlackCharts";

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route path="/nfvd-charts" element={<NFVDCharts />} />
          <Route path="/nfvd-job-failures" element={<NFVDJobFailures />} />
          <Route path="/nfvd-slack-issues" element={<NFVDSlackIssues />} />
          <Route path="/nfvd-slack-charts" element={<NFVDSlackCharts />} />
          <Route
            path="/nfvd-error-management"
            element={<NFVDErrorManagement />}
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;

/*
            <Route path="/user-activity" element={<UserActivity />} />
            <Route path="/project-activity" element={<ProjectActivity />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/support" element={<Support />} />
*/
