import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import TaskTable from "../TaskTable";
import "./Dashboard.css";
import config from "../../config";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [effort, setEffort] = useState(1);
  const [due_date, setdue_date] = useState("");
  const [user_id, setUser_id] = useState(null);
  const [error, setError] = useState("");

  const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUser_id(parseInt(id));
    if (id) fetchTasks(parseInt(id));
  }, []);

  //get
  const fetchTasks = async (uid = user_id) => {
    if (uid) {
      const res = await axios.get(`${config.API_BASE_URL}/api/tasks/${uid}`);
      setTasks(res.data);
    }
  };
  //create
  const addTask = async () => {
    // Input validations
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    if (effort <= 0) {
      setError("Effort must be a positive number.");
      return;
    }
    if (!isValidDate(due_date)) {
      setError("Please enter a valid due date.");
      return;
    }
    const today = new Date();
    const due = new Date(due_date);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      setError("Due date must be in the future.");
      return;
    }
    if (effort > diffDays) {
      setError(
        `Effort (${effort} days) cannot exceed days until due date (${diffDays} days).`
      );
      return;
    }
    // Clear error and submit
    setError("");
    await axios.post(`${config.API_BASE_URL}/api/tasks`, {
      title,
      description,
      effort,
      due_date,
      user_id,
    });
    // Reset form
    setTitle("");
    setDescription("");
    setEffort(1);
    setdue_date("");
    fetchTasks();
  };

  //delete
  const deleteTask = async (id) => {
    await axios.delete(`${config.API_BASE_URL}/api/tasks/${id}`);
    fetchTasks();
  };
  //update
  const updateTask = async (id, currentTask) => {
    await axios.put(`${config.API_BASE_URL}/api/tasks/${id}`, currentTask);
    fetchTasks();
  };
  //export
  const exportTasks = async () => {
    const res = await axios.get(
      `${config.API_BASE_URL}/api/tasks/export/${user_id}`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks.xlsx");
    document.body.appendChild(link);
    link.click();
  };
  //import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(`${config.API_BASE_URL}/api/tasks/import`, formData);
    fetchTasks();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <h3>Add Task</h3>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <div className="task-inputs">
        <label>
          Task Title:
          <input
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Effort (days):
          <input
            type="number"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value))}
            min={1}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            value={due_date}
            onChange={(e) => setdue_date(e.target.value)}
          />
        </label>
        <button onClick={addTask}>Add Task</button>
      </div>

      <h3>Your Tasks</h3>
      <TaskTable
        tasks={tasks}
        deleteTask={deleteTask}
        updateTask={updateTask}
      />

      <h3>Export Tasks to Excel</h3>
      <button onClick={exportTasks} className="xcel-actions-button xcel-btn">
        Export to Excel
      </button>

      <h3>
        Upload bulk tasks using Excel
        <span style={{ fontSize: "12px", marginLeft: "6px" }}>
          (Kindly follow the instructions below before uploading)
        </span>
      </h3>
      <input
        type="file"
        accept=".xlsx, .csv"
        onChange={handleImport}
        className="xcel-actions-button upload-btn"
      />
      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          margin: "40px 0px",
        }}
      >
        <h4>Instructions for uploading</h4>
        <p>- Kindly follow the exact excel header as shown in the below img</p>
        <p>- Input everything as strings including date</p>
        <p>
          - Date should be in dd-mm-yyyy string format. eg: 22-08-2025 . And
          don't change the col type to date and let it be plain string
        </p>
        <img src="/refImg.png" alt="Reference" width="400px" />
      </div>
    </div>
  );
};

export default Dashboard;
