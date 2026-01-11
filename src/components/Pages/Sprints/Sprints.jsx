import React from "react";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import Card from "./Card/Card";
import './Sprints.css'
import Header from '../Dashboards/Developer/header';

const Sprints = () => {
  return (
    <div className="background-svg">
      <Header />
      <Sidebar />
      <Card />
    </div>
  );
};

export default Sprints;
