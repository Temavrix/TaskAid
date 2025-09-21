import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css'
import lolipop from '../assets/lolipop.jpg'
import bluesun from '../assets/bluesun.jpg'
import redsun from '../assets/redsun.jpeg'
import orangehue from '../assets/orangehue.jpeg'
import curtain from '../assets/darkcurtain.webp'
import keynote from '../assets/keynote.webp'
import sunset from '../assets/sunsetvibes.jpg'

interface Task {
  _id: string;
  title: string;
  done?: boolean;
  createdAt: string;
  completedAt?: string | null;
}

const images: string[] = [
  lolipop,
  bluesun,
  redsun,
  orangehue,
  curtain,
  keynote,
  sunset
];

let lastIndex: number | null = null;

const getRandomImage = () => {
  if (images.length === 1) return images[0]; // only one image
  let index: number;
  do {
    index = Math.floor(Math.random() * images.length);
  } while (index === lastIndex);
  lastIndex = index;
  return images[index];
};


export default function ToDo() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [taskImages, setTaskImages] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

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
    else return true; // all
  });

  // Fetch tasks
  const fetchTasks = async () => {
  try {
    const res = await axios.get("https://taskaid-backend-8v50.onrender.com/api/tasks", {
      headers: { Authorization: token },
    });
    const tasksData = res.data;

    // Assign image if not assigned yet
    const newTaskImages: { [key: string]: string } = { ...taskImages };
    tasksData.forEach((task: Task) => {
      if (!newTaskImages[task._id]) {
        newTaskImages[task._id] = getRandomImage();
      }
    });

    setTaskImages(newTaskImages);
    setTasks(tasksData);
  } catch (err) {
    console.error(err);
  }
};

  // Add task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post("https://taskaid-backend-8v50.onrender.com/api/tasks",{ title: newTask },{ headers: { Authorization: token }});
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      await axios.delete(`https://taskaid-backend-8v50.onrender.com/api/tasks/${id}`, {
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
      await axios.put(`https://taskaid-backend-8v50.onrender.com/api/tasks/${id}/done`,{},{ headers: { Authorization: token } });
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

  const handleNotes = () => {
    navigate("/notes");
  }

  return (
    <div className="h-screen justify-center flex bg-gray-900">
      
      <div className={`fixed top-0 left-0 h-full bg-neutral-800 text-white flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-50"} lg:translate-x-0 lg:w-64`}>
        <div>
          <h2 className="text-2xl font-bold p-4">TaskAid</h2>
          <nav className="flex flex-col gap-2 p-4">
            <button className="px-3 py-2 rounded-lg bg-gray-500 text-left">
              To-Dos
            </button>
            <button onClick={handleNotes} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              Notes
            </button>
            <button onClick={handleCalander} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              Calendar
            </button>
          </nav>
        </div>
        <div className="p-4">
          <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}/>
      )}

      {/* Toggle Button */}
      <button className="fixed top-0 left-0 p-2 bg-neutral-800 text-white lg:hidden z-5" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>



      <div className="flex lg:ml-50 flex-col items-center overflow-y-auto">
        <h1 className="mt-10 text-4xl font-bold text-white mb-6">Your Commitments</h1>
        <br/>

        <form onSubmit={handleAddTask} className="flex gap-4 mb-6">
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..." className="p-3 border rounded-lg text-2xl w-72 lg:w-150 bg-white font-bold text-black"/>
          <button type="submit" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700">
            Add
          </button>
        </form>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}>
            All
          </button>
          <button onClick={() => setFilter("pending")} className={`px-3 py-1 rounded-lg ${filter === "pending" ? "bg-red-600 text-white" : "bg-gray-700 text-white"}`}>
            Pending
          </button>
          <button onClick={() => setFilter("completed")} className={`px-3 py-1 rounded-lg ${filter === "completed" ? "bg-green-600 text-white" : "bg-gray-700 text-white"}`}>
            Completed
          </button>
        </div>

        <ul className="lg:w-170 sm:w-170 bg-gray-900 overflow-y-auto no-scrollbar text-white rounded-lg shadow">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li key={task._id} className="flex flex-col p-6 mb-3 text-2xl font-bold rounded-xl shadow-md bg-black hover:shadow-lg transition-shadow"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${taskImages[task._id]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.done || false}
                      className="w-6 h-6 mt-1 accent-blue-500 flex-shrink-0"
                      onChange={() => handleToggleDone(task._id)}
                    />
                    <span className={task.done ? "line-through text-white break-words" : "break-words"}>
                      {task.title}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(task._id)}className="bg-red-600 text-white ml-3 px-3 py-1 rounded-lg hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
                {task.done && task.completedAt && (
                <p className="mt-10 text-green-600 ml-7 text-2xl">
                  ✅ Completed on{" "}
                  {new Date(task.completedAt).toLocaleString()}</p>)}
              </li>
            ))) : (<p className="text-gray-400 text-center">No tasks yet</p>)}
        </ul>
      </div>
    </div>
  );
}
