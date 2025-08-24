import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// react-calendar typings
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Task {
  _id: string;
  title: string;
  done?: boolean;
  createdAt: string;
  completedAt?: string | null;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token },
      });
      setTasks(res.data);

      // Collect all days with completed tasks (use LOCAL date, not UTC)
      const completed = new Set<string>(
        res.data
          .filter((t: Task) => t.done && t.completedAt)
          .map((t: Task) =>
            new Date(t.completedAt as string).toLocaleDateString("en-CA")
          ) as string[]
      );
      setCompletedDates(completed);
    } catch (err) {
      console.error(err);
    }
  };

  // Get tasks completed on selected day
  const completedTasksForDay = tasks.filter((task) => {
    if (!task.done || !task.completedAt || !selectedDate) return false;
    const completedDay = new Date(task.completedAt).toLocaleDateString("en-CA");
    const selectedDay = selectedDate.toLocaleDateString("en-CA");
    return completedDay === selectedDay;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleToDo = () => {
    navigate("/dashboard");
  }

  return (
    <div className="h-screen flex bg-neutral-100">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-800 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold p-4">TaskAid</h2>
          <nav className="flex flex-col gap-2 p-4">
            <button onClick={handleToDo} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              To-Do List
            </button>
            <button className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
              Calander
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
      <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Task Calendar</h1>

        {/* Calendar */}
        <Calendar
          onChange={(value: Value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
            } else if (Array.isArray(value) && value[0] instanceof Date) {
              setSelectedDate(value[0]); // handle range
            }
          }}
          value={selectedDate}
          tileContent={({ date, view }) =>
            view === "month" &&
            completedDates.has(date.toLocaleDateString("en-CA")) ? (
              <div className="flex justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            ) : null
          }
        />

        {/* Completed tasks for selected day */}
        <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Completed Tasks on{" "}
            {selectedDate?.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          {completedTasksForDay.length > 0 ? (
            <ul className="list-disc pl-5">
              {completedTasksForDay.map((task) => (
                <li key={task._id} className="text-green-700">
                  {task.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tasks completed on this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}
