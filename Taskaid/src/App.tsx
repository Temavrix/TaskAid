import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import ToDo from "./pages/ToDo";
import Notes from "./pages/notes";
import Calander from "./pages/calanderpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ToDo" element={<ToDo />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/calanderpage" element={<Calander/>} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
