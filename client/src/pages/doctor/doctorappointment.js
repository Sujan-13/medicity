import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../../modules/useFetchData";
function DoctorAppointment() {

    const [appointment,setAppointment]=useState([{
        appointmentid:"",
        firstname:"",
        lastname:"",
        specialization:"",
        appointmentdate:""
    }]);
    const {data,error}=useFetchData("doctorappointment-fetch-data");

    const navigate=useNavigate();
    useEffect(() => {
        if (data) {
          setAppointment(data); 
        }
      }, [data,navigate]);

    async function handleCheckup(e) {
        const id={
            "appointmentid":e.target.value
        }
        try {
            const response= await fetch("http://localhost:3001/api/appointment-delete",{
              method:"POST",
              credentials: 'include',
              headers:{
                "Content-type":"application/json"
              },
              body:JSON.stringify(id)
            });
              const result= await response.json();
              console.log(result);
              if (result.done) {
                navigate("/dashboard");
              }
          } catch (error) {
              console.error("Error",error);         
          }
      };

    return(
        <div>
            <div>
           {!appointment?(<h2>No checkups remaining...</h2>):
                 <table>
                <thead>
                    <tr>
                        <th>S.N.</th>
                        <th>Patient Name.</th>
                        <th>Appointment Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        appointment.map((item,index)=>{
                            console.log(appointment);
                            return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.firstname} {item.lastname}</td>
                                <td>{item.appointmentdate}</td>
                                <td>                                
                                 <button className="side-btn"  value={item.appointmentid} onClick={handleCheckup}>&#x2714;</button>                                    
                                </td>
                            </tr>
                            )
                        })
                    }
                </tbody>
                </table>}
            </div>
        </div>
    );
}

export default DoctorAppointment;