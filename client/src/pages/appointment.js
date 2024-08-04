import { useState,useEffect } from "react";

function Appointment() {

    const [appointment,setAppointment]=useState([{
        firstname:"",
        lastname:"",
        specialization:"",
        appointmentdate:""
    }]);

    // setAppointment([{
    //     firstname:"Sujan",
    //     lastname:"Gupta",
    //     specialisation:"Necromancy",
    //     appointmentdate:"2020-09-10"
    // },
    // {
    //     firstname:"Ritesh",
    //     lastname:"Gupta",
    //     specialisation:"Ullu",
    //     appointmentdate:"2020-09-10"
    // }]);

    // const [appointment] = useState([{
    //     firstname: "Sujan",
    //     lastname: "Gupta",
    //     specialisation: "Necromancy",
    //     appointmentdate: "2020-09-10"
    // },
    // {
    //     firstname: "Ritesh",
    //     lastname: "Gupta",
    //     specialisation: "Ullu",
    //     appointmentdate: "2020-09-10"
    // }]);

        
    useEffect(()=>{
        const fetchData=async ()=>{
            try { 
                const response = await fetch("http://localhost:3001/api/appointment-fetch-data", {
                method: "GET",
                credentials: "include",
              });
              const result = await response.json();
              console.log(result);
              setAppointment(result);
            }
            catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[]);


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
            <button className="side-btn">Book Appointment</button>
        </div>
    );
}

export default Appointment;