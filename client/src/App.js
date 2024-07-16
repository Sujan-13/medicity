import Home from "./pages/home";
import Footer from "./components/Footer";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Nav from "./components/Nav";
import {BrowserRouter,Route,Routes,useNavigate} from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { useEffect, useState } from "react";
import useSessionManagement from "./modules/useSession";
function App() {
  const [session,setsession]=useState(false);
  const navigate=useNavigate();

  useSessionManagement(navigate, "/dashboard");

  return (
    <div id="page-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>

    </div>
  );
}

export default App;
