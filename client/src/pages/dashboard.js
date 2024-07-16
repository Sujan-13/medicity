import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import  useSessionManagement  from "../modules/useSession";
import Nav from "../components/Nav";
import Formbody from "../components/Formbody";

function Dashboard(){
    const [session,setsession]=useState(false);
    const navigate=useNavigate();
    useSessionManagement(navigate,"","/login");
    const sidecontent=["Profile", "Appointments", "Billings"];
    const items=[["FirstName","text"],["LastName","text"],["DOB","date"], ["Gender","text"],["Address","text"],["Phone","text"], ["Email","email"]];
    const [formData, SetformData]=useState({
        firstname:"",
        lastname:"",
        dob:"",
        gender:"",
        address:"",
        phone:"",
        email:"",
        password:""
    });
    
    useEffect(()=>{
        const fetchData=async ()=>{
            try { const response = await fetch("http://localhost:3001/api/fetch-data", {
                method: "GET",
                credentials: "include",
              });
              const result = await response.json();
              console.log(result);
              SetformData(result);
            }
            catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[]);
 

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
            return <Sidebar field={item} key={index} /> 
        })}
        </div>
        </div>
        <div className="dashboard-form">
        <div class="dashboard-logo">
            <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOIsLtdQPu_wKkuK2cptqnjlgvV1kKeWLF7Ki6HKvqTpZVglh-" alt="" />
        </div>
        <div className="dashboard-inp">
            {items.map((item,index)=>{
              var member=(item[0].toLowerCase());      
                    return(                          
                         <div>
                         <Formbody key={index} field={item[0]} name={member} type={item[1]} value={formData[member]}/>
                         </div>
                            );
                        })}
        </div>
        </div>
        </div>
    </div>

    )}

export default Dashboard;