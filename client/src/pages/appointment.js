import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../modules/useFetchData";
function Appointment() {

    const [appointment,setAppointment]=useState([{
        firstname:"",
        lastname:"",
        specialization:"",
        appointmentdate:""
    }]);

    const {data,error}=useFetchData("appointment-fetch-data");

    const navigate=useNavigate();
    useEffect(() => {
        if (data) {
          setAppointment(data); 
        }
      }, [data,navigate]);

    return(
        <div>
            <div>
                <table>
                <thead>
                    <tr>
                        <th>S.N.</th>
                        <th>Doctor Name.</th>
                        <th>Specialization</th>
                        <th>Appointment Date</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        appointment.map((item,index)=>{
                            console.log("sdsa",item);
                            return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>Dr. {item.firstname} {item.lastname}</td>
                                <td>{item.specialization}</td>
                                <td>{item.appointmentdate}</td>
                            </tr>
                            
                            )
                        })
                    }
                </tbody>
                </table>
            </div>
          <Link to={"/dashboard/book"}><button className="side-btn" style={{padding:"10px",margin:"auto",display:"block"}}>Book Appointment</button></Link>
        </div>
    );
}

export default Appointment;