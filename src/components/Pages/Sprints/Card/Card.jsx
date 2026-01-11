import React, { useState, useEffect } from "react";
import "./Card.css";
import InputCard from "../InputCard/InputCard";
import EditCard from "../EditCard/EditCard";
import axios from "axios";

const Card = () => {
  const [tasks, setTasks] = useState({
    ToDo: [],
    InProgress: [],
    Done: [],
  });

  const [showInputCard, setShowInputCard] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/getSprints");
      const tasksData = response.data;
      setTasks(tasksData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = (columnId) => {
    setShowInputCard(true);
    setSelectedColumnId(columnId);
  };

  const handleSaveTask = (columnId, task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: task.description,
    };

    const updatedTasks = { ...tasks };
    updatedTasks[columnId].push(newTask);

    setTasks(updatedTasks);
    setShowInputCard(false);
  };

  const handleEditTask = (columnId, taskId, editedTitle) => {
    const updatedTasks = { ...tasks };
    const column = updatedTasks[columnId];
    const taskIndex = column.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      column[taskIndex].title = editedTitle;
    }
    setTasks(updatedTasks);
  };

  return (
    <div className="content-container">
      <div className="columns-container">
        {Object.keys(tasks).map((containerId) => (
          <div key={containerId} className="column">
            <div className="column-header">
              <h2>{containerId}</h2>
              <button
                className="button"
                type="button"
                onClick={() => handleAddTask(containerId)}
              >
                <span className="button__text">Add Task</span>
                <span className="button__icon">
                  <svg
                    className="svg"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="12" x2="12" y1="5" y2="19"></line>
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                  </svg>
                </span>
              </button>
            </div>
            <div className="task-container">
              {tasks[containerId].map((task) => (
                <EditCard
                  key={task.id}
                  task={task}
                  columnId={containerId}
                  onEditTask={handleEditTask}
                />
              ))}
            </div>
            {showInputCard && selectedColumnId === containerId && (
              <InputCard
                columnId={selectedColumnId}
                onSave={handleSaveTask}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;