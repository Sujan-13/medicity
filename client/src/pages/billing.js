import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../modules/useFetchData";
function Billing() {

    const [bills,setBills]=useState([{
        firstname:"",
        lastname:"",
        specialization:"",
        appointmentdate:"",
        amount:"",
        billingstatus:"",
        billingid:""
    }]);
    const {data,error}=useFetchData("bill-fetch-data");

    const navigate=useNavigate();
    useEffect(() => {
        if (data) {
          setBills(data); 
        }
      }, [data,navigate]);

    async function handlePayment(e) {
        const id={
            "billingid":e.target.value
        }
        try {
            const response= await fetch("http://localhost:3001/api/bill-update",{
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
      }

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
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bills.map((item,index)=>{
                            console.log(item.billingstatus);
                            return(                               
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>Dr. {item.firstname} {item.lastname}</td>
                                <td>{item.specialization}</td>
                                <td>{item.appointmentdate}</td>
                                <td>{item.amount}</td>
                                <td style={{backgroundColor:item.billingstatus==="false"?"red":"green"}}></td>
                                <td>
                                {item.billingstatus==="false" ? (
                                    <button className="side-btn"  value={item.billingid} onClick={handlePayment}>Pay</button>
                                    ) : (
                                    <h2 style={{ color: "green" }}>&#x2714;</h2>
                                    )}

                                </td>
                            </tr>
                            )
                        })
                    }
                </tbody>
                </table>
            </div>
        </div>
    );
}

export default Billing;