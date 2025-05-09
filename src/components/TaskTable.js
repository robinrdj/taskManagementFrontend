import { useState } from "react";
import "./TaskTable.css";

function TaskTable({ tasks, deleteTask, updateTask }) {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleUpdateClick = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleModalSave = () => {
    updateTask(currentTask.id, currentTask);
    setShowModal(false);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="task-table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>TaskId</th>
            <th>Title</th>
            <th>Description</th>
            <th>Effort</th>
            <th>Due Date</th>
            {/* <th>User ID</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.effort}</td>
              <td>{formatDate(task.due_date)}</td> {/* Format due date */}
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
                <button
                  className="update-btn"
                  onClick={() => handleUpdateClick(task)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && currentTask && (
        <div className="edit-modal">
          <h3>Update Task</h3>
          <div className="modal-input">
            <label>Title</label>
            <input
              type="text"
              value={currentTask.title}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
              placeholder="Title"
            />
          </div>
          <div className="modal-input">
            <label>Description</label>
            <input
              type="text"
              value={currentTask.description}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>
          <div className="modal-input">
            <label>Effort (days)</label>
            <input
              type="number"
              value={currentTask.effort}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, effort: e.target.value })
              }
              placeholder="Effort"
            />
          </div>
          <div className="modal-input">
            <label>Due Date</label>
            <input
              type="date"
              value={formatDate(currentTask.due_date)} // Format date for the modal
              onChange={(e) =>
                setCurrentTask({ ...currentTask, due_date: e.target.value })
              }
            />
          </div>
          <div className="modal-actions">
            <button className="save-btn" onClick={handleModalSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskTable;
