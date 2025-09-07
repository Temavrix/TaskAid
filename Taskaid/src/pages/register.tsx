import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://taskaid-backend-8v50.onrender.com/api/register", { email, password });
      setMessage(res.data.msg || "Registered successfully ✅");
    } catch (err: any) {
      setMessage(err.response?.data?.msg || "Registration failed ❌");
    }
  };

  return (
    <div className="flex h-screen items-center text-center justify-center bg-gray-400">
      <form onSubmit={handleRegister} className="bg-gray-700 p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Register</h2>

        <input type="email" placeholder="Email" className="w-full p-3 mb-4 bg-gray-900 text-amber-50 border rounded-lg" value={email}
          onChange={(e) => setEmail(e.target.value)}/>

        <input type="password" placeholder="Password"
          className="w-full p-3 mb-4 bg-gray-900 text-amber-50 border rounded-lg" value={password}
          onChange={(e) => setPassword(e.target.value)}/>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Register
        </button><br /><br />

        <label className='text-white text-center'>
            Click Here To Go Back To <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </label>
        
        {message && <p className="mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
}
