import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  done?: boolean;
  createdAt: string;
  completedAt?: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.done;
    if (filter === "completed") return task.done;
    return true; // all
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title: newTask },
        { headers: { Authorization: token } }
      );
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle done/undone
  const handleToggleDone = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}/done`,
        {},
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalander = () => {
    navigate("/calanderpage")
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-neutral-100">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-800 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold p-4">TaskAid</h2>
          <nav className="flex flex-col gap-2 p-4">
            <button className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              To-Do List
            </button>
            <button onClick={handleCalander} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              Calendar
            </button>
          </nav>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">To-Do Page</h1>

        {/* Add Task */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a task..."
            className="p-3 border rounded-lg w-72 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </form>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-lg ${
              filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg ${
              filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <ul className="w-96 bg-white rounded-lg shadow p-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task._id}
                className="flex flex-col gap-1 p-2 border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.done || false}
                      onChange={() => handleToggleDone(task._id)}
                    />
                    <span
                      className={
                        task.done ? "line-through text-gray-500" : ""
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                {task.done && task.completedAt && (
                  <p className="text-xs text-green-600 ml-7">
                    ✅ Completed on{" "}
                    {new Date(task.completedAt).toLocaleString()}
                  </p>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No tasks yet</p>
          )}
        </ul>
      </div>
    </div>
  );
}
