import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const Details = () => {
  const [data, setData] = useState(null);
  const { projectKey,isJiraProject } = useParams();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/api/statistics/el');
//       const jsonData = await response.json();
//       setData(jsonData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log(projectKey);
      console.log(isJiraProject);
      const response = await axios.get(`http://localhost:4000/api/statistics/${projectKey}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      try {
        const response = await axios.get(`http://localhost:4000/api/numberOfCards/${projectKey}`);
        setData(response.data);
      } catch (secondError) {
        console.error(secondError);
      }
    }
  };

  fetchData(); // Call the fetchData function
}, [projectKey]);
  return (
    <div>
      {data ? (
        <div>
          <h2>Statistics:</h2>
          <p>In To-Do: {data.inToDo}</p>
          <p>In Done: {data.inDone}</p>
          <p>In Progress: {data.inProgress}</p>
          <p>Created Last Week: {data.createdLastWeek}</p>
          <p>Done Last Week: {data.doneLastWeek}</p>
          <p>Updated Last Week: {data.updatedLastWeek}</p>
          <h3>Tasks Created Per Day Last Week:</h3>
          <ul>
            <li>Sunday: {data.tasksCreatedPerDayLastWeek.Sunday}</li>
            <li>Monday: {data.tasksCreatedPerDayLastWeek.Monday}</li>
            <li>Tuesday: {data.tasksCreatedPerDayLastWeek.Tuesday}</li>
            <li>Wednesday: {data.tasksCreatedPerDayLastWeek.Wednesday}</li>
            <li>Thursday: {data.tasksCreatedPerDayLastWeek.Thursday}</li>
            <li>Friday: {data.tasksCreatedPerDayLastWeek.Friday}</li>
            <li>Saturday: {data.tasksCreatedPerDayLastWeek.Saturday}</li>
          </ul>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Details;
