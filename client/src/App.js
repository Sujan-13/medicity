import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Appointment from "./pages/appointment";
import Book from "./pages/book";
import Profile from "./pages/profiile";
import Billing from "./pages/billing";
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
        <Route path="/dashboard" element={<Dashboard/>} >
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile/>} />
            <Route path="appointment" element={<Appointment/>} />
            <Route path="book" element={<Book />} />
            <Route path="billing" element={<Billing/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
