import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../index.css';

export default function Todo() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const localTasks = JSON.parse(localStorage.getItem('localTasks'));
    if (localTasks) {
      setTasks(localTasks);
    }
  }, []);

  useEffect(() => {
    setShowButtons(tasks.length > 0);
  }, [tasks]);

  const addTask = () => {
    if (task.trim() !== '') {
      const newTask = {
        id: new Date().getTime().toString(),
        title: task.trim(),
        importance: false,
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
      setTask('');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
  };

  const toggleImportance = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, importance: !task.importance } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
  };

  const openEditModal = (id) => {
    setEditTaskId(id);
  };

  const closeEditModal = () => {
    setEditTaskId(null);
  };

  const handleEditChange = (e, id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, title: e.target.value };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
EditTask.propTypes = {
  task: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

  return (
    <div className="container row">
      <h1 className="mt-3 text-white">To-Do App</h1>
      <div className="col-8 b2">
        <div className="inp1">
          <input
            type="text"
            name="task"
            value={task}
            placeholder="Write your task..."
            className="form-control ww"
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
        <div className="inp2">
          <button
            className="btn btn-primary form-control material-icons"
            onClick={addTask}
          >
            add
          </button>
        </div>
      </div>
      <div className="col-4">
        <div className="inp1">
          <input
            type="text"
            name="search"
            value={searchQuery}
            placeholder="Search tasks..."
            className="form-control ww"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="badge">
        You have {tasks.length === 0
          ? 'No Tasks'
          : tasks.length === 1
          ? '1 Task'
          : `${tasks.length} Tasks`}
      </div>
      {filteredTasks.map((task) => (
        <div className="row" key={task.id}>
          <div className="col-11">
            <div
              className={`form-control bg-white btn mt-2 ${
                task.completed ? 'text-decoration-line-through' : ''
              }`}
              style={{ textAlign: 'left', fontWeight: 'bold' }}
            >
              {task.title}
            </div>
          </div>
          {showButtons && (
            <div className="col-1 st-22">
              <div className="d-flex">
                <button
                  className={`mt-2 btn btn-warning material-icons ${
                    task.completed ? 'disabled' : ''
                  }`}
                  onClick={() => toggleCompletion(task.id)}
                  style={{ fontSize: '15px', marginRight: '2px' }}
                >
                  {task.completed ? 'Finished' : 'Finish'}
                </button>

                <button
                  className={`mt-2 btn btn-info material-icons ${
                    task.importance ? 'btn btn-danger' : ''
                  }`}
                  onClick={() => toggleImportance(task.id)}
                  style={{ fontSize: '16px', marginRight: '2px' }}
                >
                  {task.importance ? 'Priority_High' : 'Priority_Low'}
                </button>

                <button
                  className="mt-2 btn btn-danger material-icons"
                  onClick={() => deleteTask(task.id)}
                  style={{ fontSize: '16px' }}
                >
                  Delete
                </button>

                <button
                  className="mt-2 btn btn-success material-icons  btn-modal "
                  onClick={() => openEditModal(task.id)}
                  style={{
                    fontSize: '16px',
                    marginRight: '4px',
                    backgroundColor: 'blue',
                    color: 'white',
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {editTaskId && (
        <EditTask
          task={tasks.find((task) => task.id === editTaskId)}
          onSave={handleEditChange}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}

function EditTask({ task, onSave, onClose }) {
  const [editedTask, setEditedTask] = useState(task.title);

  const handleSave = () => {
    onSave(editedTask, task.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Task</h2>
        <input
          type="text"
          value={editedTask}
          className="form-control"
          onChange={(e) => setEditedTask(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Add prop types for EditTask component

