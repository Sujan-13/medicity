import Home from "./pages/home";
import Footer from "./components/Footer";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Nav from "./components/Nav";
import {BrowserRouter,Route,Routes,useNavigate} from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { useEffect, useState } from "react";
function App() {
  const [session,setsession]=useState(false);
  const navigate=useNavigate();
  useEffect(()=>{
    const sessionManagement=async ()=>{ 
    try {
      const response=await fetch("http://localhost:3001/api/check-session",{
        "method":"GET",
        credentials: 'include'
         });
      const result=await response.json();
      if (result.authenticated) {
        navigate("/dashboard");
      }
      console.log(result);
    } catch (error) {
     console.error("Fetch Error",error); 
    }
    }
    sessionManagement();
  },[])


  return (
    <div id="page-container">
    <Nav />
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
