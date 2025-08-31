import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function notes() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleToDo = () => {
    navigate("/ToDo");
    };

    const handleCalander = () => {
    navigate("/calanderpage");
    };

    // Logout
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };


    return (
    <div className="h-screen justify-center flex bg-neutral-600">
      
        <div className={`fixed top-0 left-0 h-full bg-neutral-800 text-white flex flex-col justify-between transform transition-transform duration-300 z-40
            ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-50"} lg:translate-x-0 lg:w-64`}>
          <div>
            <h2 className="text-2xl font-bold p-4">TaskAid</h2>
            <nav className="flex flex-col gap-2 p-4">
              <button onClick={handleToDo} className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
                To-Dos
              </button>
              <button className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-left">
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
    </div>
  );
}