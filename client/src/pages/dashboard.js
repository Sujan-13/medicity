import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { Link, Outlet,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import  useSessionManagement  from "../modules/useSession";
import Nav from "../components/Nav";

function Dashboard(){
    const navigate=useNavigate();
    useSessionManagement(navigate,"","/login");
    const sidecontent=["Profile", "Appointment", "Billing"];
     const handleLogOut = () => { 
        
            const logOut=async ()=>{
                try {
                    const response= await fetch("http://localhost:3001/api/logout",{
                        "method":"GET",
                        credentials:'include'
                    });
    
                    const result=await response.json();
                    console.log(result);
                    if (result.done) {
                        navigate("/");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            logOut();
        }
    
    return (
    <div>
    <Nav change={1} handlelogOut={handleLogOut} />
        <div className="dashboard-container"> 
        <div className="sidebar">
        <div className="sidebar-content">
        {sidecontent.map((item,index)=>{
            {console.log(item.toLowerCase())}
            return <Link to={item.toLowerCase()} ><Sidebar field={item} key={index} /></Link> 
        })}
        </div>
        </div>

        <div className="dashboard-form">
        <Outlet />
        </div>

        </div>
    </div>

    )}

export default Dashboard;