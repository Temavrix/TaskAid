import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://taskaid-backend-8v50.onrender.com/api/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/ToDo");
        } catch (err: any) {
            setMessage(err.response?.data?.msg || "Login failed ❌");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center h-screen w-screen">
            <div className="md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">
              <h1 className="text-5xl font-bold mb-6">TaskAid</h1>
              <p className="text-lg text-gray-200">
                Track your tasks efficiently....
              </p>
            </div>


            <div className="flex items-center justify-center bg-gray-400 p-2">
                <div className="w-full items-center justify-center max-w-md bg-gray-700  p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-semibold text-white text-center mb-6">Sign In</h2>
                <form onSubmit={handleLogin} className="lg:p-8 lg:w-96 sm:p-2 sm:w-48rounded-2xl ">
                    <input type="email" placeholder="Email" className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg"
                        onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg"
                        onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                        Sign In
                    </button>
                    {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
                    <p className="text-white text-center mt-4">
                        Don’t have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
                    </p>
                </form>
            </div>
            </div>
        </div>
    );
}
