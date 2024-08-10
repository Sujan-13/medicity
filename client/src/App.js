import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Appointment from "./pages/appointment";
import Book from "./pages/book";
import Profile from "./pages/profiile";
import Billing from "./pages/billing";
import DoctorDashboard from "./pages/doctor/doctordashboard";
import DoctorProfile from "./pages/doctor/doctorprofile";
import DoctorAppointment from "./pages/doctor/doctorappointment";
import AdminDashboard from "./pages/admin/admindashboard";
import AdminDoctor from "./pages/admin/admindoctor";
import AdminPatient from "./pages/admin/adminpatient";
import Loader from "./components/Loader";
import {BrowserRouter,Route,Routes,useNavigate} from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { useEffect, useState } from "react";
import useSessionManagement from "./modules/useSession";
function App() {
  const [session,setsession]=useState(false);
  const navigate=useNavigate();
  const [usertype,setUsertype]=useState(""||null);

  useSessionManagement(navigate, "/dashboard", "/login");

  useEffect(()=>{
    const checkuserType=async ()=>{
      try {
        const response = await fetch("/api/check-usertype", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (result) {
          setUsertype(result.usertype);
          console.log(usertype);
        }
        console.log(result);
      } catch (error) {
        console.error("Fetch Error", error);
      }
    };
    checkuserType();
},[navigate])

  return (
    <div id="page-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        {(usertype===""||usertype===null)&&<Route path="/dashboard" element={<Loader/>} />}
        {(usertype==="patient") &&
        <Route path="/dashboard" element={<Dashboard/>} >
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile/>} />
            <Route path="appointment" element={<Appointment/>} />
            <Route path="book" element={<Book />} />
            <Route path="billing" element={<Billing/>} />
        </Route>
        }
        {usertype==="doctor" &&
        <Route path="/dashboard" element={<DoctorDashboard />} >
            <Route index element={<DoctorProfile />} />
            <Route path="profile" element={<DoctorProfile/>} />
            <Route path="appointment" element={<DoctorAppointment/>} />
        </Route>
        }
        {usertype==="admin" &&
        <Route path="/dashboard" element={<AdminDashboard />} >
            <Route index element={<AdminDoctor />} />
            <Route path="doctor" element={<AdminDoctor/>} />
            <Route path="patient" element={<AdminPatient/>} />
        </Route>
        }
      </Routes>
    </div>
  );
}

export default App;
